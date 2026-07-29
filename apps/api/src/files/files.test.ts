import { MAX_FILE_BYTES } from "@wg/validation";
import { describe, expect, it } from "vitest";
import { estimatePdfPageCount, imageDimensions } from "./inspect.js";
import { sniffMimeType } from "./magic-bytes.js";
import { TINY_JPEG, TINY_PDF, TINY_PNG, TINY_WEBP } from "./test-fixtures.js";
import { validateUpload } from "./validate-upload.js";

describe("sniffMimeType", () => {
  it("identifies all four accepted formats by bytes", () => {
    expect(sniffMimeType(TINY_PNG)).toBe("image/png");
    expect(sniffMimeType(TINY_JPEG)).toBe("image/jpeg");
    expect(sniffMimeType(TINY_WEBP)).toBe("image/webp");
    expect(sniffMimeType(TINY_PDF)).toBe("application/pdf");
  });

  it("returns null for unknown formats (fail closed)", () => {
    expect(sniffMimeType(Buffer.from("hello world"))).toBeNull();
    expect(sniffMimeType(Buffer.from("GIF89a......", "latin1"))).toBeNull(); // GIF not accepted
    expect(sniffMimeType(Buffer.alloc(0))).toBeNull();
  });
});

describe("imageDimensions", () => {
  it("reads PNG, JPEG and WebP dimensions from headers", () => {
    expect(imageDimensions(TINY_PNG, "image/png")).toEqual({ width: 1, height: 1 });
    expect(imageDimensions(TINY_JPEG, "image/jpeg")).toEqual({ width: 1, height: 1 });
    expect(imageDimensions(TINY_WEBP, "image/webp")).toEqual({ width: 1, height: 1 });
  });

  it("returns null on truncated files instead of guessing", () => {
    expect(imageDimensions(TINY_PNG.subarray(0, 10), "image/png")).toBeNull();
    expect(imageDimensions(TINY_JPEG.subarray(0, 4), "image/jpeg")).toBeNull();
  });
});

describe("estimatePdfPageCount", () => {
  it("counts page objects", () => {
    expect(estimatePdfPageCount(TINY_PDF)).toBe(1);
  });

  it("does not count /Pages container objects as pages", () => {
    // TINY_PDF contains one /Type /Pages and one /Type /Page — expect 1.
    expect(estimatePdfPageCount(TINY_PDF)).toBe(1);
  });
});

describe("validateUpload", () => {
  it("accepts matching declared and actual types", () => {
    expect(validateUpload(TINY_PNG, "image/png")).toEqual({ ok: true, mimeType: "image/png" });
    expect(validateUpload(TINY_PDF, "application/pdf")).toEqual({
      ok: true,
      mimeType: "application/pdf",
    });
  });

  it("rejects spoofed types: PNG bytes declared as PDF", () => {
    expect(validateUpload(TINY_PNG, "application/pdf")).toEqual({
      ok: false,
      errorCode: "CORRUPT_FILE",
    });
  });

  it("rejects disallowed declared types outright", () => {
    expect(validateUpload(TINY_PNG, "text/plain")).toEqual({
      ok: false,
      errorCode: "UNSUPPORTED_TYPE",
    });
  });

  it("rejects empty and oversized files", () => {
    expect(validateUpload(Buffer.alloc(0), "image/png")).toEqual({
      ok: false,
      errorCode: "NO_FILE",
    });
    const huge = Buffer.alloc(MAX_FILE_BYTES + 1);
    TINY_PNG.copy(huge); // valid header, absurd size
    expect(validateUpload(huge, "image/png")).toEqual({
      ok: false,
      errorCode: "FILE_TOO_LARGE",
    });
  });

  it("rejects PDFs with too many pages", () => {
    const manyPages = Buffer.from(
      "%PDF-1.4\n" + "<< /Type /Page >>\n".repeat(21) + "%%EOF",
      "latin1",
    );
    expect(validateUpload(manyPages, "application/pdf")).toEqual({
      ok: false,
      errorCode: "TOO_MANY_PAGES",
    });
  });

  it("rejects images whose headers cannot be parsed (truncated)", () => {
    // Long enough to pass magic sniffing, but the dimension parse fails.
    const corrupt = Buffer.concat([TINY_JPEG.subarray(0, 3), Buffer.alloc(64, 0)]);
    expect(validateUpload(corrupt, "image/jpeg")).toEqual({
      ok: false,
      errorCode: "CORRUPT_FILE",
    });
  });
});
