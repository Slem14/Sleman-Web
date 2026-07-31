export type { Messages } from "./messages/en";
export { en } from "./messages/en";
export { prs } from "./messages/prs";
export type { PartialMessages } from "./fallback";

import { completeCatalog, type PartialMessages } from "./fallback";
import type { Messages } from "./messages/en";
import { ar } from "./messages/ar";
import { en } from "./messages/en";
import { fa } from "./messages/fa";
import { ku } from "./messages/ku";
import { ps } from "./messages/ps";
import { prs } from "./messages/prs";
import { ru } from "./messages/ru";
import { ti } from "./messages/ti";
import { tr } from "./messages/tr";
import { uk } from "./messages/uk";

/**
 * Supported UI locales, ordered by speaker population in Germany.
 *
 * Notes on the ones that are easy to get wrong:
 * - "prs" — Dari (Afghan Persian), ISO 639-3. Deliberately separate from "fa"
 *   so the Afghan variety is never conflated with Iranian Farsi.
 * - "fa"  — Iranian Farsi. Separate catalogue, different vocabulary.
 * - "ku"  — Kurmanji Kurdish in Latin script, not Sorani.
 */
export const LOCALES = ["en", "ar", "tr", "uk", "ru", "prs", "fa", "ps", "ku", "ti"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Right-to-left scripts. Everything else is left-to-right. */
const RTL_LOCALES = new Set<Locale>(["ar", "prs", "fa", "ps"]);

export function dir(locale: Locale): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

/** Native display names, used on language selection (never flags). */
export const NATIVE_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  tr: "Türkçe",
  uk: "Українська",
  ru: "Русский",
  prs: "دری",
  fa: "فارسی",
  ps: "پښتو",
  ku: "Kurdî",
  ti: "ትግርኛ",
};

/** English reference names (secondary label on language cards). */
export const ENGLISH_NAMES: Record<Locale, string> = {
  en: "English",
  ar: "Arabic",
  tr: "Turkish",
  uk: "Ukrainian",
  ru: "Russian",
  prs: "Dari",
  fa: "Farsi",
  ps: "Pashto",
  ku: "Kurdish (Kurmanji)",
  ti: "Tigrinya",
};

/**
 * Locales whose catalogue has not yet been checked by a native speaker.
 *
 * Kept as data rather than a comment so the UI can say so honestly. The
 * product promises German letters are explained carefully; claiming a
 * translation has been reviewed when it has not would undercut exactly the
 * trust this is for.
 */
export const UNREVIEWED_LOCALES = new Set<Locale>([
  "ar",
  "tr",
  "uk",
  "ru",
  "prs",
  "fa",
  "ps",
  "ku",
  "ti",
]);

/**
 * Partial catalogues, completed against English at module load.
 *
 * Anything a catalogue has not translated yet falls back to English rather
 * than rendering blank — see fallback.ts. Today that is mainly the long-form
 * legal pages, which are deliberately left to a human: machine-translating
 * legal prose is precisely where this product could do harm.
 */
const PARTIALS: Record<Exclude<Locale, "en">, PartialMessages> = {
  ar,
  tr,
  uk,
  ru,
  prs,
  fa,
  ps,
  ku,
  ti,
};

const CATALOGS: Record<Locale, Messages> = {
  en,
  ar: completeCatalog(ar),
  tr: completeCatalog(tr),
  uk: completeCatalog(uk),
  ru: completeCatalog(ru),
  prs: completeCatalog(prs),
  fa: completeCatalog(fa),
  ps: completeCatalog(ps),
  ku: completeCatalog(ku),
  ti: completeCatalog(ti),
};

export function getMessages(locale: Locale): Messages {
  return CATALOGS[locale];
}

/** Exposed for tests that assert catalogue coverage. */
export const PARTIAL_CATALOGS = PARTIALS;

/** localStorage key for the persisted language choice (client-only, C2 data). */
export const LANGUAGE_STORAGE_KEY = "wg.language";

/**
 * Languages planned but not yet built. Empty now that all ten ship — kept so
 * the selection page keeps working when the next one is queued up.
 */
export interface UpcomingLanguage {
  native: string;
  english: string;
  dir: "ltr" | "rtl";
}

export const UPCOMING_LANGUAGES: ReadonlyArray<UpcomingLanguage> = [];
