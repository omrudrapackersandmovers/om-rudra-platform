import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { staticPaths, indexablePaths, siteUrl } from "../src/data/site.js";
import { editorialGuides } from "../src/data/locations/editorialGuides.js";
import { allLocationPages, getLocationPageData, locationPath, locationAddress } from "../src/data/locations/pageData.js";
import { company } from "../src/data/company.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const fileFor = p => path.join(dist, p === "/" ? "index.html" : `${p.slice(1)}.html`);
// Preserve sourced editorial guides while verifying every directory page is useful and discoverable.
const reviewedCopy = new Set();
for (const [slug, guide] of Object.entries(editorialGuides)) {
  const location = allLocationPages.find(item => item.slug === slug);
  assert(location, `Reviewed guide has no location: ${slug}`);
  assert(guide.references.length && guide.references.every(source => new URL(source.url).protocol === "https:"), `${slug}: sourced address facts required`);
  assert(guide.decisions.length >= 3 && guide.faqs.length, `${slug}: decisions and local questions required`);
  assert(!reviewedCopy.has(guide.fact), `${slug}: repeated address fact`);
  reviewedCopy.add(guide.fact);
  const $ = load(await readFile(fileFor(locationPath(location)), "utf8"));
  assert($("main").text().includes(guide.fact), `${slug}: reviewed guidance missing from rendered page`);
  for (const source of guide.references) assert($("a[href]").toArray().some(el => $(el).attr("href") === source.url), `${slug}: reference link missing`);
  assert.equal($('input[name="from"]').attr("value"), locationAddress(location), `${slug}: enquiry pickup lost`);
}
const locationDescriptions = new Set();
for (const location of allLocationPages) {
  assert(indexablePaths.includes(locationPath(location)), `${location.slug}: service location missing from search`);
  const data = getLocationPageData(location.slug);
  const $ = load(await readFile(fileFor(locationPath(location)), "utf8"));
  const description = $('meta[name="description"]').attr("content");
  assert(!locationDescriptions.has(description), `${location.slug}: duplicate location description`);
  locationDescriptions.add(description);
  assert($("h1").text().includes(data.searchName), `${location.slug}: ambiguous location heading`);
  assert($("#location-quote-cost").text().includes(data.searchName), `${location.slug}: quote comparison section missing`);
  const graph = JSON.parse($('script[type="application/ld+json"]').text())["@graph"];
  const service = graph.find(entry => entry["@type"] === "Service");
  assert.equal(service.areaServed.containedInPlace.name, location.state, `${location.slug}: service region mismatch`);
  assert.equal(service.provider["@id"], `${siteUrl}/#business`, `${location.slug}: provider identity mismatch`);
  if (data.parent) {
    const crumbs = graph.find(entry => entry["@type"] === "BreadcrumbList").itemListElement;
    assert.equal(crumbs[2].item, `${siteUrl}${locationPath(data.parent)}`, `${location.slug}: parent city breadcrumb missing`);
  }
  assert.equal(data.planning.scenarios.length, 3, `${location.slug}: moving scenarios missing`);
  assert($("#location-moving-plan").text().includes(data.label), `${location.slug}: location plan missing`);
  assert($("main").text().includes(data.planning.scope), `${location.slug}: address guidance missing`);
  assert.equal($('input[name="from"]').attr("value"), locationAddress(location), `${location.slug}: enquiry pickup lost`);
  if (!location.isPrimaryHub) assert($("main").text().includes("not a claim of a branch office here"), `${location.slug}: branch distinction missing`);
  assert(staticPaths.includes(locationPath(location)), `${location.slug}: enquiry page removed`);
}
const inbound = new Set();
const titles = new Set();
const errors = [];
for (const p of staticPaths) {
  try {
    const $ = load(await readFile(fileFor(p), "utf8"));
    assert.equal($("title").length, 1, `${p}: one title required`);
    const title = $("title").text();
    assert(!titles.has(title), `${p}: duplicate title`); titles.add(title);
    assert.equal($("h1").length, 1, `${p}: one H1 required`);
    assert($("main").text().trim().length > 150, `${p}: empty main content`);
    assert.equal($('[aria-label="Loading page content"]').length, 0, `${p}: unresolved loading shell`);
    assert.equal($('link[rel="canonical"]').length, 1, `${p}: one canonical required`);
    assert.equal($('link[rel="canonical"]').attr("href"), `${siteUrl}${p}`, `${p}: incorrect canonical`);
    assert.equal($('meta[name="description"]').length, 1, `${p}: one description required`);
    assert($('meta[name="description"]').attr("content")?.length > 40, `${p}: missing description`);
    const robots = $('meta[name="robots"]').attr("content");
    assert.equal(robots?.includes("noindex"), !indexablePaths.includes(p), `${p}: indexing rule mismatch`);
    assert.equal($('meta[property="og:url"]').attr("content"), `${siteUrl}${p}`);
    assert($('meta[property="og:image"]').attr("content")?.startsWith(`${siteUrl}/`));
    const scripts = $('script[type="application/ld+json"]');
    assert.equal(scripts.length, 1, `${p}: one JSON-LD graph required`);
    scripts.each((_, element) => {
      const graph = JSON.parse($(element).text())["@graph"];
      assert(graph.some(entry => entry["@type"] === "MovingCompany" && entry.address?.streetAddress));
      const business = graph.find(entry => entry["@type"] === "MovingCompany");
      assert.deepEqual(business.sameAs, Object.values(company.socials).filter(Boolean));
      assert(!graph.some(entry => entry.aggregateRating || entry.review), `${p}: unconfirmed reviews`);
    });
    assert.equal($("img:not([alt])").length, 0, `${p}: missing image alt`);
    for (const element of $("a[href]").toArray()) {
      const href = $(element).attr("href");
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const link = new URL(href, siteUrl);
      const target = link.pathname.replace(/\/$/, "") || "/";
      if (!staticPaths.includes(target)) throw new Error(`${p}: broken internal link ${href}`);
      if (target !== p) inbound.add(target);
      if (link.hash) {
        const targetDoc = target === p ? $ : load(await readFile(fileFor(target), "utf8"));
        assert(targetDoc(`[id="${decodeURIComponent(link.hash.slice(1))}"]`).length, `${p}: missing anchor ${href}`);
      }
    }
    for (const element of $("img[src]").toArray()) {
      const src = $(element).attr("src");
      if (src.startsWith("/")) await access(path.join(dist, decodeURIComponent(src.slice(1))));
    }
    for (const element of $("img[srcset], source[srcset]").toArray()) {
      for (const candidate of $(element).attr("srcset").split(",")) {
        const src = candidate.trim().split(/\s+/)[0];
        if (src.startsWith("/")) await access(path.join(dist, decodeURIComponent(src.slice(1))));
      }
    }
  } catch (error) { errors.push(error.message); }
}
for (const p of indexablePaths) if (p !== "/" && !inbound.has(p)) errors.push(`Orphan page: ${p}`);
const sitemap = load(await readFile(path.join(dist, "sitemap.xml"), "utf8"), { xmlMode: true });
const urls = sitemap("loc").toArray().map(element => sitemap(element).text());
assert.deepEqual(new Set(urls), new Set(indexablePaths.map(p => `${siteUrl}${p}`)));
assert.equal(urls.length, indexablePaths.length);
assert((await readFile(path.join(dist, "sitemap.xml"), "utf8")).includes('<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'), "Sitemap stylesheet missing");
await access(path.join(dist, "sitemap.xsl"));
await access(path.join(dist, "sitemap.css"));
const sitemapView = load(await readFile(path.join(dist, "sitemap-view.html"), "utf8"));
const viewUrls = sitemapView("tbody a").toArray().map(element => sitemapView(element).attr("href"));
assert.deepEqual(new Set(viewUrls), new Set(urls), "Readable sitemap differs from XML");
assert.equal(viewUrls.length, urls.length, "Readable sitemap has duplicate URLs");
assert(sitemapView('meta[name="robots"]').attr("content").includes("noindex"), "Readable sitemap should not enter search");

const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
assert(robots.includes("User-agent: *\nAllow: /"), "All public crawlers must be allowed");
assert(!/^Disallow:\s*\S/m.test(robots), "Unexpected crawler block");
assert(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
assert.equal(await readFile(path.join(dist, "robot.txt"), "utf8"), robots);
const llms = await readFile(path.join(dist, "llms.txt"), "utf8");
const discoveryLinks = [...llms.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map(match => match[1]);
for (const p of indexablePaths) assert(discoveryLinks.includes(`${siteUrl}${p}`), `Missing AI discovery link: ${p}`);
for (const url of discoveryLinks) {
  if (Object.values(company.socials).includes(url)) continue;
  const p = new URL(url).pathname;
  assert(indexablePaths.includes(p) || ["/sitemap.xml", "/agent.txt"].includes(p), `Unknown AI discovery URL: ${url}`);
}
for (const url of Object.values(company.socials).filter(Boolean)) assert(discoveryLinks.includes(url), `Missing social discovery link: ${url}`);
const agent = await readFile(path.join(dist, "agent.txt"), "utf8");
assert(agent.includes(`${siteUrl}/get-quote`) && agent.includes("not a confirmed booking"));
assert.equal(await readFile(path.join(dist, "agents.txt"), "utf8"), agent);
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }
else console.log(`SEO checks passed: ${staticPaths.length} static pages, metadata, schema, images, links, sitemap, crawler access and AI discovery files.`);
