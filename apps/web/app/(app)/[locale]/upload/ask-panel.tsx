"use client";

import type { Locale, Messages } from "@wg/i18n";
import {
  MAX_PRIOR_EXCHANGES,
  MAX_QUESTION_LENGTH,
  parseQuestionAnswer,
  type PriorExchange,
  type QuestionAnswer,
} from "@wg/validation";
import { Alert, Button, Card } from "@wg/ui";
import { useRef, useState } from "react";
import { Evidence } from "./evidence";

type UploadMessages = Messages["upload"];

interface Exchange extends PriorExchange {
  result: QuestionAnswer;
}

/**
 * Follow-up questions about the letter the user just uploaded.
 *
 * The file stays in this component's props — held in browser memory only —
 * and is re-sent with every question. Nothing about the conversation exists
 * on the server between requests, which is what lets the "we keep nothing"
 * promise survive a feature that looks like a chat.
 */
export function AskPanel({
  apiBaseUrl,
  locale,
  file,
  m,
}: {
  apiBaseUrl: string;
  locale: Locale;
  file: File;
  m: UploadMessages;
}) {
  const [question, setQuestion] = useState("");
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const answersEndRef = useRef<HTMLDivElement>(null);

  const atLimit = exchanges.length >= MAX_PRIOR_EXCHANGES;

  const ask = async () => {
    const trimmed = question.trim();
    if (trimmed === "") {
      setError(m.askEmptyHint);
      return;
    }

    setBusy(true);
    setError(null);

    const body = new FormData();
    body.append("language", locale);
    body.append("question", trimmed);
    // Only the text of earlier turns travels — never the earlier evidence,
    // which the model can re-read from the document itself.
    body.append(
      "history",
      JSON.stringify(exchanges.map((e) => ({ question: e.question, answer: e.answer }))),
    );
    body.append("file", file, file.name);

    try {
      const response = await fetch(`${apiBaseUrl}/v1/questions`, { method: "POST", body });

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null);
        const code =
          typeof payload === "object" && payload !== null && "error" in payload
            ? (payload as { error?: { code?: string } }).error?.code
            : undefined;
        setError(
          code !== undefined && code in m.errors
            ? m.errors[code as keyof UploadMessages["errors"]]
            : m.errors.INTERNAL_ERROR,
        );
        return;
      }

      // The answer is untrusted until it passes the shared schema, exactly
      // like the analysis — a follow-up gets no trust discount.
      const validated = parseQuestionAnswer(await response.json());
      if (validated === null) {
        setError(m.errors.PROVIDER_ERROR);
        return;
      }

      setExchanges((prev) => [
        ...prev,
        { question: trimmed, answer: validated.answer, result: validated },
      ]);
      setQuestion("");
      // Let the new answer render before scrolling to it.
      window.setTimeout(() => answersEndRef.current?.scrollIntoView({ block: "nearest" }), 0);
    } catch {
      setError(m.errors.NETWORK);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-ink">{m.askTitle}</h3>
      <p className="mt-1 text-sm text-ink-muted leading-relaxed">{m.askLead}</p>

      {exchanges.length > 0 ? (
        <ol className="mt-6 space-y-6">
          {exchanges.map((exchange, index) => (
            <li key={`${index}-${exchange.question}`} className="border-s-2 border-line ps-4">
              <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {m.askYourQuestion}
              </p>
              <p className="mt-1 font-medium text-ink">{exchange.question}</p>

              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-ink-muted">
                {m.askAnswerLabel}
              </p>
              {/* Two honest states get their own visible label rather than
                  being hidden inside prose the reader might skim past. */}
              {exchange.result.outOfScope ? (
                <p className="mt-1 inline-block rounded-sm bg-warn-bg px-2 py-0.5 text-xs font-semibold text-warn-ink">
                  {m.askOutOfScope}
                </p>
              ) : !exchange.result.answeredFromDocument ? (
                <p className="mt-1 inline-block rounded-sm bg-raised px-2 py-0.5 text-xs font-semibold text-ink-muted">
                  {m.askNotInLetter}
                </p>
              ) : null}
              <p className="mt-1 text-ink leading-relaxed whitespace-pre-line">
                {exchange.result.answer}
              </p>
              <Evidence evidence={exchange.result.evidence} label={m.originalGerman} />
            </li>
          ))}
        </ol>
      ) : null}
      <div ref={answersEndRef} />

      {error !== null ? (
        <div className="mt-4">
          <Alert tone="danger" title={m.errorTitle} live>
            {error}
          </Alert>
        </div>
      ) : null}

      {!atLimit ? (
        <div className="mt-6">
          <label htmlFor="follow-up" className="sr-only">
            {m.askTitle}
          </label>
          <textarea
            id="follow-up"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends, Shift+Enter makes a new line — the convention
              // people already know from messaging apps.
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void ask();
              }
            }}
            maxLength={MAX_QUESTION_LENGTH}
            rows={2}
            disabled={busy}
            placeholder={m.askPlaceholder}
            className="w-full rounded-md border border-line bg-surface p-3 text-ink placeholder:text-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus disabled:opacity-50"
          />
          <div className="mt-3 flex items-center gap-3">
            <Button onClick={() => void ask()} disabled={busy}>
              {busy ? m.askThinking : m.askButton}
            </Button>
            <p aria-live="polite" className="text-sm text-ink-muted">
              {busy ? m.askThinking : ""}
            </p>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
