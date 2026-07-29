import type { ReactNode } from "react";

export type AlertTone = "info" | "success" | "warning" | "danger";

/**
 * Risk is never signaled by color alone (master-spec §4): every alert has an
 * icon shape AND a visible title. Icons differ in geometry, not only hue.
 */
const ICONS: Record<AlertTone, ReactNode> = {
  info: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm0-11.5A1.25 1.25 0 1 0 10 4a1.25 1.25 0 0 0 0 2.5ZM9 9a1 1 0 0 1 2 0v5a1 1 0 1 1-2 0V9Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-10.11a.9.9 0 1 0-1.32-1.22l-3.65 3.94-1.5-1.5a.9.9 0 0 0-1.27 1.27l2.16 2.17a.9.9 0 0 0 1.3-.03l4.28-4.63Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M8.45 2.9c.68-1.2 2.42-1.2 3.1 0l6.28 11.1c.67 1.19-.19 2.66-1.55 2.66H3.72c-1.36 0-2.22-1.47-1.55-2.66L8.45 2.9ZM10 7a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1Zm1.25 7.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-5 shrink-0" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM7.28 7.28a.9.9 0 0 1 1.27 0L10 8.73l1.45-1.45a.9.9 0 1 1 1.27 1.27L11.27 10l1.45 1.45a.9.9 0 1 1-1.27 1.27L10 11.27l-1.45 1.45a.9.9 0 1 1-1.27-1.27L8.73 10 7.28 8.55a.9.9 0 0 1 0-1.27Z"
        clipRule="evenodd"
      />
    </svg>
  ),
};

const TONES: Record<AlertTone, string> = {
  info: "bg-info-bg text-info-ink border-info-line",
  success: "bg-success-bg text-success-ink border-success-line",
  warning: "bg-warn-bg text-warn-ink border-warn-line",
  danger: "bg-danger-bg text-danger-ink border-danger-line",
};

export interface AlertProps {
  tone: AlertTone;
  title: string;
  children?: ReactNode;
  /** Set for dynamically appearing alerts so screen readers announce them. */
  live?: boolean;
}

export function Alert({ tone, title, children, live = false }: AlertProps) {
  return (
    <div
      role={live ? (tone === "danger" || tone === "warning" ? "alert" : "status") : undefined}
      className={`border rounded-md p-4 flex gap-3 items-start ${TONES[tone]}`}
    >
      {ICONS[tone]}
      <div className="min-w-0">
        <p className="font-semibold leading-snug">{title}</p>
        {children ? <div className="mt-1 text-[0.95em] leading-relaxed">{children}</div> : null}
      </div>
    </div>
  );
}
