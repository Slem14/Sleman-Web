"use client";

import { useEffect, useState } from "react";

export const THEME_STORAGE_KEY = "wg.theme";

/**
 * Runs before paint (inlined in <head>) so an explicit theme choice applies
 * with zero flash. Absence of a stored value = follow the system.
 * NOTE for Stage 6 CSP: this inline script must be allowed via hash/nonce.
 */
export const THEME_INIT_SCRIPT = `try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t}}catch(e){}`;

function effectiveTheme(): "light" | "dark" {
  const explicit = document.documentElement.dataset.theme;
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Physical light/dark switch (user request): sun in dark mode, moon in light.
 * Choice persists in localStorage only (C2, client-only — like language).
 */
export function ThemeToggle({
  labelToDark,
  labelToLight,
}: {
  labelToDark: string;
  labelToLight: string;
}) {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    setTheme(effectiveTheme());
  }, []);

  const toggle = () => {
    const next = (theme ?? effectiveTheme()) === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable — theme still applies for this page view.
    }
    setTheme(next);
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? labelToLight : labelToDark}
      data-testid="theme-toggle"
      className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-surface text-ink-muted transition-colors hover:border-line-strong hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {/* Both icons rendered; CSS-independent of JS state until mounted. */}
      {theme === null ? (
        <span
          aria-hidden="true"
          className="size-5 rounded-full border-2 border-current opacity-40"
        />
      ) : isDark ? (
        /* sun */
        <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor" className="size-5">
          <path d="M10 3a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0 14a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM3 10a1 1 0 0 1-1 1H1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm16-1a1 1 0 1 1 0 2h-1a1 1 0 1 1 0-2h1ZM4.3 15.7a1 1 0 0 1 1.4 0 1 1 0 0 1 0 1.4l-.7.7a1 1 0 0 1-1.4-1.4l.7-.7Zm11.4-11.4a1 1 0 0 1 0-1.4l.7-.7a1 1 0 1 1 1.4 1.4l-.7.7a1 1 0 0 1-1.4 0ZM4.3 4.3a1 1 0 0 1 0-1.4l-.7-.7A1 1 0 0 0 2.2 3.6l.7.7a1 1 0 0 0 1.4 0Zm11.4 11.4 .7.7a1 1 0 0 0 1.4-1.4l-.7-.7a1 1 0 0 0-1.4 1.4ZM10 15a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
        </svg>
      ) : (
        /* moon */
        <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor" className="size-5">
          <path d="M17.3 12.1a7.5 7.5 0 0 1-9.4-9.4.6.6 0 0 0-.8-.74 8.5 8.5 0 1 0 10.94 10.93.6.6 0 0 0-.74-.8Z" />
        </svg>
      )}
    </button>
  );
}
