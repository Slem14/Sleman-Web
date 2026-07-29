import { z } from "zod";
import { evidenceReferenceSchema } from "./document-analysis.js";

/**
 * A follow-up answer about a letter the user has already uploaded.
 *
 * The same safety contract as the analysis applies: an answer is grounded in
 * the document or it is honestly marked as not answerable from it. The reason
 * this type exists separately is that a question invites the model to be
 * helpful in ways the analysis never could — "what should I do?", "will they
 * deport me?" — and the shape of the answer has to make refusing those
 * comfortable rather than awkward.
 */
export const questionAnswerSchema = z
  .object({
    /** The answer, in the user's language. */
    answer: z.string().min(1).max(4000),
    /**
     * False when the letter simply does not contain the answer. The UI shows
     * this differently — saying "your letter does not say" is a useful answer,
     * and must never be dressed up as a guess.
     */
    answeredFromDocument: z.boolean(),
    /** German passages supporting the answer. Empty is only valid when
     * `answeredFromDocument` is false. */
    evidence: z.array(evidenceReferenceSchema),
    /**
     * Set when the question asks for something the service must not provide —
     * legal advice, a prediction, an eligibility decision. The UI turns this
     * into a pointer towards qualified human help rather than an error.
     */
    outOfScope: z.boolean(),
    limitations: z.array(z.string().min(1)),
  })
  .strict()
  .refine((a) => !a.answeredFromDocument || a.evidence.length > 0, {
    message: "an answer drawn from the document must cite evidence",
  });

export type QuestionAnswer = z.infer<typeof questionAnswerSchema>;

/** Fail-safe parse: null means "show a safe error", never a partial answer. */
export function parseQuestionAnswer(input: unknown): QuestionAnswer | null {
  const result = questionAnswerSchema.safeParse(input);
  return result.success ? result.data : null;
}

/** One earlier exchange, replayed so follow-ups can build on each other. */
export const priorExchangeSchema = z
  .object({
    question: z.string().min(1).max(500),
    answer: z.string().min(1).max(4000),
  })
  .strict();

export type PriorExchange = z.infer<typeof priorExchangeSchema>;

/** Bounded so a conversation cannot grow without limit (cost + latency). */
export const MAX_PRIOR_EXCHANGES = 8;
export const MAX_QUESTION_LENGTH = 500;
