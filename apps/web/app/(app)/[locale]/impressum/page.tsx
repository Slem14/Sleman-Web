import { getMessages, isLocale } from "@wg/i18n";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IMPRESSUM, isImpressumComplete } from "../../../impressum-data";
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

  // Details are NOT translated: an Impressum identifies a real person at a
  // real address under German law, and the name and address must appear
  // exactly as they legally read, in every language version of the site.
  if (!isImpressumComplete()) {
    return (
      <LegalArticle title={m.title}>
        <p className="text-ink-muted leading-relaxed">{m.placeholder}</p>
      </LegalArticle>
    );
  }

  return (
    <LegalArticle title={m.title}>
      <p className="text-ink-muted leading-relaxed">{m.legalBasis}</p>

      <dl className="mt-6 space-y-5" dir="ltr">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            Diensteanbieter
          </dt>
          <dd className="mt-1 text-ink">{IMPRESSUM.name}</dd>
        </div>

        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">Anschrift</dt>
          <dd className="mt-1 text-ink">
            {IMPRESSUM.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </dd>
        </div>

        <div>
          <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">Kontakt</dt>
          <dd className="mt-1 text-ink">
            <a
              href={`mailto:${IMPRESSUM.email}`}
              className="text-primary underline underline-offset-4"
            >
              {IMPRESSUM.email}
            </a>
            <span className="block">{IMPRESSUM.phone}</span>
          </dd>
        </div>

        {IMPRESSUM.vatId ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Umsatzsteuer-ID
            </dt>
            <dd className="mt-1 text-ink">{IMPRESSUM.vatId}</dd>
          </div>
        ) : null}

        {IMPRESSUM.register ? (
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              Registereintrag
            </dt>
            <dd className="mt-1 text-ink">{IMPRESSUM.register}</dd>
          </div>
        ) : null}
      </dl>
    </LegalArticle>
  );
}
