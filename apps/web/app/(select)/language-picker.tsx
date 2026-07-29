"use client";

import {
  ENGLISH_NAMES,
  LANGUAGE_STORAGE_KEY,
  LOCALES,
  NATIVE_NAMES,
  dir,
  getMessages,
  isLocale,
  type Locale,
} from "@wg/i18n";
import { LanguageCard } from "@wg/ui";
import { useEffect, useState } from "react";

/**
 * Client island: language cards, each entirely in its own language (name,
 * tagline, direction). The choice persists in localStorage only; on return
 * visits the previous choice carries a small chip in that language.
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
    <nav aria-label="Language selection" className="grid gap-4 sm:grid-cols-2">
      {LOCALES.map((locale) => {
        const m = getMessages(locale);
        return (
          <LanguageCard
            key={locale}
            href={`/${locale}`}
            nativeName={NATIVE_NAMES[locale]}
            englishName={ENGLISH_NAMES[locale]}
            langTag={locale}
            nativeDir={dir(locale)}
            subtitle={m.common.tagline}
            chip={saved === locale ? m.common.continue : undefined}
            onClick={() => remember(locale)}
          />
        );
      })}
    </nav>
  );
}
