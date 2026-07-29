/**
 * Canonical public address of the site.
 *
 * Used for canonical URLs, hreflang alternates, Open Graph tags, the sitemap
 * and robots.txt. Overridable at build time so a preview deployment does not
 * advertise itself as the production site.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://slemanparwiz.com").replace(
  /\/$/,
  "",
);
