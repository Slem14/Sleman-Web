# ADR 0006 — Database: deferred; MVP may not need one

**Status:** accepted (2026-07-29) — revisit at Stage 4/6 when a concrete need appears

## Context

Master-spec §8 permits PostgreSQL "only for data genuinely required". Stage 0's data classification leaves almost nothing to store: no documents, no users, no history. Candidate uses are configuration, verified resources, consent-text versions, aggregate metrics, abuse records.

## Analysis of candidate uses

| Candidate data                       | Actually needs Postgres?                             | MVP answer                                                                                                               |
| ------------------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| App configuration                    | No — env/config files                                | Files                                                                                                                    |
| Verified-resources directory         | No — small, human-curated, versioned                 | **JSON file in repo** (auditable via git history — a feature, not a hack)                                                |
| Privacy/consent text versions        | No — versioned with the code that renders them       | Git                                                                                                                      |
| Prompt/model version metadata        | No — logged as C2 fields                             | Logs                                                                                                                     |
| Aggregate metrics                    | Maybe later — log-derived counters suffice for pilot | Logs + log-based metrics                                                                                                 |
| Abuse-prevention records (short TTL) | Needs shared state only when >1 instance             | **In-memory per instance for MVP**; revisit with Stage 6 rate-limit design (Redis/Memorystore more likely than Postgres) |
| Async job status                     | Only if async processing becomes necessary           | Not planned for MVP                                                                                                      |

## Decision

**No database in the MVP until a concrete requirement survives this table.** The Prisma-vs-Drizzle comparison required by the master spec is explicitly deferred to the moment a database is justified; comparing ORMs for a database we may never add is waste.

## Consequences

- Fewer credentials, no PII store to breach, no migrations, lower cost — the privacy promise gets structurally easier.
- Risk: Stage 6 rate limiting across multiple Cloud Run instances needs shared state; the likely answer is a small Redis, not Postgres. Documented as an open item in the risk register (R-24 mitigation).
- If a database is introduced later, master-spec §8 field-documentation and retention rules apply from day one.
