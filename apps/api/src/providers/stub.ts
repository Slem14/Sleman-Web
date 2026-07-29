import { SCHEMA_VERSION, parseDocumentAnalysis, type DocumentAnalysis } from "@wg/validation";
import type { AnalysisInput, DocumentAnalysisProvider } from "./types.js";
import { ProviderError } from "./types.js";

/**
 * StubProvider — a deterministic, zero-cost stand-in for a real AI provider.
 *
 * Why it exists (ADR 0004): the entire pipeline, frontend, and E2E suite can
 * be built and tested without any AI account, cost, or privacy exposure.
 * It fabricates the SAME fictional Jobcenter letter analysis every time,
 * localized to the requested output language.
 *
 * It runs its own output through the schema validator exactly like a real
 * provider would be treated — the stub gets no trust discount.
 */

const SUMMARIES: Record<
  string,
  { summary: string; meaning: string; action: string; step: string }
> = {
  en: {
    summary:
      "This letter is from the Jobcenter. It asks you to hand in two documents: your rental contract and a bank statement. The deadline is 15 August 2026.",
    meaning: "Last day to hand in the requested documents.",
    action: "Hand in your rental contract and a current bank statement.",
    step: "Prepare the documents early and keep a copy of everything you send.",
  },
  prs: {
    summary:
      "این نامه از Jobcenter است. از شما خواسته شده دو سند را تحویل بدهید: قرارداد کرایهٔ خانه و صورت‌حساب بانکی. مهلت آن ۱۵ اگست ۲۰۲۶ است.",
    meaning: "آخرین روز برای تحویل اسناد خواسته‌شده.",
    action: "قرارداد کرایه و صورت‌حساب بانکی تازه را تحویل بدهید.",
    step: "اسناد را زودتر آماده کنید و از هر چیزی که می‌فرستید یک کاپی نگه دارید.",
  },
};

export class StubProvider implements DocumentAnalysisProvider {
  readonly name = "stub";

  analyze(input: AnalysisInput): Promise<DocumentAnalysis> {
    const t = SUMMARIES[input.outputLanguage] ?? SUMMARIES["en"]!;

    const candidate = {
      schemaVersion: SCHEMA_VERSION,
      detectedDocumentLanguage: "de",
      outputLanguage: input.outputLanguage,
      sender: {
        name: "Jobcenter Berlin Mitte",
        category: "Jobcenter",
        evidence: [{ page: 1, text: "Jobcenter Berlin Mitte, Seydelstraße 2-5" }],
      },
      documentType: {
        label: "Mitwirkungsaufforderung (request to cooperate)",
        confidence: "high" as const,
        evidence: [{ page: 1, text: "Aufforderung zur Mitwirkung nach § 60 SGB I" }],
      },
      summary: {
        plainLanguage: t.summary,
        evidence: [
          {
            page: 1,
            text: "Bitte reichen Sie die folgenden Unterlagen ein: Mietvertrag, aktueller Kontoauszug",
          },
        ],
      },
      actionStatus: "explicit_action_required" as const,
      urgency: "deadline_detected" as const,
      deadlines: [
        {
          rawText: "bis zum 15. August 2026",
          normalizedDate: "2026-08-15",
          timezone: "Europe/Berlin" as const,
          meaning: t.meaning,
          confidence: "high" as const,
          evidence: [{ page: 1, text: "reichen Sie die Unterlagen bis zum 15. August 2026 ein" }],
        },
      ],
      requestedActions: [
        {
          description: t.action,
          explicitlyStated: true,
          evidence: [{ page: 1, text: "Bitte reichen Sie die folgenden Unterlagen ein" }],
        },
      ],
      requestedDocuments: [
        {
          description: "Rental contract (Mietvertrag)",
          evidence: [{ page: 1, text: "Mietvertrag" }],
        },
        {
          description: "Current bank statement (aktueller Kontoauszug)",
          evidence: [{ page: 1, text: "aktueller Kontoauszug" }],
        },
      ],
      consequences: [],
      contactDetails: [],
      suggestedNextSteps: [{ description: t.step, basis: "general_caution" as const }],
      riskFlags: [],
      requiresHumanReview: false,
      humanReviewReason: null,
      limitations: ["This is a demonstration analysis produced by the stub provider."],
    };

    // Same trust rules as a real provider: schema-validate or fail safely.
    const parsed = parseDocumentAnalysis(candidate);
    if (parsed === null) {
      return Promise.reject(new ProviderError("invalid_output", "stub produced invalid analysis"));
    }
    return Promise.resolve(parsed);
  }
}
