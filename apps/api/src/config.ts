/**
 * Environment configuration. All values validated at startup; the process
 * refuses to boot with invalid config rather than limping into surprises.
 */
export interface ApiConfig {
  port: number;
  host: string;
  logLevel: "fatal" | "error" | "warn" | "info" | "debug";
  nodeEnv: "development" | "test" | "production";
}

const LOG_LEVELS = new Set(["fatal", "error", "warn", "info", "debug"]);
const NODE_ENVS = new Set(["development", "test", "production"]);

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

  return {
    port,
    host,
    logLevel: logLevel as ApiConfig["logLevel"],
    nodeEnv: nodeEnv as ApiConfig["nodeEnv"],
  };
}
