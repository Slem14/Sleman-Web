# ADR 0003 — Backend: separate stateless Fastify service for document processing

**Status:** accepted (2026-07-29) · **Stage:** 1

## Context

Document processing is the security- and privacy-critical core: untrusted file parsing, AI provider calls, strict no-persistence guarantees. Master spec requires a clear trust boundary around it in production.

## Options considered

1. **Next.js route handlers only:** fewest moving parts; but mixes untrusted-file parsing into the UI process, couples resource limits/timeouts/scaling of processing to page serving, and makes the "no document content in web logs" guarantee murkier.
2. **Separate Fastify service (chosen):** explicit boundary — only this service touches file bytes and AI credentials; independently scalable/limitable; Fastify is lightweight, well-maintained, fast, first-class TypeScript, built-in pino logging with redaction.
3. Express: larger legacy surface, slower, redaction/limits need more assembly.
4. Hono/Elysia: attractive, but Fastify's plugin maturity (multipart, rate-limit) fits Stage 3 needs better.

## Decision

`apps/api` on Fastify 5, stateless, containerized later (Stage 7). Stage 1 ships the shell: validated env config, `/health` + `/ready`, log redaction baseline (`req.body` etc. redacted), 16 KiB default body limit, graceful shutdown.

## Consequences

- Local dev runs two processes (`pnpm dev` via Turborepo runs both).
- Browser→API CORS/origin rules land in Stage 3 with the first real route (deny-by-default per master-spec §10).
- The web app may keep trivial server actions for itself, but any byte of an uploaded document flows exclusively through `apps/api`.
