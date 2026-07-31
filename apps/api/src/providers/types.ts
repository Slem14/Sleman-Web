import type {
  AllowedMimeType,
  DocumentAnalysis,
  PriorExchange,
  QuestionAnswer,
} from "@wg/validation";

/**
 * Provider abstraction (ADR 0004): the application depends on this interface
 * only — never on a concrete vendor SDK. Swapping providers is configuration,
 * not surgery, which keeps the provider-exit plan credible.
 */
/**
 * One page or attachment of a single letter.
 *
 * Letters arrive as several files far more often than as one — a two-page
 * Jobcenter decision photographed page by page, or a form stapled behind its
 * cover letter. They are passed to the provider together and analysed as ONE
 * document, because the parts only make sense read together: page 1 carries
 * the deadline, page 2 the form it applies to.
 */
export interface DocumentFile {
  /** Raw document bytes — exists in memory only, never written to disk. */
  bytes: Buffer;
  mimeType: AllowedMimeType;
}

export interface AnalysisInput {
  /** All parts of one letter, in the order the reader arranged them. */
  files: DocumentFile[];
  /** Locale the explanation must be written in ("en" | "prs"). */
  outputLanguage: string;
  /**
   * Random request ID for log correlation. Deliberately the ONLY identifier
   * a provider ever receives — no filenames, no IPs, no user hints (TB-2).
   */
  requestId: string;
}

/**
 * A follow-up question about a document the user already uploaded.
 *
 * The document is re-sent with every question rather than held server-side.
 * That is the whole reason the promise "we keep nothing" survives this
 * feature: the browser owns the file for as long as the user keeps the page
 * open, and the API stays stateless between requests.
 */
export interface QuestionInput {
  files: DocumentFile[];
  outputLanguage: string;
  requestId: string;
  question: string;
  /** Earlier exchanges in this conversation, replayed by the browser. */
  history: PriorExchange[];
}

export interface DocumentAnalysisProvider {
  /** Short identifier recorded in operational logs (C2 data). */
  readonly name: string;
  analyze(input: AnalysisInput): Promise<DocumentAnalysis>;
  answerQuestion(input: QuestionInput): Promise<QuestionAnswer>;
}

/** Typed failure taxonomy so routes map problems to stable error codes. */
export type ProviderFailureKind = "timeout" | "refused" | "invalid_output" | "unavailable";

export class ProviderError extends Error {
  readonly kind: ProviderFailureKind;

  constructor(kind: ProviderFailureKind, message: string) {
    // NOTE: message must never contain document content — it ends up in logs.
    super(message);
    this.name = "ProviderError";
    this.kind = kind;
  }
}
