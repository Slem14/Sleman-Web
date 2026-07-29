import type { AllowedMimeType } from "@wg/validation";

/**
 * Magic-byte sniffing — the authoritative check of what a file actually IS.
 *
 * Browsers send a `Content-Type` header and a filename extension, but both
 * are trivially spoofable (threat model: file-type spoofing, master-spec
 * §10). We therefore identify files by their leading bytes and treat the
 * declared type as a hint that must AGREE with reality, never as truth.
 *
 * Implemented by hand on purpose: four signatures are simpler to audit than
 * a dependency that parses hundreds of formats we do not accept.
 */
export function sniffMimeType(bytes: Buffer): AllowedMimeType | null {
  // PDF: "%PDF-" (25 50 44 46 2D). Some real-world PDFs have a UTF-8 BOM or
  // junk before the header; we accept a small tolerance window of 1024 bytes
  // like common PDF readers do.
  const window = bytes.subarray(0, 1024);
  if (window.includes("%PDF-")) return "application/pdf";

  // JPEG: FF D8 FF — start-of-image marker followed by any APPn marker.
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  // PNG: the fixed 8-byte signature 89 50 4E 47 0D 0A 1A 0A.
  const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return "image/png";
  }

  // WebP: RIFF container — "RIFF" at 0, "WEBP" at 8.
  if (
    bytes.length >= 12 &&
    bytes.toString("latin1", 0, 4) === "RIFF" &&
    bytes.toString("latin1", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null; // Unknown or disallowed format — caller rejects.
}
