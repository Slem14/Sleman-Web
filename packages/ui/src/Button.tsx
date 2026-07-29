import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-colors " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus " +
  "disabled:opacity-50 disabled:pointer-events-none select-none";

const VARIANTS: Record<Variant, string> = {
  primary:
    "btn-gradient bg-primary text-primary-contrast shadow-card hover:brightness-110 active:translate-y-px",
  secondary: "bg-surface text-ink border border-line-strong hover:border-ink-muted hover:bg-raised",
  ghost: "bg-transparent text-primary hover:bg-primary-soft",
};

/* Touch targets: at least 44px high on both sizes (WCAG 2.5.8, mobile-first). */
const SIZES: Record<Size, string> = {
  md: "min-h-11 px-5 text-base",
  lg: "min-h-12 px-7 text-lg",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md"): string {
  return `${BASE} ${VARIANTS[variant]} ${SIZES[size]}`;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "primary", size = "md", className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={`${buttonClasses(variant, size)} ${className ?? ""}`}
      type={rest.type ?? "button"}
    />
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
}

/** Anchor with button styling — for navigation that looks like an action. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonLinkProps) {
  return <a {...rest} className={`${buttonClasses(variant, size)} ${className ?? ""}`} />;
}
