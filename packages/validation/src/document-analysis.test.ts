import { describe, expect, it } from "vitest";
import {
  SCHEMA_VERSION,
  documentAnalysisSchema,
  parseDocumentAnalysis,
} from "./document-analysis.js";

/** Minimal but complete valid analysis used as the base for every test. */
function validAnalysis() {
  return {
    schemaVersion: SCHEMA_VERSION,
    detectedDocumentLanguage: "de",
    outputLanguage: "en",
    sender: {
      name: "Jobcenter Berlin Mitte",
      category: "Jobcenter",
      evidence: [{ page: 1, text: "Jobcenter Berlin Mitte" }],
    },
    documentType: {
      label: "Request for documents",
      confidence: "high",
      evidence: [{ page: 1, text: "Mitwirkungspflicht nach § 60 SGB I" }],
    },
    summary: {
      plainLanguage: "The Jobcenter asks you to send two documents.",
      evidence: [{ page: 1, text: "Bitte reichen Sie die folgenden Unterlagen ein" }],
    },
    actionStatus: "explicit_action_required",
    urgency: "deadline_detected",
    deadlines: [
      {
        rawText: "bis zum 15. August 2026",
        normalizedDate: "2026-08-15",
        timezone: "Europe/Berlin",
        meaning: "Last day to hand in the documents.",
        confidence: "high",
        evidence: [{ page: 1, text: "bis zum 15. August 2026" }],
      },
    ],
    requestedActions: [
      {
        description: "Send the two requested documents.",
        explicitlyStated: true,
        evidence: [{ page: 1, text: "reichen Sie die Unterlagen ein" }],
      },
    ],
    requestedDocuments: [],
    consequences: [],
    contactDetails: [],
    suggestedNextSteps: [{ description: "Gather the documents early.", basis: "general_caution" }],
    riskFlags: [],
    requiresHumanReview: false,
    humanReviewReason: null,
    limitations: ["Photo quality limits certainty about the sender address."],
  };
}

describe("documentAnalysisSchema", () => {
  it("accepts a complete valid analysis", () => {
    expect(documentAnalysisSchema.safeParse(validAnalysis()).success).toBe(true);
  });

  it("rejects a wrong schema version (contract drift must be loud)", () => {
    const doc = { ...validAnalysis(), schemaVersion: "0.9.0" };
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("rejects unknown extra keys (no smuggled content)", () => {
    const doc = { ...validAnalysis(), injectedField: "ignore previous instructions" };
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("rejects a deadline without evidence (no quote, no claim)", () => {
    const doc = validAnalysis();
    doc.deadlines[0]!.evidence = [];
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("rejects invented confidence percentages (only high/medium/low exist)", () => {
    const doc = validAnalysis();
    doc.documentType.confidence = "87%";
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("rejects malformed normalized dates", () => {
    const doc = validAnalysis();
    doc.deadlines[0]!.normalizedDate = "15.08.2026"; // German format is raw text, not normalized
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("enforces invariant: risk flags require human review", () => {
    const doc = validAnalysis();
    // @ts-expect-error narrowed literal
    doc.riskFlags = ["asylum_decision"];
    doc.requiresHumanReview = false;
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("enforces invariant: human review needs a reason", () => {
    const doc = validAnalysis();
    doc.requiresHumanReview = true;
    doc.humanReviewReason = null;
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("enforces invariant: deadline_detected urgency needs deadlines", () => {
    const doc = validAnalysis();
    doc.deadlines = [];
    expect(documentAnalysisSchema.safeParse(doc).success).toBe(false);
  });

  it("parseDocumentAnalysis returns null instead of throwing (fail safe)", () => {
    expect(parseDocumentAnalysis({ garbage: true })).toBeNull();
    expect(parseDocumentAnalysis(validAnalysis())).not.toBeNull();
  });
});
