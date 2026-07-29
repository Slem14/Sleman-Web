import Fastify, { type FastifyInstance } from "fastify";
import type { ApiConfig } from "./config.js";

/**
 * Log redaction is a privacy control, not a formatting choice (data class C3
 * must never reach logs — docs/privacy/data-classification.md). The paths
 * below are the Stage 1 baseline; every request-handling stage extends them
 * and adds tests proving sensitive fields stay out of log output.
 */
const REDACT_PATHS = ["req.headers.authorization", "req.headers.cookie", "req.body", "res.body"];

export function buildServer(config: ApiConfig): FastifyInstance {
  const app = Fastify({
    logger: {
      level: config.logLevel,
      redact: { paths: REDACT_PATHS, censor: "[REDACTED]" },
    },
    // Body size limits are enforced strictly from day one; the upload
    // pipeline (Stage 3) sets its own explicit, larger limit on its route.
    bodyLimit: 16 * 1024, // 16 KiB default for non-upload routes
    trustProxy: false, // revisit when deployed behind a load balancer (Stage 7)
  });

  app.get("/health", () => {
    return { status: "ok" };
  });

  app.get("/ready", () => {
    // No downstream dependencies exist yet. When they do (AI provider,
    // database), readiness checks their availability — health stays cheap.
    return { status: "ready" };
  });

  return app;
}
