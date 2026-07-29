import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/** Fail on serious/critical WCAG violations (axe-core, WCAG 2.x A+AA tags). */
async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === "serious" || v.impact === "critical",
  );
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
}

test.describe("language selection", () => {
  test("shows both languages and passes a11y scan", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /English/ })).toBeVisible();
    await expect(page.getByRole("link", { name: /دری/ })).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("keyboard-only: tab reaches language cards and Enter navigates", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab"); // first card
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/(en|prs)$/);
  });

  test("choosing English lands on the English home page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /English/ }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("German letter");
  });

  test("language choice is remembered in localStorage only", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /دری/ }).click();
    await expect(page).toHaveURL(/\/prs$/);
    const stored = await page.evaluate(() => window.localStorage.getItem("wg.language"));
    expect(stored).toBe("prs");
    // No cookies involved in the language mechanism.
    const cookies = await page.context().cookies();
    expect(cookies.filter((c) => c.name.includes("lang"))).toEqual([]);
  });
});

test.describe("English journey", () => {
  test("home shows steps, privacy promise, and serious-letters notice", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("heading", { name: "How it works" })).toBeVisible();
    await expect(page.getByText("It is not stored.", { exact: false })).toBeVisible();
    await expect(page.getByText("Some letters need more than an app")).toBeVisible();
    await expectNoSeriousA11yViolations(page);
  });

  test("legal pages are reachable from the footer and marked as drafts", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "Privacy", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/privacy$/);
    await expect(page.getByText(/pending professional legal review/i)).toBeVisible();
    await expectNoSeriousA11yViolations(page);

    for (const [name, path] of [
      ["Terms & Disclaimer", "terms"],
      ["About the AI", "ai"],
      ["Impressum", "impressum"],
    ] as const) {
      await page.goto("/en");
      await page.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`/en/${path}$`));
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
});

test.describe("Dari (RTL) journey", () => {
  test("html has lang=prs and dir=rtl set server-side", async ({ page }) => {
    await page.goto("/prs");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "prs");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("نامهٔ آلمانی");
    await expectNoSeriousA11yViolations(page);
  });

  test("Dari legal pages render in RTL with Dari content", async ({ page }) => {
    await page.goto("/prs/privacy");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("حریم خصوصی");
    await expectNoSeriousA11yViolations(page);
  });

  test("language switch link returns to selection", async ({ page }) => {
    await page.goto("/prs");
    await page.getByRole("link", { name: "تغییر زبان" }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});

test.describe("unknown locale", () => {
  test("returns 404", async ({ page }) => {
    const response = await page.goto("/de");
    expect(response?.status()).toBe(404);
  });
});
