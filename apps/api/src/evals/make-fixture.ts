/**
 * Writes one synthetic letter to disk as a PDF, for manual end-to-end checks
 * against a deployed API (curl, the browser, a phone).
 *
 * Usage: tsx src/evals/make-fixture.ts <output-path> [fixture-id]
 */
import { writeFileSync } from "node:fs";
import { LETTER_FIXTURES } from "./fixtures/letters.js";
import { renderTextToPdf } from "./fixtures/render-pdf.js";

const outputPath = process.argv[2];
if (outputPath === undefined) {
  console.error("usage: tsx src/evals/make-fixture.ts <output-path> [fixture-id]");
  process.exit(1);
}

const fixtureId = process.argv[3];
const fixture =
  fixtureId === undefined ? LETTER_FIXTURES[0]! : LETTER_FIXTURES.find((f) => f.id === fixtureId);

if (fixture === undefined) {
  console.error(`unknown fixture: ${fixtureId}`);
  console.error(`available: ${LETTER_FIXTURES.map((f) => f.id).join(", ")}`);
  process.exit(1);
}

writeFileSync(outputPath, renderTextToPdf(fixture.german));
console.log(`wrote ${fixture.id} to ${outputPath}`);
