/**
 * Extracting calendar dates from German letter wording.
 *
 * Used to VERIFY the model's normalized dates against the raw German it
 * quoted — not to produce dates of our own. If a date is not written in the
 * letter, our answer is "we don't know", never a computed guess.
 */

const MONTHS: Record<string, number> = {
  januar: 1,
  jänner: 1,
  februar: 2,
  märz: 3,
  maerz: 3,
  april: 4,
  mai: 5,
  juni: 6,
  juli: 7,
  august: 8,
  september: 9,
  oktober: 10,
  november: 11,
  dezember: 12,
};

function iso(year: number, month: number, day: number): string | null {
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  // Reject impossible days (30 February) by round-tripping through Date.
  const utc = new Date(Date.UTC(year, month - 1, day));
  if (utc.getUTCMonth() !== month - 1 || utc.getUTCDate() !== day) return null;
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Every explicit calendar date written in a piece of German text.
 *
 * German writes day-first: 15.08.2026 is 15 August, never 8 March. Getting
 * this backwards would silently shift deadlines by months, so the day-first
 * assumption is hard-coded rather than locale-detected.
 */
export function extractGermanDates(text: string): string[] {
  const found = new Set<string>();

  // Numeric: 15.08.2026, 15.8.2026, 15. 08. 2026
  const numeric = /\b(\d{1,2})\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})\b/g;
  for (const match of text.matchAll(numeric)) {
    const value = iso(Number(match[3]), Number(match[2]), Number(match[1]));
    if (value !== null) found.add(value);
  }

  // Written month: "15. August 2026", "1. Jänner 2027"
  const written = /\b(\d{1,2})\s*\.?\s*([A-Za-zÄÖÜäöüß]+)\s+(\d{4})\b/g;
  for (const match of text.matchAll(written)) {
    const month = MONTHS[match[2]!.toLowerCase()];
    if (month === undefined) continue;
    const value = iso(Number(match[3]), month, Number(match[1]));
    if (value !== null) found.add(value);
  }

  return [...found];
}

/** True when the text contains wording that implies a computed deadline. */
export function hasRelativeDeadlineWording(text: string): boolean {
  const relative = [
    "innerhalb",
    "binnen",
    "frist von",
    "nach zugang",
    "nach erhalt",
    "ab zustellung",
    "nach zustellung",
    "wochen",
    "monaten",
    "werktagen",
  ];
  const haystack = text.toLowerCase();
  return relative.some((term) => haystack.includes(term));
}
