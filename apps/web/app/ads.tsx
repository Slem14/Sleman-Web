"use client";

import { useConsent } from "./consent";

/**
 * Google AdSense integration.
 *
 * ── Read this before changing anything here ──────────────────────────────
 * This is the only third-party code on the site, and it exists on pages where
 * people upload asylum decisions, deportation notices and Jobcenter letters.
 * Two rules follow from that and must not be relaxed casually:
 *
 *  1. Ads never appear on the upload page or the result page. Those are the
 *     screens where a document is on screen and in browser memory. Ad code
 *     placed there would sit alongside the most sensitive content the product
 *     ever handles, and no revenue justifies that adjacency.
 *  2. Ad slots never sit between a reader and their deadline. They go beside
 *     and below the content, never inside the explanation.
 *
 * EU users additionally require consent before personalised ads are served.
 * That consent layer is NOT implemented here — see docs/privacy for the open
 * item. Until it exists, this deployment is not GDPR-complete.
 */

/**
 * Master switch. OFF until two things are true:
 *
 *   1. The Impressum in impressum-data.ts is complete with a genuinely
 *      serviceable address. Ads make this service `geschäftsmäßig`, which is
 *      what creates the § 5 DDG duty in the first place — running ads without
 *      it is the exact state an Abmahnung targets.
 *   2. A consent banner exists for EU visitors, because personalised ads
 *      require consent before the first ad request is made.
 *
 * Flipping this to true without both is not a configuration choice, it is
 * accepting a legal risk — so it lives here, alone, and says so.
 */
export const ADS_ENABLED = false;

const AD_CLIENT = "ca-pub-7948445846326610";

/** The loader tag. Rendered once per document, in <head>. */
export function AdSenseScript() {
  const consent = useConsent();
  // No consent, no script. Not a hidden slot — the request to Google is never
  // made at all, which is what "prior consent" actually requires.
  if (!ADS_ENABLED || consent !== "granted") return null;
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}

/**
 * One ad unit.
 *
 * `data-full-width-responsive` lets a single unit serve both the narrow rail
 * on desktop and the full-width block on mobile, so we do not ship two
 * separate units that both try to fill the same page.
 */
function AdUnit({ slot, format = "auto" }: { slot: string; format?: string }) {
  return (
    <>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      {/* AdSense requires one push per unit. Inline rather than via next/script
          because the unit and its activation must stay adjacent — a unit that
          renders without its push is an empty box. */}
      <script
        dangerouslySetInnerHTML={{ __html: "(adsbygoogle = window.adsbygoogle || []).push({});" }}
      />
    </>
  );
}

/**
 * Side rail. Hidden below xl, where there is no room beside the content and
 * an ad would push the letter explanation into a narrow column.
 */
export function SideAd({ slot, label }: { slot: string; label: string }) {
  return (
    <aside
      aria-label={label}
      className="hidden xl:block w-[300px] shrink-0 sticky top-24 self-start"
    >
      <AdUnit slot={slot} format="vertical" />
    </aside>
  );
}

/** Footer unit — appears after the reader has finished the content. */
export function BottomAd({ slot, label }: { slot: string; label: string }) {
  return (
    <aside aria-label={label} className="mx-auto max-w-6xl px-6 pb-10">
      <AdUnit slot={slot} format="horizontal" />
    </aside>
  );
}
