# Om Rudra Packers and Movers - Public Website

React website for **Om Rudra Packers and Movers Private Limited**, with moving enquiries, service information, indicative pricing, location guides, and city-to-city route pages. Production pages are rendered to static HTML, then hydrated for interactive features.

For API and admin-panel setup, see the [repository README](../../README.md).

## Development

Run commands from `frontend/website/` using Node.js compatible with Vite 8:

```bash
npm ci
```

Copy `.env.example` to `.env.local`:

```dotenv
VITE_API_URL=http://localhost:8787
# VITE_TURNSTILE_SITE_KEY=
# VITE_GOOGLE_SITE_VERIFICATION=
# VITE_BING_SITE_VERIFICATION=
```

```bash
npm run dev
```

Vite normally serves the website at `http://localhost:5173`. Start the backend separately for form submissions. Without `VITE_API_URL`, requests use `https://api.omrudrapackersandmovers.com`. All `VITE_` values are public build-time configuration; never put private keys in them. Restart development or rebuild production after changing these values.

## Routes and page counts

Current data defines **257 named public pages** and **258 generated HTML documents**, including `/404`:

- **202 location pages** at `/packers-movers-:slug`: 157 cities/districts and 45 local areas.
- **37 route pages** at `/route/:slug`.
- **9 service pages**: `/services` and eight `/services/:slug` detail pages.
- **8 core pages**: `/`, `/about`, `/pricing`, `/where-we-serve`, `/contact`, `/get-quote`, `/privacy`, and `/terms`.
- **1 search page** at `/search`.

Routes live in `src/apps/main-website/MainWebsiteRoutes.jsx`. `src/data/site.js` defines generated paths, indexable paths, the production domain, and the sitemap. Prerendering also generates redirects for legacy location and route aliases.

## Content and pricing

- `src/data/company.js` - business identity, contacts, and office information.
- `src/data/pricing.js` - indicative rates and estimator settings shared across pricing, location, route, and quote views.
- `src/data/services.js` and `serviceDetails.js` - service listings and detail content.
- `src/data/locations/index.js` - aggregated cities/districts and routes.
- `src/data/locations/coverage.js` - directory filters and local areas.
- `src/data/locations/pageData.js` - complete location-page collection and derived content.
- `src/data/locations/editorialGuides.js` - reviewed local guidance used to determine location indexing.
- `src/data/locations/interstate-routes.js` - city-to-city routes.
- `src/data/searchIndex.js` - site-search entries.

Update shared data rather than duplicating rates or business details in components. Locations represent enquiry areas, not offices. Do not invent branch addresses, reviews, completed moves, guarantees, or availability claims. See the [location editorial policy](../../docs/location-content.md).

## Enquiry forms

Moving enquiries use `POST /api/leads`; contact enquiries use `POST /api/leads/contact`. The backend handles validation, D1 storage, and optional Brevo notifications. Forms provide inline validation and loading, success, and failure states.

Turnstile uses the public `VITE_TURNSTILE_SITE_KEY` and backend `TURNSTILE_SECRET_KEY`. Verify token handling on both forms before enabling production protection. A website build does not confirm API submissions or email delivery.

## Production build and checks

```bash
npm run build
npm run lint
npm run preview
```

`npm run build` runs the Vite client build, server-renderer build, static prerendering, and SEO checks. `dist/` contains the deployable website; `dist-ssr/` contains the intermediate renderer. Both are generated and excluded from Git.

`npm run check:seo` reruns validation against an existing `dist/` build. It checks metadata, indexing rules, structured data, image references, internal links, sitemap membership, and crawler/discovery files. Build first after content changes. Lint is a separate check and is not part of the build script.

`npm run preview` starts the custom static server at `http://127.0.0.1:4173`, with redirects, HTTP 404 responses, gzip compression, and asset cache headers. Use this production build for Lighthouse audits; the development server includes development overhead. Recheck performance and hosting behaviour on the deployed domain. Fonts are bundled locally, and homepage images and shared logos use responsive WebP variants.

## SEO and hosting

The sitemap currently contains **61 indexable URLs**, including seven reviewed location guides. The other **195 location pages** use `noindex,follow`; search and error pages are also excluded from indexing. Recheck counts whenever saved collections or editorial guides change.

The build emits static HTML, `sitemap.xml`, `robots.txt`, its `robot.txt` alias, `llms.txt`, `agent.txt`, `agents.txt`, and hosting redirects. Deploy `dist/`. Cloudflare Pages geolocation support lives in `functions/api/geo.js` and must be included when using that hosting integration.

Follow the [SEO build and launch guide](../../docs/seo-launch.md) for hosting configuration, verification tokens, redirects, crawler access, and post-deployment checks. Search-provider verification, sitemap submission, analytics setup, and deployment are separate actions from building the website.
