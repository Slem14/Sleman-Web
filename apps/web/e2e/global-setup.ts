/**
 * Warms the dev server before any test runs.
 *
 * The suite is fullyParallel, so ten workers start at once and each navigation
 * to a not-yet-compiled route makes the Next dev server compile it on demand.
 * Ten simultaneous cold compiles queue behind each other and routinely exceed
 * the per-test timeout — which showed up as the whole suite failing or passing
 * at random depending on which routes happened to be cached, not on whether
 * the code was correct.
 *
 * Requesting each route once, sequentially, means every route is already
 * compiled by the time the first test navigates. This removes the race rather
 * than hiding it behind a longer timeout or a retry, so a failure after this
 * point is a real failure.
 */
const ROUTES = [
  "/",
  "/en/",
  "/prs/",
  "/en/upload/",
  "/prs/upload/",
  "/en/privacy/",
  "/en/terms/",
  "/en/ai/",
  "/en/impressum/",
  "/prs/privacy/",
  "/prs/terms/",
];

export default async function globalSetup(): Promise<void> {
  const baseUrl = "http://localhost:3000";

  for (const route of ROUTES) {
    // Generous per-route budget: a cold compile of a route the dev server has
    // never seen is legitimately slow, and this is the one place we can afford
    // to wait for it.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 90_000);
    try {
      await fetch(`${baseUrl}${route}`, { signal: controller.signal });
    } catch {
      // A route that fails to warm is not fatal here — the test that needs it
      // will report the real problem with far better context than we could.
    } finally {
      clearTimeout(timer);
    }
  }
}
