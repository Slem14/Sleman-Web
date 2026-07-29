# ADR 0004 — AI provider abstraction (no provider chosen yet)

**Status:** accepted (2026-07-29) · **Stage:** 1 (interface), Stage 4 (first real adapter)

## Context

Master-spec §8: no tight coupling to any AI provider. Provider choice is a privacy/legal decision (DPA, EU processing, no-training terms) as much as a technical one, and must survive provider exit (legal-review question C / provider exit plan).

## Decision

- `packages/types` (Stage 3) defines `DocumentAnalysisProvider`: `analyze(input: AnalysisInput): Promise<DocumentAnalysis>` plus typed error taxonomy (timeout, refused, invalid-output, budget-exceeded).
- Adapters live server-side in `apps/api/src/providers/<name>/`; selection via server config; exactly one approved provider active in production.
- **Stage 3 ships a deterministic `StubProvider`** returning fixture analyses so the entire pipeline, UI, and E2E tests work with zero AI dependency.
- Every real adapter requires the master-spec §9 provider checklist completed (draft-for-review) _before_ first real document — enforced as a PR checklist item.
- Fallback providers disabled by default; enabling one requires its own completed checklist + ADR amendment.
- Prompt text is versioned data (`promptVersion` recorded in C2 logs), not inline strings.

## Consequences

- Stages 2–3 proceed with no AI account, no cost, no privacy exposure.
- Provider comparison (candidates: Anthropic, Google Vertex AI, Mistral, EU-hosted options) happens in Stage 4 with the checklist as the scoring rubric — deliberately deferred until the pipeline exists to test against.
- Cost: one indirection layer; trivial next to the exit-flexibility and testability gains.
