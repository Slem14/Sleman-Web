/**
 * English message catalog — the source of truth for the message shape.
 * The Dari catalog must satisfy the same `Messages` type; TypeScript fails
 * the build if any key is missing or extra in either language.
 */
export const en = {
  common: {
    appName: "Welcome Germany",
    tagline: "Understand your German letters — in your language.",
    continue: "Continue",
    back: "Back",
    betaNotice: "Early preview — not yet open to the public.",
    languageSwitch: "Change language",
    skipToContent: "Skip to main content",
  },
  languageSelect: {
    title: "Choose your language",
    subtitle: "زبان خود را انتخاب کنید",
    hint: "You can change this anytime.",
    continueSaved: "Continue in",
    comingLater:
      "More languages are planned. We only add a language once native speakers have reviewed it.",
  },
  home: {
    heroTitle: "Got a German letter you don't understand?",
    heroLead:
      "Take a photo of it. We explain what it says, what it asks you to do, and when it's due — in your language, with the original German passages shown as proof.",
    stepsTitle: "How it works",
    steps: [
      {
        title: "Upload your letter",
        text: "Photograph it with your phone or choose a PDF.",
      },
      {
        title: "Read the explanation",
        text: "Who sent it, what it says, deadlines, and what documents it asks for.",
      },
      {
        title: "Check the proof",
        text: "Every conclusion shows the German sentence it comes from.",
      },
      {
        title: "Done — nothing is stored",
        text: "Your letter is deleted after processing. No account needed.",
      },
    ] as ReadonlyArray<{ title: string; text: string }>,
    privacyTitle: "Before you upload — how we treat your letter",
    privacyPoints: [
      "Your letter is analyzed by artificial intelligence (AI).",
      "It is not stored. After processing, it is gone from our systems.",
      "No account, no name, no email is needed.",
      "AI can make mistakes. Always verify important deadlines against the original letter.",
      "This service explains letters. It is not a law firm and does not give legal advice.",
    ] as ReadonlyArray<string>,
    privacyMore: "Read the full privacy notice",
    uploadCta: "Understand my letter",
    uploadComingSoon:
      "Uploading opens in the next release. What you see today is an early preview.",
    seriousTitle: "Some letters need more than an app",
    seriousText:
      "For letters about courts, asylum decisions, deportation, or losing your home, we deliberately stay cautious and point you to qualified human help.",
  },
  privacyPage: {
    title: "Privacy Notice",
    draftBadge: "Draft — pending professional legal review",
    intro:
      "This page explains, in plain language, what happens to your data when you use Welcome Germany. The short version: we designed this service so that we know as little about you as possible.",
    sections: [
      {
        heading: "Your letter",
        body: "Your uploaded letter is processed only to create your explanation. It is processed in memory, sent to our carefully selected AI provider under a data-processing agreement, and then discarded. We do not store it, we cannot retrieve it afterwards, and we never use it to train AI models.",
      },
      {
        heading: "No account, no profile",
        body: "You do not create an account. We do not build a profile of you. We do not know who you are.",
      },
      {
        heading: "What we do record",
        body: "Anonymous technical information needed to run the service safely: for example that a request happened, how long it took, its rough file size, and whether it succeeded. This never includes your letter's content, your name, or your address.",
      },
      {
        heading: "Your language choice",
        body: "Your selected language is saved only in your own browser, so the site opens in your language next time. It is not sent to us.",
      },
      {
        heading: "No tracking",
        body: "No advertising, no tracking cookies, no analytics scripts that follow you, no session recording.",
      },
      {
        heading: "Questions and rights",
        body: "You have rights under the EU General Data Protection Regulation (GDPR), including access and erasure. Because we store no documents and no accounts, there is usually nothing we could look up about you — but you can always contact us.",
      },
    ] as ReadonlyArray<{ heading: string; body: string }>,
  },
  termsPage: {
    title: "Terms of Use & Disclaimer",
    draftBadge: "Draft — pending professional legal review",
    sections: [
      {
        heading: "What this service is",
        body: "Welcome Germany helps you understand the content of German administrative letters. It gives you an AI-generated explanation for information purposes.",
      },
      {
        heading: "What this service is not",
        body: "It is not a law firm, not a public authority, and not legal advice. It does not decide your rights, predict outcomes, or replace qualified legal, migration, tax, or social counseling.",
      },
      {
        heading: "AI can make mistakes",
        body: "The explanation is generated by artificial intelligence. It can misread documents, especially poor-quality photos. The original German letter always remains the authoritative document. Verify important deadlines and seek qualified help for serious matters.",
      },
      {
        heading: "Your responsibility",
        body: "Only upload documents you are allowed to upload. Do not rely on this service as your only source for decisions with legal consequences.",
      },
    ] as ReadonlyArray<{ heading: string; body: string }>,
  },
  aiPage: {
    title: "How the AI works — transparency",
    intro:
      "You have a right to know how this service produces its explanations. This page keeps it honest and short.",
    points: [
      "Your letter is read by a large language model (AI) operated by our contracted provider.",
      "The AI is instructed to only report what the letter actually says, to show the German text supporting each conclusion, and to say clearly when something is uncertain.",
      "The AI is instructed to never give legal conclusions and to flag serious letters for qualified human help.",
      "Despite these safeguards, AI can misunderstand text. Treat the result as a well-prepared explanation, not as a certified translation or advice.",
      "Your letter is not used to train any AI model.",
    ] as ReadonlyArray<string>,
  },
  impressumPage: {
    title: "Impressum",
    placeholder:
      "Legal provider identification (Impressum) will be published here before public launch, as required by German law (§ 5 DDG).",
  },
  footer: {
    privacy: "Privacy",
    terms: "Terms & Disclaimer",
    ai: "About the AI",
    impressum: "Impressum",
    notLegalAdvice: "Information only — not legal advice.",
  },
};

/**
 * Structural type all catalogs must match exactly. Derived from the English
 * catalog WITHOUT `as const`, so values are `string` (translatable) while the
 * key structure stays strictly enforced.
 */
export type Messages = typeof en;
