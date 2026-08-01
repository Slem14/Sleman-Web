import { arGuides } from "./ar";
import { trGuides } from "./tr";
import { faGuides } from "./fa";
import { kuGuides } from "./ku";
import { prsGuides } from "./prs";
import { psGuides } from "./ps";
import { tiGuides } from "./ti";
import { ruGuides } from "./ru";
import { ukGuides } from "./uk";

/**
 * Letter guides — the substantive content of the site.
 *
 * These exist for three reasons at once, and the ordering matters:
 *
 *  1. People searching "was bedeutet Mahnung Jobcenter" need a real answer
 *     whether or not they ever upload anything. That is the point.
 *  2. Search engines and AI assistants cite pages that answer a question
 *     fully. A tool with no prose is invisible to both.
 *  3. AdSense rejects sites for "low value content", which a six-page utility
 *     reads as regardless of how useful the tool is.
 *
 * ── Rules these must follow, without exception ───────────────────────────
 *
 * Everything the product refuses to do in an analysis, it also refuses here:
 *
 *  - No legal advice. Explain what a letter type IS and what it usually asks
 *    for. Never say what the reader should argue, whether to appeal, or
 *    whether a decision is correct.
 *  - No invented deadlines. Deadlines vary per letter. Say where the deadline
 *    is printed; never state a number as if it applied to the reader's case.
 *  - No predicted outcomes. Never say what "will" happen.
 *  - German terms stay in German, with the translation beside them, so the
 *    reader can quote the word to an office or find it on their own letter.
 *  - High-risk categories (court, asylum, deportation, eviction) point to
 *    human help early and prominently, not as a footnote.
 */

/**
 * Locales whose guide text actually exists in that language.
 *
 * The rule for this product is that once someone picks a language, they never
 * see text in a language they cannot read. English prose under an Arabic
 * shell breaks that, so a locale only appears here once its guides are
 * genuinely translated — and until then the guides are not offered in it at
 * all. Fewer pages, but no page that lies about being readable.
 *
 * Add a locale here only together with its translated text.
 */
export const GUIDE_LOCALES = ["en", "ar", "tr", "uk", "ru", "prs", "fa", "ps", "ku", "ti"] as const;

export function hasGuides(locale: string): boolean {
  return (GUIDE_LOCALES as readonly string[]).includes(locale);
}

/**
 * The translatable part of a guide.
 *
 * `germanTitle`, `slug` and `highRisk` are deliberately absent: the German
 * letter name must stay German in every language (it is the word printed on
 * the reader's letter), the slug must stay stable because it is an indexed
 * URL, and whether a letter type is high-risk is a property of the letter,
 * not of who is reading about it.
 */
export interface GuideTranslation {
  title: string;
  summary: string;
  sender: string;
  sections: GuideSection[];
}

/** locale → slug → translated content. */
export type GuideTranslations = Record<string, GuideTranslation>;

export interface GuideSection {
  heading: string;
  /** Paragraphs. Rendered as text, never as HTML. */
  paragraphs: string[];
}

export interface Guide {
  /** URL segment. Stable — these become indexed addresses. */
  slug: string;
  /** German name of the letter, shown prominently and kept in German. */
  germanTitle: string;
  /** Plain-language English title used for the page heading and <title>. */
  title: string;
  /** One-sentence summary, used for meta description and card text. */
  summary: string;
  /** Who typically sends this. */
  sender: string;
  /** True for court/asylum/deportation/eviction — triggers the help notice. */
  highRisk: boolean;
  sections: GuideSection[];
}

const DEADLINE_NOTE =
  "The deadline that applies to you is printed on your own letter — usually near the top or at the end of the section describing what you must do. Look for a date, or a phrase such as „innerhalb von zwei Wochen“ (within two weeks) or „bis zum“ (by). Do not rely on a period you read online, including here: the same letter type carries different deadlines depending on why it was sent.";

const HELP_NOTE =
  "For a letter of this kind, get help from a person rather than acting alone. A Migrationsberatung (migration counselling service), a Sozialberatung, a Verbraucherzentrale, or a lawyer can read the actual letter and tell you what your options are. Many of these services are free.";

/** locale -> slug -> translated content. English lives in GUIDES itself. */
const TRANSLATIONS: Record<string, GuideTranslations> = {
  ar: arGuides,
  tr: trGuides,
  uk: ukGuides,
  ru: ruGuides,
  prs: prsGuides,
  fa: faGuides,
  ps: psGuides,
  ku: kuGuides,
  ti: tiGuides,
};

export const GUIDES: Guide[] = [
  {
    slug: "jobcenter-bescheid",
    germanTitle: "Bescheid vom Jobcenter",
    title: "A decision letter from the Jobcenter",
    summary:
      "What a Jobcenter Bescheid is, how to tell whether it grants or reduces money, and where the deadline is printed.",
    sender: "Jobcenter",
    highRisk: false,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "A „Bescheid“ is an official decision. A Jobcenter Bescheid tells you what the Jobcenter has decided about your benefits — how much you receive, for which months, and on what basis.",
          "It is not a letter asking your opinion. The decision has already been made. What the letter gives you is the reasoning and a period in which you can respond.",
        ],
      },
      {
        heading: "How to tell what it decided",
        paragraphs: [
          "Look for „Bewilligung“ (approval) or „Ablehnung“ (rejection) near the beginning. „Aufhebung“ means a previous decision is being cancelled, and „Erstattung“ means the Jobcenter wants money back from you.",
          "Amounts are usually listed per month in a table, often under „Berechnung“ (calculation). The period the decision covers is given as „Bewilligungszeitraum“.",
        ],
      },
      {
        heading: "What it usually asks you to do",
        paragraphs: [
          "Many Bescheide ask for nothing at all — they inform you of a decision. Others ask for documents, often listed under „Mitwirkungspflicht“ or „bitte reichen Sie ein“ (please submit).",
          "If you disagree with a Bescheid, the letter will name a period for a „Widerspruch“ (objection). Whether an objection makes sense in your situation is a question for a counselling service, not for a website.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },
  {
    slug: "mahnung",
    germanTitle: "Mahnung",
    title: "A payment reminder",
    summary:
      "What a Mahnung is, how it differs from a Mahnbescheid from the court, and why the difference matters.",
    sender: "Companies, insurers, public bodies",
    highRisk: false,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "A „Mahnung“ is a reminder that someone believes you owe money. It comes from the company or office itself, not from a court.",
          "It usually states the original amount, any added fees („Mahngebühr“), and a date by which they want payment.",
        ],
      },
      {
        heading: "The important distinction",
        paragraphs: [
          "A „Mahnung“ is not the same as a „Mahnbescheid“. A Mahnbescheid comes from a court (Amtsgericht), arrives in a yellow envelope, and carries a short legal period for responding. If your letter says Mahnbescheid, treat it as a court matter and get advice quickly.",
          "Confusing the two is common and consequential, because only one of them starts a legal process.",
        ],
      },
      {
        heading: "What it usually asks you to do",
        paragraphs: [
          "Pay, or contact the sender about the claim. If you believe the claim is wrong, a Verbraucherzentrale (consumer advice centre) can look at it with you — including whether it is one of the common letters that look official but are not.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },
  {
    slug: "auslaenderbehoerde-anhoerung",
    germanTitle: "Anhörung der Ausländerbehörde",
    title: "A hearing letter from the immigration office",
    summary:
      "What an Anhörung from the Ausländerbehörde means, and why it is a letter to take to a counsellor rather than answer alone.",
    sender: "Ausländerbehörde",
    highRisk: true,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "An „Anhörung“ means the office is considering a decision about your residence status and is required to let you comment first. It is a formal step before a decision, not the decision itself.",
          "Because it comes before a decision, what you write in response can matter a great deal.",
        ],
      },
      {
        heading: "Why to get help with this one",
        paragraphs: [
          "This is a letter about your right to stay. What you should say, and what you should not, depends entirely on your individual circumstances — no general guidance can substitute for someone reading your file.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },
  {
    slug: "krankenkasse-beitragsbescheid",
    germanTitle: "Beitragsbescheid der Krankenkasse",
    title: "A health insurance contribution notice",
    summary:
      "What a Beitragsbescheid from your Krankenkasse states, and what to do if the contribution looks wrong.",
    sender: "Krankenkasse",
    highRisk: false,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "A „Beitragsbescheid“ tells you how much you must pay for health insurance, from which date, and how the amount was calculated.",
          "It often follows a change: a new job, self-employment, the end of studies, or the end of another form of coverage.",
        ],
      },
      {
        heading: "What it usually asks you to do",
        paragraphs: [
          "Usually: pay the stated contribution, or supply proof of income so the amount can be recalculated. Look for „Einkommensnachweis“ (proof of income).",
          "If the amount assumes an income you do not have, Krankenkassen commonly recalculate once you send evidence. A Sozialberatung can help you work out what evidence is needed.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },
  {
    slug: "kuendigung-wohnung",
    germanTitle: "Kündigung der Wohnung",
    title: "A letter ending your tenancy",
    summary:
      "What a Kündigung from a landlord is, the difference between the ordinary and immediate forms, and why to act quickly.",
    sender: "Landlord or property management",
    highRisk: true,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "A „Kündigung“ from your landlord states that they intend to end your tenancy, and from which date.",
          "„Ordentliche Kündigung“ is the ordinary form with a notice period. „Fristlose Kündigung“ claims the right to end the tenancy immediately, usually over unpaid rent.",
        ],
      },
      {
        heading: "Why to get help with this one",
        paragraphs: [
          "Losing your home affects everything else, including your residence status and your benefits. Whether a Kündigung is valid depends on details that only someone reading the letter and your contract can assess.",
          HELP_NOTE,
          "A Mieterverein (tenants' association) is the specific service for this kind of letter.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },
  {
    slug: "bamf-bescheid",
    germanTitle: "Bescheid vom BAMF",
    title: "A decision on your asylum application",
    summary:
      "What a BAMF Bescheid is, why the response period is short, and why this letter should go to a counsellor the same week.",
    sender: "Bundesamt für Migration und Flüchtlinge (BAMF)",
    highRisk: true,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "A Bescheid from the BAMF is the decision on your asylum application. It states the outcome and the reasons for it.",
          "The outcome may be recognition, a lesser form of protection, or a rejection — and rejections come in more than one form, which affects what happens next.",
        ],
      },
      {
        heading: "Why this letter is urgent",
        paragraphs: [
          "Periods for responding to a BAMF Bescheid are short, and in some cases they are counted in days rather than weeks. Missing one can end the possibility of challenging the decision.",
          "This is the letter type where getting to a qualified person quickly matters most. Do not wait to understand it fully before seeking help — take it to someone.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },
  {
    slug: "rundfunkbeitrag",
    germanTitle: "Rundfunkbeitrag",
    title: "The broadcasting fee letter",
    summary:
      "What the Rundfunkbeitrag is, why it arrives even if you own no television, and when an exemption is possible.",
    sender: "Beitragsservice (ARD, ZDF, Deutschlandradio)",
    highRisk: false,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "The „Rundfunkbeitrag“ is a fee charged per household, not per person and not per device. It arrives whether or not you own a television or radio.",
          "Letters from the Beitragsservice usually either register your household, request payment, or chase an unpaid amount.",
        ],
      },
      {
        heading: "What it usually asks you to do",
        paragraphs: [
          "Pay, register the household, or state that another person in the same household already pays — in which case the household is charged once.",
          "Exemption („Befreiung“) is possible for some people receiving certain benefits, including some Jobcenter recipients. The letter or the Beitragsservice website explains what evidence is needed.",
          DEADLINE_NOTE,
        ],
      },
    ],
  },
  {
    slug: "gerichtspost",
    germanTitle: "Post vom Gericht",
    title: "A letter from a court",
    summary:
      "How to recognise court post, what the yellow envelope means, and why the date on it matters.",
    sender: "Amtsgericht, Landgericht, or another court",
    highRisk: true,
    sections: [
      {
        heading: "What this letter is",
        paragraphs: [
          "Court letters arrive from a „Gericht“ — commonly an Amtsgericht. They may concern a debt, a tenancy, a fine, or a case brought against you.",
          "A yellow envelope („Zustellungsurkunde“) means formal service: the date of delivery is recorded, and legal periods are counted from that date. Note the date written on the envelope and keep it.",
        ],
      },
      {
        heading: "Why to get help with this one",
        paragraphs: [
          "Court periods are short and missing one can decide a case without your side being heard. This is not a letter to set aside until you have time.",
          HELP_NOTE,
          DEADLINE_NOTE,
        ],
      },
    ],
  },
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/**
 * Returns a guide with its text in the requested language.
 *
 * Returns undefined rather than falling back to English when a translation is
 * missing — the fallback is exactly the bug this replaced. A caller that
 * cannot get the reader's language must show nothing, not English.
 */
export function resolveGuide(slug: string, locale: string): Guide | undefined {
  const guide = findGuide(slug);
  if (guide === undefined) return undefined;
  if (locale === "en") return guide;

  const translated = TRANSLATIONS[locale]?.[slug];
  if (translated === undefined) return undefined;

  return {
    ...guide,
    title: translated.title,
    summary: translated.summary,
    sender: translated.sender,
    sections: translated.sections,
  };
}

/** Guides available in a locale, already translated. */
export function guidesFor(locale: string): Guide[] {
  return GUIDES.map((guide) => resolveGuide(guide.slug, locale)).filter(
    (guide): guide is Guide => guide !== undefined,
  );
}
