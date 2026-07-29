# ADR 0002 — Frontend: Next.js (App Router) + TypeScript strict + Tailwind (Stage 2)

**Status:** accepted (2026-07-29) · **Stage:** 1

## Context

Requirements: mobile-first responsive web, first-class RTL, WCAG 2.2 AA, static legal pages, server-side privacy (no AI credentials or document routing in the browser), low-end-device performance.

## Options considered

1. **Next.js App Router (chosen):** server components by default keep sensitive logic server-side; mature i18n/RTL ecosystem; static rendering for legal pages; team/AI familiarity; deployable containerized (not tied to any host).
2. Vite + React SPA: simpler mental model, but SPA-only means worse low-end performance, and API proxying/security headers all need custom hosting glue.
3. SvelteKit/Astro: fine tools; smaller a11y/i18n ecosystem for RTL bureaucratic apps, no advantage worth the divergence from the spec's preference.

## Decision

Next.js current stable, App Router, TypeScript strict, `output` mode decided at Stage 7 (container). Tailwind CSS + accessible headless primitives arrive in Stage 2 with the design system. React Strict Mode on; `poweredByHeader` off; pre-launch `noindex`.

## Consequences

- Server components by default; client components only for interactive islands (upload, language switch).
- The web app never talks to AI providers; it talks only to `apps/api` (trust boundary, ADR 0003 / trust-boundaries.md).
- Next.js major upgrades are routine maintenance; Renovate (Stage 6) handles cadence.
