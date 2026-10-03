# 1st Om Packers and Movers — Frontend Web Application

High-performance, mobile-first React application built for **1st Om Packers and Movers Pvt. Ltd.**

---

## 🧭 Pages Architecture (168 Total Pages)

* **Places & Location Pages (151 Pages)**:
  * `/where-we-serve` — Central Interactive Directory & State Filter (1 page)
  * `/packers-movers-:slug` — City & District Landing Pages (114 pages across Bihar, Jharkhand, UP, Delhi NCR, WB & Metros)
  * `/route/:slug` — High-Intent Interstate Corridor Pages (36 pages connecting key hubs to major Indian cities)
* **Core & Lead Capture Pages (7 Pages)**:
  * `/` (Home), `/about`, `/pricing`, `/contact`, `/get-quote`, `/privacy`, `/terms`
* **Services (9 Pages)**:
  * `/services` hub + 8 specific service detail pages (`/services/:slug`)
* **Utility (1 Page)**:
  * `/search` — Live client-side instant search

---

## 💰 Centralized Pricing Engine (`src/data/pricing.js`)

**Single Source of Truth**: All rates, estimator parameters, local shifting tiers, interstate corridor prices, vehicle transport, and add-on rates are maintained in `src/data/pricing.js`.
Components (`Pricing.jsx`, `LocationPage.jsx`, `RoutePage.jsx`, `QuoteForm.jsx`) import directly from this file. A change made in `pricing.js` instantly reflects across all 168 pages without component-level edits.

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

