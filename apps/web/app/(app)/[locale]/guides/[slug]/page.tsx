import { LOCALES, getMessages, isLocale } from "@wg/i18n";
import { Alert, ButtonLink } from "@wg/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES, findGuide } from "../../../../guides/guide-data";
import { SITE_URL } from "../../../../site";
import { LegalArticle } from "../../legal-article";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => GUIDES.map((guide) => ({ locale, slug: guide.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = findGuide(slug);
  if (!isLocale(locale) || guide === undefined) return {};

  const canonical = `${SITE_URL}/${locale}/guides/${slug}/`;
  return {
    // The German term is in the title on purpose: it is what people paste into
    // a search box, because it is the word printed on the letter in their hand.
    title: `${guide.germanTitle} — ${guide.title}`,
    description: guide.summary,
    alternates: {
      canonical,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/guides/${slug}/`])),
    },
    openGraph: { type: "article", url: canonical, title: guide.title, description: guide.summary },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const guide = findGuide(slug);
  if (guide === undefined) notFound();
  const m = getMessages(locale);

  return (
    <LegalArticle title={guide.title}>
      {/* German name stays LTR and in German even inside RTL layouts — it is
          the string the reader must match against their own letter. */}
      <p dir="ltr" lang="de" className="font-mono text-sm text-ink-muted">
        {guide.germanTitle}
      </p>
      <p className="mt-4 text-lg text-ink-muted leading-relaxed">{guide.summary}</p>

      <p className="mt-2 text-sm text-ink-muted">
        <span className="font-mono text-xs uppercase tracking-wider">{m.upload.from}:</span>{" "}
        <span dir="ltr" lang="de">
          {guide.sender}
        </span>
      </p>

      {/* Serious categories lead with the escalation, before any explanation
          the reader might mistake for reassurance — same rule as an analysis. */}
      {guide.highRisk ? (
        <div className="mt-6">
          <Alert tone="warning" title={m.upload.seriousTitle}>
            {m.upload.seriousLead}
          </Alert>
        </div>
      ) : null}

      {guide.sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-xl font-bold text-ink">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-3 text-ink leading-relaxed">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <div className="mt-10">
        <ButtonLink href={`/${locale}/upload/`} size="lg">
          {m.home.uploadCta}
        </ButtonLink>
      </div>

      <div className="mt-8">
        <Alert tone="info" title={m.upload.aiNotice} />
      </div>
    </LegalArticle>
  );
}
