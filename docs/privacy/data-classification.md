# Initial Data Classification — Welcome Germany

> Stage 0 deliverable. Draft v0.1 — draft for professional review. Defines data classes, what falls into each, and binding handling rules. Every future field/log/metric must be mapped here before it is created.

## Classes

### C3 — Sensitive user content (highest)

The uploaded document and everything derived from it.

**Items:** uploaded file bytes; extracted text/OCR output; AI prompt containing document content; full AI response; analysis result; reply draft; masked/unmasked previews; any personal data within (names, addresses, IDs, case numbers, health/asylum/financial details — frequently GDPR Art. 9 special-category).

**Rules:**

- Processed in memory; never written to persistent storage; never in the database.
- Never logged, never in error reports, never in analytics, never in test data.
- Sent only to the approved AI provider under approved terms; no training use; no fallback providers without their own approval.
- Lifetime: request duration only; disposal on every exit path (success, error, timeout, disconnect) — verified by tests.
- Client-side result state cleared on delete/reset and end of session.

### C2 — Operational metadata (pseudonymous / short-lived)

Data needed to run and protect the service, deliberately minimized.

**Items:** random request ID; timestamp; route; status; duration; file-size bucket; page-count bucket; general file category; output language; model ID; prompt version; schema version; broad error code; estimated cost; deployment version; short-retention abuse-control records (e.g., hashed/truncated IP with defined TTL — exact mechanism decided in Stage 3/6 and reviewed).

**Rules:** no C3 content ever; retention short and documented per field (target: ≤30 days operational logs, abuse records shorter); sampling where viable; access restricted to operators; documented in the retention schedule.

### C1 — Internal project data

**Items:** source code; configuration (non-secret); documentation; synthetic eval fixtures; verified-resources file; i18n catalogs; CI logs.

**Rules:** no real user documents ever enter C1 (fixtures are synthetic or lawfully licensed/redacted — provenance recorded); secrets never in C1 (they are their own category below).

### C0 — Public

**Items:** the website UI text, legal pages, published docs if open-sourced.

**Rules:** must contain no operational thresholds that aid abuse (rate limits, budget values).

### S — Secrets (handled as their own class)

**Items:** AI provider keys; cloud credentials; signing keys; DB credentials.
**Rules:** secret manager only; never in code, env-committed files, logs, or Terraform source; rotation procedure documented (Stage 6/7); separate per environment.

## Classification decisions already binding

| Data item                    | Class            | Store?                       | Log?             | Notes                                  |
| ---------------------------- | ---------------- | ---------------------------- | ---------------- | -------------------------------------- |
| Uploaded letter (any form)   | C3               | Never                        | Never            | Memory only                            |
| OCR/extracted text           | C3               | Never                        | Never            |                                        |
| Analysis JSON                | C3               | Never server-side            | Never            | Exists client-side until reset         |
| Reply draft                  | C3               | Never                        | Never            |                                        |
| Original filename            | C3-adjacent      | Never                        | Never            | Random names if temp files unavoidable |
| IP address                   | C2               | Only short-TTL abuse records | Not indefinitely | Mechanism + TTL decided Stage 3/6      |
| Language preference          | C2 (client-only) | Browser storage only         | —                | No server persistence                  |
| Request ID                   | C2               | Logs only                    | Yes              | Random, no linkage to person           |
| Model/prompt/schema versions | C2               | Yes                          | Yes              | No content                             |
| Eval fixtures                | C1               | Yes                          | n/a              | Synthetic only, provenance documented  |
| Verified resources           | C1/C0            | Yes                          | n/a              | Human-verified entries only            |

## Special-category note (for legal review)

Letters about asylum, health insurance, or Jugendamt matters reveal Art. 9 GDPR special-category data by their nature. The engineering stance: such data transits C3 processing and is never retained. Whether this processing model requires explicit consent, a DPIA, or additional safeguards is a **launch-blocking legal question** ([legal-review-questions.md](legal-review-questions.md)).
