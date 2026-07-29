# Local Development — Welcome Germany

## Prerequisites

- Node.js ≥ 22 (developed on 24 LTS)
- pnpm 10 (`npm i -g pnpm`)
- Git

## First-time setup

```bash
pnpm install
```

That's everything. No database, no cloud account, no AI key (by design until Stage 4 — and even then the stub provider keeps keyless development working).

## Everyday commands (run from repo root)

| Command                        | What it does                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------- |
| `pnpm dev`                     | Runs web (http://localhost:3000) and api (http://127.0.0.1:3001) together via Turborepo |
| `pnpm build`                   | Builds all apps/packages                                                                |
| `pnpm test`                    | Runs all test suites (Vitest)                                                           |
| `pnpm lint`                    | ESLint across the monorepo                                                              |
| `pnpm typecheck`               | TypeScript strict checking                                                              |
| `pnpm format` / `format:check` | Prettier write / verify                                                                 |

Scoped runs: `pnpm --filter @wg/api dev`, `pnpm --filter @wg/web build`, etc.

## Trying the full flow locally

1. `pnpm dev` (starts web on :3000 and the API on :3001)
2. Open http://localhost:3000 → choose a language → "Understand my letter"
3. Upload any PDF/JPG/PNG/WebP. The **stub provider** returns a fixed, fictional
   Jobcenter analysis — no AI provider is involved, nothing costs money, and the
   result is identical every time.

The web app finds the API automatically in development. Deployed builds require
`NEXT_PUBLIC_API_BASE_URL`; when it is unset, the upload page says the service is not
switched on rather than showing a control that cannot work.

## End-to-end tests

```bash
pnpm --filter @wg/web test:e2e
```

Playwright starts both servers itself. Free ports 3000/3001 first if you already have
`pnpm dev` running.

## Verifying the API shell

```bash
pnpm --filter @wg/api dev
```

Then: http://127.0.0.1:3001/health → `{"status":"ok"}` and `/ready` → `{"status":"ready"}`.

## Environment

Copy `.env.example` to `.env` if you need non-default ports. Never commit `.env`. There are no secrets in local development at this stage.

## Git hooks

Installed automatically by `pnpm install` (husky):

- **pre-commit:** lint-staged (Prettier on staged files)
- **commit-msg:** commitlint (Conventional Commits — e.g. `feat: add upload validation`)

## Windows notes

The repo path contains spaces and parentheses — tooling in use handles this, but always quote paths in ad-hoc shell commands.
