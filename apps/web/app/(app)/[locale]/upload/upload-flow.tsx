"use client";

import type { Locale, Messages } from "@wg/i18n";
import {
  MAX_FILE_BYTES,
  MAX_FILES_PER_ANALYSIS,
  isAllowedMimeType,
  parseDocumentAnalysis,
  type DocumentAnalysis,
} from "@wg/validation";
import { Alert, Button, Card } from "@wg/ui";
import { useRef, useState } from "react";
import { AnalysisResult } from "./analysis-result";

/** Inline so the buttons carry meaning at a glance, not just text. */
function FileIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor" className="size-5 shrink-0">
      <path
        fillRule="evenodd"
        d="M4 3.5A1.5 1.5 0 0 1 5.5 2h5.086a1.5 1.5 0 0 1 1.06.44l3.915 3.914A1.5 1.5 0 0 1 16 7.414V16.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 16.5v-13ZM11 3.5V6a1 1 0 0 0 1 1h2.5L11 3.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="currentColor" className="size-5 shrink-0">
      <path
        fillRule="evenodd"
        d="M7.5 3a1 1 0 0 0-.83.44L5.87 4.7A1 1 0 0 1 5.04 5.1H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1.04a1 1 0 0 1-.83-.44l-.8-1.2A1 1 0 0 0 12.5 3h-5ZM10 13.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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
  const [files, setFiles] = useState<File[]>([]);
  const [errorKey, setErrorKey] = useState<ErrorKey | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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
    setFiles([]);
    setErrorKey(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const failWith = (key: ErrorKey) => {
    setErrorKey(key);
    setPhase("error");
  };

  /**
   * Adds the chosen files to the set, rather than replacing it.
   *
   * Appending is what makes a multi-page letter workable: a phone camera can
   * only capture one page per trip, so each trip has to add to what is already
   * there. The input is cleared afterwards so choosing the same file twice
   * still fires a change event.
   */
  const onFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? []);
    event.target.value = "";
    setErrorKey(null);
    if (chosen.length === 0) return;

    if (files.length + chosen.length > MAX_FILES_PER_ANALYSIS) {
      failWith("TOO_MANY_FILES");
      return;
    }
    // Client-side pre-checks exist only for fast, friendly feedback. The API
    // repeats every check authoritatively — the browser is never trusted.
    for (const candidate of chosen) {
      if (candidate.size > MAX_FILE_BYTES) {
        failWith("FILE_TOO_LARGE");
        return;
      }
      if (!isAllowedMimeType(candidate.type)) {
        failWith("UNSUPPORTED_TYPE");
        return;
      }
    }
    setFiles((current) => [...current, ...chosen]);
    setPhase("idle");
  };

  /** Removes one page without disturbing the order of the rest. */
  const removeFile = (index: number) => {
    setErrorKey(null);
    setFiles((current) => current.filter((_, i) => i !== index));
  };

  const submit = async () => {
    if (files.length === 0) return;
    setPhase("checking");
    setErrorKey(null);

    const body = new FormData();
    body.append("language", locale);
    for (const file of files) body.append("file", file, file.name);

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
        files={files}
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
        <p className="block font-semibold text-ink">{m.pickTitle}</p>
        <p className="mt-1 text-sm text-ink-muted">{m.fileHint}</p>

        {/*
          Two separate inputs, because one cannot do both jobs on a phone.
          `capture` forces the camera to open immediately and removes any way
          to reach the gallery or a saved PDF — which stranded anyone whose
          letter was already a file. The plain input opens the OS picker
          (gallery, Files, Drive); the capture input is the shortcut for
          photographing a letter that is physically in front of you.
        */}
        <input
          ref={fileInputRef}
          id="letter-file"
          name="file"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          multiple
          onChange={onFileChosen}
          disabled={busy}
          className="sr-only"
        />
        <input
          ref={cameraInputRef}
          id="letter-camera"
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={onFileChosen}
          disabled={busy}
          className="sr-only"
        />

        {/* Flex rather than a 2-column grid: the camera button is hidden on
            pointer-fine devices, and the file button should then take the full
            width instead of leaving an empty cell. */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            size="lg"
            disabled={busy}
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileIcon />
            {m.chooseFile}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            disabled={busy}
            className="touch-only flex-1"
            onClick={() => cameraInputRef.current?.click()}
          >
            <CameraIcon />
            {m.takePhoto}
          </Button>
        </div>

        {/* Photo advice is only advice if photographing is on offer. */}
        <p className="touch-only mt-4 text-sm text-ink-muted leading-relaxed">{m.photoTips}</p>

        {files.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-medium text-ink">
              {files.length === 1
                ? m.selectedFile
                : m.selectedFiles.replace("{n}", `${files.length}`)}
            </p>
            {/* Numbered, because order is meaning: the model is told these are
                pages 1..n of one letter, so what the reader sees here has to
                match what gets sent. */}
            <ol className="mt-2 space-y-2">
              {files.map((f, index) => (
                <li
                  key={`${f.name}-${f.lastModified}-${index}`}
                  className="flex items-center gap-3 rounded-md border border-line bg-raised px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs text-ink-muted shrink-0">{index + 1}</span>
                  {/* dir=ltr: filenames are not translated and must not be
                      mirrored inside an RTL layout. */}
                  <span dir="ltr" className="font-mono text-ink break-all grow min-w-0">
                    {f.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    disabled={busy}
                    className="shrink-0 text-primary underline underline-offset-4 hover:text-primary-strong"
                  >
                    {m.removeFile}
                  </button>
                </li>
              ))}
            </ol>
            {files.length > 1 ? (
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">{m.multiPageNote}</p>
            ) : null}
          </div>
        ) : null}
      </Card>

      <div className="flex flex-wrap items-center gap-4">
        <Button size="lg" onClick={() => void submit()} disabled={files.length === 0 || busy}>
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
