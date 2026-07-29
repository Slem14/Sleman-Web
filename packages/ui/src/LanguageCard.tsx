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
  className,
  ...rest
}: LanguageCardProps) {
  return (
    <a
      {...rest}
      className={
        "group bg-surface border border-line rounded-lg p-6 flex items-center justify-between gap-4 " +
        "shadow-card hover:border-primary hover:shadow-card-lg transition-all " +
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
        "min-h-[5.5rem] " +
        (className ?? "")
      }
    >
      <span className="min-w-0">
        <span
          lang={langTag}
          dir={nativeDir}
          className="block text-2xl font-bold text-ink leading-tight"
        >
          {nativeName}
        </span>
        <span className="block mt-1 text-sm text-ink-muted font-mono uppercase tracking-wide">
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
