/**
 * Environment configuration. All values validated at startup; the process
 * refuses to boot with invalid config rather than limping into surprises.
 */
export interface ApiConfig {
  port: number;
  host: string;
  logLevel: "fatal" | "error" | "warn" | "info" | "debug";
  nodeEnv: "development" | "test" | "production";
  /** Exact browser origin allowed by CORS — deny-by-default (TB-1). */
  webOrigin: string;
  /** Which DocumentAnalysisProvider implementation to use. */
  provider: "stub" | "anthropic";
  /** Credentials and model for the real provider (absent when using the stub). */
  anthropic?: {
    apiKey: string;
    model: string;
    /** Set only when routing through a gateway rather than the Anthropic API. */
    baseUrl?: string | undefined;
  };
  /** Max analysis requests per client per minute (anti-abuse, §19). */
  rateLimitMax: number;
  /** Hard ceiling for a single request lifetime, in milliseconds. */
  requestTimeoutMs: number;
}

const LOG_LEVELS = new Set(["fatal", "error", "warn", "info", "debug"]);
const NODE_ENVS = new Set(["development", "test", "production"]);
const PROVIDERS = new Set(["stub", "anthropic"]);

export function loadConfig(env: NodeJS.ProcessEnv = process.env): ApiConfig {
  const port = Number(env.API_PORT ?? 3001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`Invalid API_PORT: ${env.API_PORT}`);
  }

  const host = env.API_HOST ?? "127.0.0.1";

  const logLevel = env.LOG_LEVEL ?? "info";
  if (!LOG_LEVELS.has(logLevel)) {
    throw new Error(`Invalid LOG_LEVEL: ${logLevel}`);
  }

  const nodeEnv = env.NODE_ENV ?? "development";
  if (!NODE_ENVS.has(nodeEnv)) {
    throw new Error(`Invalid NODE_ENV: ${nodeEnv}`);
  }

  const webOrigin = env.WEB_ORIGIN ?? "http://localhost:3000";

  const provider = env.ANALYSIS_PROVIDER ?? "stub";
  if (!PROVIDERS.has(provider)) {
    throw new Error(`Invalid ANALYSIS_PROVIDER: ${provider}`);
  }

  const rateLimitMax = Number(env.RATE_LIMIT_MAX ?? 10);
  if (!Number.isInteger(rateLimitMax) || rateLimitMax < 1) {
    throw new Error(`Invalid RATE_LIMIT_MAX: ${env.RATE_LIMIT_MAX}`);
  }

  const requestTimeoutMs = Number(env.REQUEST_TIMEOUT_MS ?? 30_000);
  if (!Number.isInteger(requestTimeoutMs) || requestTimeoutMs < 1000) {
    throw new Error(`Invalid REQUEST_TIMEOUT_MS: ${env.REQUEST_TIMEOUT_MS}`);
  }

  const config: ApiConfig = {
    port,
    host,
    logLevel: logLevel as ApiConfig["logLevel"],
    nodeEnv: nodeEnv as ApiConfig["nodeEnv"],
    webOrigin,
    provider: provider as ApiConfig["provider"],
    rateLimitMax,
    requestTimeoutMs,
  };

  // Credentials are only read when the real provider is selected, so tests and
  // local development never need a key on disk.
  if (config.provider === "anthropic") {
    const apiKey = env.ANTHROPIC_API_KEY ?? "";
    if (apiKey === "") {
      throw new Error("ANALYSIS_PROVIDER=anthropic requires ANTHROPIC_API_KEY");
    }
    config.anthropic = {
      apiKey,
      model: env.ANALYSIS_MODEL ?? "claude-haiku-4-5",
      baseUrl: env.ANTHROPIC_BASE_URL,
    };
  }

  return config;
}
