# ADR 0005 — Hosting direction: containerized on Google Cloud Run (EU region), decided finally in Stage 7

**Status:** provisional (2026-07-29) — revisit before Stage 7 provisioning

## Context

Requirements: EU/German processing region, stateless containers, scale-to-zero economics for a free MVP, secret manager, budget alerts, Terraform support. The master spec prefers Cloud Run "subject to verification".

## Direction (not yet binding)

- Both apps build as OCI containers → portable to any container host (the real hedge).
- Primary candidate: **Cloud Run in `europe-west3` (Frankfurt)** — scale-to-zero, per-request pricing, mature Terraform, Secret Manager, EU region selectable.
- Alternatives kept live until Stage 7: Hetzner (German provider, cheap, more ops burden), Scaleway/OVH (EU-sovereign), Fly.io (fra region).
- Known caveat to verify in Stage 7: US CLOUD Act exposure of any US hyperscaler and whether Cloud Run's operations (build, logging, support flows) can be confined to EU — feeds the international-transfer assessment (legal question A3). If legal review rejects US hyperscalers, the container strategy makes Hetzner/Scaleway the fallback with bounded rework (mainly Terraform + secret wiring).

## Stage 1 consequences

- Nothing provisioned now. No cloud accounts needed until Stage 7.
- Apps stay 12-factor: config via env, stateless, graceful shutdown (already implemented in the API shell).
- `.env.example` documents config names; secrets never in repo.
