"use client";

import { usePathname } from "next/navigation";
import { ADS_ENABLED, BottomAd, SideAd } from "./ads";

/**
 * Decides where ads may appear.
 *
 * The upload route is excluded deliberately and permanently. It is the one
 * place where a person's letter — a Jobcenter decision, an asylum ruling, a
 * deportation notice — is on screen and in browser memory. Third-party ad code
 * has no business sharing that page, and the follow-up question panel lives
 * there too. Everything else (home, privacy, terms, AI notice) is ordinary
 * content and may carry ads.
 */
function adsAllowed(pathname: string): boolean {
  return ADS_ENABLED && !pathname.includes("/upload");
}

export function SideAdSlot({ slot, label }: { slot: string; label: string }) {
  const pathname = usePathname();
  if (!adsAllowed(pathname)) return null;
  return <SideAd slot={slot} label={label} />;
}

export function BottomAdSlot({ slot, label }: { slot: string; label: string }) {
  const pathname = usePathname();
  if (!adsAllowed(pathname)) return null;
  return <BottomAd slot={slot} label={label} />;
}
