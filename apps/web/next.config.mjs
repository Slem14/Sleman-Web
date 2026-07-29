/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@wg/ui", "@wg/i18n", "@wg/validation"],
  // Fully static export: the frontend is SSG by design (no server features);
  // it deploys to GitHub Pages for now and any static host later. The API
  // (Stage 3+) is a separate service — the trust boundary stays intact.
  output: "export",
  // Directory-style URLs (/en/ -> /en/index.html) — most compatible with
  // static hosting, including GitHub Pages.
  trailingSlash: true,
  // Production builds write to their own directory so `pnpm build` never
  // corrupts a running dev server's .next cache (bit us twice on Windows).
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
};

export default nextConfig;
