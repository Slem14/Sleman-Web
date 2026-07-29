"use client";

import type { Messages } from "@wg/i18n";
import type { DocumentAnalysis, EvidenceReference } from "@wg/validation";
import { Alert, Button, Card } from "@wg/ui";

type UploadMessages = Messages["upload"];

/**
 * Minimal result view for Stage 3 — enough to prove the whole pipeline works
 * end to end. The polished result experience (urgency treatment, high-risk
 * presentation, reply draft) arrives in Stage 5.
 *
 * Two rules already hold here and must never regress:
 *  1. Every claim can be traced to its German source text.
 *  2. Model output is rendered as TEXT only — never as HTML — so a malicious
 *     document cannot inject markup through the analysis (master-spec §10).
 */
export function AnalysisResult({
  analysis,
  m,
  onReset,
  liveMessage,
}: {
  analysis: DocumentAnalysis;
  m: UploadMessages;
  onReset: () => void;
  liveMessage: string;
}) {
  return (
    <div className="space-y-6">
      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      <h2 className="text-2xl font-bold text-ink">{m.resultTitle}</h2>

      {/* Sender and document type */}
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
        <p className="mt-5 text-ink leading-relaxed">{analysis.summary.plainLanguage}</p>
      </Card>

      {/* Deadlines: normalized date next to the untouched German wording. */}
      {analysis.deadlines.map((deadline) => (
        <Card key={deadline.rawText} tone="raised">
          <h3 className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            {m.deadlineTitle}
          </h3>
          <p className="mt-2 text-2xl font-bold text-ink">{deadline.normalizedDate ?? "—"}</p>
          <p className="mt-1 text-ink-muted">{deadline.meaning}</p>
          <Evidence evidence={deadline.evidence} label={m.originalGerman} />
        </Card>
      ))}

      {/* Requested actions */}
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

      {/* Requested documents */}
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

      {/* Next steps: document-grounded and general advice stay distinguishable. */}
      {analysis.suggestedNextSteps.length > 0 ? (
        <Card>
          <h3 className="font-semibold text-ink">{m.nextStepsTitle}</h3>
          <ul className="mt-3 space-y-3">
            {analysis.suggestedNextSteps.map((step) => (
              <li key={step.description} className="text-ink leading-relaxed">
                <span className="me-2 inline-block rounded-sm bg-raised px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-ink-muted align-middle">
                  {step.basis === "document" ? m.basisDocument : m.basisGeneral}
                </span>
                {step.description}
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {/* AI transparency is shown with the result, never buried in terms. */}
      <Alert tone="info" title={m.aiNotice} />

      <Button variant="secondary" onClick={onReset}>
        {m.startOver}
      </Button>
    </div>
  );
}

/**
 * Evidence disclosure: the German passage a claim came from.
 * `lang="de"` + `dir="ltr"` keep German readable and correctly ordered even
 * when the surrounding page is right-to-left (Dari).
 */
function Evidence({ evidence, label }: { evidence: EvidenceReference[]; label: string }) {
  if (evidence.length === 0) return null;
  return (
    <details className="mt-3 group">
      <summary className="cursor-pointer text-sm font-medium text-primary hover:text-primary-strong marker:content-['']">
        {label}
      </summary>
      <div className="mt-2 space-y-2">
        {evidence.map((item) => (
          <blockquote
            key={item.text}
            lang="de"
            dir="ltr"
            className="border-s-2 border-line-strong ps-3 font-mono text-sm text-ink-muted leading-relaxed"
          >
            {item.text}
          </blockquote>
        ))}
      </div>
    </details>
  );
}
