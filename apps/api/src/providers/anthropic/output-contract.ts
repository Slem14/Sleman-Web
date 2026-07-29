import { SCHEMA_VERSION } from "@wg/validation";

/**
 * The output shape, described for the model.
 *
 * This is a DESCRIPTION, not the enforcement layer. `parseDocumentAnalysis()`
 * remains the only thing that decides whether an analysis is acceptable — if
 * this text and the Zod schema ever disagree, the schema wins and the response
 * is rejected. Keeping them aligned only improves first-try success rate; it
 * cannot weaken the guarantee.
 *
 * Written by hand rather than generated so the field notes can carry the
 * safety rules ("only if written in the letter") that a bare JSON Schema has
 * no way to express.
 */
export function buildOutputContract(): string {
  return `# Output format

Return exactly one JSON object and nothing else. No markdown fences, no commentary.

{
  "schemaVersion": "${SCHEMA_VERSION}",
  "detectedDocumentLanguage": "de",
  "outputLanguage": "<the language you were asked to write in>",

  "sender": {
    "name": "<the sending authority, in German, or null>",
    "category": "<kind of body, e.g. Jobcenter / Ausländerbehörde / Krankenkasse / court / landlord / employer, or null>",
    "evidence": [{ "page": <number or null>, "text": "<German quote>" }]
  },

  "documentType": {
    "label": "<what kind of letter this is, in the output language>",
    "confidence": "high" | "medium" | "low",
    "evidence": [{ "page": <number or null>, "text": "<German quote>" }]
  },

  "summary": {
    "plainLanguage": "<a few short sentences: who wrote, what it is about, what it asks>",
    "evidence": [{ "page": <number or null>, "text": "<German quote>" }]
  },

  "actionStatus": "explicit_action_required" | "possibly_action_required" | "no_explicit_action_found" | "unclear",
  "urgency": "immediate_review" | "deadline_detected" | "action_without_clear_deadline" | "informational" | "unclear",

  "deadlines": [
    {
      "rawText": "<the German deadline wording, copied exactly>",
      "normalizedDate": "YYYY-MM-DD" or null,
      "timezone": "Europe/Berlin",
      "meaning": "<what happens by this date, in the output language>",
      "confidence": "high" | "medium" | "low",
      "evidence": [{ "page": <number or null>, "text": "<German quote>" }]
    }
  ],

  "requestedActions": [
    {
      "description": "<what the reader is asked to do>",
      "explicitlyStated": true | false,
      "evidence": [{ "page": <number or null>, "text": "<German quote>" }]
    }
  ],

  "requestedDocuments": [
    { "description": "<document asked for>", "evidence": [{ "page": <number or null>, "text": "<German quote>" }] }
  ],

  "consequences": [
    { "description": "<consequence the letter states>", "explicitlyStated": true | false, "evidence": [{ "page": <number or null>, "text": "<German quote>" }] }
  ],

  "contactDetails": [
    { "type": "postal_address" | "email" | "phone" | "portal" | "other", "value": "<copied exactly from the letter>", "evidence": [{ "page": <number or null>, "text": "<German quote>" }] }
  ],

  "suggestedNextSteps": [
    { "description": "<a step the reader could take>", "basis": "document" | "general_caution" }
  ],

  "riskFlags": [ "court_or_judicial" | "criminal_accusation" | "police_or_prosecution" | "deportation_or_removal" | "asylum_decision" | "residence_permit_negative" | "benefits_loss" | "enforcement_or_debt" | "eviction_or_housing" | "employment_dismissal" | "tax_penalty" | "child_protection" | "urgent_medical" | "unclear_but_serious" ],
  "requiresHumanReview": true | false,
  "humanReviewReason": "<why, in the output language>" or null,
  "limitations": [ "<anything that limits how much this analysis can be trusted>" ]
}

Field rules that decide whether the answer is usable:

- Arrays may be empty. Never invent an entry to avoid an empty array.
- Every entry in deadlines, requestedActions, requestedDocuments, consequences and contactDetails MUST carry at least one evidence quotation. No quote means the entry does not belong in the output.
- "evidence[].text" is ORIGINAL GERMAN copied from the document. Never translated, never paraphrased.
- "normalizedDate" is only ever a date written in the letter. If the letter gives a period rather than a date, use null.
- "contactDetails[].value" is copied character-for-character from the letter.
- If "riskFlags" is non-empty then "requiresHumanReview" must be true and "humanReviewReason" must be filled in.
- If "urgency" is "deadline_detected" then "deadlines" must contain at least one entry.
- "page" is null when the document has no meaningful page numbers, such as a single photograph.`;
}
