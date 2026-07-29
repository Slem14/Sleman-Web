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
