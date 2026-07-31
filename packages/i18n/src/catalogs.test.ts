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
    expect(isLocale("xx")).toBe(false);
  });

  it("keeps Dari and Iranian Farsi as genuinely separate catalogues", () => {
    // Both now ship. The risk this guards against is not that "fa" exists —
    // it is that the two collapse into one another, which would put Iranian
    // vocabulary in front of Afghan readers and vice versa.
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("prs")).toBe(true);

    const dari = getMessages("prs");
    const farsi = getMessages("fa");
    expect(dari.upload.title).not.toBe(farsi.upload.title);

    // Afghan Dari uses مشوره; Iranian Farsi uses مشاوره. If either catalogue
    // ever contains the other's form in this string, they have drifted.
    expect(dari.home.privacyPoints.join(" ")).toContain("مشوره");
    expect(farsi.home.privacyPoints.join(" ")).toContain("مشاوره");
  });

  it("completes every locale against English rather than leaving gaps", () => {
    for (const locale of LOCALES) {
      const messages = getMessages(locale);
      // A missing key would surface as undefined and render blank — the whole
      // point of the fallback is that this cannot happen.
      expect(messages.upload.errors.NETWORK).toBeTruthy();
      expect(messages.privacyPage.title).toBeTruthy();
      expect(messages.footer.notLegalAdvice).toBeTruthy();
    }
  });
});
