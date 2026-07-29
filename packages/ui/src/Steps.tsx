export interface Step {
  title: string;
  text: string;
}

/**
 * Numbered, textual step list (master-spec §7: clear step indicators, no
 * information by color/graphics alone). Semantic <ol> for screen readers.
 */
export function Steps({ steps }: { steps: ReadonlyArray<Step> }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map((step, i) => (
        <li
          key={step.title}
          className="bg-surface border border-line rounded-lg p-5 flex gap-4 items-start"
        >
          <span
            aria-hidden="true"
            className="font-mono text-sm font-bold text-primary-soft-ink bg-primary-soft rounded-sm size-8 grid place-items-center shrink-0 mt-0.5"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold text-ink leading-snug">{step.title}</h3>
            <p className="mt-1 text-ink-muted leading-relaxed text-[0.95rem]">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
