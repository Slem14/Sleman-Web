import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

/**
 * robots.txt — the site is public and should be findable.
 *
 * People looking for help with a German letter search for exactly that, so
 * being indexable is part of the product working at all.
 */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
