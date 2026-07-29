/**
 * Synthetic file fixtures for tests.
 *
 * These are the smallest structurally valid files of each accepted format —
 * generated, never taken from a real document. Test data must never contain
 * real user content (docs/privacy/data-classification.md, class C1).
 *
 * Lives in its own module (not inside a *.test.ts) so importing it from
 * another suite does not re-execute that suite's tests.
 */

/** Real 1×1 pixel PNG (67 bytes). */
export const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
  "base64",
);

/** Real 1×1 pixel JPEG. */
export const TINY_JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AVN//2Q==",
  "base64",
);

/** Hand-built minimal lossless WebP (VP8L) describing a 1×1 image. */
export const TINY_WEBP = (() => {
  const buf = Buffer.alloc(26);
  buf.write("RIFF", 0, "latin1");
  buf.writeUInt32LE(18, 4); // RIFF payload size
  buf.write("WEBP", 8, "latin1");
  buf.write("VP8L", 12, "latin1");
  buf.writeUInt32LE(5, 16); // chunk size
  buf[20] = 0x2f; // VP8L signature byte
  // Dimension bits: width-1 = 0, height-1 = 0 → a 1×1 image.
  buf.writeUInt32LE(0, 21);
  return buf;
})();

/** Minimal single-page PDF skeleton (structurally sufficient, not renderable). */
export const TINY_PDF = Buffer.from(
  "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
    "3 0 obj\n<< /Type /Page /Parent 2 0 R >>\nendobj\n" +
    "trailer\n<< /Root 1 0 R >>\n%%EOF",
  "latin1",
);
