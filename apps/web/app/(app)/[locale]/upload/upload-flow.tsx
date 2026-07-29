"use client";

import type { Locale, Messages } from "@wg/i18n";
import {
  MAX_FILE_BYTES,
  isAllowedMimeType,
  parseDocumentAnalysis,
  type DocumentAnalysis,
} from "@wg/validation";
import { Alert, Button, Card } from "@wg/ui";
import { useRef, useState } from "react";
import { AnalysisResult } from "./analysis-result";

type UploadMessages = Messages["upload"];
type ErrorKey = keyof UploadMessages["errors"];

/**
 * Phases of the flow. Kept explicit (not booleans) so the UI can never be in
 * two states at once, and so each phase maps to one screen-reader message.
 */
type Phase = "idle" | "checking" | "uploading" | "analyzing" | "done" | "error";

export function UploadFlow({
  apiBaseUrl,
  locale,
  m,
}: {
  apiBaseUrl: string;
  locale: Locale;
  m: UploadMessages;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Return to a clean slate — this is the user-facing "delete" action.
   *
   * Because the server never held the document or the conversation, dropping
   * these references is genuinely the whole deletion: there is nowhere else
   * for a copy to be. The file input is cleared too, so the browser stops
   * holding the selection.
   */
  const reset = () => {
    setPhase("idle");
    setFile(null);
    setErrorKey(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const failWith = (key: ErrorKey) => {
    setErrorKey(key);
    setPhase("error");
  };

  const onFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = event.target.files?.[0] ?? null;
    setErrorKey(null);
    if (chosen === null) {
      setFile(null);
      return;
    }
    // Client-side pre-checks exist only for fast, friendly feedback. The API
    // repeats every check authoritatively — the browser is never trusted.
    if (chosen.size > MAX_FILE_BYTES) {
      setFile(null);
      failWith("FILE_TOO_LARGE");
      return;
    }
    if (!isAllowedMimeType(chosen.type)) {
      setFile(null);
      failWith("UNSUPPORTED_TYPE");
      return;
    }
    setFile(chosen);
    setPhase("idle");
  };

  const submit = async () => {
    if (file === null) return;
    setPhase("checking");
    setErrorKey(null);

    const body = new FormData();
    body.append("language", locale);
    body.append("file", file, file.name);

    try {
      setPhase("uploading");
      const response = await fetch(`${apiBaseUrl}/v1/analyses`, { method: "POST", body });
      setPhase("analyzing");

      if (!response.ok) {
        // The API answers with stable machine codes; we map them to the
        // user's language here. Unknown codes fall back to a generic message.
        const payload: unknown = await response.json().catch(() => null);
        const code =
          typeof payload === "object" && payload !== null && "error" in payload
            ? (payload as { error?: { code?: string } }).error?.code
            : undefined;
        failWith(code !== undefined && code in m.errors ? (code as ErrorKey) : "INTERNAL_ERROR");
        return;
      }

      // Model output is untrusted until it passes the shared schema — the
      // browser validates independently of the server (defense in depth).
      const validated = parseDocumentAnalysis(await response.json());
      if (validated === null) {
        failWith("PROVIDER_ERROR");
        return;
      }
      setAnalysis(validated);
      setPhase("done");
    } catch {
      // fetch() rejects on network failure, DNS, CORS, offline, abort.
      failWith("NETWORK");
    }
  };

  const busy = phase === "checking" || phase === "uploading" || phase === "analyzing";

  /** One live-region sentence per phase, for screen readers. */
  const liveMessage =
    phase === "checking"
      ? m.stateChecking
      : phase === "uploading"
        ? m.stateUploading
        : phase === "analyzing"
          ? m.stateAnalyzing
          : phase === "done"
            ? m.stateDone
            : "";

  if (phase === "done" && analysis !== null) {
    return (
      <AnalysisResult
        analysis={analysis}
        m={m}
        locale={locale}
        apiBaseUrl={apiBaseUrl}
        // Kept in memory so follow-up questions can re-send it; cleared by
        // reset(), which is what makes "delete" actually delete.
        file={file}
        onReset={reset}
        liveMessage={liveMessage}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Screen-reader announcements for every processing state change. */}
      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>

      {errorKey !== null ? (
        <Alert tone="danger" title={m.errorTitle} live>
          {m.errors[errorKey]}
        </Alert>
      ) : null}

      <Card>
        <label htmlFor="letter-file" className="block font-semibold text-ink">
          {m.chooseFile}
        </label>
        <p className="mt-1 text-sm text-ink-muted">{m.fileHint}</p>

        <input
          ref={fileInputRef}
          id="letter-file"
          name="file"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          // `capture` asks mobile browsers to offer the rear camera directly;
          // desktop browsers ignore it and show the normal file picker.
          capture="environment"
          onChange={onFileChosen}
          disabled={busy}
          className="mt-4 block w-full text-sm text-ink file:me-4 file:rounded-md file:border-0 file:bg-primary-soft file:px-4 file:py-2.5 file:font-semibold file:text-primary-soft-ink hover:file:brightness-95 disabled:opacity-50"
        />

        <p className="mt-4 text-sm text-ink-muted leading-relaxed">{m.photoTips}</p>

        {file !== null ? (
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink-muted">{m.selectedFile}:</span>
            {/* dir=ltr: filenames are not translated and must not be mirrored
                inside an RTL layout. */}
            <span dir="ltr" className="font-mono text-ink break-all">
              {file.name}
            </span>
            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="text-primary underline underline-offset-4 hover:text-primary-strong"
            >
              {m.removeFile}
            </button>
          </p>
        ) : null}
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={() => void submit()} disabled={file === null || busy}>
          {busy ? m.stateAnalyzing : m.analyze}
        </Button>
        {busy ? <p className="text-sm text-ink-muted">{m.processingNote}</p> : null}
      </div>

      {busy ? (
        <div aria-hidden="true" className="space-y-3">
          {/* Skeleton placeholder: shows progress without inventing a percentage. */}
          <div className="h-4 w-2/3 rounded-full bg-raised animate-pulse" />
          <div className="h-4 w-1/2 rounded-full bg-raised animate-pulse" />
          <div className="h-4 w-3/4 rounded-full bg-raised animate-pulse" />
        </div>
      ) : null}
    </div>
  );
}
