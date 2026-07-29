"use client";

import type { EvidenceReference } from "@wg/validation";

/**
 * Evidence disclosure: the German passage a claim came from.
 *
 * `lang="de"` + `dir="ltr"` keep German readable and correctly ordered even
 * when the surrounding page is right-to-left (Dari). This is the single most
 * important piece of bidirectional handling in the product — it is what lets
 * a Dari reader show the original German to a German speaker.
 */
export function Evidence({
  evidence,
  label,
}: {
  evidence: readonly EvidenceReference[];
  label: string;
}) {
  if (evidence.length === 0) return null;

  return (
    <details className="mt-3 group">
      <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-strong marker:content-['']">
        {label}
      </summary>
      <div className="mt-2 space-y-2">
        {evidence.map((item) => (
          <blockquote
            key={item.text}
            lang="de"
            dir="ltr"
            className="border-s-2 border-line-strong ps-3 font-mono text-sm text-ink-muted leading-relaxed"
          >
            {item.text}
          </blockquote>
        ))}
      </div>
    </details>
  );
}
