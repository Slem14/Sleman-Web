import {
  MAX_FILES_PER_ANALYSIS,
  MAX_PRIOR_EXCHANGES,
  MAX_QUESTION_LENGTH,
  priorExchangeSchema,
  type PriorExchange,
  type UploadErrorCode,
} from "@wg/validation";
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { ApiConfig } from "../config.js";
import { collectFiles } from "../files/collect-files.js";
import { validateUpload } from "../files/validate-upload.js";
import {
  ProviderError,
  type DocumentAnalysisProvider,
  type DocumentFile,
} from "../providers/types.js";

const OUTPUT_LANGUAGES = new Set(["en", "prs"]);

const historySchema = z.array(priorExchangeSchema).max(MAX_PRIOR_EXCHANGES);

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

      // The browser re-sends every part of the letter with each question, plus
      // any page the reader has added since — which is how someone can attach
      // page 2 mid-conversation without the server ever holding page 1.
      const collected = await collectFiles(request, MAX_FILES_PER_ANALYSIS);
      if (collected.error !== null) return fail(collected.error);
      const { files, fields } = collected;
      if (files.length === 0) return fail("NO_FILE");

      try {
        const fieldValue = (name: string): string => fields[name] ?? "";

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

        const validated: DocumentFile[] = [];
        for (const file of files) {
          const verdict = validateUpload(file.bytes, file.mimeType);
          if (!verdict.ok) return fail(verdict.errorCode);
          validated.push({ bytes: file.bytes, mimeType: verdict.mimeType });
        }

        const totalBytes = validated.reduce((sum, f) => sum + f.bytes.length, 0);
        request.wgMeta = {
          fileCategory: validated.every((f) => f.mimeType === "application/pdf") ? "pdf" : "image",
          fileSizeBucket: `${Math.ceil(totalBytes / 1_000_000)}MB`,
          fileCount: validated.length,
          outputLanguage: language,
          provider: provider.name,
          // The count only — never the questions themselves (C2 discipline).
          historyLength: history.length,
        };

        try {
          const answer = await provider.answerQuestion({
            files: validated,
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
        for (const file of files) file.bytes.fill(0);
      }
    },
  );
}
