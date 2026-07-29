import { getMessages, isLocale } from "@wg/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle, LegalSection } from "../legal-article";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).termsPage.title } : {};
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale).termsPage;

  return (
    <LegalArticle title={m.title} draftBadge={m.draftBadge}>
      {m.sections.map((s) => (
        <LegalSection key={s.heading} heading={s.heading} body={s.body} />
      ))}
    </LegalArticle>
  );
}
