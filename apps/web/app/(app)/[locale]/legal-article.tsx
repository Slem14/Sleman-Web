import { Badge } from "@wg/ui";
import type { ReactNode } from "react";

/**
 * Shared shell for legal/informational pages: title, optional draft badge,
 * optional intro, then content. Semantic article with heading hierarchy.
 */
export function LegalArticle({
  title,
  draftBadge,
  intro,
  children,
}: {
  title: string;
  draftBadge?: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <article className="max-w-prose">
      {draftBadge ? (
        <p className="mb-4">
          <Badge tone="warning">{draftBadge}</Badge>
        </p>
      ) : null}
      <h1 className="text-3xl font-bold text-ink leading-tight">{title}</h1>
      {intro ? <p className="mt-4 text-lg text-ink-muted leading-relaxed">{intro}</p> : null}
      <div className="mt-8 space-y-8">{children}</div>
    </article>
  );
}

export function LegalSection({ heading, body }: { heading: string; body: string }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-ink">{heading}</h2>
      <p className="mt-2 text-ink-muted leading-relaxed">{body}</p>
    </section>
  );
}
