# ADR 0008 — First real analysis provider: Anthropic API

**Status:** accepted (2026-07-29) · **Stage:** 4

## Decision

The first production `DocumentAnalysisProvider` implementation targets the **Anthropic API** (platform.claude.com), with the model as a runtime configuration value. Default model: `claude-haiku-4-5` (founder's choice — lowest cost per analysis), subject to the safety gates below.

## Why this provider

- **Native structured outputs.** The API can be given our `DocumentAnalysis` JSON Schema and constrained to produce conforming output, rather than asked politely to return JSON. This turns "the model returned something unparseable" from a likely failure into an API-level guarantee — a genuine safety upgrade over what master-spec §5 assumed.
- **Document understanding.** PDFs are accepted as first-class `document` blocks (no OCR step of our own); images as `image` blocks. Fewer moving parts between the user's photo and the analysis means fewer places to lose or corrupt content.
- **Published no-training position for API traffic**, which is the precondition our privacy notice already promises users. **This must still be verified in writing** as part of the §9 provider checklist before a single real letter is sent — see `docs/privacy/provider-assessment-anthropic.md`.

## Why the model is configuration, not code

`ANALYSIS_MODEL` is an environment variable. Switching tiers — or providers — must never require a code change, because the model choice is a live cost/accuracy tradeoff we expect to revisit with evidence. The evaluation harness (Stage 4) runs the same fixture set against multiple tiers and reports accuracy against cost.

## Safety gates that bind regardless of model choice

From `docs/product/metrics.md`, unchanged by this ADR:

- 100% high-risk escalation recall on the eval set — a miss blocks deployment.
- No invented deadlines or contact details, at any confidence.
- Prompt-injection fixtures must not alter behaviour.

A cheaper model that fails these does not ship, however attractive its price. The decision the founder makes is _which model to try first_, not whether the gates apply.

## Model-specific API constraints (Haiku 4.5)

Current Anthropic models differ in which request parameters they accept. The adapter centralises this in one place:

| Concern                | Haiku 4.5                                           | Newer tiers (Sonnet 5 / Opus 5)                                     |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------------- |
| `temperature`          | Accepted — we send `0` for deterministic extraction | **Rejected (400)** — determinism comes from prompt + effort instead |
| `output_config.effort` | **Rejected**                                        | Accepted (`low`…`max`)                                              |
| Extended thinking      | `{type: "enabled", budget_tokens: N}`               | `{type: "adaptive"}`                                                |
| Prompt-cache minimum   | 4096 tokens                                         | 512–1024 tokens                                                     |
| Context window         | 200K                                                | 1M                                                                  |

Consequence for master-spec §17 ("use low-temperature or equivalent settings for extraction"): that instruction is **model-dependent** and is superseded by `docs/product/spec-amendments.md` §1.

## Consequences

- One approved provider receives document content. No fan-out, no fallback provider, until each has passed its own checklist (master-spec §8).
- The stub provider remains the default in development and in every test — no test may require credentials.
- Cost per analysis becomes a measured metric rather than an estimate, feeding risk R-32 (sustainability).
