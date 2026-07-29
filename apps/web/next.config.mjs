/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  transpilePackages: ["@wg/ui", "@wg/i18n"],
  // Production builds write to their own directory so `pnpm build` never
  // corrupts a running dev server's .next cache (bit us twice on Windows).
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",
};

export default nextConfig;
