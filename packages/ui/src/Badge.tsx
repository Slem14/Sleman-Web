import type { HTMLAttributes } from "react";

export type BadgeTone = "neutral" | "warning";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-raised text-ink-muted border-line",
  warning: "bg-warn-bg text-warn-ink border-warn-line",
};

/** Small technical label — used e.g. for "Draft — pending legal review". */
export function Badge({
  tone = "neutral",
  className,
  ...rest
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      {...rest}
      className={`inline-block border rounded-sm px-2 py-1 font-mono text-xs uppercase tracking-wider ${TONES[tone]} ${className ?? ""}`}
    />
  );
}
