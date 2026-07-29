import { parseDocumentAnalysis, type DocumentAnalysis } from "@wg/validation";
import { buildOutputContract } from "../anthropic/output-contract.js";
import { PROMPT_VERSION, buildSystemPrompt } from "../anthropic/prompt.js";
import type { AnalysisInput, DocumentAnalysisProvider } from "../types.js";
import { ProviderError } from "../types.js";

/**
 * Document analysis via the Google Gemini API.
 *
 * Deliberately shares the prompt and output contract with the Anthropic
 * adapter. The safety rules — the injection boundary, the ban on invented
 * dates and contacts, the escalation policy — are properties of the PRODUCT,
 * not of a vendor. Two providers with two prompts would mean two behaviours to
 * audit and two places for a rule to quietly go missing.
 *
 * Written against the REST API rather than the Google SDK: the request shape
 * we need is small, and it keeps a second vendor SDK out of the dependency
 * tree of the service that handles documents.
 */

export interface GeminiProviderOptions {
  apiKey: string;
  model: string;
  timeoutMs: number;
  /** Injected for tests — production leaves it unset. */
  fetch?: typeof fetch | undefined;
}

/**
 * Models verified against this adapter's request shape AND confirmed callable.
 *
 * Google's model list endpoint returns models that are closed to new API
 * projects — calling one returns 404 with "no longer available to new users".
 * Everything here has been exercised with a real request, not merely listed.
 */
const SUPPORTED_MODELS = new Set([
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-3-pro-preview",
  "gemini-pro-latest",
]);

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta";

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
}

export class GeminiProvider implements DocumentAnalysisProvider {
  readonly name = "gemini";

  private readonly apiKey: string;
  private readonly model: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: GeminiProviderOptions) {
    if (!SUPPORTED_MODELS.has(options.model)) {
      throw new Error(
        `Unsupported ANALYSIS_MODEL: ${options.model}. Supported: ${[...SUPPORTED_MODELS].join(", ")}`,
      );
    }
    this.apiKey = options.apiKey;
    this.model = options.model;
    this.timeoutMs = options.timeoutMs;
    this.fetchImpl = options.fetch ?? fetch;
  }

  get promptVersion(): string {
    return PROMPT_VERSION;
  }

  /** Token counts from the most recent call — C2 metadata, for cost metrics. */
  lastUsage: { inputTokens: number; outputTokens: number } | null = null;

  async analyze(input: AnalysisInput): Promise<DocumentAnalysis> {
    const system = `${buildSystemPrompt(input.outputLanguage)}\n\n${buildOutputContract()}`;

    let correction = "";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const raw = await this.callModel(system, input, correction);
      const analysis = parseDocumentAnalysis(extractJson(raw));
      if (analysis !== null) return analysis;

      correction =
        "Your previous response did not match the required JSON object exactly. " +
        "Return only the JSON object described above, with every required field present " +
        "and at least one German evidence quotation on every deadline, requested action, " +
        "requested document, consequence and contact detail.";
    }

    throw new ProviderError("invalid_output", "analysis did not satisfy the schema");
  }

  private async callModel(
    system: string,
    input: AnalysisInput,
    correction: string,
  ): Promise<string> {
    const instruction =
      correction === ""
        ? "Analyse the attached German letter and return the JSON object."
        : `${correction}\n\nAnalyse the attached German letter again and return only the JSON object.`;

    const body = {
      system_instruction: { parts: [{ text: system }] },
      contents: [
        {
          role: "user",
          // Document first, instruction second — same ordering as the other
          // adapter, so the two behave alike on identical fixtures.
          parts: [
            {
              inline_data: { mime_type: input.mimeType, data: input.fileBytes.toString("base64") },
            },
            { text: instruction },
          ],
        },
      ],
      generationConfig: {
        // Deterministic extraction: this is not a creative task.
        temperature: 0,
        maxOutputTokens: 8192,
        // Ask for JSON at the API level rather than hoping the prose complies.
        responseMimeType: "application/json",
      },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(`${API_ROOT}/models/${this.model}:generateContent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        // Message text is deliberately status-only: an upstream error body can
        // quote the request back, and the request contains the document.
        const kind =
          response.status >= 500 || response.status === 429 ? "unavailable" : "invalid_output";
        throw new ProviderError(kind, `provider returned status ${response.status}`);
      }

      const payload = (await response.json()) as GeminiResponse;

      // A safety filter blocking the prompt is the same product situation as
      // an Anthropic refusal: not a malfunction, but this letter cannot be
      // handled automatically (docs/product/spec-amendments.md §3).
      if (payload.promptFeedback?.blockReason !== undefined) {
        throw new ProviderError("refused", "provider declined to analyse this document");
      }

      const candidate = payload.candidates?.[0];
      if (
        candidate?.finishReason === "SAFETY" ||
        candidate?.finishReason === "PROHIBITED_CONTENT"
      ) {
        throw new ProviderError("refused", "provider declined to analyse this document");
      }

      this.lastUsage = {
        inputTokens: payload.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: payload.usageMetadata?.candidatesTokenCount ?? 0,
      };

      return (candidate?.content?.parts ?? []).map((part) => part.text ?? "").join("\n");
    } catch (error) {
      if (error instanceof ProviderError) throw error;
      if (error instanceof Error && error.name === "AbortError") {
        throw new ProviderError("timeout", "provider request timed out");
      }
      throw new ProviderError("unavailable", "provider call failed");
    } finally {
      clearTimeout(timer);
    }
  }
}

/** Recovers the JSON object from a response that may carry a fence or prose. */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const candidates = [trimmed];

  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(trimmed);
  if (fenced?.[1] !== undefined) candidates.push(fenced[1].trim());

  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first !== -1 && last > first) candidates.push(trimmed.slice(first, last + 1));

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate);
    } catch {
      continue;
    }
  }
  return null;
}
