/**
 * One-shot live check of the configured provider.
 *
 * Run with: pnpm --filter @wg/api exec tsx src/evals/smoke.ts
 *
 * Sends a single SYNTHETIC letter through the real provider and prints what
 * came back. Nothing here touches user data — the letter is invented, so this
 * script is safe to run against any endpoint.
 */
import { readFileSync } from "node:fs";
import { AnthropicProvider } from "../providers/anthropic/adapter.js";
import { GeminiProvider } from "../providers/gemini/adapter.js";
import { applyPostChecks } from "../safety/post-checks.js";
import { applyRiskEscalation } from "../safety/risk-classifier.js";
import { LETTER_FIXTURES } from "./fixtures/letters.js";
import { renderTextToPdf } from "./fixtures/render-pdf.js";

/**
 * Minimal .env reader — this script runs outside the server's config path.
 *
 * Values here OVERRIDE the ambient environment, which is the opposite of the
 * usual dotenv rule. The reason is specific: developer shells frequently carry
 * an inherited ANTHROPIC_BASE_URL or key from other tooling, and silently
 * sending a gateway key to the wrong endpoint produces a confusing 401. For a
 * local evaluation script the checked-in .env is the explicit intent.
 */
function loadEnv(): void {
  try {
    const raw = readFileSync(new URL("../../../../.env", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const match = /^([A-Z_]+)=(.*)$/.exec(line.trim());
      if (match?.[1] !== undefined) {
        process.env[match[1]] = match[2];
      }
    }
  } catch {
    // No .env — rely on the ambient environment.
  }
}

function requireKey(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === "") {
    console.error(`${name} is not set.`);
    process.exit(1);
  }
  return value;
}

async function main(): Promise<void> {
  loadEnv();

  const providerName = process.env.ANALYSIS_PROVIDER ?? "gemini";
  const model =
    process.env.ANALYSIS_MODEL ??
    (providerName === "gemini" ? "gemini-2.5-flash" : "claude-haiku-4-5");

  const provider =
    providerName === "gemini"
      ? new GeminiProvider({
          apiKey: requireKey("GEMINI_API_KEY"),
          model,
          timeoutMs: 90_000,
        })
      : new AnthropicProvider({
          apiKey: requireKey("ANTHROPIC_API_KEY"),
          model,
          baseUrl: process.env.ANTHROPIC_BASE_URL,
          timeoutMs: 90_000,
        });

  console.log(`provider: ${providerName}`);
  console.log(`model:    ${model}`);

  const fixture = LETTER_FIXTURES[0]!;
  const pdf = renderTextToPdf(fixture.german);
  console.log(`fixture:  ${fixture.id} (${pdf.length} byte PDF)\n`);

  const started = Date.now();
  const raw = await provider.analyze({
    files: [{ bytes: pdf, mimeType: "application/pdf" }],
    outputLanguage: "en",
    requestId: "smoke-test",
  });
  const elapsed = Date.now() - started;

  const checked = applyPostChecks(raw);
  const escalated = applyRiskEscalation(checked.analysis);
  const analysis = escalated.analysis;

  console.log(`--- analysis in ${(elapsed / 1000).toFixed(1)}s ---`);
  console.log(`sender:       ${analysis.sender.name ?? "(none)"}`);
  console.log(`type:         ${analysis.documentType.label}`);
  console.log(`actionStatus: ${analysis.actionStatus}`);
  console.log(`urgency:      ${analysis.urgency}`);
  for (const deadline of analysis.deadlines) {
    console.log(
      `deadline:     ${deadline.normalizedDate ?? "(not normalized)"} <- "${deadline.rawText}"`,
    );
  }
  for (const action of analysis.requestedActions) {
    console.log(`action:       ${action.description}`);
  }
  console.log(`riskFlags:    ${analysis.riskFlags.join(", ") || "(none)"}`);
  console.log(`humanReview:  ${String(analysis.requiresHumanReview)}`);
  console.log(`\nsafety violations: ${checked.violations.join(", ") || "(none)"}`);
  console.log(`escalated flags:   ${escalated.addedFlags.join(", ") || "(none)"}`);

  const expected = fixture.expected.deadlines[0];
  const got = analysis.deadlines[0]?.normalizedDate ?? null;
  console.log(`\nexpected deadline ${expected ?? "(none)"} — got ${got ?? "(none)"}`);
}

main().catch((error: unknown) => {
  console.error("smoke test failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
