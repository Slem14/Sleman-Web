# ADR 0007 — i18n approach, locale codes, fonts, and design-system placement

**Status:** accepted (2026-07-29) · **Stage:** 2

## Locale code for Dari

**`prs`** (ISO 639-3 for Dari) over `fa-AF`: makes the Afghan variety explicit in URLs (`/prs`), storage, and logs, and prevents any library from "helpfully" falling back to generic `fa` (Iranian Farsi) resources. `NATIVE_NAMES` renders دری; English reference name is "Dari".

## i18n mechanism: typed TypeScript catalogs, no i18n library

Options: next-intl (feature-rich, needs middleware/routing integration), react-i18next (runtime-oriented, JSON keys, no compile-time safety), **custom typed catalogs (chosen)**.

Rationale: 2 locales, fully static strings, no pluralization/interpolation needs yet. The English catalog defines `Messages`; the Dari catalog must satisfy it — **a missing or extra translation is a compile error**, stronger than any library's runtime fallback. Runtime tests add key-structure parity, empty-string, and mojibake guards. Server components read catalogs directly; only the language picker is client-side. Migration path to next-intl stays open if interpolation/plurals arrive.

## Routing: route groups with two root layouts

- `app/(select)/` — root `/`: language selection, direction-neutral shell.
- `app/(app)/[locale]/` — `/en/*`, `/prs/*`: `<html lang dir>` rendered server-side, so RTL is correct on first paint (no flash, no client patch). `dynamicParams=false` → unknown locales 404. Navigation between the two root layouts is a full page load — acceptable for the rare language switch.
- Language preference: localStorage only (`wg.language`), read client-side on the selection page to highlight the previous choice. No cookies, no server knowledge.

## Fonts (self-hosted via next/font — zero third-party requests at runtime)

- **Inter** — body/UI (Latin).
- **Space Grotesk** — display headings (Latin): the "tech-forward" voice.
- **Vazirmatn** — Arabic-script coverage, designed for Persian/Dari; both body and display for `prs` via font-stack fallthrough (Latin-only fonts simply lack Arabic glyphs, so Vazirmatn takes over automatically).
- Monospace accents use the system mono stack (no download).

## Design system placement

`packages/ui` holds tokens (`tokens.css`, CSS custom properties, light + dark via `prefers-color-scheme`) and components styled with Tailwind utility classes; the web app compiles them via Tailwind v4 `@source` + `transpilePackages`. Tokens are the single theming authority; Tailwind color/radius/shadow names map onto them in `globals.css` `@theme inline`.

## Verified by

20 Playwright tests (desktop + mobile: language flows, RTL attributes, keyboard-only navigation, axe WCAG 2.2 AA scans on all pages, localStorage-only persistence, 404 for unknown locales) + 20 unit tests. The axe gate already caught one real contrast bug (ink-faint on white at 12px) before any human saw it.

## Lesson recorded

Never round-trip UTF-8 source files through PowerShell `Get-Content`/`Set-Content` (ANSI default corrupted all Dari text once during this stage; recovered by rewriting files). A mojibake-guard test now exists in the i18n package.
