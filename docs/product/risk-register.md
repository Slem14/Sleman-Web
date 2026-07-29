# Risk Register — Welcome Germany

> Stage 0 deliverable. Living document — reviewed at the end of every stage. Likelihood/Impact: L/M/H. Owner "F" = founder, "E" = engineering (Claude-assisted).

## Safety & product risks

| ID   | Risk                                                                          | L   | I     | Mitigation                                                                                                                                                                                      | Status                            |
| ---- | ----------------------------------------------------------------------------- | --- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| R-01 | AI misses or misstates a real deadline; user suffers legal/financial harm     | M   | **H** | Evidence-required schema; raw German text always shown beside normalized dates; confidence marking; eval suite with deadline precision/recall gates; UI instructs verifying important deadlines | Open — primary product risk       |
| R-02 | AI hallucinates content not in the letter (contacts, consequences, resources) | M   | H     | Evidence references mandatory; deterministic post-checks; unsupported-claim rate metric; resources only from verified file                                                                      | Open                              |
| R-03 | High-risk letter classified as routine; user doesn't seek help                | M   | **H** | Conservative classification, deterministic keyword layer that can only raise risk; escalation-miss blocks deploys                                                                               | Open                              |
| R-04 | Users treat output as legal advice despite disclaimers                        | H   | M     | Plain-language transparency in result UI (not buried); high-risk flow pushes to humans; wording review in native review                                                                         | Open — residual risk acknowledged |
| R-05 | Poor photo quality → wrong extraction rather than honest failure              | M   | H     | Abstention rules; "unclear" states in schema; low-quality-scan eval fixtures                                                                                                                    | Open                              |
| R-06 | Dari output is actually Iranian Farsi or mistranslated bureaucratic terms     | M   | H     | Native Dari review is launch-blocking; terminology glossary built during review; eval language-quality metric                                                                                   | Open                              |
| R-07 | Reply draft contains admissions or invented facts                             | L   | H     | Draft rules (master-spec §18); placeholders only; high-risk drafting disabled; unit tests on draft restrictions                                                                                 | Open                              |

## Legal & compliance risks

| ID   | Risk                                                                                                   | L   | I     | Mitigation                                                                                                                                                                                    | Status                          |
| ---- | ------------------------------------------------------------------------------------------------------ | --- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| R-10 | Service classified as unauthorized legal service under RDG (Rechtsdienstleistungsgesetz)               | M   | **H** | Product explains explicit document content, avoids individual legal assessment; top question for German lawyer before launch ([legal-review-questions](../privacy/legal-review-questions.md)) | Open — launch-blocking question |
| R-11 | GDPR: uploaded letters contain special-category data (health, asylum status) processed via AI provider | H   | H     | No storage; DPIA screening; provider DPA + no-training terms required; lawful-basis assessment by lawyer                                                                                      | Open — launch-blocking          |
| R-12 | International transfer if AI provider processes outside EU                                             | M   | H     | Provider assessment checklist before any real document; EU processing preferred; transfer mechanism documented otherwise                                                                      | Open                            |
| R-13 | Impressum/terms inadequate (TMG/DDG requirements)                                                      | M   | M     | Placeholder now; lawyer-reviewed before public launch; founder provides entity details                                                                                                        | Open                            |
| R-14 | EU AI Act transparency obligations for AI-generated content                                            | M   | M     | AI disclosure built into UI from Stage 2; tracked as legal question                                                                                                                           | Open                            |
| R-15 | Minors use the service                                                                                 | L   | M     | Age/minor assessment in legal review; no targeting of minors                                                                                                                                  | Open                            |

## Security risks (detail in threat model, Stage 6)

| ID   | Risk                                                  | L   | I     | Mitigation                                                                                                         | Status |
| ---- | ----------------------------------------------------- | --- | ----- | ------------------------------------------------------------------------------------------------------------------ | ------ |
| R-20 | Prompt injection inside letters manipulates analysis  | H   | M     | Trust-boundary system prompt; injection eval fixture; output schema validation; no tool/URL control from documents | Open   |
| R-21 | Malicious uploads (PDF exploits, decompression bombs) | M   | H     | Magic bytes, size/page/pixel limits, parser isolation, no persistent disk                                          | Open   |
| R-22 | Document content leaks via logs/error reports         | M   | **H** | Redaction by design; automated no-leak tests; error reporter strips bodies                                         | Open   |
| R-23 | API key leak → cost explosion / data exposure         | L   | H     | Secret manager, least privilege, budgets, kill switch                                                              | Open   |
| R-24 | Abuse/DoS drives API costs                            | M   | M     | Rate limits, budgets, concurrency caps, alerts before public testing                                               | Open   |

## Delivery & operational risks

| ID   | Risk                                                              | L   | I   | Mitigation                                                                                               | Status                    |
| ---- | ----------------------------------------------------------------- | --- | --- | -------------------------------------------------------------------------------------------------------- | ------------------------- |
| R-30 | Solo founder + AI development; bus factor and review gaps         | H   | M   | Stage gates with documented stop protocol; everything in docs; conventional repo hygiene                 | Accepted for MVP          |
| R-31 | No native Dari reviewer secured                                   | M   | H   | Recruit via community orgs early (validation plan); launch-blocking gate stands                          | **Open — founder action** |
| R-32 | Provider costs make free service unsustainable                    | M   | M   | Cost per analysis measured from Stage 4; budgets; model-tier strategy; monetization deferred but tracked | Open                      |
| R-33 | Community orgs distrust or ignore the tool                        | M   | M   | Involve orgs in validation _before_ launch; position as triage aid, not replacement                      | Open                      |
| R-34 | Scope creep breaks the privacy promise (e.g., "just add history") | M   | H   | Master spec constraints; changes require documented amendment                                            | Mitigated by process      |
| R-35 | GCP region/services don't meet expectations on EU-only processing | L   | M   | Verify during Stage 7 design; alternatives (e.g., EU-only providers) documented in exit plan             | Open                      |

## Top three risks right now

1. **R-10 (RDG)** — could reshape the product; ask the lawyer first.
2. **R-01/R-03 (deadline & high-risk misses)** — the safety core; drives the eval suite design.
3. **R-31 (no Dari reviewer yet)** — long lead time; founder outreach should start now, not at Stage 8.
