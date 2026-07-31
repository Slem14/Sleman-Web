export interface LogoProps {
  /** Rendered size in pixels. The mark is drawn on a 48-unit grid. */
  size?: number;
  /** Adds the animated reading pass. Off for favicons and static contexts. */
  animated?: boolean;
  className?: string;
}

/**
 * The Welcome Deutschland mark.
 *
 * A page whose top line is still broken into fragments while the lines below
 * it have resolved into whole, readable bars — the product's whole promise in
 * one image: German that arrives as noise, leaving as something you can read.
 * Top-to-bottom is the reading direction, so the eye travels from confusion to
 * clarity without needing the metaphor explained.
 *
 * The mark is deliberately not a flag, an eagle, or a Brandenburg Gate. This is
 * a tool for people who are often anxious about the state; borrowing state
 * iconography would make it look like the letter it is trying to explain.
 *
 * `animated` sweeps a highlight down the page and resolves the fragments in
 * sequence, which reads as the app scanning the letter. Opacity only — no
 * filters, no layout properties — per the performance contract in globals.css.
 * The global prefers-reduced-motion rule freezes it into the static mark.
 */
export function Logo({ size = 32, animated = false, className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      role="img"
      aria-label="Welcome Deutschland"
      className={className}
    >
      <defs>
        <linearGradient id="wg-logo-page" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--wg-primary-strong)" />
          <stop offset="100%" stopColor="var(--wg-primary)" />
        </linearGradient>
      </defs>

      {/* The page. */}
      <rect x="8" y="5" width="32" height="38" rx="8" fill="url(#wg-logo-page)" />

      {/* The unread line: three fragments, still separate. */}
      <g fill="var(--wg-primary-contrast)" opacity="0.5">
        <rect x="15" y="15" width="6" height="3" rx="1.5" className={animated ? "wg-frag-1" : ""} />
        <rect x="23" y="15" width="4" height="3" rx="1.5" className={animated ? "wg-frag-2" : ""} />
        <rect x="29" y="15" width="4" height="3" rx="1.5" className={animated ? "wg-frag-3" : ""} />
      </g>

      {/* The understood lines: whole, and fully opaque. */}
      <g fill="var(--wg-primary-contrast)">
        <rect x="15" y="23" width="18" height="3" rx="1.5" />
        <rect x="15" y="31" width="12" height="3" rx="1.5" />
      </g>
    </svg>
  );
}
