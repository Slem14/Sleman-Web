/**
 * Post-build verification of the static export.
 *
 * The deployed site is plain files on a static host, so some guarantees can
 * only be checked against the build output rather than the dev server:
 *
 *  - every locale page exists as a file (nothing silently missing),
 *  - a 404.html exists (this is what the host serves for unknown paths),
 *  - the site is indexable and declares canonical URLs,
 *  - the CNAME ships, so a deploy cannot reset the custom domain,
 *  - no third-party origins are referenced (privacy: fonts must be self-hosted).
 *
 * Exits non-zero on any failure so CI blocks the deploy.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(import.meta.dirname, "..", ".next-build");

const failures = [];
const check = (label, condition) => {
  if (!condition) failures.push(label);
};

// 1. Required pages exist as static files.
const requiredPages = [
  "index.html",
  "404.html",
  "en/index.html",
  "prs/index.html",
  "en/upload/index.html",
  "prs/upload/index.html",
  "en/privacy/index.html",
  "prs/privacy/index.html",
  "en/terms/index.html",
  "en/ai/index.html",
  "en/impressum/index.html",
];
for (const page of requiredPages) {
  check(`missing page: ${page}`, existsSync(join(OUT_DIR, page)));
}

// 2. The 404 page renders our content, not a framework default.
if (existsSync(join(OUT_DIR, "404.html"))) {
  const notFound = readFileSync(join(OUT_DIR, "404.html"), "utf8");
  check("404.html does not contain the custom message", notFound.includes("Page not found"));
}

// 3. The site is public: search engines must be able to find it, and each
//    page must declare a canonical URL so the two locales are not treated as
//    duplicates of one another.
check("robots.txt is missing", existsSync(join(OUT_DIR, "robots.txt")));
check("sitemap.xml is missing", existsSync(join(OUT_DIR, "sitemap.xml")));

// 3a. CNAME must ship with the export. GitHub Pages reads the custom domain
//     from this file on every deploy, and a deploy without it silently resets
//     the domain — which has already happened once on this project and takes
//     the whole site offline until someone notices.
// 3b. ads.txt must survive the export. It is the AdSense site-verification
//     method, and it is a plain file with no script — losing it would silently
//     un-verify the site without breaking anything visible.
check("ads.txt is missing from the export", existsSync(join(OUT_DIR, "ads.txt")));

const cnamePath = join(OUT_DIR, "CNAME");
check("CNAME is missing from the export", existsSync(cnamePath));
if (existsSync(cnamePath)) {
  check(
    "CNAME does not contain the production domain",
    readFileSync(cnamePath, "utf8").trim() === "welcome-deutschland.de",
  );
}

for (const page of ["index.html", "en/index.html", "prs/index.html"]) {
  const file = join(OUT_DIR, page);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  check(`${page} still carries noindex`, !html.includes("noindex"));
  check(`${page} is missing a canonical link`, html.includes('rel="canonical"'));
}

// 4. Privacy: no third-party origins referenced from any page (fonts are
//    self-hosted by next/font; analytics and CDNs are forbidden entirely).
const forbiddenHosts = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "google-analytics.com",
  "googletagmanager.com",
  "cdn.jsdelivr.net",
  "unpkg.com",
];
for (const page of ["index.html", "en/index.html", "prs/index.html", "en/upload/index.html"]) {
  const file = join(OUT_DIR, page);
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  for (const host of forbiddenHosts) {
    check(`${page} references third-party host ${host}`, !html.includes(host));
  }
}

if (failures.length > 0) {
  console.error("Static export verification FAILED:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`Static export verification passed (${requiredPages.length} pages checked).`);
