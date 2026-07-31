import type { Messages } from "./messages/en";
import { en } from "./messages/en";

/** Every field optional, recursively — the shape a partial catalog may take. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends ReadonlyArray<unknown>
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type PartialMessages = DeepPartial<Messages>;

/**
 * Fills a partial catalog out to a complete one using English.
 *
 * Two things make this the right shape for this product rather than a
 * shortcut:
 *
 *  1. A language can ship the moment its safety-critical strings exist. The
 *     upload flow, the error messages and the risk warnings are what a person
 *     needs in their own language; the long legal prose can follow.
 *  2. Adding an English string later cannot break nine other locales' builds.
 *     Under the previous all-or-nothing typing it would, which in practice
 *     means either blocking the change or rushing translations to unblock it.
 *
 * A missing string therefore degrades to English — visibly imperfect, but
 * readable — instead of rendering blank or failing to compile.
 *
 * Arrays are replaced wholesale, never merged element-by-element: a translated
 * list of four privacy points must not end up as two translated entries
 * followed by two English ones.
 */
function mergeInto<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (override === undefined) return base;

  const result = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    if (value === undefined) continue;

    const baseValue = (base as Record<string, unknown>)[key];
    if (
      typeof value === "object" &&
      value !== null &&
      !Array.isArray(value) &&
      typeof baseValue === "object" &&
      baseValue !== null &&
      !Array.isArray(baseValue)
    ) {
      result[key] = mergeInto(baseValue, value as DeepPartial<unknown>);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

/** Completes a partial catalog against the English source of truth. */
export function completeCatalog(partial: PartialMessages): Messages {
  return mergeInto(en, partial);
}
