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
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
