import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // Compiles every route once, sequentially, before the parallel suite starts.
  // See e2e/global-setup.ts for why.
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    // Mobile-first product: the phone viewport is not optional coverage.
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  // Both services run for E2E: the upload flow exercises the real API with
  // the stub analysis provider (no AI, no cost, deterministic results).
  webServer: [
    {
      command: "pnpm --filter @wg/web dev",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: "pnpm --filter @wg/api dev",
      url: "http://127.0.0.1:3001/health",
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      // The production rate limit (10/min) is deliberately low and would
      // throttle the parallel desktop+mobile suites. Rate limiting itself is
      // covered by API integration tests, which assert it with a limit of 2.
      env: { ...process.env, RATE_LIMIT_MAX: "1000" },
    },
  ],
});
