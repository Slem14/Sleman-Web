import { SCHEMA_VERSION, type DocumentAnalysis } from "@wg/validation";
import { describe, expect, it } from "vitest";
import { extractGermanDates, hasRelativeDeadlineWording } from "./german-dates.js";
import { applyPostChecks } from "./post-checks.js";
import { applyRiskEscalation, detectRiskFlags } from "./risk-classifier.js";

/** A benign, well-formed analysis used as the base for each test. */
function baseAnalysis(overrides: Partial<DocumentAnalysis> = {}): DocumentAnalysis {
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
      evidence: [{ page: 1, text: "Aufforderung zur Mitwirkung" }],
    },
    summary: {
      plainLanguage: "The Jobcenter asks for two documents.",
      evidence: [{ page: 1, text: "Bitte reichen Sie die Unterlagen ein" }],
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
        evidence: [{ page: 1, text: "reichen Sie die Unterlagen bis zum 15. August 2026 ein" }],
      },
    ],
    requestedActions: [
      {
        description: "Hand in the documents.",
        explicitlyStated: true,
        evidence: [{ page: 1, text: "Bitte reichen Sie die Unterlagen ein" }],
      },
    ],
    requestedDocuments: [],
    consequences: [],
    contactDetails: [],
    suggestedNextSteps: [],
    riskFlags: [],
    requiresHumanReview: false,
    humanReviewReason: null,
    limitations: [],
    ...overrides,
  };
}

describe("extractGermanDates", () => {
  it("reads numeric German dates as day-first", () => {
    // 15.08.2026 is 15 August — reading it as 8 March would shift a deadline
    // by five months, which is the single most damaging bug in this product.
    expect(extractGermanDates("bis zum 15.08.2026")).toEqual(["2026-08-15"]);
    expect(extractGermanDates("am 1.9.2026")).toEqual(["2026-09-01"]);
  });

  it("reads written-out German months", () => {
    expect(extractGermanDates("bis zum 15. August 2026")).toEqual(["2026-08-15"]);
    expect(extractGermanDates("am 3. März 2027")).toEqual(["2027-03-03"]);
  });

  it("rejects impossible dates instead of rolling them over", () => {
    expect(extractGermanDates("30.02.2026")).toEqual([]);
  });

  it("finds several dates in one passage", () => {
    const dates = extractGermanDates("Schreiben vom 01.07.2026, Frist bis 15.08.2026");
    expect(dates).toContain("2026-07-01");
    expect(dates).toContain("2026-08-15");
  });
});

describe("hasRelativeDeadlineWording", () => {
  it("recognises periods rather than fixed dates", () => {
    expect(hasRelativeDeadlineWording("innerhalb von zwei Wochen")).toBe(true);
    expect(hasRelativeDeadlineWording("binnen eines Monats nach Zugang")).toBe(true);
    expect(hasRelativeDeadlineWording("bis zum 15. August 2026")).toBe(false);
  });
});

describe("applyPostChecks — deadlines", () => {
  it("keeps a date that appears in its own evidence", () => {
    const { analysis, violations } = applyPostChecks(baseAnalysis());
    expect(violations).toEqual([]);
    expect(analysis.deadlines[0]!.normalizedDate).toBe("2026-08-15");
  });

  it("strips a date that does not appear in the German it cites", () => {
    // The model reports 2026-09-01 while quoting a letter that says August.
    const doc = baseAnalysis();
    doc.deadlines[0]!.normalizedDate = "2026-09-01";

    const { analysis, violations } = applyPostChecks(doc);
    expect(violations).toContain("deadline_not_in_evidence");
    expect(analysis.deadlines[0]!.normalizedDate).toBeNull();
    // The German wording survives — the user can still read the truth.
    expect(analysis.deadlines[0]!.rawText).toBe("bis zum 15. August 2026");
    expect(analysis.limitations.join(" ")).toMatch(/could not confirm/i);
  });

  it("strips a date computed from a relative period", () => {
    const doc = baseAnalysis({
      deadlines: [
        {
          rawText: "innerhalb von zwei Wochen nach Zugang dieses Schreibens",
          normalizedDate: "2026-08-15", // computed, not stated
          timezone: "Europe/Berlin",
          meaning: "Two weeks after you received the letter.",
          confidence: "high",
          evidence: [{ page: 1, text: "innerhalb von zwei Wochen nach Zugang" }],
        },
      ],
    });

    const { analysis, violations } = applyPostChecks(doc);
    expect(violations).toContain("deadline_computed_from_relative_wording");
    expect(analysis.deadlines[0]!.normalizedDate).toBeNull();
    expect(analysis.deadlines[0]!.confidence).toBe("low");
  });
});

describe("applyPostChecks — contact details", () => {
  it("keeps a contact that appears in its evidence", () => {
    const doc = baseAnalysis({
      contactDetails: [
        {
          type: "phone",
          value: "030 12345678",
          evidence: [{ page: 1, text: "Telefon: 030 12345678" }],
        },
      ],
    });
    const { analysis, violations } = applyPostChecks(doc);
    expect(violations).toEqual([]);
    expect(analysis.contactDetails).toHaveLength(1);
  });

  it("drops an invented phone number", () => {
    // The gravest hallucination in this product: a plausible-looking number
    // that sends an anxious person to the wrong place.
    const doc = baseAnalysis({
      contactDetails: [
        {
          type: "phone",
          value: "030 99999999",
          evidence: [{ page: 1, text: "Telefon: 030 12345678" }],
        },
      ],
    });
    const { analysis, violations } = applyPostChecks(doc);
    expect(violations).toContain("contact_not_in_evidence");
    expect(analysis.contactDetails).toHaveLength(0);
    expect(analysis.limitations.join(" ")).toMatch(/contact details could not be confirmed/i);
  });

  it("ignores formatting differences between value and evidence", () => {
    const doc = baseAnalysis({
      contactDetails: [
        {
          type: "email",
          value: "Jobcenter.Mitte@jobcenter-ge.de",
          evidence: [{ page: 1, text: "E-Mail: jobcenter.mitte@jobcenter-ge.de" }],
        },
      ],
    });
    const { violations } = applyPostChecks(doc);
    expect(violations).toEqual([]);
  });
});

describe("risk classification", () => {
  it("detects court vocabulary in quoted German", () => {
    const doc = baseAnalysis({
      documentType: {
        label: "Letter",
        confidence: "medium",
        evidence: [{ page: 1, text: "Amtsgericht Berlin — Mahnbescheid" }],
      },
    });
    expect(detectRiskFlags(doc)).toContain("court_or_judicial");
  });

  it("detects deportation and asylum vocabulary", () => {
    const doc = baseAnalysis({
      summary: {
        plainLanguage: "…",
        evidence: [{ page: 1, text: "Ausreiseaufforderung und Abschiebungsandrohung" }],
      },
    });
    expect(detectRiskFlags(doc)).toContain("deportation_or_removal");
  });

  it("matches inside German compound words", () => {
    // Räumungsklage must trigger the eviction rule; whole-word matching
    // would miss it, which is why matching is substring-based.
    const doc = baseAnalysis({
      summary: { plainLanguage: "…", evidence: [{ page: 1, text: "Räumungsklage erhoben" }] },
    });
    expect(detectRiskFlags(doc)).toContain("eviction_or_housing");
  });

  it("finds nothing in an ordinary letter", () => {
    expect(detectRiskFlags(baseAnalysis())).toEqual([]);
  });

  it("escalates when the model missed a risk the keywords catch", () => {
    const doc = baseAnalysis({
      urgency: "informational",
      summary: {
        plainLanguage: "This letter is about your case.",
        evidence: [{ page: 1, text: "Strafbefehl der Staatsanwaltschaft" }],
      },
    });
    expect(doc.requiresHumanReview).toBe(false);

    const { analysis, addedFlags } = applyRiskEscalation(doc);
    expect(addedFlags).toContain("criminal_accusation");
    expect(analysis.requiresHumanReview).toBe(true);
    expect(analysis.humanReviewReason).not.toBeNull();
    expect(analysis.urgency).toBe("immediate_review");
  });

  it("never removes a risk the model reported", () => {
    // The keyword layer sees nothing here; the model's own judgement stands.
    const doc = baseAnalysis({
      riskFlags: ["unclear_but_serious"],
      requiresHumanReview: true,
      humanReviewReason: "The wording is unclear and the consequences may be serious.",
    });
    const { analysis } = applyRiskEscalation(doc);
    expect(analysis.riskFlags).toContain("unclear_but_serious");
    expect(analysis.requiresHumanReview).toBe(true);
  });

  it("forces human review whenever any risk flag is present", () => {
    const doc = baseAnalysis({ riskFlags: ["asylum_decision"], requiresHumanReview: false });
    const { analysis } = applyRiskEscalation(doc);
    expect(analysis.requiresHumanReview).toBe(true);
    expect(analysis.humanReviewReason).not.toBeNull();
  });
});
