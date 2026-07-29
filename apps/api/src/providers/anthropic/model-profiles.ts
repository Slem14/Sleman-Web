/**
 * Per-model request-parameter differences.
 *
 * Anthropic models do not all accept the same request fields, and sending a
 * field a model has removed is a hard 400 rather than a silent no-op. Rather
 * than scatter `if (model.startsWith(...))` through the adapter, every
 * difference lives in this table.
 *
 * Adding a model means adding a row here and nothing else.
 * See docs/architecture/adr/0008-anthropic-provider.md for the comparison.
 */

export interface ModelProfile {
  /** Model ID sent to the API. */
  readonly id: string;
  /**
   * Sampling temperature, or null when the model rejects sampling parameters.
   * We want deterministic extraction, so this is 0 wherever it is allowed.
   */
  readonly temperature: number | null;
  /**
   * `output_config.effort`, or null when the model rejects it. Newer models
   * removed temperature and use effort as the depth control instead; sending
   * both to a model that accepts only one is a 400.
   */
  readonly effort: "low" | "medium" | "high" | null;
  /** Ceiling on output tokens. Our analyses are far smaller than any limit. */
  readonly maxOutputTokens: number;
  /**
   * Minimum prompt length that can be cached. Below this the cache silently
   * does nothing — worth knowing before assuming the system prompt is cached.
   */
  readonly promptCacheMinimumTokens: number;
}

const PROFILES: Record<string, ModelProfile> = {
  // Founder's default: lowest cost per analysis. Accepts sampling parameters
  // (so we get literal temperature 0) and rejects `effort`.
  "claude-haiku-4-5": {
    id: "claude-haiku-4-5",
    temperature: 0,
    effort: null,
    maxOutputTokens: 8000,
    promptCacheMinimumTokens: 4096,
  },
  // Mid tier. Sampling parameters removed; depth is controlled by effort.
  "claude-sonnet-5": {
    id: "claude-sonnet-5",
    temperature: null,
    effort: "medium",
    maxOutputTokens: 8000,
    promptCacheMinimumTokens: 1024,
  },
  // Highest quality tier we would consider for this workload.
  "claude-opus-5": {
    id: "claude-opus-5",
    temperature: null,
    effort: "medium",
    maxOutputTokens: 8000,
    promptCacheMinimumTokens: 512,
  },
  // Gateway alias. Some compatible gateways expose unversioned model names
  // and map them to a concrete model on their side. We cannot know which
  // generation sits behind the alias, so the conservative choice is to send
  // neither temperature nor effort — both are rejected by *some* generation,
  // and omitting them is accepted by all of them.
  "claude-sonnet": {
    id: "claude-sonnet",
    temperature: null,
    effort: null,
    maxOutputTokens: 8000,
    promptCacheMinimumTokens: 4096,
  },
};

export const SUPPORTED_MODELS = Object.keys(PROFILES);

export function isSupportedModel(model: string): boolean {
  return model in PROFILES;
}

/** Throws rather than guessing — an unknown model must fail at startup. */
export function getModelProfile(model: string): ModelProfile {
  const profile = PROFILES[model];
  if (profile === undefined) {
    throw new Error(
      `Unsupported ANALYSIS_MODEL: ${model}. Supported: ${SUPPORTED_MODELS.join(", ")}`,
    );
  }
  return profile;
}
