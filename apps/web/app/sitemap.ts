import { LOCALES } from "@wg/i18n";
import type { MetadataRoute } from "next";
import { GUIDES, hasGuides } from "./guides/guide-data";
import { SITE_URL } from "./site";

/**
 * Sitemap for search engines.
 *
 * Every page exists in both locales, and each entry declares its alternates so
 * a search engine can offer a Dari speaker the Dari page rather than the
 * English one. Generated at build time into the static export.
 */
const PATHS = [
  "",
  "upload",
  "guides",
  // Each guide is its own indexable page — they are the pages that answer a
  // search query directly, so they must appear individually rather than only
  // behind the index.
  ...GUIDES.map((guide) => `guides/${guide.slug}`),
  "privacy",
  "terms",
  "ai",
  "impressum",
] as const satisfies readonly string[];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of PATHS) {
    for (const locale of LOCALES) {
      // Guides exist only where they are genuinely translated. Listing an
      // untranslated locale would send a searcher to a page in a language
      // they cannot read, which is the thing this rule exists to prevent.
      if (path.startsWith("guides") && !hasGuides(locale)) continue;
      const suffix = path === "" ? "" : `${path}/`;
      entries.push({
        url: `${SITE_URL}/${locale}/${suffix}`,
        changeFrequency: "weekly",
        // The entry pages matter most; legal pages are support material.
        priority: path === "" ? 1 : path === "upload" ? 0.9 : 0.4,
        alternates: {
          languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/${suffix}`])),
        },
      });
    }
  }

  // The language chooser is the true entry point.
  entries.unshift({ url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 });

  return entries;
}
