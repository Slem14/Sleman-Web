import {
  MAX_FILE_BYTES,
  MAX_IMAGE_PIXELS,
  MAX_PDF_PAGES,
  isAllowedMimeType,
  type AllowedMimeType,
  type UploadErrorCode,
} from "@wg/validation";
import { estimatePdfPageCount, imageDimensions } from "./inspect.js";
import { sniffMimeType } from "./magic-bytes.js";

export type UploadValidationResult =
  { ok: true; mimeType: AllowedMimeType } | { ok: false; errorCode: UploadErrorCode };

/**
 * The complete server-side gate an uploaded file must pass before any
 * processing (pipeline steps 4–6, master-spec §16). Order matters: cheap
 * checks run first so abusive requests cost us as little as possible.
 */
export function validateUpload(bytes: Buffer, declaredMimeType: string): UploadValidationResult {
  // 1. Size — also enforced upstream by the multipart limit; double-checked
  //    here so this function is safe to reuse in other entry paths.
  if (bytes.length === 0) return { ok: false, errorCode: "NO_FILE" };
  if (bytes.length > MAX_FILE_BYTES) return { ok: false, errorCode: "FILE_TOO_LARGE" };

  // 2. Declared type must be one we support at all.
  if (!isAllowedMimeType(declaredMimeType)) {
    return { ok: false, errorCode: "UNSUPPORTED_TYPE" };
  }

  // 3. Reality check: the bytes decide, not the header (anti-spoofing).
  const actual = sniffMimeType(bytes);
  if (actual === null) return { ok: false, errorCode: "UNSUPPORTED_TYPE" };
  if (actual !== declaredMimeType) return { ok: false, errorCode: "CORRUPT_FILE" };

  // 4. Structural limits per format.
  if (actual === "application/pdf") {
    if (estimatePdfPageCount(bytes) > MAX_PDF_PAGES) {
      return { ok: false, errorCode: "TOO_MANY_PAGES" };
    }
  } else {
    const dims = imageDimensions(bytes, actual);
    // Unreadable headers on a file that passed magic-byte checks means a
    // malformed/truncated image — reject rather than guess (fail closed).
    if (dims === null) return { ok: false, errorCode: "CORRUPT_FILE" };
    if (dims.width * dims.height > MAX_IMAGE_PIXELS) {
      return { ok: false, errorCode: "IMAGE_TOO_LARGE" };
    }
  }

  return { ok: true, mimeType: actual };
}
