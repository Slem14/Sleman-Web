import { z } from "zod";

/**
 * The DocumentAnalysis schema — the contract of the entire product.
 *
 * Every analysis the user ever sees MUST pass this runtime validation first
 * (master-spec §5). The schema is deliberately strict:
 *
 *  - `.strict()` on every object: unknown keys are rejected, so a confused
 *    or manipulated model response cannot smuggle extra content through.
 *  - Evidence is required wherever a claim is made: no quote, no claim.
 *  - Uncertainty is a first-class citizen (confidence levels, nullable
 *    normalized dates, "unclear" statuses) — the schema makes honesty easier
 *    to express than false confidence.
 *
 * Versioning: bump SCHEMA_VERSION on ANY shape change and record the change
 * in the CHANGELOG. The version travels inside every payload so logs and
 * evals can always tell which contract a result was produced under.
 */
export const SCHEMA_VERSION = "1.0.0";

/**
 * A quote from the original German document that backs up a claim.
 * `page` is null when the source has no usable page concept (e.g. photos).
 */
export const evidenceReferenceSchema = z
  .object({
    page: z.number().int().min(1).nullable(),
    text: z.string().min(1).max(1000),
  })
  .strict();

/** Confidence is coarse on purpose — fake precision ("87%") is banned UX. */
export const confidenceSchema = z.enum(["high", "medium", "low"]);

/** Machine-readable high-risk categories (docs/product/high-risk-document-policy.md). */
export const riskFlagSchema = z.enum([
  "court_or_judicial",
  "criminal_accusation",
  "police_or_prosecution",
  "deportation_or_removal",
  "asylum_decision",
  "residence_permit_negative",
  "benefits_loss",
  "enforcement_or_debt",
  "eviction_or_housing",
  "employment_dismissal",
  "tax_penalty",
  "child_protection",
  "urgent_medical",
  "unclear_but_serious",
]);

export const deadlineSchema = z
  .object({
    /** The German text exactly as it appears in the letter — authoritative. */
    rawText: z.string().min(1),
    /**
     * ISO date (YYYY-MM-DD) if the deadline could be normalized with
     * reasonable certainty, otherwise null. Never invented, never shifted.
     */
    normalizedDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
    /** Fixed: all German administrative deadlines live in this timezone. */
    timezone: z.literal("Europe/Berlin"),
    /** Plain-language meaning, e.g. "last day to submit the documents". */
    meaning: z.string().min(1),
    confidence: confidenceSchema,
    evidence: z.array(evidenceReferenceSchema).min(1),
  })
  .strict();

export const requestedActionSchema = z
  .object({
    description: z.string().min(1),
    /** True only when the letter literally asks for it — no inference. */
    explicitlyStated: z.boolean(),
    evidence: z.array(evidenceReferenceSchema).min(1),
  })
  .strict();

export const documentAnalysisSchema = z
  .object({
    schemaVersion: z.literal(SCHEMA_VERSION),
    detectedDocumentLanguage: z.string().min(2).max(16),
    outputLanguage: z.string().min(2).max(16),

    sender: z
      .object({
        name: z.string().min(1).nullable(),
        category: z.string().min(1).nullable(),
        evidence: z.array(evidenceReferenceSchema),
      })
      .strict(),

    documentType: z
      .object({
        label: z.string().min(1),
        confidence: confidenceSchema,
        evidence: z.array(evidenceReferenceSchema),
      })
      .strict(),

    summary: z
      .object({
        plainLanguage: z.string().min(1),
        evidence: z.array(evidenceReferenceSchema),
      })
      .strict(),

    actionStatus: z.enum([
      "explicit_action_required",
      "possibly_action_required",
      "no_explicit_action_found",
      "unclear",
    ]),

    urgency: z.enum([
      "immediate_review",
      "deadline_detected",
      "action_without_clear_deadline",
      "informational",
      "unclear",
    ]),

    deadlines: z.array(deadlineSchema),
    requestedActions: z.array(requestedActionSchema),

    requestedDocuments: z.array(
      z
        .object({
          description: z.string().min(1),
          evidence: z.array(evidenceReferenceSchema).min(1),
        })
        .strict(),
    ),

    consequences: z.array(
      z
        .object({
          description: z.string().min(1),
          explicitlyStated: z.boolean(),
          evidence: z.array(evidenceReferenceSchema).min(1),
        })
        .strict(),
    ),

    contactDetails: z.array(
      z
        .object({
          type: z.enum(["postal_address", "email", "phone", "portal", "other"]),
          /** Only ever copied from the document — inventing contacts is a
           * deploy-blocking safety violation (docs/product/metrics.md). */
          value: z.string().min(1),
          evidence: z.array(evidenceReferenceSchema).min(1),
        })
        .strict(),
    ),

    suggestedNextSteps: z.array(
      z
        .object({
          description: z.string().min(1),
          /** "document" = grounded in this letter; "general_caution" = generic
           * safe advice. The UI renders these visually separated. */
          basis: z.enum(["document", "general_caution"]),
        })
        .strict(),
    ),

    riskFlags: z.array(riskFlagSchema),
    requiresHumanReview: z.boolean(),
    humanReviewReason: z.string().min(1).nullable(),
    limitations: z.array(z.string().min(1)),
  })
  .strict()
  // Cross-field safety invariants — cheap deterministic checks that catch
  // inconsistent model output even when each field looks fine in isolation.
  .refine((doc) => doc.riskFlags.length === 0 || doc.requiresHumanReview, {
    message: "risk flags present but requiresHumanReview is false",
  })
  .refine((doc) => !(doc.requiresHumanReview && doc.humanReviewReason === null), {
    message: "requiresHumanReview without a humanReviewReason",
  })
  .refine((doc) => doc.urgency !== "deadline_detected" || doc.deadlines.length > 0, {
    message: "urgency says deadline_detected but no deadlines listed",
  });

export type DocumentAnalysis = z.infer<typeof documentAnalysisSchema>;
export type EvidenceReference = z.infer<typeof evidenceReferenceSchema>;
export type Deadline = z.infer<typeof deadlineSchema>;
export type RiskFlag = z.infer<typeof riskFlagSchema>;

/**
 * Fail-safe parse: returns the validated analysis or `null` — the caller must
 * treat `null` as "show a safe error, never render a partial result"
 * (master-spec §5: fail safely if invalid).
 */
export function parseDocumentAnalysis(input: unknown): DocumentAnalysis | null {
  const result = documentAnalysisSchema.safeParse(input);
  return result.success ? result.data : null;
}
