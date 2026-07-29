# Competitive Differentiation Hypotheses — Welcome Germany

> Stage 0 deliverable. Draft v0.1. These are hypotheses to test in validation, not marketing claims.

## The landscape

| Alternative                                                                                                                  | What it does well                                   | Where it fails our users                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Google Translate / Lens                                                                                                      | Instant, free, works on photos                      | Word-level translation of bureaucratic German is often misleading; no structure: no "do I need to act, by when"; no risk awareness; no evidence trail                          |
| General chatbots (ChatGPT, Gemini, Claude apps)                                                                              | Can summarize and answer follow-ups                 | No safety rails for high-risk letters; hallucinated confidence; unclear data handling for sensitive uploads; no RTL-first Dari UX; requires prompt skill users don't have      |
| Human help: Migrationsberatung, social workers, Flüchtlingsräte                                                              | Qualified, trusted, legally safe                    | Weeks of waiting; limited hours; capacity crisis; not available at 8pm when the letter arrives                                                                                 |
| Friends/family translation                                                                                                   | Trusted, free                                       | Inconsistent quality; availability; embarrassment/privacy cost of showing personal letters                                                                                     |
| Existing "explain German letters" apps and integration platforms (e.g., letter-explainer tools, Integreat, Handbook Germany) | Useful general information; some letter tools exist | Mostly generic info, not _this letter_; letter tools observed so far lack: evidence-linked extraction, conservative high-risk handling, Dari, strict no-storage privacy stance |

## Our differentiation hypotheses

| #   | Hypothesis                                                                                                                                                          | How we'll know it's true                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| D-1 | **Structured answers beat translation.** Users primarily want "act? by when? how serious?", not prose translation                                                   | Validation interviews; pilot: % of users who expand the full summary vs. act on the action/deadline cards |
| D-2 | **Evidence builds trust.** Showing the German passage behind each conclusion makes users (and the helpers advising them) trust and verify results                   | Interviews with helpers; evidence-expansion usage in pilot                                                |
| D-3 | **Privacy stance is adoption-critical**, not a nice-to-have — target users fear their documents reaching authorities or being stored                                | Interviews; explicit question in validation script                                                        |
| D-4 | **Dari-first matters.** Serving Dari properly (not Iranian Farsi, not English-only) reaches an underserved community and earns community-org referrals              | Community-org feedback; Dari usage share in pilot                                                         |
| D-5 | **Conservative high-risk handling earns professional referrals.** Counselors will recommend a tool that visibly knows its limits and pushes serious cases to humans | Counselor interviews after demoing the high-risk flow                                                     |
| D-6 | **No account = usable in the real context** (helper with someone else's phone, one-off anxious use)                                                                 | Pilot observation; drop-off measurement at privacy screen                                                 |

## What we deliberately do not compete on

- Being a general legal-information portal (Handbook Germany does this well — potential partner, not competitor).
- Speed/volume of raw translation.
- Case management or personal bureaucracy archives (excluded from MVP; revisit only with a real privacy design).

## Positioning sentence (working)

> "Not a translator, not a lawyer: Welcome Germany reads your German letter and tells you — in your language, with the proof highlighted — who wrote it, what it asks of you, and when it's due; and when a letter is too serious for an app, it says so and points you to real help."
