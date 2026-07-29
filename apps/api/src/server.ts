import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import Fastify, { type FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import type { ApiConfig } from "./config.js";
import { AnthropicProvider } from "./providers/anthropic/adapter.js";
import { GeminiProvider } from "./providers/gemini/adapter.js";
import { StubProvider } from "./providers/stub.js";
import type { DocumentAnalysisProvider } from "./providers/types.js";
import { registerAnalysesRoute } from "./routes/analyses.js";

/**
 * Log redaction is a privacy control, not a formatting choice (data class C3
 * must never reach logs — docs/privacy/data-classification.md). Everything a
 * request carries that could contain document content or identifiers is
 * blocked at the logger level; an automated test proves it stays that way.
 */
const REDACT_PATHS = [
  "req.headers.authorization",
  "req.headers.cookie",
  "req.headers['content-disposition']", // would contain the original filename
  "req.body",
  "res.body",
];

/** Per-request operational metadata (C2 only — buckets, categories, names). */
export interface WgRequestMeta {
  fileCategory?: string;
  fileSizeBucket?: string;
  outputLanguage?: string;
  provider?: string;
  /** How many claims the safety layer stripped — a count, never the content. */
  safetyViolations?: number;
  /** How many risk flags the keyword layer added on top of the model's. */
  escalatedFlags?: number;
}

declare module "fastify" {
  interface FastifyRequest {
    wgMeta?: WgRequestMeta;
  }
}

function buildProvider(config: ApiConfig): DocumentAnalysisProvider {
  // Provider selection is server-side configuration only (ADR 0004) — no
  // request may influence which provider sees a document.
  switch (config.provider) {
    case "stub":
      return new StubProvider();
    case "anthropic": {
      const settings = config.anthropic;
      if (settings === undefined) {
        throw new Error("anthropic provider selected without credentials");
      }
      return new AnthropicProvider({
        apiKey: settings.apiKey,
        model: settings.model,
        baseUrl: settings.baseUrl,
        // Leave headroom under the request timeout so a slow provider surfaces
        // as a provider error rather than a dropped connection.
        timeoutMs: Math.max(5000, config.requestTimeoutMs - 2000),
      });
    }
    case "gemini": {
      const settings = config.gemini;
      if (settings === undefined) {
        throw new Error("gemini provider selected without credentials");
      }
      return new GeminiProvider({
        apiKey: settings.apiKey,
        model: settings.model,
        timeoutMs: Math.max(5000, config.requestTimeoutMs - 2000),
      });
    }
  }
}

export async function buildServer(
  config: ApiConfig,
  options: { loggerStream?: NodeJS.WritableStream } = {},
): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: config.logLevel,
      redact: { paths: REDACT_PATHS, censor: "[REDACTED]" },
      // Tests inject a capture stream to PROVE no sensitive data is logged.
      ...(options.loggerStream ? { stream: options.loggerStream } : {}),
    },
    // Random UUIDs as request IDs: correlate logs without identifying users.
    genReqId: () => randomUUID(),
    // Default body limit for JSON routes; the upload route has its own
    // explicit multipart limit (master-spec §8: strict request-size limits).
    bodyLimit: 16 * 1024,
    // Hard lifetime ceiling per request — slowloris & hung-provider defense.
    requestTimeout: config.requestTimeoutMs,
    trustProxy: false, // revisit when deployed behind a load balancer (Stage 7)
  });

  // CORS: literal deny-by-default (TB-1). A callback is used instead of a
  // static string so that unknown origins receive NO access-control headers
  // at all, rather than headers naming a different origin. Requests without
  // an Origin header (same-origin navigations, curl, server-to-server) are
  // not subject to CORS and pass through untouched.
  await app.register(cors, {
    origin: (origin, callback) => {
      if (origin === undefined || origin === config.webOrigin) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ["GET", "POST"],
  });

  // Global rate limit as a safety net; the analysis route sets its own
  // stricter per-route budget. Uses in-memory store (single instance MVP —
  // shared-store decision documented in ADR 0006).
  await app.register(rateLimit, {
    global: true,
    max: 120,
    timeWindow: "1 minute",
  });

  // Multipart uploads: memory-only, no temp files ever (attachFieldsToBody
  // stays off; the route streams the single file part into a buffer).
  await app.register(multipart);

  app.get("/health", () => {
    return { status: "ok" };
  });

  app.get("/ready", () => {
    // No downstream dependencies yet: the stub provider is in-process.
    // Stage 4 adds a real provider reachability signal here.
    return { status: "ready" };
  });

  registerAnalysesRoute(app, config, buildProvider(config));

  // One structured C2 event per request — the ONLY operational trace an
  // analysis leaves behind (docs/privacy/data-classification.md table).
  app.addHook("onResponse", (request, reply, done) => {
    if (request.url.startsWith("/v1/")) {
      request.log.info(
        {
          route: request.routeOptions.url,
          statusCode: reply.statusCode,
          durationMs: Math.round(reply.elapsedTime),
          ...request.wgMeta,
        },
        "request completed",
      );
    }
    done();
  });

  return app;
}
