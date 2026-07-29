import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "../site";
import { fontVariables } from "../fonts";
import { THEME_INIT_SCRIPT } from "../theme";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Welcome Germany — Understand your German letters",
  description:
    "Upload a photo of a German official letter and get a clear explanation in your language: who sent it, what it asks you to do, and by when. Free, no account, nothing stored.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Welcome Germany",
    title: "Welcome Germany — Understand your German letters",
    description:
      "Upload a photo of a German official letter and get a clear explanation in your language.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1312" },
  ],
};

/**
 * Root layout for the language-selection entry ("/").
 * Deliberately direction-neutral; every language speaks for itself on its
 * own card. suppressHydrationWarning: extensions + theme script touch <html>.
 */
export default function SelectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-dvh">
        {/* Apply persisted theme before anything paints (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {/* Three drifting glow fields. Spans rather than pseudo-elements so
            each can carry its own cycle without fighting for ::before. */}
        <div aria-hidden="true" className="aurora">
          <span />
          <span />
          <span />
        </div>
        {children}
      </body>
    </html>
  );
}
