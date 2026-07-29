import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Welcome Germany",
  description: "Understand your German letters — in your language.",
  robots: { index: false, follow: false }, // pre-launch: keep out of search indexes
};

// lang/dir become dynamic when i18n lands in Stage 2 (Dari = rtl).
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: browser extensions (grammar checkers etc.)
    // inject attributes into <html> before React hydrates; only this element
    // ignores that noise — real mismatches inside the page still surface.
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
