/**
 * Renders brand/welcome-germany-logo.svg to PNG at several sizes.
 *
 * Lives in apps/web because that is where Playwright's Chromium is already a
 * dependency for the e2e suite — rendering the brand mark needs no extra image
 * tooling on top of it. Outputs land next to the source SVG in brand/.
 *
 *   pnpm --filter @wg/web logo
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
// @playwright/test (not "playwright") — that is the package this workspace
// declares, and pnpm's strict linking will not resolve an undeclared one.
import { chromium } from "@playwright/test";

const brandDir = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "brand");
const svg = readFileSync(join(brandDir, "welcome-germany-logo.svg"), "utf8");

// 1024 for press and stores, 512 for social/OG cards, 180 for iOS home screen.
const SIZES = [1024, 512, 180];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const size of SIZES) {
  await page.setViewportSize({ width: size, height: size });
  // omitBackground + transparent body so the mark drops onto any surface.
  await page.setContent(
    `<body style="margin:0;background:transparent">${svg.replace(
      /width="\d+" height="\d+"/,
      `width="${size}" height="${size}"`,
    )}</body>`,
  );
  const buffer = await page.screenshot({ omitBackground: true });
  const out = join(brandDir, `welcome-germany-logo-${size}.png`);
  writeFileSync(out, buffer);
  console.log(`wrote welcome-germany-logo-${size}.png (${(buffer.length / 1024).toFixed(1)} KB)`);
}

await browser.close();
