export type { Messages } from "./messages/en";
export { en } from "./messages/en";
export { prs } from "./messages/prs";

import type { Messages } from "./messages/en";
import { en } from "./messages/en";
import { prs } from "./messages/prs";

/**
 * Supported UI locales.
 * - "en"  — English
 * - "prs" — Dari (Afghan Persian). ISO 639-3 code; chosen over "fa-AF" so the
 *   Afghan variety is explicit and never conflated with Iranian Farsi
 *   (see docs/product/requirements.md §7 open decisions — resolved here).
 */
export const LOCALES = ["en", "prs"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Text direction for a locale. Dari is right-to-left. */
export function dir(locale: Locale): "ltr" | "rtl" {
  return locale === "prs" ? "rtl" : "ltr";
}

/** Native display names, used on language selection (never flags). */
export const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  prs: "دری",
};

/** English reference names (secondary label on language cards). */
export const ENGLISH_NAMES: Record<Locale, string> = {
  en: "English",
  prs: "Dari",
};

const CATALOGS: Record<Locale, Messages> = { en, prs };

export function getMessages(locale: Locale): Messages {
  return CATALOGS[locale];
}

/** localStorage key for the persisted language choice (client-only, C2 data). */
export const LANGUAGE_STORAGE_KEY = "wg.language";
