/**
 * Upload constraints — the single source of truth shared by the web client
 * (friendly pre-checks) and the API (authoritative enforcement).
 *
 * The client checks exist purely for fast, kind feedback; the server NEVER
 * trusts them (trust boundary TB-1, docs/architecture/trust-boundaries.md).
 */

/** Maximum accepted upload size. Typical letter photos are 2–6 MB. */
export const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15 MiB

/** Maximum PDF pages — administrative letters are short; books are abuse. */
export const MAX_PDF_PAGES = 20;

/** Maximum image pixels (width × height) — caps decompression cost. */
export const MAX_IMAGE_PIXELS = 50_000_000; // 50 MP

/** The only content types the product accepts (master-spec §3). */
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export function isAllowedMimeType(value: string): value is AllowedMimeType {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(value);
}

/**
 * Machine-readable error codes for upload/analysis failures. The API returns
 * codes, not sentences — the web client maps each code to a localized,
 * friendly message (English/Dari). Never leak technical detail to users.
 */
export const UPLOAD_ERROR_CODES = [
  "FILE_TOO_LARGE",
  "UNSUPPORTED_TYPE",
  "CORRUPT_FILE",
  "TOO_MANY_PAGES",
  "IMAGE_TOO_LARGE",
  "INVALID_LANGUAGE",
  "NO_FILE",
  "RATE_LIMITED",
  "PROVIDER_ERROR",
  /**
   * The provider's safety classifiers declined this document. Distinct from
   * PROVIDER_ERROR because the user-facing answer is different: nothing is
   * broken, this particular letter cannot be handled automatically, and the
   * right advice is to seek qualified human help.
   */
  "ANALYSIS_REFUSED",
  "INTERNAL_ERROR",
] as const;

export type UploadErrorCode = (typeof UPLOAD_ERROR_CODES)[number];
