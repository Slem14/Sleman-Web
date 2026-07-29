import {
  MAX_FILE_BYTES,
  MAX_PRIOR_EXCHANGES,
  MAX_QUESTION_LENGTH,
  priorExchangeSchema,
  type PriorExchange,
  type UploadErrorCode,
} from "@wg/validation";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ApiConfig } from "../config.js";
import { validateUpload } from "../files/validate-upload.js";
import { ProviderError, type DocumentAnalysisProvider } from "../providers/types.js";

const OUTPUT_LANGUAGES = new Set(["en", "prs"]);

const historySchema = z.array(priorExchangeSchema).max(MAX_PRIOR_EXCHANGES);

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
 * POST /v1/questions — a follow-up question about an already-uploaded letter.
 *
 * The document is re-sent by the browser with every question. That is what
 * lets the service answer follow-ups while still storing nothing: there is no
 * session, no cached document, no conversation record on our side. Close the
 * tab and the letter is gone, because the only copy was in the browser.
 *
 * Same validation, limits, disposal and logging discipline as the analysis
 * route — a question is not a lesser request.
 */
export function registerQuestionsRoute(
  app: FastifyInstance,
  config: ApiConfig,
  provider: DocumentAnalysisProvider,
): void {
  app.post(
    "/v1/questions",
    {
      config: {
        rateLimit: {
          // Questions are cheaper than an analysis but still cost a model
          // call; a slightly higher budget keeps a real conversation possible.
          max: config.rateLimitMax * 3,
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

      const part = await request.file({
        limits: { fileSize: MAX_FILE_BYTES, files: 1, fields: 6 },
      });
      if (!part) return fail("NO_FILE");

      let fileBytes: Buffer;
      try {
        fileBytes = await part.toBuffer();
      } catch {
        return fail("FILE_TOO_LARGE");
      }

      try {
        const fieldValue = (name: string): string => {
          const field = part.fields[name];
          return field && "value" in field ? String(field.value) : "";
        };

        const language = fieldValue("language");
        if (!OUTPUT_LANGUAGES.has(language)) return fail("INVALID_LANGUAGE");

        const question = fieldValue("question").trim();
        if (question === "" || question.length > MAX_QUESTION_LENGTH) {
          return fail("INVALID_LANGUAGE");
        }

        // History is client-supplied and therefore untrusted: parse it, cap
        // it, and drop it entirely if it is malformed rather than passing
        // unvalidated text into a prompt.
        let history: PriorExchange[] = [];
        const rawHistory = fieldValue("history");
        if (rawHistory !== "") {
          try {
            const parsed = historySchema.safeParse(JSON.parse(rawHistory));
            if (parsed.success) history = parsed.data;
          } catch {
            history = [];
          }
        }

        const verdict = validateUpload(fileBytes, part.mimetype);
        if (!verdict.ok) return fail(verdict.errorCode);

        request.wgMeta = {
          fileCategory: verdict.mimeType === "application/pdf" ? "pdf" : "image",
          fileSizeBucket: `${Math.ceil(fileBytes.length / 1_000_000)}MB`,
          outputLanguage: language,
          provider: provider.name,
          // The count only — never the questions themselves (C2 discipline).
          historyLength: history.length,
        };

        try {
          const answer = await provider.answerQuestion({
            fileBytes,
            mimeType: verdict.mimeType,
            outputLanguage: language,
            requestId: request.id,
            question,
            history,
          });
          return await reply.status(200).send(answer);
        } catch (err) {
          const code: UploadErrorCode =
            err instanceof ProviderError && err.kind === "refused"
              ? "ANALYSIS_REFUSED"
              : err instanceof ProviderError
                ? "PROVIDER_ERROR"
                : "INTERNAL_ERROR";
          request.log.warn({ errKind: err instanceof ProviderError ? err.kind : "unknown" });
          return fail(code);
        }
      } finally {
        // Disposal on every exit path, exactly as on the analysis route.
        fileBytes.fill(0);
      }
    },
  );
}
