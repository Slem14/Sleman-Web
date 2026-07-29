import { getMessages, isLocale } from "@wg/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalArticle } from "../legal-article";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).impressumPage.title } : {};
}

export default async function ImpressumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale).impressumPage;

  return (
    <LegalArticle title={m.title}>
      <p className="text-ink-muted leading-relaxed">{m.placeholder}</p>
    </LegalArticle>
  );
}
