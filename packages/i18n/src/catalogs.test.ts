import { describe, expect, it } from "vitest";
import { en, prs, LOCALES, dir, getMessages, isLocale } from "./index";

/** Recursively collect dot-paths of all keys in a catalog. */
function keyPaths(obj: unknown, prefix = ""): string[] {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) return [prefix];
  return Object.entries(obj).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
}

describe("message catalogs", () => {
  it("Dari catalog has exactly the same key structure as English", () => {
    expect(keyPaths(prs).sort()).toEqual(keyPaths(en).sort());
  });

  it("array-valued messages have equal lengths across locales", () => {
    expect(prs.home.steps.length).toBe(en.home.steps.length);
    expect(prs.home.privacyPoints.length).toBe(en.home.privacyPoints.length);
    expect(prs.privacyPage.sections.length).toBe(en.privacyPage.sections.length);
    expect(prs.termsPage.sections.length).toBe(en.termsPage.sections.length);
    expect(prs.aiPage.points.length).toBe(en.aiPage.points.length);
  });

  it("no empty strings anywhere", () => {
    const collect = (o: unknown): string[] =>
      typeof o === "string"
        ? [o]
        : typeof o === "object" && o !== null
          ? Object.values(o).flatMap(collect)
          : [];
    for (const locale of LOCALES) {
      for (const s of collect(getMessages(locale))) {
        expect(s.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("Dari catalog actually contains Arabic-script text (mojibake guard)", () => {
    // ؀-ۿ is the Arabic Unicode block; fails if encoding is broken.
    expect(prs.home.heroTitle).toMatch(/[؀-ۿ]/);
    expect(prs.footer.privacy).toMatch(/[؀-ۿ]/);
    expect(prs.privacyPage.sections[0]?.body).toMatch(/[؀-ۿ]/);
  });

  it("direction helper is correct", () => {
    expect(dir("en")).toBe("ltr");
    expect(dir("prs")).toBe("rtl");
  });

  it("locale guard accepts known and rejects unknown", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("prs")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale("fa")).toBe(false);
  });
});
