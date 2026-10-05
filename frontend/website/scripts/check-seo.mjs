import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { staticPaths, indexablePaths, siteUrl } from "../src/data/site.js";
import { editorialGuides } from "../src/data/locations/editorialGuides.js";
import { allLocationPages, locationPath, locationAddress } from "../src/data/locations/pageData.js";
import { company } from "../src/data/company.js";

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const fileFor = p => path.join(dist, p === "/" ? "index.html" : `${p.slice(1)}.html`);
// Editorial admission is deliberate: a new location must not automatically enter search.
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
for (const location of allLocationPages) {
  assert.equal(indexablePaths.includes(locationPath(location)), Boolean(editorialGuides[location.slug]), `${location.slug}: unreviewed location entered search`);
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
