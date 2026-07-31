import { ButtonLink } from "@wg/ui";
import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import { THEME_INIT_SCRIPT } from "./theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found — Welcome Deutschland",
  robots: { index: false, follow: false },
};

/**
 * Global 404.
 *
 * Both real root layouts live inside route groups ((select) and (app)), so
 * this file must supply its own <html>/<body> — without it, notFound() from a
 * root layout falls through to a generic 500 error page.
 *
 * Deliberately English-only and direction-neutral: for an unknown URL we do
 * not know the visitor's language, so we send them to the language chooser
 * rather than guessing.
 */
export default function NotFound() {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-dvh grid place-items-center p-6">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div aria-hidden="true" className="ambient">
          <span />
          <span />
          <span />
        </div>
        <main className="max-w-md text-center">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink-muted">
            Welcome<span className="text-primary"> Deutschland</span>
          </p>
          <h1 className="mt-6 text-3xl font-bold text-ink">Page not found</h1>
          <p className="mt-3 text-ink-muted leading-relaxed">
            This page does not exist. Choose your language to start again.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/">Choose your language</ButtonLink>
          </div>
        </main>
      </body>
    </html>
  );
}
