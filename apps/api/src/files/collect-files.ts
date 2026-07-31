import { MAX_FILE_BYTES, type AllowedMimeType, type UploadErrorCode } from "@wg/validation";
import type { FastifyRequest } from "fastify";

/** A raw part as it came off the wire, before any validation. */
export interface CollectedFile {
  bytes: Buffer;
  /** Client-declared type. NOT trusted — validateUpload decides the real one. */
  mimeType: string;
}

export interface CollectedUpload {
  files: CollectedFile[];
  /** Non-file multipart fields, flattened to strings. */
  fields: Record<string, string>;
  /** Set when the upload must be rejected outright; files are still returned. */
  error: UploadErrorCode | null;
}

/**
 * Reads a multipart request fully into memory — never to disk.
 *
 * Returns whatever was read even on failure, so the caller can still zero the
 * buffers it did receive. Anything already read must be wiped whether or not
 * the request succeeded, and a route that only wiped on the happy path would
 * leave document bytes in reusable memory exactly when something went wrong.
 */
export async function collectFiles(
  request: FastifyRequest,
  maxFiles: number,
): Promise<CollectedUpload> {
  const files: CollectedFile[] = [];
  const fields: Record<string, string> = {};

  try {
    const parts = request.parts({
      limits: {
        fileSize: MAX_FILE_BYTES,
        files: maxFiles,
        // Room for language, question and history alongside the files.
        fields: 8,
      },
    });

    for await (const part of parts) {
      if (part.type === "file") {
        // One more than the limit means the client sent too many; refusing is
        // better than silently analysing a truncated letter.
        if (files.length >= maxFiles) {
          // Drain so the connection closes cleanly rather than mid-stream.
          await part.toBuffer().catch(() => undefined);
          return { files, fields, error: "TOO_MANY_FILES" };
        }
        try {
          files.push({ bytes: await part.toBuffer(), mimeType: part.mimetype });
        } catch {
          // @fastify/multipart throws once a stream exceeds the size limit.
          return { files, fields, error: "FILE_TOO_LARGE" };
        }
      } else {
        fields[part.fieldname] = String(part.value);
      }
    }
  } catch {
    return { files, fields, error: "FILE_TOO_LARGE" };
  }

  return { files, fields, error: null };
}

/** Narrowed shape the providers accept, once validation has assigned a type. */
export interface ValidatedFile {
  bytes: Buffer;
  mimeType: AllowedMimeType;
}
