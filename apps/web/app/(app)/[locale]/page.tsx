import { getMessages, isLocale } from "@wg/i18n";
import { Alert, ButtonLink, Card, Steps } from "@wg/ui";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HeroMock } from "./hero-mock";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <div className="space-y-14">
      {/* Hero */}
      <section className="pt-6 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="rise rise-1">
          <h1 className="text-4xl sm:text-5xl font-bold text-ink leading-[1.08] text-balance">
            {m.home.heroTitle}
          </h1>
          <p className="mt-5 text-lg text-ink-muted leading-relaxed max-w-prose">
            {m.home.heroLead}
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* Leads to the upload page, which states honestly whether the
                analysis service is switched on in this deployment. */}
            <ButtonLink href={`/${locale}/upload/`} size="lg">
              {m.home.uploadCta}
            </ButtonLink>
          </div>
        </div>

        <div className="rise rise-3">
          <HeroMock m={m.home.mock} />
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
