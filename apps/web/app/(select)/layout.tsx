import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { fontVariables } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Welcome Germany — Choose your language",
  description: "Understand your German letters — in your language.",
  robots: { index: false, follow: false }, // pre-launch
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0e1413" },
  ],
};

/**
 * Root layout for the language-selection entry ("/").
 * Deliberately direction-neutral: English frame, Dari rendered inline with
 * its own lang/dir. suppressHydrationWarning: browser extensions mutate
 * <html> attributes before hydration.
 */
export default function SelectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className={fontVariables}>
      <body className="min-h-dvh grid place-items-center p-6">{children}</body>
    </html>
  );
}
