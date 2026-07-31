import type { Guide } from "./guides/guide-data";
import { SITE_URL } from "./site";

/**
 * JSON-LD structured data.
 *
 * This is the highest-leverage thing on the site for both goals at once:
 *
 *  - Google uses it to build rich results and to understand what a page IS
 *    rather than guessing from prose.
 *  - AI assistants lean on it heavily when deciding what a page can be cited
 *    for. A page that declares "this is an FAQ answering X" gets quoted; a
 *    page of undifferentiated text usually does not.
 *
 * Everything here must be visible on the page too. Structured data that
 * describes content a human cannot see is cloaking, and Google penalises it.
 */

function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Serialised, not interpolated: the values come from our own module, but
      // </script> inside any string would still break out of the tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

/** Identifies the service itself. Emitted once, on the home page. */
export function WebSiteJsonLd({
  locale,
  name,
  description,
}: {
  locale: string;
  name: string;
  description: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name,
        description,
        url: `${SITE_URL}/${locale}/`,
        inLanguage: locale,
        isAccessibleForFree: true,
        publisher: { "@type": "Person", name: "Sleman Parwiz" },
      }}
    />
  );
}

/**
 * Describes a guide as an explainer article.
 *
 * `about` names the German letter type explicitly. That is the term someone
 * types into a search box, because it is the word printed on the letter in
 * their hand — and it is what an assistant matches against when someone asks
 * "what is a Mahnbescheid".
 */
export function GuideJsonLd({ guide, locale }: { guide: Guide; locale: string }) {
  const url = `${SITE_URL}/${locale}/guides/${guide.slug}/`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: `${guide.germanTitle} — ${guide.title}`,
        description: guide.summary,
        url,
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: locale,
        isAccessibleForFree: true,
        about: { "@type": "Thing", name: guide.germanTitle },
        author: { "@type": "Person", name: "Sleman Parwiz" },
        publisher: { "@type": "Person", name: "Sleman Parwiz" },
      }}
    />
  );
}

/**
 * FAQ markup built from the guide's own sections.
 *
 * Each section heading is already phrased as a question a reader actually
 * asks ("What this letter is", "What it usually asks you to do"), so the
 * mapping is honest rather than retrofitted — the answer text is exactly what
 * the page displays.
 */
export function GuideFaqJsonLd({ guide }: { guide: Guide }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.sections.map((section) => ({
          "@type": "Question",
          name: `${guide.germanTitle}: ${section.heading}`,
          acceptedAnswer: { "@type": "Answer", text: section.paragraphs.join(" ") },
        })),
      }}
    />
  );
}
