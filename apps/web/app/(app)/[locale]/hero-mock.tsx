import type { Messages } from "@wg/i18n";

/**
 * The "wow" element: a miniature of the product itself. A German letter
 * (always LTR, lang=de — a live demonstration of bidi isolation inside RTL
 * layouts) turning into a structured explanation card in the UI language.
 * Pure CSS/SVG, decorative float, no client JS.
 */
export function HeroMock({ m }: { m: Messages["home"]["mock"] }) {
  return (
    <div aria-hidden="true" className="select-none float-slow">
      {/* Letter */}
      <div className="relative mx-auto max-w-sm">
        <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
          {m.letterLabel}
        </p>
        <div
          lang="de"
          dir="ltr"
          className="rounded-lg border border-line bg-surface p-5 shadow-card-lg rotate-[-1.5deg]"
        >
          <div className="h-2 w-24 rounded-full bg-raised" />
          <div className="mt-2 h-2 w-36 rounded-full bg-raised" />
          <p className="mt-4 font-mono text-[0.7rem] leading-relaxed text-ink-muted">
            Sehr geehrte Damen und Herren, …
          </p>
          <p className="mt-2 font-mono text-[0.7rem] leading-relaxed text-ink">
            Bitte reichen Sie die Unterlagen{" "}
            <mark className="bg-warn-bg text-warn-ink rounded-xs px-1 font-semibold">
              bis zum 15. August 2026
            </mark>{" "}
            ein.
          </p>
          <div className="mt-4 h-2 w-32 rounded-full bg-raised" />
          <div className="mt-2 h-2 w-20 rounded-full bg-raised" />
        </div>

        {/* Connector */}
        <div className="my-3 flex justify-center">
          <svg viewBox="0 0 24 24" className="size-6 text-primary" fill="currentColor">
            <path d="M12 4a1 1 0 0 1 1 1v11.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-5 5a1 1 0 0 1-1.4 0l-5-5a1 1 0 1 1 1.4-1.4l3.3 3.3V5a1 1 0 0 1 1-1Z" />
          </svg>
        </div>

        {/* Explanation */}
        <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted">
          {m.resultLabel}
        </p>
        <div className="rounded-lg border border-line bg-surface p-5 shadow-glow rotate-[1deg]">
          <dl className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted pt-0.5">
                {m.sender}
              </dt>
              <dd dir="ltr" className="font-semibold text-ink text-end">
                {m.senderValue}
              </dd>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-md bg-primary-soft p-2.5 -mx-2.5">
              <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-primary-soft-ink pt-0.5">
                {m.deadline}
              </dt>
              <dd className="font-bold text-primary-soft-ink text-end">{m.deadlineValue}</dd>
            </div>
            <div className="flex items-start justify-between gap-3">
              <dt className="font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted pt-0.5">
                {m.action}
              </dt>
              <dd className="font-semibold text-ink text-end">{m.actionValue}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
