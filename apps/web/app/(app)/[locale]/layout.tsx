import { LOCALES, dir, getMessages, isLocale } from "@wg/i18n";
import { Badge } from "@wg/ui";
import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { fontVariables } from "../../fonts";
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
  return {
    title: { default: m.common.appName, template: `%s — ${m.common.appName}` },
    description: m.common.tagline,
    robots: { index: false, follow: false }, // pre-launch
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1413" },
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
        <a href="#main" className="skip-link">
          {m.common.skipToContent}
        </a>

        <header className="border-b border-line bg-surface">
          <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between gap-4">
            <Link
              href={`/${locale}`}
              className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-ink hover:text-primary transition-colors"
            >
              Welcome Germany
            </Link>
            <div className="flex items-center gap-3">
              <Badge tone="neutral" aria-hidden="true" className="hidden sm:inline-block">
                Beta
              </Badge>
              <Link
                href="/"
                className="text-sm font-medium text-primary hover:text-primary-strong underline underline-offset-4"
              >
                {m.common.languageSwitch}
              </Link>
            </div>
          </div>
        </header>

        <main id="main" className="flex-1 w-full mx-auto max-w-3xl px-6 py-10">
          {children}
        </main>

        <footer className="border-t border-line bg-surface mt-16">
          <div className="mx-auto max-w-3xl px-6 py-8">
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
            <p className="mt-4 text-xs text-ink-muted">
              {m.footer.notLegalAdvice} · {m.common.betaNotice}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
