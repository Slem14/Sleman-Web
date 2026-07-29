# ADR 0001 — Monorepo with pnpm workspaces + Turborepo

**Status:** accepted (2026-07-29) · **Stage:** 1

## Context

The product has a web frontend, an API with a hard trust boundary, and several shared concerns (schema, i18n, config). One person + AI develops it; consistency and low ceremony matter more than org-scale tooling.

## Options considered

1. **Single Next.js app (no monorepo):** simplest start, but erases the trust boundary the master spec requires around document processing, and makes the Stage 3+ API extraction a painful migration.
2. **Two separate repos (web, api):** clean boundary, but shared schema/i18n packages become versioning overhead a solo founder will not maintain honestly.
3. **pnpm workspaces + Turborepo (chosen):** one repo, shared packages consumed by both apps at source level, task caching, standard in the ecosystem, minimal config (~30 lines).
4. Nx: more powerful, more concepts and lock-in than this project needs.

## Decision

Option 3. Layout per master-spec §8: `apps/web`, `apps/api`, `packages/*`, `infrastructure/terraform` (later), `docs/`.

## Consequences

- Shared `DocumentAnalysis` schema (Stage 3) lives once in `packages/validation`, typed end to end — the single biggest safety win of the structure.
- CI runs one pipeline; Turborepo caching keeps it fast.
- Cost: slightly more config than a bare Next app; accepted.
