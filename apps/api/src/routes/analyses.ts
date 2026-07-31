import { MAX_FILES_PER_ANALYSIS, type UploadErrorCode } from "@wg/validation";
import type { FastifyInstance } from "fastify";
import type { ApiConfig } from "../config.js";
import { collectFiles } from "../files/collect-files.js";
import { validateUpload } from "../files/validate-upload.js";
import {
  ProviderError,
  type DocumentAnalysisProvider,
  type DocumentFile,
} from "../providers/types.js";
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
  TOO_MANY_FILES: 422,
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
      // A letter is frequently several files: pages photographed one by one,
      // or a form behind its cover letter. They are analysed together as one
      // document, so the parts can refer to each other.
      const collected = await collectFiles(request, MAX_FILES_PER_ANALYSIS);
      if (collected.error !== null) return fail(collected.error);
      const { files, fields } = collected;
      if (files.length === 0) return fail("NO_FILE");

      try {
        // ---- 2. Language field (attached alongside the files). -----------
        const language = fields["language"] ?? "";
        if (!OUTPUT_LANGUAGES.has(language)) return fail("INVALID_LANGUAGE");

        // ---- 3. Strict validation of EVERY part (magic bytes, limits). ---
        // One bad page fails the whole request: a partial letter would be
        // explained as if it were complete, which is exactly the kind of
        // confident-but-wrong answer this product must never give.
        const validated: DocumentFile[] = [];
        for (const file of files) {
          const verdict = validateUpload(file.bytes, file.mimeType);
          if (!verdict.ok) return fail(verdict.errorCode);
          validated.push({ bytes: file.bytes, mimeType: verdict.mimeType });
        }

        // Operational metadata for the C2 log event — buckets only, never
        // exact values that could fingerprint a document.
        const totalBytes = validated.reduce((sum, f) => sum + f.bytes.length, 0);
        request.wgMeta = {
          fileCategory: validated.every((f) => f.mimeType === "application/pdf") ? "pdf" : "image",
          fileSizeBucket: `${Math.ceil(totalBytes / 1_000_000)}MB`,
          fileCount: validated.length,
          outputLanguage: language,
          provider: provider.name,
        };

        // ---- 4. Analyze via the configured provider. ----------------------
        try {
          const raw = await provider.analyze({
            files: validated,
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
        // Node's GC reclaims the buffers; zeroing first is defense in depth so
        // document bytes do not linger in reusable memory (master-spec §16).
        // Every page is wiped, including any read before a later one failed.
        for (const file of files) file.bytes.fill(0);
      }
    },
  );
}
