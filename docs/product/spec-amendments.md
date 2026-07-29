# Amendments to the Master Specification

Changes discovered during implementation that supersede parts of [master-spec.md](master-spec.md). The master spec stays as written; this file records where reality diverged and why.

---

## 1. "Low temperature for extraction" is model-dependent (supersedes §17)

**Master spec says:** "Use low-temperature or equivalent settings for extraction."

**Reality (2026-07-29):** Current Anthropic models have removed sampling parameters entirely — sending `temperature`, `top_p`, or `top_k` to Opus 4.7+, Sonnet 5, or Fable 5 returns a 400 error. Older models including Haiku 4.5 still accept them.

**Amendment:** The intent — deterministic, non-creative extraction — stands. The mechanism is per-model and lives in the provider adapter:

- Models that accept sampling parameters: `temperature: 0`.
- Models that do not: determinism comes from the locked prompt, structured output constraints, and the `effort` parameter.

Never send both; sending `effort` to a model that rejects it also 400s. The adapter owns this mapping (`apps/api/src/providers/anthropic/model-profiles.ts`).

---

## 2. Schema conformance is enforced by the API, not just validated afterwards (strengthens §5)

**Master spec says:** the output must be "runtime validated" and "fail safely if invalid".

**Reality:** The provider supports _structured outputs_ — the request carries our JSON Schema and the response is constrained to conform.

**Amendment:** Both layers apply, in this order:

1. **Constrain** — the schema is sent with the request, so malformed shapes are prevented rather than caught.
2. **Validate** — the response still passes through `parseDocumentAnalysis()` before anything is rendered.

Layer 2 is not redundant: JSON Schema cannot express our cross-field safety invariants (risk flags imply human review; `deadline_detected` implies a listed deadline), and a provider bug must never reach a user. The rule stands: **no analysis is rendered that has not passed our own validator.**

---

## 3. Refusals are a normal outcome, not an error (adds to §8)

**Reality:** The provider's safety classifiers can decline a request, returning HTTP 200 with `stop_reason: "refusal"` and an empty or partial response body.

**Amendment:** The adapter treats a refusal as a typed provider failure (`ProviderError("refused")`), which the API maps to a user-facing message explaining that this document could not be analysed automatically and suggesting qualified human help. It is never rendered as a crash, and never as a partial analysis.

This matters for our users specifically: letters about criminal or police matters — exactly our HR-02 and HR-03 categories — are the most likely to be declined. The failure path must therefore be _kind and useful_, not a dead end.

---

## 4. Model choice is configuration and subject to evidence (clarifies §8)

**Amendment:** `ANALYSIS_MODEL` is an environment variable, and the evaluation harness compares tiers on identical fixtures. The safety gates in [metrics.md](metrics.md) decide what may ship; cost decides only among models that pass them.
