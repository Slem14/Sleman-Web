import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/**
 * Waits until the page is visually settled.
 *
 * axe measures colour contrast from computed style, so an element caught
 * mid-entrance — while its opacity is still animating from 0 — scores as a
 * contrast failure even though the finished page is perfectly accessible.
 * Running alone the animation had always completed before the scan; running
 * ten workers in parallel it sometimes had not, so the suite failed or passed
 * depending on machine load rather than on the code.
 *
 * Only finite animations are awaited. The ambient backdrop loops forever by
 * design, and awaiting it would hang the suite.
 */
async function settle(page: Page): Promise<void> {
  await page.waitForLoadState("load");

  // On a client-side route change React applies the new <title> a tick after
  // the route renders, and there is no second load event to wait on — so axe
  // could scan in that gap and report the document as untitled. The page is
  // correctly titled; the scan was simply early.
  await page.waitForFunction(() => document.title.trim().length > 0);

  await page.evaluate(async () => {
    const finite = document.getAnimations().filter((animation) => {
      const timing = animation.effect?.getComputedTiming();
      return timing !== undefined && timing.iterations !== Infinity;
    });
    await Promise.all(finite.map((animation) => animation.finished.catch(() => undefined)));
  });
}

/** Fail on serious/critical WCAG violations (axe-core, WCAG 2.x A+AA tags). */
export async function expectNoSeriousA11yViolations(page: Page): Promise<void> {
  await settle(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}
