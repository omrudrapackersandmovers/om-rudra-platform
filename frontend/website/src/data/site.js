import { allLocationPages, indexableLocationPages, locationPath } from "./locations/pageData.js";
import { allRoutes } from "./locations/index.js";
import { services } from "./services.js";

export const siteUrl = "https://omrudrapackersandmovers.com";
export const corePaths = ["/", "/about", "/contact", "/pricing", "/where-we-serve", "/get-quote", "/privacy", "/terms", "/services"];
export const indexablePaths = [...corePaths, ...services.map(item => `/services/${item.slug}`), ...indexableLocationPages.map(locationPath), ...allRoutes.map(item => `/route/${item.slug}`)];
export const staticPaths = [...new Set([...indexablePaths, ...allLocationPages.map(locationPath), "/search", "/404"])];
export function isIndexablePath(pathname) { return indexablePaths.includes(pathname); }
export function generateSitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexablePaths.map(p => `  <url><loc>${siteUrl}${p}</loc></url>`).join("\n")}\n</urlset>`;
}
