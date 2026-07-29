import Anthropic from "@anthropic-ai/sdk";
import {
  parseDocumentAnalysis,
  parseQuestionAnswer,
  type AllowedMimeType,
  type DocumentAnalysis,
  type QuestionAnswer,
} from "@wg/validation";
import { getModelProfile, type ModelProfile } from "./model-profiles.js";
import { buildOutputContract } from "./output-contract.js";
import { PROMPT_VERSION, buildSystemPrompt } from "./prompt.js";
import { buildQuestionPrompt } from "./question-prompt.js";
import type { AnalysisInput, DocumentAnalysisProvider, QuestionInput } from "../types.js";
import { ProviderError } from "../types.js";

export interface AnthropicProviderOptions {
  apiKey: string;
  model: string;
  /** Override for proxies and compatible gateways; omit for the Anthropic API. */
  baseUrl?: string | undefined;
  /** Hard ceiling on one provider call, independent of the HTTP request timeout. */
  timeoutMs: number;
  /**
   * Injected HTTP layer. Exists so the adapter's behaviour — retry, refusal
   * handling, error mapping — is testable without a network or credentials.
   * Production leaves it unset.
   */
  fetch?: typeof fetch | undefined;
}

/**
 * Document analysis via the Anthropic Messages API.
 *
 * Trust boundary TB-2 (docs/architecture/trust-boundaries.md): this class is
 * the only place document bytes leave our infrastructure. What crosses is
 * exactly the locked prompt plus the document — no filename, no IP, no user
 * identifier, nothing that would let a provider correlate two letters to one
 * person. The request ID stays on our side for log correlation only.
 *
 * The output is treated as untrusted until it passes `parseDocumentAnalysis`,
 * for the same reason the document is: it is text produced by a model that a
 * malicious letter may have tried to influence.
 */
export class AnthropicProvider implements DocumentAnalysisProvider {
  readonly name = "anthropic";

  private readonly client: Anthropic;
  private readonly profile: ModelProfile;
  private readonly timeoutMs: number;

  constructor(options: AnthropicProviderOptions) {
    this.profile = getModelProfile(options.model);
    this.timeoutMs = options.timeoutMs;
    this.client = new Anthropic({
      apiKey: options.apiKey,
      ...(options.baseUrl !== undefined ? { baseURL: options.baseUrl } : {}),
      ...(options.fetch !== undefined ? { fetch: options.fetch } : {}),
      timeout: options.timeoutMs,
      // Retries are bounded and only cover transport-level failures; a refusal
      // or an invalid analysis is never retried blindly (master-spec §8).
      maxRetries: 1,
    });
  }

  /** Version string recorded in operational logs (C2 data, no content). */
  get promptVersion(): string {
    return PROMPT_VERSION;
  }

  async analyze(input: AnalysisInput): Promise<DocumentAnalysis> {
    const system = `${buildSystemPrompt(input.outputLanguage)}\n\n${buildOutputContract()}`;
    const documentBlock = this.buildDocumentBlock(input);

    // First attempt, then at most one corrective retry. The retry re-sends the
    // same document with the validation failure appended — it never lowers the
    // bar, it just gives the model one chance to fix a malformed response.
    let lastFailure = "";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const instruction =
        lastFailure === ""
          ? "Analyse the attached German letter and return the JSON object."
          : `${lastFailure}\n\nAnalyse the attached German letter again and return only the JSON object.`;
      const raw = await this.callModel(system, documentBlock, instruction);
      const analysis = parseDocumentAnalysis(extractJson(raw));

      if (analysis !== null) return analysis;

      lastFailure =
        "Your previous response did not match the required JSON object exactly. " +
        "Return only the JSON object described above, with every required field present " +
        "and at least one German evidence quotation on every deadline, requested action, " +
        "requested document, consequence and contact detail.";
    }

    // Two malformed responses is a provider failure, not a user error. The
    // route turns this into a safe message; we never render a partial result.
    throw new ProviderError("invalid_output", "analysis did not satisfy the schema");
  }

  async answerQuestion(input: QuestionInput): Promise<QuestionAnswer> {
    const system = buildQuestionPrompt(input.outputLanguage, input.history);
    const documentBlock = this.buildDocumentBlock(input);

    let correction = "";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      // The question travels as data next to the document, never spliced into
      // the system prompt — the same separation that protects the letter.
      const raw = await this.callModel(
        system,
        documentBlock,
        `${correction}The person asks: ${input.question}`,
      );
      const answer = parseQuestionAnswer(extractJson(raw));
      if (answer !== null) return answer;

      correction =
        "Your previous response did not match the required JSON object. Return only the JSON " +
        "object described above, with evidence present whenever answeredFromDocument is true. ";
    }

    throw new ProviderError("invalid_output", "answer did not satisfy the schema");
  }

  /** Wraps the document bytes in the content block its type requires. */
  private buildDocumentBlock(input: {
    fileBytes: Buffer;
    mimeType: AllowedMimeType;
  }): Anthropic.ContentBlockParam {
    const data = input.fileBytes.toString("base64");

    if (input.mimeType === "application/pdf") {
      return {
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data },
      };
    }

    return {
      type: "image",
      source: { type: "base64", media_type: input.mimeType, data },
    };
  }

  private async callModel(
    system: string,
    documentBlock: Anthropic.ContentBlockParam,
    instruction: string,
  ): Promise<string> {
    try {
      const response = await this.client.messages.create(
        {
          model: this.profile.id,
          max_tokens: this.profile.maxOutputTokens,
          system,
          // Sampling and effort are mutually exclusive across model
          // generations; the profile decides which (if either) applies.
          ...(this.profile.temperature !== null ? { temperature: this.profile.temperature } : {}),
          ...(this.profile.effort !== null
            ? { output_config: { effort: this.profile.effort } }
            : {}),
          messages: [
            {
              role: "user",
              // Document first, instruction second: the model reads the
              // material before it reads what to do with it.
              content: [documentBlock, { type: "text", text: instruction }],
            },
          ],
        },
        { timeout: this.timeoutMs },
      );

      // A safety classifier declining is a normal outcome, not a crash
      // (docs/product/spec-amendments.md §3). Serious letters — exactly our
      // high-risk categories — are the most likely to trigger it.
      if (response.stop_reason === "refusal") {
        throw new ProviderError("refused", "provider declined to analyse this document");
      }

      return response.content
        .filter((block): block is Anthropic.TextBlock => block.type === "text")
        .map((block) => block.text)
        .join("\n");
    } catch (error) {
      throw toProviderError(error);
    }
  }
}

/**
 * Pulls the JSON object out of a response that may carry stray prose.
 *
 * The prompt asks for bare JSON, but models occasionally wrap it in a fence or
 * add a sentence. Recovering from that is strictly better than failing the
 * user — and costs nothing in safety, because the result still has to pass the
 * schema afterwards.
 */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();

  const candidates: string[] = [trimmed];

  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(trimmed);
  if (fenced?.[1] !== undefined) candidates.push(fenced[1].trim());

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(trimmed.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }
  return null;
}

/**
 * Maps transport and API failures onto our typed taxonomy.
 *
 * Messages are deliberately generic: an error string can end up in logs, and
 * a provider error message could echo document content back at us.
 */
function toProviderError(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error;

  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    return new ProviderError("timeout", "provider request timed out");
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return new ProviderError("unavailable", "could not reach provider");
  }
  if (error instanceof Anthropic.RateLimitError) {
    return new ProviderError("unavailable", "provider rate limit reached");
  }
  // APIError is the base for every HTTP-status failure. Connection errors
  // also extend it, which is why they are checked above this branch.
  if (error instanceof Anthropic.APIError) {
    // `status` is generic on APIError and widens to `any` once the class is
    // narrowed without its type parameters; coerce explicitly rather than
    // letting an untyped value drive the branch below.
    const status: number = typeof error.status === "number" ? error.status : 0;
    // 5xx is theirs, 4xx is ours — both look like "unavailable" to the user,
    // but the distinction is what makes operational logs readable.
    const kind = status >= 500 || status === 0 ? "unavailable" : "invalid_output";
    return new ProviderError(kind, `provider returned status ${status}`);
  }

  return new ProviderError("unavailable", "provider call failed");
}
