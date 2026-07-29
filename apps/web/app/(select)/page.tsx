import { UPCOMING_LANGUAGES } from "@wg/i18n";
import { ThemeToggle } from "../theme";
import { LanguagePicker } from "./language-picker";

/**
 * The first meaningful interaction: choose your language (master-spec §6).
 * Cards only — every language presents itself in itself. Upcoming languages
 * are visible but honestly disabled ("soon"), so no false doors.
 */
export default function LanguageSelectPage() {
  return (
    <div className="min-h-dvh flex flex-col p-6">
      <main className="w-full max-w-xl mx-auto flex-1 flex flex-col justify-center py-10">
        <h1 className="sr-only">Welcome Germany — Choose your language</h1>

        <p className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-ink-muted text-center">
          Welcome<span className="text-primary"> Germany</span>
        </p>
        <p aria-hidden="true" className="mt-3 mb-10 text-center text-4xl select-none">
          🌐
        </p>

        <LanguagePicker />

        {/* Coming soon — visible, honest, not clickable. */}
        <ul
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3"
          aria-label="Languages coming soon"
        >
          {UPCOMING_LANGUAGES.map((lang) => (
            <li
              key={lang.english}
              className="rounded-lg border border-dashed border-line bg-surface/50 p-4 text-center"
            >
              <span lang="und" dir={lang.dir} className="block font-semibold text-ink-muted">
                {lang.native}
              </span>
              <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-widest text-ink-muted">
                {lang.english}
              </span>
              <span className="mt-2 inline-block rounded-sm bg-raised px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-ink-muted">
                soon
              </span>
            </li>
          ))}
        </ul>
      </main>

      <div className="fixed top-5 end-5">
        <ThemeToggle labelToDark="Switch to dark mode" labelToLight="Switch to light mode" />
      </div>
    </div>
  );
}
