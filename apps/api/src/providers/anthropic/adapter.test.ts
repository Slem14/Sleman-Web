import { SCHEMA_VERSION } from "@wg/validation";
import { describe, expect, it, vi } from "vitest";
import { TINY_PDF, TINY_PNG } from "../../files/test-fixtures.js";
import { ProviderError } from "../types.js";
import { AnthropicProvider } from "./adapter.js";

/**
 * Adapter behaviour, verified against a fake HTTP layer.
 *
 * No network, no credentials, no cost — so these run in CI on every pull
 * request. What they pin down is everything that must hold regardless of which
 * model is behind the endpoint: retry policy, refusal handling, error mapping,
 * and the rule that a malformed analysis never reaches the caller.
 */

/** A complete, valid analysis as the model would return it. */
function validAnalysisJson(): string {
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    detectedDocumentLanguage: "de",
    outputLanguage: "en",
    sender: { name: "Jobcenter Musterstadt", category: "Jobcenter", evidence: [] },
    documentType: { label: "Request for documents", confidence: "high", evidence: [] },
    summary: { plainLanguage: "They want two documents.", evidence: [] },
    actionStatus: "explicit_action_required",
    urgency: "deadline_detected",
    deadlines: [
      {
        rawText: "bis zum 15. August 2026",
        normalizedDate: "2026-08-15",
        timezone: "Europe/Berlin",
        meaning: "Last day to send the documents.",
        confidence: "high",
        evidence: [{ page: 1, text: "bis zum 15. August 2026" }],
      },
    ],
    requestedActions: [],
    requestedDocuments: [],
    consequences: [],
    contactDetails: [],
    suggestedNextSteps: [],
    riskFlags: [],
    requiresHumanReview: false,
    humanReviewReason: null,
    limitations: [],
  });
}

/** Builds a fake fetch returning canned Messages API responses in order. */
function fakeFetch(responses: Array<{ status?: number; body: unknown }>) {
  const calls: Array<{ url: string; body: unknown }> = [];
  let index = 0;

  const impl = vi.fn((input: string | URL | Request, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    calls.push({
      url,
      body: typeof init?.body === "string" ? (JSON.parse(init.body) as unknown) : undefined,
    });
    const next = responses[Math.min(index, responses.length - 1)]!;
    index += 1;
    return Promise.resolve(
      new Response(JSON.stringify(next.body), {
        status: next.status ?? 200,
        headers: { "content-type": "application/json" },
      }),
    );
  });

  return { impl: impl as unknown as typeof fetch, calls };
}

/** Shapes an object like a Messages API success response. */
function messageResponse(text: string, stopReason = "end_turn") {
  return {
    id: "msg_test",
    type: "message",
    role: "assistant",
    model: "claude-haiku-4-5",
    content: [{ type: "text", text }],
    stop_reason: stopReason,
    stop_sequence: null,
    usage: { input_tokens: 100, output_tokens: 200 },
  };
}

function buildProvider(fetchImpl: typeof fetch) {
  return new AnthropicProvider({
    apiKey: "test-key",
    model: "claude-haiku-4-5",
    baseUrl: "https://gateway.test",
    timeoutMs: 5000,
    fetch: fetchImpl,
  });
}

const pdfInput = {
  files: [{ bytes: TINY_PDF, mimeType: "application/pdf" as const }],
  outputLanguage: "en",
  requestId: "req-test",
};

describe("AnthropicProvider", () => {
  it("returns a validated analysis from a well-formed response", async () => {
    const { impl } = fakeFetch([{ body: messageResponse(validAnalysisJson()) }]);
    const analysis = await buildProvider(impl).analyze(pdfInput);

    expect(analysis.deadlines[0]!.normalizedDate).toBe("2026-08-15");
    expect(analysis.outputLanguage).toBe("en");
  });

  it("sends the document as a PDF block and the instruction after it", async () => {
    const { impl, calls } = fakeFetch([{ body: messageResponse(validAnalysisJson()) }]);
    await buildProvider(impl).analyze(pdfInput);

    const body = calls[0]!.body as {
      messages: Array<{ content: Array<{ type: string; source?: { media_type: string } }> }>;
      system: string;
    };
    const blocks = body.messages[0]!.content;
    expect(blocks[0]!.type).toBe("document");
    expect(blocks[0]!.source!.media_type).toBe("application/pdf");
    // Document first, instruction second — the model reads the material
    // before it reads what to do with it.
    expect(blocks[1]!.type).toBe("text");
    // The injection boundary must be present in every request.
    expect(body.system).toContain("UNTRUSTED CONTENT");
  });

  it("sends images as image blocks", async () => {
    const { impl, calls } = fakeFetch([{ body: messageResponse(validAnalysisJson()) }]);
    await buildProvider(impl).analyze({
      ...pdfInput,
      files: [{ bytes: TINY_PNG, mimeType: "image/png" }],
    });

    const body = calls[0]!.body as { messages: Array<{ content: Array<{ type: string }> }> };
    expect(body.messages[0]!.content[0]!.type).toBe("image");
  });

  it("omits parameters the configured model rejects", async () => {
    // Haiku accepts temperature and rejects effort; sending effort would 400.
    const { impl, calls } = fakeFetch([{ body: messageResponse(validAnalysisJson()) }]);
    await buildProvider(impl).analyze(pdfInput);

    const body = calls[0]!.body as Record<string, unknown>;
    expect(body["temperature"]).toBe(0);
    expect(body).not.toHaveProperty("output_config");
  });

  it("recovers a JSON object wrapped in a markdown fence", async () => {
    const fenced = "Here is the analysis:\n```json\n" + validAnalysisJson() + "\n```";
    const { impl } = fakeFetch([{ body: messageResponse(fenced) }]);
    const analysis = await buildProvider(impl).analyze(pdfInput);
    expect(analysis.schemaVersion).toBe(SCHEMA_VERSION);
  });

  it("retries once when the first response fails validation, then succeeds", async () => {
    const { impl, calls } = fakeFetch([
      { body: messageResponse('{"schemaVersion":"wrong"}') },
      { body: messageResponse(validAnalysisJson()) },
    ]);
    const analysis = await buildProvider(impl).analyze(pdfInput);

    expect(calls).toHaveLength(2);
    expect(analysis.schemaVersion).toBe(SCHEMA_VERSION);
    // The retry must state what was wrong, not just ask again.
    const second = calls[1]!.body as { messages: Array<{ content: Array<{ text?: string }> }> };
    expect(second.messages[0]!.content[1]!.text).toMatch(/did not match the required JSON/i);
  });

  it("gives up after two malformed responses rather than returning a partial", async () => {
    const { impl, calls } = fakeFetch([{ body: messageResponse("not json at all") }]);
    await expect(buildProvider(impl).analyze(pdfInput)).rejects.toThrow(ProviderError);
    // Bounded: exactly two attempts, never an unbounded retry loop.
    expect(calls).toHaveLength(2);
  });

  it("maps a safety refusal to its own error kind", async () => {
    // Serious letters are the most likely to be declined, so this path has to
    // be distinguishable from a malfunction — the user needs different advice.
    const { impl } = fakeFetch([{ body: messageResponse("", "refusal") }]);
    await expect(buildProvider(impl).analyze(pdfInput)).rejects.toMatchObject({
      kind: "refused",
    });
  });

  it("maps a server error to unavailable", async () => {
    const { impl } = fakeFetch([
      { status: 500, body: { type: "error", error: { type: "api_error", message: "boom" } } },
    ]);
    await expect(buildProvider(impl).analyze(pdfInput)).rejects.toMatchObject({
      kind: "unavailable",
    });
  });

  it("never puts document content in the error message", async () => {
    // Error strings reach logs; a provider error echoing the document back
    // would defeat the entire redaction layer.
    const { impl } = fakeFetch([
      {
        status: 400,
        body: { type: "error", error: { type: "invalid_request_error", message: "boom" } },
      },
    ]);
    try {
      await buildProvider(impl).analyze(pdfInput);
      expect.unreachable("should have thrown");
    } catch (error) {
      expect((error as Error).message).not.toMatch(/PDF|stream|obj/i);
      expect((error as Error).message).toMatch(/provider returned status 400/);
    }
  });

  it("rejects an unknown model at construction rather than at request time", () => {
    expect(
      () =>
        new AnthropicProvider({
          apiKey: "k",
          model: "definitely-not-a-model",
          timeoutMs: 1000,
        }),
    ).toThrow(/Unsupported ANALYSIS_MODEL/);
  });
});
