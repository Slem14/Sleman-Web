import type { AnchorHTMLAttributes } from "react";

export interface LanguageCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Language name in its own script, e.g. "دری". */
  nativeName: string;
  /** English reference name, e.g. "Dari". */
  englishName: string;
  /** Language tag for the lang attribute, e.g. "prs". */
  langTag: string;
  /** Direction of the native name. */
  nativeDir: "ltr" | "rtl";
  /** Short line rendered in the language itself (e.g. its tagline). */
  subtitle?: string | undefined;
  /** Small chip shown at the end (e.g. "last used" in that language). */
  chip?: string | undefined;
}

/**
 * Large tappable language choice (language-first UX, master-spec §6).
 * Native name is authoritative and rendered in its own script and direction.
 */
export function LanguageCard({
  nativeName,
  englishName,
  langTag,
  nativeDir,
  subtitle,
  chip,
  className,
  ...rest
}: LanguageCardProps) {
  return (
    <a
      {...rest}
      className={
        "group bg-surface border border-line rounded-xl p-7 flex items-center justify-between gap-4 " +
        "shadow-card transition-all hover:border-primary hover:shadow-glow hover:-translate-y-0.5 " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
        "min-h-[6rem] " +
        (className ?? "")
      }
    >
      <span className="min-w-0" lang={langTag} dir={nativeDir}>
        <span className="flex items-center gap-3">
          <span className="block text-3xl font-bold text-ink leading-tight">{nativeName}</span>
          {chip ? (
            <span className="inline-block rounded-sm bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary-soft-ink">
              {chip}
            </span>
          ) : null}
        </span>
        {subtitle ? (
          <span className="block mt-1.5 text-sm text-ink-muted leading-relaxed">{subtitle}</span>
        ) : null}
        <span
          dir="ltr"
          className="block mt-2 text-xs text-ink-muted font-mono uppercase tracking-widest"
        >
          {englishName}
        </span>
      </span>
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        fill="currentColor"
        className="size-5 shrink-0 text-ink-faint group-hover:text-primary transition-colors rtl:-scale-x-100"
      >
        <path
          fillRule="evenodd"
          d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.17 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
          clipRule="evenodd"
        />
      </svg>
    </a>
  );
}
