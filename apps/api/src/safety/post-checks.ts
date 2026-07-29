import type { DocumentAnalysis } from "@wg/validation";
import { extractGermanDates, hasRelativeDeadlineWording } from "./german-dates.js";

/**
 * Deterministic safety checks applied to a validated analysis.
 *
 * The schema guarantees the analysis is well-FORMED. These checks ask a
 * different question: is it well-FOUNDED? Specifically, do the claims survive
 * being compared against the German text the model itself quoted?
 *
 * Two of the master spec's absolute rules are mechanically checkable, and both
 * are checked here rather than trusted:
 *   - "never invent a deadline"        → a normalized date must appear in the
 *                                        German it was drawn from
 *   - "never invent contact details"   → a phone number, email or address must
 *                                        appear in its own evidence
 *
 * Failing a check never throws. It DOWNGRADES the claim — removing the
 * unsupported part, keeping the quoted German, and recording an honest note in
 * `limitations`. A user is better served by "we could not confirm this date"
 * than by a confident date we cannot stand behind.
 */

/** Machine-readable violations, counted by the evaluation harness. */
export type SafetyViolation =
  | "deadline_not_in_evidence"
  | "deadline_computed_from_relative_wording"
  | "contact_not_in_evidence"
  | "evidence_missing";

export interface PostCheckResult {
  analysis: DocumentAnalysis;
  violations: SafetyViolation[];
}

/** Normalizes for comparison: strip everything but digits and letters. */
function comparable(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9äöüß@]/g, "");
}

export function applyPostChecks(input: DocumentAnalysis): PostCheckResult {
  const violations: SafetyViolation[] = [];
  const limitations = [...input.limitations];

  // ---- Deadlines: a normalized date must be present in its own evidence ----
  const deadlines = input.deadlines.map((deadline) => {
    if (deadline.normalizedDate === null) return deadline;

    // The German the model says this deadline came from.
    const sourceText = [deadline.rawText, ...deadline.evidence.map((e) => e.text)].join(" ");
    const datesInSource = extractGermanDates(sourceText);

    if (datesInSource.includes(deadline.normalizedDate)) {
      return deadline; // Confirmed against the letter's own wording.
    }

    // Not confirmed. Two different failures, both handled the same way:
    // keep the German, drop the date we cannot support.
    if (datesInSource.length === 0 && hasRelativeDeadlineWording(sourceText)) {
      // "innerhalb von zwei Wochen" — a computed date the letter never states.
      violations.push("deadline_computed_from_relative_wording");
      limitations.push(
        "This deadline is described as a period of time rather than a fixed date. We have not calculated the exact date — please check the original letter.",
      );
    } else {
      violations.push("deadline_not_in_evidence");
      limitations.push(
        "We could not confirm one of the dates against the text of the letter. Please read the original German wording shown below it.",
      );
    }

    return {
      ...deadline,
      normalizedDate: null,
      // A date we could not verify is not a high-confidence date.
      confidence: "low" as const,
    };
  });

  // ---- Contact details: the value must appear in its own evidence ----------
  const contactDetails = input.contactDetails.filter((contact) => {
    const evidenceText = comparable(contact.evidence.map((e) => e.text).join(" "));
    const value = comparable(contact.value);
    // Short values (a 3-digit extension) would match by accident; require a
    // meaningful overlap before trusting one.
    if (value.length < 4) return false;
    if (evidenceText.includes(value)) return true;

    violations.push("contact_not_in_evidence");
    return false; // Drop it rather than show a contact we cannot source.
  });

  if (contactDetails.length !== input.contactDetails.length) {
    limitations.push(
      "Some contact details could not be confirmed against the letter and were left out. Please use the contact information printed on your original letter.",
    );
  }

  // ---- Evidence presence on claims that require it ------------------------
  const hasEmptyEvidence =
    input.requestedActions.some((a) => a.evidence.length === 0) ||
    input.requestedDocuments.some((d) => d.evidence.length === 0) ||
    input.consequences.some((c) => c.evidence.length === 0);

  if (hasEmptyEvidence) {
    violations.push("evidence_missing");
  }

  return {
    analysis: { ...input, deadlines, contactDetails, limitations },
    violations,
  };
}
