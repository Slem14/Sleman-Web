import { LOCALES, dir, getMessages, isLocale } from "@wg/i18n";
import { Logo } from "@wg/ui";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SITE_URL } from "../../site";
import { fontVariables } from "../../fonts";
import { THEME_INIT_SCRIPT, ThemeToggle } from "../../theme";
import "../../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const m = getMessages(locale);
  const canonical = `${SITE_URL}/${locale}/`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: m.common.appName, template: `%s — ${m.common.appName}` },
    description: m.common.tagline,
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      // Tell search engines the two locales are the same page in different
      // languages, so a Dari speaker is offered the Dari version.
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/`])),
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: m.common.appName,
      title: m.common.appName,
      description: m.common.tagline,
      locale,
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    // Must track --wg-canvas in packages/ui/src/tokens.css — this is the colour
    // the browser paints its own chrome with, so a stale value shows as a seam
    // above the page on mobile.
    { media: "(prefers-color-scheme: dark)", color: "#070a10" },
  ],
};

/**
 * Root layout for all locale pages. lang/dir are set server-side so RTL is
 * correct on first paint — no flash, no client-side patching.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <html lang={locale} dir={dir(locale)} suppressHydrationWarning className={fontVariables}>
      <body className="min-h-dvh flex flex-col">
        {/* Apply persisted theme before anything paints (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div aria-hidden="true" className="ambient">
          <span />
          <span />
          <span />
        </div>

        <a href="#main" className="skip-link">
          {m.common.skipToContent}
        </a>

        <header className="sticky top-0 z-40 header-blur border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between gap-4">
            <Link
              href={`/${locale}`}
              className="group flex items-center gap-2.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-ink hover:text-primary transition-colors"
            >
              <Logo size={28} animated className="shrink-0" />
              <span>
                Welcome<span className="text-primary"> Germany</span>
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="text-sm font-medium text-primary hover:text-primary-strong underline underline-offset-4"
              >
                {m.common.languageSwitch}
              </Link>
              <ThemeToggle
                labelToDark={m.common.themeToDark}
                labelToLight={m.common.themeToLight}
              />
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 w-full mx-auto max-w-6xl px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-line bg-surface mt-16">
          <div className="mx-auto max-w-6xl px-6 py-8">
            <nav aria-label={m.footer.privacy} className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href={`/${locale}/privacy`} className="text-ink-muted hover:text-primary">
                {m.footer.privacy}
              </Link>
              <Link href={`/${locale}/terms`} className="text-ink-muted hover:text-primary">
                {m.footer.terms}
              </Link>
              <Link href={`/${locale}/ai`} className="text-ink-muted hover:text-primary">
                {m.footer.ai}
              </Link>
              <Link href={`/${locale}/impressum`} className="text-ink-muted hover:text-primary">
                {m.footer.impressum}
              </Link>
            </nav>
            <p className="mt-4 text-xs text-ink-muted">{m.footer.notLegalAdvice}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
