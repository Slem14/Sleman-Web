"use client";

import {
  ENGLISH_NAMES,
  LANGUAGE_STORAGE_KEY,
  LOCALES,
  NATIVE_NAMES,
  dir,
  isLocale,
  type Locale,
} from "@wg/i18n";
import { LanguageCard } from "@wg/ui";
import { useEffect, useState } from "react";

/**
 * Client island: renders the language cards, persists the choice in
 * localStorage (browser-only, never sent to a server) and, on return visits,
 * points out the previous choice.
 */
export function LanguagePicker() {
  const [saved, setSaved] = useState<Locale | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (stored !== null && isLocale(stored)) setSaved(stored);
    } catch {
      // Storage unavailable (private mode etc.) — feature degrades silently.
    }
  }, []);

  const remember = (locale: Locale) => {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    } catch {
      // Non-essential; ignore.
    }
  };

  return (
    <nav aria-label="Language selection" className="grid gap-4">
      {LOCALES.map((locale) => (
        <LanguageCard
          key={locale}
          href={`/${locale}`}
          nativeName={NATIVE_NAMES[locale]}
          englishName={
            saved === locale
              ? `${ENGLISH_NAMES[locale]} — previously chosen`
              : ENGLISH_NAMES[locale]
          }
          langTag={locale}
          nativeDir={dir(locale)}
          onClick={() => remember(locale)}
        />
      ))}
    </nav>
  );
}
