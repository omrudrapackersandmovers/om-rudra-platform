import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const redirects = new Map((await readFile(path.join(root, "_redirects"), "utf8")).trim().split("\n").filter(line => line.startsWith("/")).map(line => { const [from, to] = line.split(/\s+/); return [from, to]; }));
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".xml": "application/xml", ".txt": "text/plain", ".webp": "image/webp", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://localhost");
    if (redirects.has(url.pathname)) { response.writeHead(301, { Location: redirects.get(url.pathname) + url.search }); response.end(); return; }
    const pathname = decodeURIComponent(url.pathname);
    const relative = pathname === "/" ? "index.html" : path.extname(pathname) ? pathname.slice(1) : `${pathname.slice(1)}.html`;
    let filename = path.resolve(root, relative);
    if (!filename.startsWith(root + path.sep)) { response.writeHead(400); response.end(); return; }
    let status = 200;
    try { if (!(await stat(filename)).isFile()) throw new Error("not a file"); } catch { filename = path.join(root, "404.html"); status = 404; }
    const extension = path.extname(filename);
    const headers = { "Content-Type": mime[extension] || "application/octet-stream", Vary: "Accept-Encoding" };
    if (status === 200 && pathname.startsWith("/assets/")) headers["Cache-Control"] = "public, max-age=31536000, immutable";
    else if (status === 200 && pathname.startsWith("/images/")) headers["Cache-Control"] = "public, max-age=604800";
    let body = await readFile(filename);
    if (/\bgzip\b/.test(request.headers["accept-encoding"] || "") && [".html", ".js", ".css", ".xml", ".txt", ".svg"].includes(extension)) {
      body = gzipSync(body);
      headers["Content-Encoding"] = "gzip";
    }
    response.writeHead(status, headers);
    response.end(body);
  } catch { response.writeHead(500); response.end("Preview error"); }
}).listen(4173, "127.0.0.1", () => console.log("Static SEO preview: http://127.0.0.1:4173"));
