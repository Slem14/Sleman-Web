import { describe, expect, it } from "vitest";
import { buildServer } from "./server.js";
import { loadConfig } from "./config.js";

const testConfig = loadConfig({ NODE_ENV: "test", LOG_LEVEL: "error" });

describe("health endpoints", () => {
  it("GET /health returns ok", async () => {
    const app = buildServer(testConfig);
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
    await app.close();
  });

  it("GET /ready returns ready", async () => {
    const app = buildServer(testConfig);
    const res = await app.inject({ method: "GET", url: "/ready" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ready" });
    await app.close();
  });

  it("unknown routes return 404 without leaking internals", async () => {
    const app = buildServer(testConfig);
    const res = await app.inject({ method: "GET", url: "/nope" });
    expect(res.statusCode).toBe(404);
    await app.close();
  });
});

describe("config validation", () => {
  it("rejects invalid port", () => {
    expect(() => loadConfig({ API_PORT: "not-a-port" })).toThrow(/Invalid API_PORT/);
  });

  it("rejects invalid log level", () => {
    expect(() => loadConfig({ LOG_LEVEL: "chatty" })).toThrow(/Invalid LOG_LEVEL/);
  });

  it("applies safe defaults", () => {
    const cfg = loadConfig({});
    expect(cfg.port).toBe(3001);
    expect(cfg.host).toBe("127.0.0.1");
  });
});
