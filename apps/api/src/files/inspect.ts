import type { AllowedMimeType } from "@wg/validation";

/**
 * Lightweight structural inspection of accepted formats.
 *
 * Purpose: enforce resource limits (pixels, pages) BEFORE any expensive or
 * risky processing happens — decompression bombs are a named threat
 * (master-spec §10). We only read header fields; we never decode image data
 * or execute PDF structures here. Full parser isolation is a Stage 6 task;
 * the residual risk is documented in the risk register (R-21).
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

/** PNG: IHDR is always the first chunk — width/height at fixed offsets 16/20. */
function pngDimensions(bytes: Buffer): ImageDimensions | null {
  if (bytes.length < 24) return null;
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

/**
 * JPEG: walk the marker segments until a Start-Of-Frame marker (C0–CF,
 * excluding C4/C8/CC which are not frames) carries the dimensions.
 */
function jpegDimensions(bytes: Buffer): ImageDimensions | null {
  let offset = 2; // skip FF D8
  while (offset + 9 < bytes.length) {
    if (bytes[offset] !== 0xff) return null; // lost sync — corrupt file
    const marker = bytes[offset + 1]!;
    // Standalone markers without a length field.
    if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7) || marker === 0x01) {
      offset += 2;
      continue;
    }
    const segmentLength = bytes.readUInt16BE(offset + 2);
    const isStartOfFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isStartOfFrame) {
      return {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
    }
    if (segmentLength < 2) return null;
    offset += 2 + segmentLength;
  }
  return null;
}

/**
 * WebP: three sub-formats store dimensions differently (VP8X/VP8/VP8L).
 * Each sub-format needs a different minimum length, so the bounds are checked
 * per branch — a blanket minimum would reject valid small lossless files.
 */
function webpDimensions(bytes: Buffer): ImageDimensions | null {
  if (bytes.length < 16) return null;
  const chunk = bytes.toString("latin1", 12, 16);
  if (chunk === "VP8X") {
    if (bytes.length < 30) return null;
    // Extended format: 24-bit little-endian width-1 / height-1 at 24 / 27.
    const width = 1 + (bytes[24]! | (bytes[25]! << 8) | (bytes[26]! << 16));
    const height = 1 + (bytes[27]! | (bytes[28]! << 8) | (bytes[29]! << 16));
    return { width, height };
  }
  if (chunk === "VP8 ") {
    if (bytes.length < 30) return null;
    // Lossy: 14-bit dimensions at fixed offsets after the frame tag.
    return {
      width: bytes.readUInt16LE(26) & 0x3fff,
      height: bytes.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    if (bytes.length < 25) return null;
    // Lossless: after the 0x2f signature byte at offset 20, 14 bits of
    // (width-1) then 14 bits of (height-1), packed little-endian.
    const bits = bytes.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  return null;
}

export function imageDimensions(bytes: Buffer, mime: AllowedMimeType): ImageDimensions | null {
  switch (mime) {
    case "image/png":
      return pngDimensions(bytes);
    case "image/jpeg":
      return jpegDimensions(bytes);
    case "image/webp":
      return webpDimensions(bytes);
    default:
      return null;
  }
}

/**
 * Conservative PDF page-count estimate: counts `/Type /Page` object markers
 * in the raw bytes. Not a full parse (deliberately — untrusted input), and it
 * can undercount in exotic compressed structures, so the AI provider's own
 * page limit remains the second line of defense.
 */
export function estimatePdfPageCount(bytes: Buffer): number {
  const text = bytes.toString("latin1");
  const matches = text.match(/\/Type\s*\/Page(?![a-zA-Z])/g);
  return Math.max(1, matches?.length ?? 0);
}
