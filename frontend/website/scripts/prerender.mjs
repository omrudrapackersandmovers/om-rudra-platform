import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../dist-ssr/entry-server.js";
import { staticPaths, indexablePaths, siteUrl, generateSitemap } from "../src/data/site.js";
import { generateDiscoveryFiles } from "./discovery.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const template = await readFile(path.join(dist, "index.html"), "utf8");
for (const pathname of staticPaths) {
  const { html, head } = await render(pathname);
  if (!html.includes("<h1") || !head.includes('rel="canonical"')) throw new Error(`Incomplete static page: ${pathname}`);
  const markedHead = head.replace(/<(title|meta|link)\b/g, '<$1 data-static-meta="true"');
  const document = template.replace("<!--page-head-->", markedHead).replace('<div id="root"></div>', `<div id="root" data-static-path="${pathname}">${html}</div>`);
  // Flat .html files let Cloudflare Pages serve extensionless URLs without adding a slash.
  const target = pathname === "/" ? path.join(dist, "index.html") : path.join(dist, `${pathname.slice(1)}.html`);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, document);
}
await writeFile(path.join(dist, "sitemap.xml"), generateSitemap());
await generateDiscoveryFiles(dist);
const redirects = [
  `https://www.omrudrapackersandmovers.com/* ${siteUrl}/:splat 301`,
  ...staticPaths.filter(p => p.startsWith("/packers-movers-")).map(p => `/packers-movers/${p.slice("/packers-movers-".length)} ${p} 301`),
  ...indexablePaths.filter(p => p.startsWith("/route/")).map(p => `/route/route-${p.slice("/route/".length)} ${p} 301`),
  ...indexablePaths.filter(p => p.startsWith("/route/")).map(p => `/${p.slice("/route/".length)} ${p} 301`),
  ...staticPaths.filter(p => p !== "/").map(p => `${p}/ ${p} 301`),
];
await writeFile(path.join(dist, "_redirects"), redirects.join("\n") + "\n");
console.log(`Generated ${staticPaths.length} HTML pages and ${indexablePaths.length} sitemap URLs.`);
