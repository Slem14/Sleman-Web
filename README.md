# Welcome Germany

A privacy-first web application that helps people who don't read German understand German administrative letters — structured explanations (sender, deadlines, required actions, evidence) in their language, with an optional German reply draft. First languages: **English** and **Dari (دری)**. No accounts, no stored documents.

> **Project status: Stage 0 complete (discovery & risk definition) — awaiting go for Stage 1 (architecture & repository foundation).** No application code exists yet, by design. See the staged plan in [docs/product/master-spec.md §21](docs/product/master-spec.md).

## Documentation map

| Document                                                                               | Purpose                                                                               |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| [docs/product/master-spec.md](docs/product/master-spec.md)                             | **Source of truth** — full product/engineering specification and staged delivery plan |
| [docs/product/requirements.md](docs/product/requirements.md)                           | Refined requirements, scope, explicit assumptions                                     |
| [docs/product/personas-and-jobs.md](docs/product/personas-and-jobs.md)                 | Personas and jobs-to-be-done                                                          |
| [docs/product/user-journey.md](docs/product/user-journey.md)                           | End-to-end user journey incl. high-risk branch                                        |
| [docs/product/high-risk-document-policy.md](docs/product/high-risk-document-policy.md) | Categories, behavior rules, escalation, verified-resources governance                 |
| [docs/product/risk-register.md](docs/product/risk-register.md)                         | Living risk register (safety, legal, security, delivery)                              |
| [docs/product/differentiation.md](docs/product/differentiation.md)                     | Competitive landscape and differentiation hypotheses                                  |
| [docs/product/metrics.md](docs/product/metrics.md)                                     | Success and safety metrics; deploy-blocking thresholds                                |
| [docs/product/validation-plan.md](docs/product/validation-plan.md)                     | User/community validation phases and ethics rules                                     |
| [docs/privacy/data-classification.md](docs/privacy/data-classification.md)             | Data classes C0–C3 + secrets; binding handling rules                                  |
| [docs/privacy/legal-review-questions.md](docs/privacy/legal-review-questions.md)       | Questions for a qualified German lawyer (A-block is launch-blocking)                  |

## Non-negotiable principles (short form)

1. Uploaded documents are never stored, never logged, never used for training or analytics.
2. Every important claim in an analysis carries evidence from the original German text.
3. High-risk letters get _more_ caution, not more confidence — and a push toward qualified human help.
4. Documents are untrusted input (prompt-injection boundary).
5. Legal artifacts are always "draft for professional review" — never "compliant".
6. No public Dari launch without native Dari review; no public launch without legal review.

## License / contributing / security policy

Added in Stage 1 with the repository foundation.
