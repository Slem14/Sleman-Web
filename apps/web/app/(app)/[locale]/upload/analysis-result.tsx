"use client";

import type { Locale, Messages } from "@wg/i18n";
import type { DocumentAnalysis } from "@wg/validation";
import { Alert, Button, Card } from "@wg/ui";
import { AskPanel } from "./ask-panel";
import { Evidence } from "./evidence";

type UploadMessages = Messages["upload"];

/**
 * The result view.
 *
 * Two rules hold throughout and must never regress:
 *  1. Every claim can be traced to its German source text.
 *  2. Model output renders as TEXT only — never as HTML — so a malicious
 *     document cannot inject markup through the analysis (master-spec §10).
 *
 * Everything the analysis found is shown. A section the letter did not
 * support simply does not appear; nothing is summarised away.
 */
export function AnalysisResult({
  analysis,
  m,
  locale,
  apiBaseUrl,
  files,
  onReset,
  liveMessage,
}: {
  analysis: DocumentAnalysis;
  m: UploadMessages;
  locale: Locale;
  apiBaseUrl: string;
  files: File[];
  onReset: () => void;
  liveMessage: string;
}) {
  return (
    <div className="space-y-6">
      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      {/* Serious letters lead with the escalation, before anything the reader
          might mistake for reassurance. */}
      {analysis.requiresHumanReview ? (
        <Alert tone="warning" title={m.seriousTitle}>
          <p>{analysis.humanReviewReason ?? m.seriousLead}</p>
          <p className="mt-2">{m.seriousLead}</p>
        </Alert>
      ) : null}

      <h2 className="text-2xl font-bold text-ink">{m.resultTitle}</h2>

      <Card>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">{m.from}</dt>
            {/* German authority names stay LTR inside RTL layouts. */}
            <dd dir="ltr" className="mt-1 font-semibold text-ink">
              {analysis.sender.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              {m.documentType}
            </dt>
            <dd className="mt-1 font-semibold text-ink">{analysis.documentType.label}</dd>
          </div>
        </dl>
        {/* whitespace-pre-line: the summary is now multi-paragraph, and the
            paragraph breaks the model writes are meaningful structure. */}
        <p className="mt-5 text-ink leading-relaxed whitespace-pre-line">
          {analysis.summary.plainLanguage}
        </p>
        <Evidence evidence={analysis.summary.evidence} label={m.originalGerman} />
      </Card>

      {analysis.deadlines.map((deadline) => (
        <Card key={deadline.rawText} tone="raised">
          <h3 className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            {m.deadlineTitle}
          </h3>
          <p className="mt-2 text-2xl font-bold text-ink">{deadline.normalizedDate ?? "—"}</p>
          <p className="mt-1 text-ink-muted">{deadline.meaning}</p>
          {/* The German wording is shown even when a date could not be
              normalised — it is the authoritative version either way. */}
          <p dir="ltr" lang="de" className="mt-2 font-mono text-sm text-ink-muted">
            {deadline.rawText}
          </p>
          <Evidence evidence={deadline.evidence} label={m.originalGerman} />
        </Card>
      ))}

      {analysis.requestedActions.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-ink">{m.actionsTitle}</h3>
          <ul className="mt-3 space-y-4">
            {analysis.requestedActions.map((action) => (
              <li key={action.description}>
                <p className="text-ink leading-relaxed">{action.description}</p>
                <Evidence evidence={action.evidence} label={m.originalGerman} />
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {analysis.requestedDocuments.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-ink">{m.documentsTitle}</h3>
          <ul className="mt-3 space-y-4">
            {analysis.requestedDocuments.map((doc) => (
              <li key={doc.description}>
                <p className="text-ink leading-relaxed">{doc.description}</p>
                <Evidence evidence={doc.evidence} label={m.originalGerman} />
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {analysis.consequences.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-ink">{m.consequencesTitle}</h3>
          <ul className="mt-3 space-y-4">
            {analysis.consequences.map((consequence) => (
              <li key={consequence.description}>
                <p className="text-ink leading-relaxed">{consequence.description}</p>
                <Evidence evidence={consequence.evidence} label={m.originalGerman} />
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {analysis.contactDetails.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-ink">{m.contactTitle}</h3>
          <ul className="mt-3 space-y-3">
            {analysis.contactDetails.map((contact) => (
              // Contact values are copied from the letter and verified against
              // its evidence server-side; LTR so numbers read correctly.
              <li key={contact.value} dir="ltr" className="font-mono text-sm text-ink break-all">
                {contact.value}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {analysis.suggestedNextSteps.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-ink">{m.nextStepsTitle}</h3>
          <ul className="mt-3 space-y-3">
            {analysis.suggestedNextSteps.map((step) => (
              <li key={step.description} className="text-ink leading-relaxed">
                {/* Which advice comes from the authority and which from us is
                    never blurred — the reader needs to know the difference. */}
                <span className="me-2 inline-block rounded-sm bg-raised px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted align-middle">
                  {step.basis === "document" ? m.basisDocument : m.basisGeneral}
                </span>
                {step.description}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {analysis.limitations.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-ink">{m.limitationsTitle}</h3>
          <ul className="mt-3 space-y-2">
            {analysis.limitations.map((limitation) => (
              <li
                key={limitation}
                className="flex gap-3 items-start text-ink-muted leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 rounded-full bg-line-strong shrink-0"
                />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* Follow-up questions need the original file, which lives only in
          browser memory — hence the null guard rather than a fetch. */}
      {files.length > 0 ? (
        <AskPanel apiBaseUrl={apiBaseUrl} locale={locale} files={files} m={m} />
      ) : null}

      {/* AI transparency travels with the result, never buried in terms. */}
      <Alert tone="info" title={m.aiNotice} />

      <Button variant="secondary" onClick={onReset}>
        {m.startOver}
      </Button>
    </div>
  );
}
