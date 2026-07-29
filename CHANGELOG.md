# Changelog

All notable changes to this project are documented here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/); versions follow the staged delivery plan until first release.

## [Unreleased]

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
