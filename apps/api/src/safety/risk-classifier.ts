import type { DocumentAnalysis, RiskFlag } from "@wg/validation";
import { RISK_KEYWORDS } from "./risk-keywords.js";

/**
 * Deterministic high-risk classification, applied AFTER the model has spoken.
 *
 * The governing rule (docs/product/high-risk-document-policy.md): this layer
 * may only ever RAISE the assessed risk, never lower it. The model can add
 * caution the keywords miss; the keywords can add caution the model missed;
 * neither can talk the system out of being careful.
 *
 * What it reads: the German text the model quoted back as evidence, plus the
 * sender name and the raw deadline wording. Those are verbatim excerpts of the
 * document, so scanning them is scanning the letter itself.
 *
 * Known limitation (documented, not hidden): if the model quotes no evidence
 * from the risky passage, this layer cannot see it. It is a second opinion,
 * not an independent reader. That is why the model prompt carries its own
 * escalation rules and why the eval suite measures escalation recall directly.
 */

/** Collects every German-language string the analysis carries. */
function germanTextOf(analysis: DocumentAnalysis): string {
  const parts: string[] = [];

  if (analysis.sender.name !== null) parts.push(analysis.sender.name);

  const collectEvidence = (evidence: ReadonlyArray<{ text: string }>) => {
    for (const item of evidence) parts.push(item.text);
  };

  collectEvidence(analysis.sender.evidence);
  collectEvidence(analysis.documentType.evidence);
  collectEvidence(analysis.summary.evidence);
  for (const deadline of analysis.deadlines) {
    parts.push(deadline.rawText);
    collectEvidence(deadline.evidence);
  }
  for (const action of analysis.requestedActions) collectEvidence(action.evidence);
  for (const doc of analysis.requestedDocuments) collectEvidence(doc.evidence);
  for (const consequence of analysis.consequences) collectEvidence(consequence.evidence);
  for (const contact of analysis.contactDetails) collectEvidence(contact.evidence);

  return parts.join("\n").toLowerCase();
}

/** Risk flags implied by the German vocabulary present in the analysis. */
export function detectRiskFlags(analysis: DocumentAnalysis): RiskFlag[] {
  const haystack = germanTextOf(analysis);
  const found: RiskFlag[] = [];

  for (const { flag, terms } of RISK_KEYWORDS) {
    if (terms.some((term) => haystack.includes(term))) {
      found.push(flag);
    }
  }

  return found;
}

export interface RiskEscalation {
  analysis: DocumentAnalysis;
  /** Flags this layer added that the model had not reported. */
  addedFlags: RiskFlag[];
}

/**
 * Merges keyword-detected risk into the model's own assessment.
 *
 * Escalation is one-directional: flags are added, never removed, and
 * `requiresHumanReview` can only go from false to true.
 */
export function applyRiskEscalation(analysis: DocumentAnalysis): RiskEscalation {
  const detected = detectRiskFlags(analysis);
  const existing = new Set(analysis.riskFlags);
  const addedFlags = detected.filter((flag) => !existing.has(flag));

  if (addedFlags.length === 0) {
    // The model already covered everything the keywords can see. Even so, an
    // existing flag must still imply human review — the schema enforces this,
    // but we do not rely on a validator to fix a safety property.
    if (analysis.riskFlags.length > 0 && !analysis.requiresHumanReview) {
      return {
        analysis: {
          ...analysis,
          requiresHumanReview: true,
          humanReviewReason:
            analysis.humanReviewReason ??
            "This letter appears to concern a serious matter. A qualified person should look at it.",
        },
        addedFlags: [],
      };
    }
    return { analysis, addedFlags: [] };
  }

  return {
    analysis: {
      ...analysis,
      riskFlags: [...analysis.riskFlags, ...addedFlags],
      requiresHumanReview: true,
      humanReviewReason:
        analysis.humanReviewReason ??
        "This letter appears to concern a serious matter. A qualified person should look at it.",
      // Never downgrade an urgency the model already assigned.
      urgency: analysis.urgency === "informational" ? "immediate_review" : analysis.urgency,
    },
    addedFlags,
  };
}
