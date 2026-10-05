# Om Rudra Packers and Movers

Web platform for **Om Rudra Packers and Movers Private Limited**, a new relocation business based in Patna. The repository contains the public website, an admin panel and a lead-management API.

## Project structure

- `frontend/website/` - public React website.
- `frontend/admin-panel/` - operations and administration frontend.
- `backend/` - Hono API on Cloudflare Workers, with Cloudflare D1 and Drizzle ORM.

## Public pages

The website currently supports **257 named public pages**, excluding unknown URLs and redirects:

- **202 location pages** at `/packers-movers-:slug`: 157 listed cities/districts and 45 local areas (31 in Patna and 14 in Delhi).
- **37 city-to-city route pages** at `/route/:slug`.
- **18 core, service, legal and search pages** listed below.

Core and utility routes:

- `/` - homepage.
- `/about` - company introduction and moving approach.
- `/pricing` - indicative pricing and moving cost guidance.
- `/where-we-serve` - searchable location directory, with Patna local areas selected initially and filters for listed routes.
- `/contact` - general enquiries, booking questions, feedback and business enquiries.
- `/get-quote` - moving enquiry form.
- `/privacy` - privacy policy, including current cookie and planned analytics information.
- `/terms` - terms of service.
- `/search` - site search across services, locations and routes.

Service routes:

- `/services`
- `/services/home-shifting`
- `/services/office-commercial-shifting`
- `/services/car-transportation`
- `/services/bike-transportation`
- `/services/packing-unpacking`
- `/services/loading-unloading`
- `/services/warehousing-storage`
- `/services/goods-insurance`

Page counts come from the saved data and should be updated when locations, routes or services change. Listed locations represent moving enquiry areas, not branch offices. The confirmed office is in Patna.

## Location and route pages

Location pages share a responsive design, with content varying by location type, saved local areas and listed city connections. They include address-access checklists, service enquiries, pricing guidance, FAQs and links to other locations. This is a data-driven foundation; the pages do not yet have genuine completed-move stories, customer reviews or location-specific business photographs.

Every listed route opens its own page from the directory and location pages. Route pages include pickup and delivery planning, available enquiry categories, FAQs, endpoint location links and other outbound routes. Quote actions prefill the origin, destination and interstate scope; service actions also prefill the selected service.

Do not add invented reviews, move counts, branch addresses, delivery guarantees or operational claims. Confirm service availability and final quote scope with the business. Real local evidence can be added as the business completes moves.

## Forms and lead handling

- The moving enquiry form submits to `POST /api/leads`.
- The contact form submits to `POST /api/leads/contact` and requires name, phone, email, subject and message.
- Forms use custom validation and inline feedback instead of browser validation popups. Submission states include loading, success and failure feedback.
- The backend validates requests, stores enquiries in the leads table and supports email notifications through Brevo.
- Cloudflare Turnstile verification is enabled when its backend secret is configured. Contact widget configuration uses `VITE_TURNSTILE_SITE_KEY`; verify token handling across both forms before enabling protection in production.

Frontend API requests use `VITE_API_URL`, falling back to `https://api.omrudrapackersandmovers.com`. A working frontend build alone does not verify production lead storage or notification delivery.

## Tech stack

- React 19, Vite and React Router 7.
- Tailwind CSS v4 and shared CSS variables for colours, typography and border radii.
- Redux Toolkit, GSAP, Framer Motion and Lenis.
- `react-helmet-async` for page metadata and JSON-LD.
- Lucide and React Icons.
- Hono, Zod, Drizzle ORM and Cloudflare D1 for the backend.

## Data and SEO

Public website data lives under `frontend/website/src/data/`:

- `company.js` - company identity, contacts and office information.
- `pricing.js` - indicative rates and estimator configuration.
- `locations/index.js` - aggregated city, district and route collections.
- `locations/coverage.js` - coverage filters and local-area options.
- `locations/pageData.js` - the complete location-page collection and derived page content.
- `locations/interstate-routes.js` - the listed city-to-city routes.
- `searchIndex.js` - search entries for public pages.

Public pages have canonical URLs, indexing rules, social metadata and confirmed business structured data. Location, route and service pages include Service metadata and breadcrumbs. The static build emits `dist/sitemap.xml` and `dist/robots.txt` using the production domain and saved page data. The sitemap currently contains **61 URLs**, including seven reviewed city guides. The other 195 location pages remain accessible for enquiries with `noindex,follow` until their local content is reviewed; utility search and error pages are excluded. See [location editorial policy](docs/location-content.md). The build also generates an unrestricted `robots.txt`, a `robot.txt` alias, an `llms.txt` content index and site-specific `agent.txt`/`agents.txt` enquiry guides. Public AI crawling is allowed; CDN crawler settings still need verification after deployment.

The production build generates **258 static HTML documents**, including complete content and metadata for 61 indexable pages, 195 noindex location enquiry pages, a noindex search page and a noindex error page. React hydrates normal routes to keep interactions working. The build validates metadata, sitemap membership, image assets, internal links and crawlable content. See [SEO build and launch guide](docs/seo-launch.md) for hosting, verification and production checks. Static generation does not guarantee indexing or rankings.

## Running locally

Start the website:

```bash
cd frontend/website
npm install
npm run dev
```

For local API requests, create `frontend/website/.env.local`:

```dotenv
VITE_API_URL=http://localhost:8787
# Add a suitable development Turnstile site key if testing the widget.
# VITE_TURNSTILE_SITE_KEY=
```

Start the API in a separate terminal:

```bash
cd backend
npm install
npm run db:migrate:local
npm run dev
```

Local database setup uses the existing migration script. Review subsequent files in `backend/drizzle/` if a feature needs additional migrations. Backend configuration is in `backend/wrangler.toml`; use local development secrets for local testing and keep them out of version control. Bindings include `DB`, `BREVO_API_KEY`, `NOTIFICATION_EMAIL`, `TURNSTILE_SECRET_KEY` and `JWT_SECRET`.

## Validation

From `frontend/website/`:

```bash
npm run build
npm run lint
npm run check:seo
npm run preview
```

The recent location and route work passed production builds, targeted lint checks, data checks for all 202 locations and 37 route endpoints, and mobile overflow/quote-prefill checks. Repository-wide lint still has previously identified issues in shared search/form components; targeted checks are not a substitute for a clean full lint run.

## Remaining launch work

- Complete a site-wide mobile and desktop review, including existing service pages and shared interactions.
- Deploy and verify the contact endpoint and moving enquiry flow: validation, D1 storage, notifications and failure handling.
- Review Privacy Policy and Terms of Service with the business before launch; further legal work was deferred.
- Add GA4 when ready. Analytics is planned and is not currently installed. There is no dedicated cookie policy page yet; update disclosures and consent behaviour to match the eventual setup.
- Push and deploy the static build, verify redirects and HTTP 404s, then create/verify Search Console and submit the sitemap using docs/seo-launch.md.
- Add genuine photos, customer feedback and completed-move details as they become available.

No production deployment or analytics setup is implied by the current page implementation.
