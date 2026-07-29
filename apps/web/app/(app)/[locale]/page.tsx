import { getMessages, isLocale } from "@wg/i18n";
import { Alert, Button, Card, Steps } from "@wg/ui";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="pt-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight text-balance">
          {m.home.heroTitle}
        </h1>
        <p className="mt-4 text-lg text-ink-muted leading-relaxed max-w-prose">{m.home.heroLead}</p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center">
          {/* Upload arrives in Stage 3 — honest disabled state, no fake door. */}
          <Button size="lg" disabled aria-describedby="upload-coming-soon">
            {m.home.uploadCta}
          </Button>
          <p id="upload-coming-soon" className="text-sm text-ink-muted max-w-xs">
            {m.home.uploadComingSoon}
          </p>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="steps-title">
        <h2 id="steps-title" className="text-xl font-bold text-ink mb-5">
          {m.home.stepsTitle}
        </h2>
        <Steps steps={m.home.steps} />
      </section>

      {/* Privacy promise */}
      <section aria-labelledby="privacy-title">
        <Card>
          <h2 id="privacy-title" className="text-xl font-bold text-ink">
            {m.home.privacyTitle}
          </h2>
          <ul className="mt-4 space-y-3">
            {m.home.privacyPoints.map((point) => (
              <li key={point} className="flex gap-3 items-start text-ink-muted leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 rounded-full bg-primary shrink-0"
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5">
            <Link
              href={`/${locale}/privacy`}
              className="font-medium text-primary hover:text-primary-strong underline underline-offset-4"
            >
              {m.home.privacyMore}
            </Link>
          </p>
        </Card>
      </section>

      {/* High-risk honesty */}
      <section>
        <Alert tone="warning" title={m.home.seriousTitle}>
          {m.home.seriousText}
        </Alert>
      </section>
    </div>
  );
}
