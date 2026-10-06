# Om Rudra Packers and Movers

Web platform for **Om Rudra Packers and Movers Private Limited**, based in Patna. The repository contains a public website, an operations admin panel, and a lead-management API.

## Repository structure

- `frontend/website/` - public React website with static HTML generation. See the [website README](frontend/website/README.md).
- `frontend/admin-panel/` - React administration app for leads, quotations, jobs, bilties, invoices, fleet, staff, finances, and settings.
- `backend/` - Hono API on Cloudflare Workers, with Cloudflare D1 and Drizzle ORM.
- `frontend/mobile-app/` - reserved directory with no application implemented yet.
- `docs/` - requirements, design references, editorial policy, and launch guidance.

Each application has its own package manifest and lockfile. Run commands inside its directory; there is no root install or build script. Use Node.js compatible with the installed Vite 8 tooling and npm.

## Local development

### Backend API

```bash
cd backend
npm ci
```

Copy `.dev.vars.example` to `.dev.vars`. Set `ENVIRONMENT=development` and choose a local `JWT_SECRET`. Update sender and notification details because the example still contains the previous business identity. Set `BREVO_API_KEY` when testing email notifications. Add `TURNSTILE_SECRET_KEY` only when testing protection with matching frontend configuration. Keep credentials outside version control.

```bash
npm run db:migrate:local
npm run dev
```

The API normally listens at `http://localhost:8787`; `/health` provides a status endpoint. `db:migrate:local` applies pending SQL migrations from `drizzle/`, including the admin authentication fields. Database and Worker configuration live in `backend/wrangler.toml`.

For an older database initialized with direct SQL execution or runtime-added admin columns, inspect its schema and migration history before switching to tracked migrations. The admin security migration is intended for the original schema; existing columns must be reconciled before applying it. Preserve local database state when changing database bindings.

### Public website

In a separate terminal:

```bash
cd frontend/website
npm ci
```

Copy `.env.example` to `.env.local`, keeping `VITE_API_URL=http://localhost:8787` for local API testing, then run `npm run dev`. Vite normally starts at `http://localhost:5173`; check the terminal for the actual port.

### Admin panel

In another terminal:

```bash
cd frontend/admin-panel
npm ci
```

Create `.env.local` containing `VITE_API_URL=http://localhost:8787`, then run `npm run dev`. Vite selects another available port when the website is running. Admin requests append `/api/admin` to the API origin.

Admin access requires an account in the local database. Review `backend/scripts/create-admin.js` before running `npm run create-admin -- <username> <password>` from `backend/`. It replaces an existing account with the same username and prints the supplied password; use explicit local credentials.

## Public pages and content

Current data defines **257 named public pages**: 202 location pages, 37 city-to-city route pages, and 18 core, service, legal, and search pages. The build generates **258 HTML documents**, including the error page.

Seven reviewed location guides are indexable. The remaining 195 location pages use `noindex,follow` while staying available for enquiries. The sitemap contains **61 URLs**. Counts derive from `frontend/website/src/data/site.js` and the location collections; recheck them when content changes.

Shared business details, pricing, services, and location content live in `frontend/website/src/data/`. Listed locations represent enquiry areas, not branch offices. The confirmed office is in Patna. Do not add invented reviews, move counts, offices, delivery guarantees, or unsupported service claims.

## Forms and configuration

- Moving enquiries submit to `POST /api/leads`.
- Contact enquiries submit to `POST /api/leads/contact`.
- The API validates requests, stores leads in D1, and supports Brevo email notifications.
- Both lead endpoints use Turnstile middleware. Verify widget and token handling for both forms before configuring the production secret.
- Contact submissions appear in the admin panel at `/support`, with subject/search filters, support statuses, and staff notes separate from the original customer message. Sales lead lists exclude these submissions. Apply `0007_contact_support.sql` to each database before deploying the updated API.
- Staff can use **Log complaint** in the support inbox for phone, WhatsApp, in-person, email, and other direct contacts. The form saves customer details, a booking/job reference, complaint details, status, and internal notes. Apply `0008_internal_complaints.sql` before deploying this feature. Logging a complaint does not send a customer email.
- The website uses `VITE_API_URL`, falling back to `https://api.omrudrapackersandmovers.com` when unset.

All `VITE_` variables are public build-time configuration. Private `JWT_SECRET`, `BREVO_API_KEY`, and `TURNSTILE_SECRET_KEY` values belong in Worker secrets or local `.dev.vars`. Sender and notification settings are configured separately.

## Build and validation

From `frontend/website/`:

```bash
npm run build
npm run lint
npm run check:seo
npm run preview
```

The build bundles the client and server renderer, generates static pages and discovery files, and runs SEO validation automatically. `check:seo` checks an existing `dist/` build. Preview serves the generated site at `http://127.0.0.1:4173`.

From `frontend/admin-panel/`, use `npm run build`, `npm run lint`, and `npm run preview`. From `backend/`, `npm run deploy` deploys the Worker to the account configured in `wrangler.toml`. Deployment is separate from frontend builds.

Generated `dist/`, `dist-ssr/`, Wrangler temporary files, and Lighthouse reports can be recreated. Preserve environment files, `.dev.vars`, and `.wrangler/state/`, which may contain the local database. Establish current build and lint status by running checks rather than relying on historical results.

## Launch work

- Review mobile and desktop layouts, forms, and shared interactions.
- Verify production validation, D1 lead storage, notifications, and failure handling.
- Confirm business facts, service availability, indicative prices, Privacy Policy, and Terms with the business.
- Configure analytics and associated disclosures when ready; GA4 is currently planned.
- Deploy and verify redirects, HTTP 404s, canonical URLs, crawler settings, and response headers.
- Verify search-provider properties and submit the sitemap after deployment.
- Add genuine photographs, completed-move details, and customer feedback as available.

See the [SEO build and launch guide](docs/seo-launch.md) and [location editorial policy](docs/location-content.md). A successful build alone does not verify deployment, lead delivery, or search indexing.
