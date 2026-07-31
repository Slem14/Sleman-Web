import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
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
      // Builds, then serves the static export — byte-for-byte what GitHub
      // Pages serves. Running against `next dev` meant ten parallel workers
      // racing on-demand route compilation, which made the suite pass or fail
      // by machine load rather than by the code. See scripts/serve-export.mjs.
      command: "pnpm --filter=@wg/web... build && node scripts/serve-export.mjs",
      url: "http://localhost:3000",
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
      // Baked in at build time. Without it a production build has no API
      // origin and the upload page correctly renders "unavailable" instead of
      // the form — which is right behaviour, and would silently gut the
      // upload tests into asserting nothing.
      env: { ...process.env, NEXT_PUBLIC_API_BASE_URL: "http://127.0.0.1:3001" },
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
