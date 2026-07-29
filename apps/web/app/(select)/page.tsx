import { en, prs } from "@wg/i18n";
import { LanguagePicker } from "./language-picker";

/**
 * The first meaningful interaction: choose your language (master-spec §6).
 * No personal data, no consent walls — just two large, honest buttons.
 */
export default function LanguageSelectPage() {
  return (
    <main className="w-full max-w-md">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-6 text-center">
        Welcome Germany
      </p>

      <h1 className="text-2xl font-bold text-center text-ink">{en.languageSelect.title}</h1>
      <p lang="prs" dir="rtl" className="mt-1 text-2xl font-bold text-center text-ink">
        {prs.languageSelect.title}
      </p>

      <div className="mt-8">
        <LanguagePicker />
      </div>

      <p className="mt-8 text-sm text-ink-muted text-center leading-relaxed">
        {en.languageSelect.comingLater}
      </p>
      <p lang="prs" dir="rtl" className="mt-2 text-sm text-ink-muted text-center leading-relaxed">
        {prs.languageSelect.comingLater}
      </p>
    </main>
  );
}
