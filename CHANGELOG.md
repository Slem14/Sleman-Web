# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); versions follow the staged delivery plan until first release.

## [Unreleased]

### Stage 2 — Design system, i18n, and static journey (2026-07-29)

- `packages/ui`: design tokens (deep-teal/warm-paper, automatic dark mode, WCAG-AA-checked
  pairs, reduced-motion support) + components (Button, Card, Alert, Steps, LanguageCard, Badge)
  with component tests.
- `packages/i18n`: typed English + Dari (`prs`) catalogs — TypeScript enforces catalog parity;
  tests guard key structure, empty strings, and encoding. Dari copy marked pending native review.
- Web app: language-first flow (`/` selection → `/en` | `/prs`), full server-rendered RTL for
  Dari, home page with steps/privacy promise/high-risk notice, legal draft pages (privacy,
  terms, AI transparency, Impressum placeholder), skip link, focus states, self-hosted fonts
  (Inter, Space Grotesk, Vazirmatn), Tailwind v4.
- Lint: @next/eslint-plugin-next + jsx-a11y (errors, not warnings).
- E2E: Playwright (desktop + mobile) with axe-core WCAG 2.2 AA scans — 20 tests.
- ADR 0007 (locale codes, i18n mechanism, fonts, design-system placement).

### Stage 1 — Architecture and repository foundation (2026-07-29)

- Monorepo scaffold: pnpm workspaces + Turborepo.
- Shared strict TypeScript configs (`@wg/typescript-config`) and ESLint flat config (`@wg/eslint-config`).
- `apps/api`: Fastify shell with `/health` and `/ready`, validated env config, log redaction baseline, graceful shutdown, Vitest tests.
- `apps/web`: minimal Next.js App Router shell (placeholder page, noindex).
- CI skeleton (GitHub Actions): format, lint, typecheck, test, build.
- Commit convention (Conventional Commits) with husky + commitlint + lint-staged.
- ADRs 0001–0006, trust-boundary & data-flow document, local development guide.
- Governance docs: CONTRIBUTING, SECURITY, CODE_OF_CONDUCT.

### Stage 0 — Discovery and risk definition (2026-07-29)

- Master specification with staged delivery plan (docs/product/master-spec.md).
- Requirements, personas, user journey, high-risk document policy, risk register,
  data classification, legal review questions, differentiation, metrics, validation plan.
