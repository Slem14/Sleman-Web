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
  return isLocale(locale) ? { title: getMessages(locale).aiPage.title } : {};
}

export default async function AiTransparencyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale).aiPage;

  return (
    <LegalArticle title={m.title} intro={m.intro}>
      <ul className="space-y-4">
        {m.points.map((point) => (
          <li key={point} className="flex gap-3 items-start text-ink-muted leading-relaxed">
            <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </LegalArticle>
  );
}
