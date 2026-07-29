import type { AllowedMimeType, DocumentAnalysis } from "@wg/validation";

/**
 * Provider abstraction (ADR 0004): the application depends on this interface
 * only — never on a concrete vendor SDK. Swapping providers is configuration,
 * not surgery, which keeps the provider-exit plan credible.
 */
export interface AnalysisInput {
  /** Raw document bytes — exists in memory only, never written to disk. */
  fileBytes: Buffer;
  mimeType: AllowedMimeType;
  /** Locale the explanation must be written in ("en" | "prs"). */
  outputLanguage: string;
  /**
   * Random request ID for log correlation. Deliberately the ONLY identifier
   * a provider ever receives — no filenames, no IPs, no user hints (TB-2).
   */
  requestId: string;
}

export interface DocumentAnalysisProvider {
  /** Short identifier recorded in operational logs (C2 data). */
  readonly name: string;
  analyze(input: AnalysisInput): Promise<DocumentAnalysis>;
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
