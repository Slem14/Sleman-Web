import { LOCALES, getMessages, isLocale } from "@wg/i18n";
import { Card } from "@wg/ui";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GUIDE_LOCALES, guidesFor } from "../../../guides/guide-data";
import { SITE_URL } from "../../../site";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDE_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const canonical = `${SITE_URL}/${locale}/guides/`;
  const m = getMessages(locale);
  const title = m.guidesPage.title;
  const description = m.guidesPage.lead;
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}/guides/`])),
    },
    openGraph: { type: "website", url: canonical, title, description },
  };
}

export default async function GuidesIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">
        {m.guidesPage.title}
      </h1>
      <p className="mt-4 text-lg text-ink-muted leading-relaxed">{m.guidesPage.lead}</p>

      <ul className="mt-10 space-y-4">
        {guidesFor(locale).map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/${locale}/guides/${guide.slug}/`}
              className="block focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus rounded-xl"
            >
              <Card>
                {/* German title first: it is what the reader is looking for,
                    because it is the word printed on their letter. */}
                <p dir="ltr" lang="de" className="font-semibold text-ink">
                  {guide.germanTitle}
                </p>
                <p className="mt-1 text-sm text-ink-muted leading-relaxed">{guide.summary}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
