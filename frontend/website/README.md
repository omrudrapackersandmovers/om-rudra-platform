# Om Rudra Packers and Movers - Frontend Web Application

High-performance, mobile-first React application built for **Om Rudra Packers and Movers**

---

## 🧭 Pages Architecture (258 Static Pages)

* **Places & Location Pages (151 Pages)**:
  * `/where-we-serve` - Central Interactive Directory & State Filter (1 page)
  * `/packers-movers-:slug` - City & District Landing Pages (114 pages across Bihar, Jharkhand, UP, Delhi NCR, WB & Metros)
  * `/route/:slug` - High-Intent Interstate Corridor Pages (36 pages connecting key hubs to major Indian cities)
* **Core & Lead Capture Pages (7 Pages)**:
  * `/` (Home), `/about`, `/pricing`, `/contact`, `/get-quote`, `/privacy`, `/terms`
* **Services (9 Pages)**:
  * `/services` hub + 8 specific service detail pages (`/services/:slug`)
* **Utility (1 Page)**:
  * `/search` - Live client-side instant search

---

## 💰 Centralized Pricing Engine (`src/data/pricing.js`)

**Single Source of Truth**: All rates, estimator parameters, local shifting tiers, interstate corridor prices, vehicle transport, and add-on rates are maintained in `src/data/pricing.js`.
Components (`Pricing.jsx`, `LocationPage.jsx`, `RoutePage.jsx`, `QuoteForm.jsx`) import directly from this file. A change made in `pricing.js` instantly reflects across the shared pages without component-level edits.

---

## 🛠️ Development & Build

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```


## Performance testing

Run `npm run build`, then `npm run preview`, and audit `http://localhost:4173/` with Lighthouse. The Vite development server at port 5173 includes development overhead and is not the production performance baseline. Preview serves compressed HTML, CSS and JavaScript and uses production asset cache headers. Recheck the deployed domain after launch. Fonts are bundled locally; homepage images and shared logos use responsive WebP variants. Original images are retained.

## Location content and search discovery

Seven reviewed city guides are indexable. The remaining 195 location enquiry pages stay accessible with `noindex,follow` until they have useful, reviewed local content. The sitemap contains 61 URLs across all page types. See [location editorial policy](../../docs/location-content.md).
