import { getMessages, isLocale } from "@wg/i18n";
import { Alert } from "@wg/ui";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UploadFlow } from "./upload-flow";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return isLocale(locale) ? { title: getMessages(locale).upload.title } : {};
}

/**
 * The upload page. Server component: it resolves the locale and hands the
 * already-translated strings to the client island, so no message catalog
 * shipping or locale logic happens in the browser.
 *
 * The analysis API lives on a separate origin (trust boundary TB-1). When
 * NEXT_PUBLIC_API_BASE_URL is not configured at build time — as on the
 * current static preview deployment — the page says so honestly instead of
 * presenting an upload control that cannot work.
 */
export default async function UploadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const m = getMessages(locale).upload;

  // In local development the API runs alongside `pnpm dev`, so the flow works
  // out of the box. Deployed builds must configure the URL explicitly —
  // there is no implicit production fallback.
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    (process.env.NODE_ENV === "development" ? "http://127.0.0.1:3001" : "");

  // Set at build time while the analysis runs on a free provider tier, whose
  // terms do not guarantee the no-training promise the privacy notice makes.
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true";

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold text-ink leading-tight">{m.title}</h1>
      <p className="mt-4 text-lg text-ink-muted leading-relaxed">{m.lead}</p>

      <div className="mt-10 space-y-6">
        {apiBaseUrl === "" ? (
          <Alert tone="info" title={m.unavailableTitle}>
            {m.unavailableText}
          </Alert>
        ) : (
          <>
            {/* Set NEXT_PUBLIC_TEST_MODE=true to warn users that the current
                provider tier does not guarantee the privacy notice's
                no-training promise. */}
            {isTestMode ? (
              <Alert tone="warning" title={m.testModeTitle}>
                {m.testModeText}
              </Alert>
            ) : null}
            <UploadFlow apiBaseUrl={apiBaseUrl} locale={locale} m={m} />
          </>
        )}
      </div>
    </div>
  );
}
