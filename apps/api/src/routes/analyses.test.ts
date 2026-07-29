import { parseDocumentAnalysis } from "@wg/validation";
import { Writable } from "node:stream";
import { describe, expect, it } from "vitest";
import { loadConfig } from "../config.js";
import { TINY_PDF, TINY_PNG } from "../files/test-fixtures.js";
import { buildServer } from "../server.js";

const testConfig = loadConfig({ NODE_ENV: "test", LOG_LEVEL: "info" });

/** Shape of every error response the API returns — codes, never prose. */
interface ErrorBody {
  error: { code: string };
}

/** Typed accessor for inject() responses (res.json() is `any`). */
function errorBody(res: { json: () => unknown }): ErrorBody {
  return res.json() as ErrorBody;
}

/** Build a raw multipart/form-data payload by hand — no client libs needed. */
function multipartUpload(opts: {
  fileBytes: Buffer;
  filename: string;
  contentType: string;
  language?: string;
}) {
  const boundary = "----wgtestboundary";
  const parts: Buffer[] = [];
  if (opts.language !== undefined) {
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="language"\r\n\r\n${opts.language}\r\n`,
      ),
    );
  }
  parts.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${opts.filename}"\r\n` +
        `Content-Type: ${opts.contentType}\r\n\r\n`,
    ),
    opts.fileBytes,
    Buffer.from(`\r\n--${boundary}--\r\n`),
  );
  return {
    payload: Buffer.concat(parts),
    headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
  };
}

describe("POST /v1/analyses", () => {
  it("returns a schema-valid analysis for a valid PNG upload", async () => {
    const app = await buildServer(testConfig);
    const req = multipartUpload({
      fileBytes: TINY_PNG,
      filename: "letter.png",
      contentType: "image/png",
      language: "en",
    });
    const res = await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    expect(res.statusCode).toBe(200);
    const analysis = parseDocumentAnalysis(res.json());
    expect(analysis).not.toBeNull();
    expect(analysis!.outputLanguage).toBe("en");
    expect(analysis!.deadlines[0]!.normalizedDate).toBe("2026-08-15");
    await app.close();
  });

  it("localizes the analysis for Dari (prs)", async () => {
    const app = await buildServer(testConfig);
    const req = multipartUpload({
      fileBytes: TINY_PDF,
      filename: "brief.pdf",
      contentType: "application/pdf",
      language: "prs",
    });
    const res = await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    expect(res.statusCode).toBe(200);
    const analysis = parseDocumentAnalysis(res.json());
    expect(analysis!.outputLanguage).toBe("prs");
    expect(analysis!.summary.plainLanguage).toMatch(/[؀-ۿ]/); // actual Dari text
    // German evidence stays German regardless of output language.
    expect(analysis!.deadlines[0]!.rawText).toContain("15. August 2026");
    await app.close();
  });

  it("rejects disallowed file types with a stable error code", async () => {
    const app = await buildServer(testConfig);
    const req = multipartUpload({
      fileBytes: Buffer.from("just some text"),
      filename: "letter.txt",
      contentType: "text/plain",
      language: "en",
    });
    const res = await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    expect(res.statusCode).toBe(415);
    expect(res.json()).toEqual({ error: { code: "UNSUPPORTED_TYPE" } });
    await app.close();
  });

  it("rejects spoofed extensions (PNG bytes claiming to be PDF)", async () => {
    const app = await buildServer(testConfig);
    const req = multipartUpload({
      fileBytes: TINY_PNG,
      filename: "letter.pdf",
      contentType: "application/pdf",
      language: "en",
    });
    const res = await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    expect(res.statusCode).toBe(422);
    expect(errorBody(res).error.code).toBe("CORRUPT_FILE");
    await app.close();
  });

  it("rejects a missing language field", async () => {
    const app = await buildServer(testConfig);
    const req = multipartUpload({
      fileBytes: TINY_PNG,
      filename: "letter.png",
      contentType: "image/png",
      // no language on purpose
    });
    const res = await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    expect(res.statusCode).toBe(400);
    expect(errorBody(res).error.code).toBe("INVALID_LANGUAGE");
    await app.close();
  });

  it("enforces the per-route rate limit", async () => {
    const app = await buildServer(loadConfig({ NODE_ENV: "test", RATE_LIMIT_MAX: "2" }));
    const req = multipartUpload({
      fileBytes: TINY_PNG,
      filename: "a.png",
      contentType: "image/png",
      language: "en",
    });
    await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    const third = await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    expect(third.statusCode).toBe(429);
    expect(errorBody(third).error.code).toBe("RATE_LIMITED");
    await app.close();
  });

  it("denies CORS for unknown origins (deny-by-default)", async () => {
    const app = await buildServer(testConfig);
    const denied = await app.inject({
      method: "OPTIONS",
      url: "/v1/analyses",
      headers: {
        origin: "https://evil.example",
        "access-control-request-method": "POST",
      },
    });
    // No allow-origin header at all, and never a wildcard.
    expect(denied.headers["access-control-allow-origin"]).toBeUndefined();

    // ...while the configured web origin is allowed.
    const allowed = await app.inject({
      method: "OPTIONS",
      url: "/v1/analyses",
      headers: {
        origin: testConfig.webOrigin,
        "access-control-request-method": "POST",
      },
    });
    expect(allowed.headers["access-control-allow-origin"]).toBe(testConfig.webOrigin);
    await app.close();
  });

  /**
   * THE privacy test: nothing document-related may ever appear in logs.
   * We upload a file with a distinctive filename and distinctive bytes and
   * then assert the entire captured log output contains neither
   * (docs/product/metrics.md — log-leak test, must always pass).
   */
  it("never logs filenames or document content", async () => {
    const lines: string[] = [];
    const capture = new Writable({
      write(chunk: Buffer, _enc, cb) {
        lines.push(chunk.toString("utf8"));
        cb();
      },
    });
    const app = await buildServer(testConfig, { loggerStream: capture });

    const secretContent = Buffer.concat([
      TINY_PNG,
      Buffer.from("HERR_MUSTERMANN_GEHEIMNUMMER_12345", "latin1"),
    ]);
    const req = multipartUpload({
      fileBytes: secretContent,
      filename: "SUPER_SECRET_asylum_case.png",
      contentType: "image/png",
      language: "en",
    });
    const res = await app.inject({ method: "POST", url: "/v1/analyses", ...req });
    expect(res.statusCode).toBe(200);
    await app.close();

    const allLogs = lines.join("\n");
    expect(allLogs).not.toContain("SUPER_SECRET");
    expect(allLogs).not.toContain("MUSTERMANN");
    expect(allLogs).not.toContain("GEHEIMNUMMER");
    // ...while the C2 operational event IS present, with buckets only.
    expect(allLogs).toContain("fileSizeBucket");
    expect(allLogs).toContain('"outputLanguage":"en"');
    expect(allLogs).toContain('"provider":"stub"');
  });
});
