import { MAX_FILE_BYTES, type UploadErrorCode } from "@wg/validation";
import type { FastifyInstance } from "fastify";
import type { ApiConfig } from "../config.js";
import { validateUpload } from "../files/validate-upload.js";
import { ProviderError, type DocumentAnalysisProvider } from "../providers/types.js";

/** Locales the analysis can be explained in — mirrors @wg/i18n LOCALES. */
const OUTPUT_LANGUAGES = new Set(["en", "prs"]);

/** Map provider failures to stable public error codes (no internals leak). */
function providerErrorCode(err: unknown): UploadErrorCode {
  if (err instanceof ProviderError) {
    return err.kind === "invalid_output" ? "PROVIDER_ERROR" : "PROVIDER_ERROR";
  }
  return "INTERNAL_ERROR";
}

/** HTTP status per error code — kept in one place for consistency. */
const ERROR_STATUS: Record<UploadErrorCode, number> = {
  NO_FILE: 400,
  UNSUPPORTED_TYPE: 415,
  CORRUPT_FILE: 422,
  FILE_TOO_LARGE: 413,
  TOO_MANY_PAGES: 422,
  IMAGE_TOO_LARGE: 422,
  INVALID_LANGUAGE: 400,
  RATE_LIMITED: 429,
  PROVIDER_ERROR: 502,
  INTERNAL_ERROR: 500,
};

/**
 * POST /v1/analyses — the document-processing pipeline (master-spec §16).
 *
 * Receives one multipart file + a `language` field, validates strictly,
 * analyzes in memory via the configured provider, and returns a
 * schema-validated DocumentAnalysis. Nothing about the document is
 * persisted or logged at any point.
 */
export function registerAnalysesRoute(
  app: FastifyInstance,
  config: ApiConfig,
  provider: DocumentAnalysisProvider,
): void {
  app.post(
    "/v1/analyses",
    {
      config: {
        // Per-route rate limit: analysis is the expensive endpoint (§19).
        rateLimit: {
          max: config.rateLimitMax,
          timeWindow: "1 minute",
          errorResponseBuilder: () => ({
            statusCode: 429,
            error: { code: "RATE_LIMITED" },
          }),
        },
      },
    },
    async (request, reply) => {
      const fail = (code: UploadErrorCode) =>
        reply.status(ERROR_STATUS[code]).send({ error: { code } });

      // ---- 1. Read the multipart upload fully into memory (never disk). --
      const part = await request.file({
        limits: { fileSize: MAX_FILE_BYTES, files: 1, fields: 4 },
      });
      if (!part) return fail("NO_FILE");

      let fileBytes: Buffer;
      try {
        fileBytes = await part.toBuffer();
      } catch {
        // @fastify/multipart throws when the stream exceeds the size limit.
        return fail("FILE_TOO_LARGE");
      }

      try {
        // ---- 2. Language field (attached alongside the file). ------------
        const languageField = part.fields["language"];
        const language =
          languageField && "value" in languageField ? String(languageField.value) : "";
        if (!OUTPUT_LANGUAGES.has(language)) return fail("INVALID_LANGUAGE");

        // ---- 3. Strict file validation (magic bytes, limits). ------------
        const verdict = validateUpload(fileBytes, part.mimetype);
        if (!verdict.ok) return fail(verdict.errorCode);

        // Operational metadata for the C2 log event — buckets only, never
        // exact values that could fingerprint a document.
        request.wgMeta = {
          fileCategory: verdict.mimeType === "application/pdf" ? "pdf" : "image",
          fileSizeBucket: `${Math.ceil(fileBytes.length / 1_000_000)}MB`,
          outputLanguage: language,
          provider: provider.name,
        };

        // ---- 4. Analyze via the configured provider. ----------------------
        try {
          const analysis = await provider.analyze({
            fileBytes,
            mimeType: verdict.mimeType,
            outputLanguage: language,
            requestId: request.id,
          });
          // Provider output is untrusted until schema-validated; concrete
          // providers validate internally, and the stub does too — but we
          // still never echo anything except the validated object.
          return await reply.status(200).send(analysis);
        } catch (err) {
          request.log.warn({ errKind: err instanceof ProviderError ? err.kind : "unknown" });
          return fail(providerErrorCode(err));
        }
      } finally {
        // ---- 5. Disposal on EVERY exit path (success, error, throw). ------
        // Node's GC reclaims the buffer; zeroing first is defense in depth so
        // document bytes do not linger in reusable memory (master-spec §16).
        fileBytes.fill(0);
      }
    },
  );
}
