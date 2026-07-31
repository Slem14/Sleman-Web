/**
 * Static file server for the exported site, used by the e2e suite.
 *
 * The suite used to run against `next dev`, which compiles routes on demand.
 * With ten parallel workers and ~100 routes, cold compilations queued behind
 * each other and blew the per-test timeout — so the suite passed or failed
 * depending on machine load rather than on the code. Warming routes first
 * helped but did not remove the race.
 *
 * Serving the built export removes compilation from the picture entirely, and
 * has a second benefit that matters more: this is byte-for-byte the artifact
 * GitHub Pages serves. Tests now exercise what ships, not a dev-mode
 * approximation of it.
 *
 * Deliberately dependency-free — a test server is not worth a package.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";

const ROOT = join(import.meta.dirname, "..", ".next-build");
const PORT = Number(process.env.PORT ?? 3000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".png": "image/png",
};

function resolve(urlPath) {
  // Strip the query and normalise away any ".." before touching the disk.
  const clean = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const candidates = clean.endsWith("/")
    ? [join(ROOT, clean, "index.html")]
    : [join(ROOT, clean), join(ROOT, `${clean}.html`), join(ROOT, clean, "index.html")];

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

createServer((req, res) => {
  const url = req.url ?? "/";
  const [path = "/", query] = url.split("?");

  // The site is built with trailingSlash: true, and GitHub Pages redirects
  // /en to /en/. Without replicating that, the browser's URL stays on the
  // unslashed form and every URL assertion in the suite fails — the tests
  // would be checking a behaviour the real host does not have.
  if (!path.endsWith("/") && extname(path) === "" && existsSync(join(ROOT, path, "index.html"))) {
    res.writeHead(308, { location: `${path}/${query === undefined ? "" : `?${query}`}` });
    return res.end();
  }

  const file = resolve(url);

  if (file === null) {
    // Mirrors GitHub Pages: unknown paths get 404.html with a 404 status.
    const notFound = join(ROOT, "404.html");
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" });
    if (existsSync(notFound)) return createReadStream(notFound).pipe(res);
    return res.end("Not found");
  }

  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`serving ${ROOT} on http://localhost:${PORT}`);
});
