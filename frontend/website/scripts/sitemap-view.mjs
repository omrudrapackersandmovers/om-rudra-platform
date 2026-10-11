import { writeFile } from "node:fs/promises";
import path from "node:path";
import { siteUrl, indexablePaths } from "../src/data/site.js";

const groups = [
  { id: "pages", title: "Website pages", paths: indexablePaths.filter(p => !p.startsWith("/packers-movers-") && !p.startsWith("/route/") && !p.startsWith("/services/")) },
  { id: "services", title: "Moving services", paths: indexablePaths.filter(p => p.startsWith("/services/")) },
  { id: "locations", title: "Cities, districts and local areas", paths: indexablePaths.filter(p => p.startsWith("/packers-movers-")) },
  { id: "routes", title: "Moving routes", paths: indexablePaths.filter(p => p.startsWith("/route/")) },
];
const escape = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const head = '<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><meta name="robots" content="noindex,follow"/><title>Sitemap | Om Rudra Packers and Movers</title><link rel="stylesheet" href="/sitemap.css"/></head>';
const header = '<header><div class="wrap"><div class="brand"><img src="/brand/lockup-horizontal.svg" alt="Om Rudra Packers and Movers Private Limited"/><a href="/">Visit website &#8599;</a></div><h1>Every move starts somewhere.</h1><p>This sitemap lists our public website pages, moving services, locations and routes. Choose a link to explore the site.</p><a href="/sitemap.xml">XML sitemap</a> &#183; <a href="/sitemap-view.html">Readable HTML view</a></div></header>';
const footer = '<footer><div class="wrap"><p>Om Rudra Packers and Movers Private Limited</p><p>Location pages describe service enquiries. Availability is confirmed before booking.</p></div></footer>';
export async function writeSitemapView(dist) {
  const stats = `<div class="stats"><div class="stat"><strong>${indexablePaths.length}</strong><span>Public URLs</span></div>${groups.slice(1).map(g => `<div class="stat"><strong>${g.paths.length}</strong><span>${g.id === "locations" ? "Locations" : g.title}</span></div>`).join("")}</div>`;
  const nav = `<nav aria-label="Sitemap sections">${groups.map(g => `<a href="#${g.id}">${g.title}</a>`).join("")}</nav>`;
  const sections = groups.map(g => `<section id="${g.id}"><div class="section-heading"><h2>${g.title}</h2><span class="count">${g.paths.length} URLs</span></div><table><thead><tr><th scope="col">No.</th><th scope="col">Page URL</th></tr></thead><tbody>${g.paths.map((p,i) => `<tr><td>${i+1}</td><td><a href="${escape(siteUrl+p)}">${escape(siteUrl+p)}</a></td></tr>`).join("")}</tbody></table></section>`).join("");
  await writeFile(path.join(dist, "sitemap-view.html"), `<!doctype html><html lang="en">${head}<body>${header}<main class="wrap">${stats}${nav}${sections}</main>${footer}</body></html>`);
}
