/**
 * Minimal PDF writer for evaluation fixtures.
 *
 * Why hand-rolled rather than a library: fixtures must go through the same
 * document path a real user's upload takes, so a plain text string would not
 * be a fair test. A dependency that renders arbitrary documents is a large
 * surface to add for the sake of seven fake letters — this is about eighty
 * lines and produces a file any PDF reader accepts.
 *
 * Deliberately plain: one page, one built-in font, no compression. The point
 * is a faithful transport, not typography.
 */

/** WinAnsiEncoding covers the German alphabet, including ä ö ü ß. */
function escapePdfText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export interface RenderOptions {
  /** Points from the top of the page to the first baseline. */
  marginTop?: number;
  fontSize?: number;
  lineHeight?: number;
}

/**
 * Renders plain text to a single-page A4 PDF.
 *
 * Lines longer than the page are wrapped at word boundaries so nothing is
 * silently lost — a truncated fixture would produce a misleading eval result.
 */
export function renderTextToPdf(text: string, options: RenderOptions = {}): Buffer {
  const fontSize = options.fontSize ?? 11;
  const lineHeight = options.lineHeight ?? fontSize * 1.35;
  const marginTop = options.marginTop ?? 60;
  const marginLeft = 56;
  const pageWidth = 595; // A4 at 72 dpi
  const pageHeight = 842;
  // Helvetica averages ~0.5em per character; leave margin for the estimate.
  const maxCharsPerLine = Math.floor((pageWidth - marginLeft * 2) / (fontSize * 0.5));

  const lines: string[] = [];
  for (const rawLine of text.split("\n")) {
    if (rawLine.length <= maxCharsPerLine) {
      lines.push(rawLine);
      continue;
    }
    let current = "";
    for (const word of rawLine.split(" ")) {
      if (current === "") {
        current = word;
      } else if (`${current} ${word}`.length <= maxCharsPerLine) {
        current = `${current} ${word}`;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current !== "") lines.push(current);
  }

  // Content stream: begin text, set font, then one positioned show-text per line.
  const streamParts = ["BT", `/F1 ${fontSize} Tf`];
  let y = pageHeight - marginTop;
  for (const line of lines) {
    streamParts.push(`1 0 0 1 ${marginLeft} ${y.toFixed(2)} Tm`);
    streamParts.push(`(${escapePdfText(line)}) Tj`);
    y -= lineHeight;
  }
  streamParts.push("ET");
  const stream = streamParts.join("\n");

  // Objects are assembled in order so byte offsets can be recorded for the
  // xref table, which readers use to locate each object.
  const objects: string[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] ` +
      "/Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    `<< /Length ${Buffer.byteLength(stream, "latin1")} >>\nstream\n${stream}\nendstream`,
  ];

  const chunks: Buffer[] = [];
  const offsets: number[] = [];
  let position = 0;

  const push = (text_: string) => {
    const buf = Buffer.from(text_, "latin1");
    chunks.push(buf);
    position += buf.length;
  };

  push("%PDF-1.4\n");
  objects.forEach((body, index) => {
    offsets.push(position);
    push(`${index + 1} 0 obj\n${body}\nendobj\n`);
  });

  const xrefStart = position;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    xref += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  push(xref);
  push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);

  return Buffer.concat(chunks);
}
