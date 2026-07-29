# Contributing — Welcome Germany

## Workflow

- `main` is always deployable and protected (no direct pushes once the GitHub remote exists; PRs with passing checks required).
- Short-lived feature branches: `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`.
- **Conventional Commits** enforced by commitlint: `feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`, `ci:`, `build:`.
- Every PR runs the CI pipeline (format, lint, typecheck, test, build). Red CI = no merge.
- Development follows the staged plan in [docs/product/master-spec.md §21](docs/product/master-spec.md); scope changes need a documented amendment or ADR.

## Local setup

See [docs/operations/local-development.md](docs/operations/local-development.md).

## Hard rules (privacy & safety — non-negotiable)

1. **Never commit real letters or personal data** — test fixtures are synthetic only (see docs/privacy/data-classification.md).
2. **Never log document content** — extend the redaction paths and their tests when adding request handling.
3. **No new third-party scripts, analytics, or trackers** without a documented privacy assessment.
4. **No secrets in the repo** — `.env` is gitignored; deployed secrets live in a secret manager.
5. Legal artifacts are always labeled "draft for professional review".

## Code standards

- TypeScript strict; no `any` without a written justification comment.
- Model output is untrusted: render as text, validate against schema, never `dangerouslySetInnerHTML`.
- Accessibility is part of done: keyboard operability and labels ship with the feature, not later.
