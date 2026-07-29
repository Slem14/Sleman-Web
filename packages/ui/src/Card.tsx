import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** "raised" adds subtle elevation; default sits flat on the canvas. */
  tone?: "flat" | "raised";
}

export function Card({ tone = "flat", className, ...rest }: CardProps) {
  const elevation = tone === "raised" ? "shadow-card" : "";
  return (
    <div
      {...rest}
      className={`bg-surface border border-line rounded-lg p-6 ${elevation} ${className ?? ""}`}
    />
  );
}
