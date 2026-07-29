import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "../fonts";
import { THEME_INIT_SCRIPT } from "../theme";
import "../globals.css";

export const metadata: Metadata = {
  title: "Welcome Germany — Choose your language",
  description: "Understand your German letters — in your language.",
  robots: { index: false, follow: false }, // pre-launch
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
        <div aria-hidden="true" className="aurora" />
        <div aria-hidden="true" className="gridlines" />
        {children}
      </body>
    </html>
  );
}
