"use client";

import { usePathname } from "next/navigation";
import { DONATE_URL } from "./donate";

/**
 * Donation link, hidden on the upload and result routes.
 *
 * Same exclusion as the ads, for a related but distinct reason: that screen is
 * where someone is reading a Jobcenter decision or a deportation notice. Being
 * asked for money in the same breath is the wrong thing to do to a person in
 * that moment, regardless of how modestly it is phrased. Everywhere else is
 * ordinary content and may carry it.
 */
export function DonateLink({ label, note }: { label: string; note: string }) {
  const pathname = usePathname();
  if (pathname.includes("/upload")) return null;

  return (
    <>
      {/* rel="noopener": never hand window.opener to another origin. */}
      <p className="mt-4">
        <a
          href={DONATE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-strong"
        >
          {label}
        </a>
      </p>
      <p className="mt-2 max-w-prose text-xs text-ink-muted leading-relaxed">{note}</p>
    </>
  );
}
