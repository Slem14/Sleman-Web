import { MAX_FILE_BYTES, type UploadErrorCode } from "@wg/validation";
import type { FastifyInstance } from "fastify";
import type { ApiConfig } from "../config.js";
import { validateUpload } from "../files/validate-upload.js";
import { ProviderError, type DocumentAnalysisProvider } from "../providers/types.js";
import { applyPostChecks } from "../safety/post-checks.js";
import { applyRiskEscalation } from "../safety/risk-classifier.js";

/** Locales the analysis can be explained in — mirrors @wg/i18n LOCALES. */
const OUTPUT_LANGUAGES = new Set(["en", "prs"]);

/** Map provider failures to stable public error codes (no internals leak). */
function providerErrorCode(err: unknown): UploadErrorCode {
  if (err instanceof ProviderError) {
    // A refusal is not a malfunction — it gets its own code so the UI can say
    // something useful instead of "try again", which would not help.
    return err.kind === "refused" ? "ANALYSIS_REFUSED" : "PROVIDER_ERROR";
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
  ANALYSIS_REFUSED: 422,
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
          const raw = await provider.analyze({
            fileBytes,
            mimeType: verdict.mimeType,
            outputLanguage: language,
            requestId: request.id,
          });

          // ---- 4a. Deterministic safety layer (master-spec §16 steps 13–14).
          // The model has spoken; now the parts that must not depend on it.
          // Post-checks strip claims the quoted German does not support;
          // escalation adds risk the model may have missed. Neither can make
          // an analysis less cautious than the model already made it.
          const checked = applyPostChecks(raw);
          const escalated = applyRiskEscalation(checked.analysis);

          // Violation counts are C2 metadata — how many, never what.
          if (checked.violations.length > 0 || escalated.addedFlags.length > 0) {
            request.wgMeta = {
              ...request.wgMeta,
              safetyViolations: checked.violations.length,
              escalatedFlags: escalated.addedFlags.length,
            };
          }

          return await reply.status(200).send(escalated.analysis);
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
