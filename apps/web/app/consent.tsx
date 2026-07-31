"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cookie/ads consent.
 *
 * Required before the first ad request reaches Google: under GDPR and the
 * TTDSG, personalised advertising needs prior consent, and "prior" means the
 * ad script must not load until the visitor has chosen. That is why this
 * controls whether AdSense loads at all rather than merely hiding a banner.
 *
 * Three rules this must keep:
 *
 *  1. Reject is exactly as easy as accept — same size, same prominence, one
 *     click. A banner where refusing takes more effort is not consent, and on
 *     a service used by people under pressure it would be indefensible.
 *  2. Declining is remembered, so nobody is asked on every page.
 *  3. No consent means no ad script. Not a hidden slot — no script.
 *
 * The choice lives in localStorage, never on a server: the site still knows
 * nothing about the visitor.
 */
const CONSENT_KEY = "wg.consent.ads";

export type ConsentState = "granted" | "denied" | "unset";

export function readConsent(): ConsentState {
  if (typeof window === "undefined") return "unset";
  const stored = window.localStorage.getItem(CONSENT_KEY);
  return stored === "granted" || stored === "denied" ? stored : "unset";
}

/** Fired so the ad loader can react without a page reload. */
const CONSENT_EVENT = "wg:consent";

export function useConsent(): ConsentState {
  const [consent, setConsent] = useState<ConsentState>("unset");

  useEffect(() => {
    setConsent(readConsent());
    const onChange = () => setConsent(readConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  return consent;
}

function setConsent(value: Exclude<ConsentState, "unset">): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export interface ConsentCopy {
  title: string;
  body: string;
  accept: string;
  reject: string;
  more: string;
}

export function ConsentBanner({ copy, privacyHref }: { copy: ConsentCopy; privacyHref: string }) {
  const consent = useConsent();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const ref = useRef<HTMLDivElement>(null);
  const visible = mounted && consent === "unset";

  /**
   * Reserve space equal to the banner's height while it is shown.
   *
   * Without this the fixed banner sits on top of the end of the page and the
   * footer links underneath it cannot be clicked — which the e2e suite caught.
   * Covering content the reader is trying to reach, until they answer a
   * question about ads, is the kind of coercion this banner is supposed not to
   * be. Measured rather than hard-coded because the text wraps differently in
   * ten languages.
   */
  useEffect(() => {
    if (!visible) return;
    const element = ref.current;
    if (element === null) return;

    const apply = () => {
      document.body.style.paddingBottom = `${element.offsetHeight}px`;
    };
    apply();

    const observer = new ResizeObserver(apply);
    observer.observe(element);
    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, [visible]);

  // Rendered only after mount: the server cannot know the stored choice, and
  // showing the banner during hydration would flash it at people who already
  // answered.
  if (!visible) return null;

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface shadow-2"
    >
      <div className="mx-auto max-w-4xl px-6 py-5">
        <h2 id="consent-title" className="font-semibold text-ink">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed">{copy.body}</p>

        {/* Equal weight on both buttons — see rule 1 above. */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => setConsent("granted")}
            className="flex-1 rounded-md btn-gradient px-4 py-2.5 font-semibold text-primary-contrast focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {copy.accept}
          </button>
          <button
            type="button"
            onClick={() => setConsent("denied")}
            className="flex-1 rounded-md border border-line-strong px-4 py-2.5 font-semibold text-ink hover:border-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {copy.reject}
          </button>
        </div>

        <a
          href={privacyHref}
          className="mt-3 inline-block text-sm text-primary underline underline-offset-4"
        >
          {copy.more}
        </a>
      </div>
    </div>
  );
}
