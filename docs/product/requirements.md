# Product Requirements — Welcome Germany

> Stage 0 deliverable. Status: draft v0.1 (2026-07-29). Source of truth for scope: [master-spec.md](master-spec.md).

## 1. Problem statement

People living in Germany who do not read German receive official letters (Ausländerbehörde, Jobcenter, Krankenkasse, Finanzamt, courts, landlords, insurers). Misunderstanding or ignoring these letters causes missed deadlines, lost benefits, fines, and in the worst cases residence-status or legal harm. Existing translation tools translate words but do not answer the questions that matter: **Who sent this? Do I have to do something? By when? What happens if I don't?**

## 2. Solution summary

A privacy-first web app: upload a photo or PDF of a German letter, get a structured explanation in your language (v1: English, Dari) — sender, document type, plain summary, explicit deadlines, requested actions and documents, supporting German passages — plus an optional polite German reply draft. No account. Document deleted after processing.

## 3. Functional requirements

| ID    | Requirement                                                                                             | Priority          |
| ----- | ------------------------------------------------------------------------------------------------------- | ----------------- |
| FR-1  | User selects UI language (English / Dari) as first interaction; choice persists in browser storage only | Must              |
| FR-2  | Full RTL layout when Dari is selected, with LTR bidi isolation for embedded German text                 | Must              |
| FR-3  | Short plain-language privacy explanation shown before upload                                            | Must              |
| FR-4  | Upload German letters as PDF, JPEG, PNG, WebP; phone camera via browser file input                      | Must              |
| FR-5  | Server-side validation: content type, magic bytes, size, page count, pixel/decompression limits         | Must              |
| FR-6  | Structured analysis conforming to versioned Zod schema (master-spec §5)                                 | Must              |
| FR-7  | Explicit deadline extraction with raw German text, Europe/Berlin normalization, confidence, evidence    | Must              |
| FR-8  | Explicit requested-action and requested-document extraction with evidence                               | Must              |
| FR-9  | Sender and document-type identification with evidence and confidence                                    | Must              |
| FR-10 | Every important claim is backed by a German evidence snippet the user can view                          | Must              |
| FR-11 | High-risk documents flagged and handled per the [high-risk policy](high-risk-document-policy.md)        | Must              |
| FR-12 | Optional German reply draft, only on explicit user request, placeholder-based (master-spec §18)         | Must              |
| FR-13 | Visible delete/reset control that clears the current result                                             | Must              |
| FR-14 | AI transparency disclosures visible in the result UI, not only in terms                                 | Must              |
| FR-15 | No account, no login, no document history                                                               | Must (constraint) |
| FR-16 | Uploaded document and analysis discarded after the session; nothing persisted server-side               | Must (constraint) |
| FR-17 | Optional personal-data masking before analysis, presented as best-effort                                | Should            |
| FR-18 | Static pages: privacy notice, Impressum, terms/disclaimer, AI transparency notice                       | Must              |
| FR-19 | Health/readiness endpoints, rate limiting, abuse controls                                               | Must              |
| FR-20 | "Coming later" indication for future languages without false promises                                   | Could             |

## 4. Non-functional requirements

| ID    | Requirement                                                                                                |
| ----- | ---------------------------------------------------------------------------------------------------------- |
| NFR-1 | WCAG 2.2 AA; keyboard-only operation; screen-reader announcements for upload/processing                    |
| NFR-2 | Mobile-first; usable on low-end Android phones over slow connections                                       |
| NFR-3 | Processing feedback within 1s; typical analysis under ~60s with progress state; hard timeout with recovery |
| NFR-4 | No document content in logs, error reports, analytics, or the database (verified by automated tests)       |
| NFR-5 | EU/German processing region for own infrastructure; AI provider data handling assessed before use          |
| NFR-6 | Interface reading level: plain language, ~B1 equivalent in each UI language                                |
| NFR-7 | Uptime target for MVP: best effort with monitoring; no SLA claims                                          |
| NFR-8 | Cost ceiling per analysis and global daily budget enforced server-side                                     |

## 5. Scope

**In MVP:** everything in master-spec §3 "Included".
**Out of MVP:** everything in master-spec §3 "Excluded" — notably accounts, history, payments, native apps, auto-submission, additional languages beyond English + Dari.

## 6. Explicit assumptions (to validate — see [validation-plan.md](validation-plan.md))

| ID   | Assumption                                                                                                                                                             | Risk if wrong                      | Validation                          |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------- |
| A-1  | Target users can photograph a letter with a phone and use a simple web app                                                                                             | Core flow unusable                 | User testing with community members |
| A-2  | Dari speakers in Germany prefer Dari UI over English/German                                                                                                            | Wasted v1 language effort          | Community interviews                |
| A-3  | Users trust an app enough to upload official letters if privacy is explained plainly                                                                                   | No adoption                        | Interviews + pilot observation      |
| A-4  | Multimodal LLM extraction of deadlines/actions from scanned German letters is reliable enough with conservative uncertainty handling                                   | Product unsafe → cannot launch     | AI evaluation suite (Stage 4)       |
| A-5  | Phone photos of letters (lighting, skew, folds) are of sufficient quality often enough                                                                                 | High failure rate frustrates users | Eval fixtures with realistic photos |
| A-6  | Explaining a letter's explicit content, with disclaimers and without individual legal assessment, can be structured to reduce RDG (German Legal Services Act) exposure | Service model must change          | Legal review — top question         |
| A-7  | An AI provider exists whose contractual terms permit processing sensitive documents without retention/training, from the EU                                            | Provider choice blocked            | Provider assessment (Stage 4)       |
| A-8  | Users accept ~30–60s processing time                                                                                                                                   | Abandonment                        | Pilot metrics                       |
| A-9  | Community organizations will help recruit testers and refer users                                                                                                      | Validation plan stalls             | Direct outreach (Stage 0/ongoing)   |
| A-10 | No-account, no-history model is a feature (trust), not a frustration                                                                                                   | Retention suffers later            | Pilot feedback; revisit post-MVP    |

## 7. Open product decisions

- Final product name and domain (working name: "Welcome Germany").
- Whether masking (FR-17) ships in MVP v1 or immediately after (decide in Stage 3 based on complexity).
- Whether Dari locale tag is `prs` or `fa-AF` in the i18n library (decide in Stage 2; must render identically).
- Hosting/legal entity and Impressum details (founder to provide before launch).
