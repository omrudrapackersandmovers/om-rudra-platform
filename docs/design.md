# 1st Om Packers and Movers — Master Design & Engineering Specification

**Status:** Final — binding for all design and development work on this project.
**Owner:** Unyrise Tech
**Client:** 1st Om Packers and Movers Pvt. Ltd.

---

## 0. How to Use This Document

This file is the **single source of truth**. If any instruction elsewhere (a chat message, a code comment, a guess) conflicts with this file, **this file wins**. If something is not covered here, stop and ask — do not invent a convention.

Rules of engagement:

1. Every rule in this document written as **MUST**, **NEVER**, or **ALWAYS** is non-negotiable. There is no "close enough."
2. Do not skip to code. Read Sections 1–9 (brand, content, IA) before touching Sections 10+ (stack, folders, deployment).
3. Do not invent data. If a fact (a certification, a number, an award, a rating) is not present in the Company Data File (Section 11) or given explicitly by the client, it does not go on the site. Leave a `// TODO: confirm with client` marker instead of guessing or fabricating.
4. Do not restructure the project. Section 14 governs folder structure — follow the structure that already exists in the repository. Do not scaffold a new one, rename folders, or "clean up" structure on your own initiative.

---

## 1. Brand Foundation

### 1.1 Company Snapshot

- **Legal name:** 1st Om Packers and Movers Pvt. Ltd.
- **Industry:** Packing, moving, and relocation services
- **Primary base:** Bihar, with coverage extending across Jharkhand, Uttar Pradesh, Delhi NCR, West Bengal, and pan-India interstate routes (full location data lives in Section 12 / the Locations Data Layer, not hardcoded anywhere in the UI).
- **Audience:** Households and businesses relocating within a city, within a state, interstate, or (in the "Other Relocation Markets" set) to major metros. The overwhelming majority of visitors arrive **on a mobile phone**, often from a WhatsApp share, a Google search, or a Google Business Profile listing. Design and build mobile-first, not "responsive as an afterthought."

### 1.2 Positioning

We are not building "a packers and movers website." We are building the **calmest, most trustworthy 10 minutes of someone's moving day** — the moment they're anxious about their belongings, their new city, their money, and they land on this site and feel, immediately: *these people know exactly what they're doing, and they've done this a thousand times before.*

The competitive set (reference sites like ompackersindia.com) sells **services**: a features list, a rate card, an FAQ, a wall of city links. We sell **an experience**: the feeling of watching your last box leave your old home and knowing it's in good hands, and the feeling of walking into your new home already unpacked and settled.

Positioning statement (internal, not for the site verbatim):
> "1st Om Packers and Movers doesn't move boxes. It moves the beginning of someone's next chapter — safely, on time, without them having to think about it."

### 1.3 Voice & Tone

- Warm, direct, competent. Sounds like a person who has personally supervised thousands of moves — not a marketing department.
- Speaks to **one person's move**, not "customers" in the abstract. Use "your move," "your home," "your family," not "our valued clients."
- Confident without hype. State facts plainly ("we've moved X families across Y districts") rather than adjective-stacking ("world-class, best-in-class, industry-leading").
- Never mentions technology, code, frameworks, or "how the website works" anywhere in user-facing copy. The person reading this is thinking about their move, not about React.
- Never uses fear-based scare copy about fraud/scams as a primary hook (competitors overuse "beware of frauds" as a homepage headline — mentioning it briefly for reassurance is fine; leading with it is not).

---

## 2. Design Tokens — Single Source of Truth (Configurable Theming)

**Non-negotiable requirement from the client: changing the entire site's look — colors, fonts, spacing, radius — must be possible by editing ONE file. No developer should ever need to hunt through components to change a color.**

### 2.1 Where tokens live

Because the stack uses Tailwind CSS (latest, v4+, CSS-first configuration — see Section 13), tokens are NOT defined in a `tailwind.config.js` theme object. They are defined once, as CSS custom properties, inside a single tokens file (e.g. `theme.css` / `tokens.css` — the exact path must match wherever the existing folder structure keeps global styles; do not create a second styles location).

```css
@theme {
  /* Color */
  --color-background: #ffffff;
  --color-surface: #f7f7f9;
  --color-primary: #203a64;      /* deep navy — trust, corporate reliability */
  --color-primary-foreground: #ffffff;
  --color-accent: #f5a623;       /* marigold — CTAs, price highlights, "Om" warmth without cliché saffron/red */
  --color-accent-foreground: #141416;
  --color-text: #141416;
  --color-text-muted: #5b5f6b;
  --color-border: #e4e4e8;
  --color-success: #1f9d55;
  --color-danger: #d64545;

  /* Typography */
  --font-display: "Sora", ui-sans-serif, sans-serif;
  --font-body: "Inter", ui-sans-serif, sans-serif;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;

  /* Shadow (used sparingly — see 6.4) */
  --shadow-card: 0 1px 2px rgba(20, 20, 22, 0.04), 0 8px 24px rgba(20, 20, 22, 0.06);
}
```

### 2.2 Rules

- **NEVER** hardcode a hex/rgb/hsl color value inside a component file. Always reference the token (`bg-primary`, `text-text-muted`, `border-border`, etc. via Tailwind's generated utilities, or `var(--color-primary)` in raw CSS).
- **NEVER** hardcode a font-family, border-radius, or shadow value in a component. Reference the token.
- If a new color/spacing/radius need arises during build, add it to this one tokens file first, then consume it — do not invent a one-off value inline "just this once."
- Dark mode is not in scope for v1 unless the client asks — but because tokens are centralized, adding a `.dark { @theme { ... } }` override later must be a drop-in, not a rewrite.

### 2.3 Full palette reference

| Token | Hex | Usage |
|---|---|---|
| `--color-background` | `#FFFFFF` | Page background (white theme, as required) |
| `--color-surface` | `#F7F7F9` | Section alternation, card backgrounds |
| `--color-primary` | `#203A64` | Navigation, headings, primary buttons, trust elements |
| `--color-accent` | `#F5A623` | CTAs, "Get a Free Quote" buttons, price highlights, active states |
| `--color-text` | `#141416` | Body copy, headings |
| `--color-text-muted` | `#5B5F6B` | Captions, secondary text, metadata |
| `--color-border` | `#E4E4E8` | Dividers, input borders, card outlines |

Do not introduce additional brand colors without updating this table first.

---

## 3. Typography

- **Display / Headings:** Sora — confident, geometric, works at large hero sizes without feeling like a generic SaaS default.
- **Body / UI:** Inter — highly legible at small sizes, critical for dense route tables, pricing grids, and long-form service copy on mobile screens.
- Use ONE weight system per family; do not introduce a third typeface.
- Type scale must follow a real modular scale (not arbitrary px jumps). Suggested scale (rem, mobile-first, adjust up for desktop via clamp()):
  - Display: `clamp(2rem, 5vw, 3.5rem)`
  - H1: `clamp(1.75rem, 4vw, 2.75rem)`
  - H2: `clamp(1.4rem, 3vw, 2rem)`
  - H3: `1.25rem`
  - Body: `1rem` (16px minimum — never smaller on mobile)
  - Caption: `0.875rem`
- Line length: body copy max ~72 characters per line on desktop; don't let text spans go edge-to-edge on wide screens.
- **NEVER** use all-caps tracked-out "eyebrow" labels above headings (e.g. "OUR SERVICES") — this is a generic AI-design tell. If a section needs a label, set it in sentence case as part of the visual hierarchy, not as decorative chrome.
- **NEVER** style a headline by bolding/coloring just one word for "punch." If emphasis is needed, it must come from layout or scale, not mid-sentence styling tricks.

---

## 4. Iconography & Illustration

### 4.1 Icons

- Icon library: **lucide-react** (already the standing library per project convention).
- Icons must be **semantically related to the content next to them** — a truck icon next to "Home Shifting," a shield icon next to "Goods Insurance," a map-pin/route icon next to location content, a clock icon next to timelines. **NEVER** use decorative icons that don't map to real meaning.
- **BANNED icons:** `Sparkles`, `Wand2`, `Zap` (used purely for flourish), any "magic"/AI-coded iconography. These are the single biggest visual tell of an AI-generated site and must not appear anywhere on this project.
- Icon usage suggestions relevant to this domain: `Truck`, `Package`, `Boxes`, `MapPin`, `Navigation`, `Route`, `ShieldCheck`, `Clock`, `PhoneCall`, `MessageCircle` (WhatsApp-style contact), `CheckCircle2`, `Warehouse`, `Star`, `Home`, `Building2`, `Car`, `Bike`.
- Do not put every icon inside a soft-gradient circle badge by default — that is the generic "SaaS card kit" pattern. Vary treatment by context; some icons can sit inline with text with no container at all.

### 4.2 Illustration / imagery

- The brief calls for **free 3D illustrations / vector illustrations**, not AI-generated stock photography of generic smiling people with boxes (industry cliché — avoid it).
- Approved free sources (verify license terms — commercial use, no attribution required where possible; if attribution is required, credit in the site footer, not on-page):
  - **unDraw** (undraw.co) — open-source SVG illustrations, recolorable to match `--color-primary` / `--color-accent`. Best fit for process/step illustrations (packing, loading, moving day, new home).
  - **Storyset by Freepik** (storyset.com) — free tier with attribution, premium removes it; strong moving/logistics-themed sets exist.
  - **Icons8 Illustrations / Ouch! Illustrations** — freemium, check license per asset.
  - **LottieFiles** (lottiefiles.com) — free, lightweight *animated* illustrations (a moving truck driving, boxes stacking) — good for a hero moment or empty states, must stay small in file size and respect reduced-motion preference.
- **NEVER** use unrelated generic 3D blob/abstract-shape renders "because they look modern" — every illustration must depict something a person moving house would recognize: boxes, trucks, homes, route maps, hands packing, a family in a new home.
- Every image must have descriptive, keyword-relevant `alt` text (see SEO, Section 10) — never `alt=""` on meaningful imagery, never `alt="image1"`.

---

## 5. Motion & Interaction

- Motion tools already in the stack: **GSAP + ScrollTrigger** for orchestrated scroll reveals, **Lenis** for smooth scrolling, **Framer Motion** for component-level transitions/microinteractions.
- Spend the "one bold motion moment" on something tied to the subject: e.g., a route line that draws itself across a map as the user scrolls through "how it works," or a truck icon that travels along a progress line through the 4 steps of a move (Survey → Pack → Transport → Unpack).
- **NEVER** apply the same generic "fade-and-slide-up on scroll" to every single section and every single card — this is the most common generic AI-site tell. Pick ONE orchestrated moment per page; keep everything else calm.
- Hover states on cards/buttons: subtle (slight elevation or color shift), not a full re-animation.
- Respect `prefers-reduced-motion` — every animation must have a reduced/no-motion fallback.
- Mobile: motion budget is smaller. Heavy scroll-triggered animation that's delightful on desktop can cause jank on mid-range Android phones — test on real mobile devices/throttled CPU, not just desktop Chrome.

---

## 6. Layout, Grid & Mobile-First Rules

### 6.1 Mobile-first is mandatory, not optional

The client has explicitly flagged that the overwhelming majority of the audience will open this site from a mobile phone. Build and review every page **at 375px width first**, then scale up. Do not design at desktop width and "make it responsive" afterward.

Mobile-specific requirements:
- A **persistent, thumb-reachable action bar** at the bottom of the viewport on mobile (Call + WhatsApp, at minimum) on every page — this is the single highest-converting element for this industry and audience.
- All tap targets ≥ 44×44px.
- Forms: minimize required fields on the first screen; use native mobile input types (`tel`, `email`) so the correct keyboard appears.
- No hover-dependent functionality (mobile has no hover) — anything revealed on hover on desktop must have a tap/visible equivalent on mobile.
- Hero section on mobile must communicate the core value proposition and a way to act (call/quote) within the first screen, without requiring a scroll.

### 6.2 Grid

- 4-column grid on mobile, 8 on tablet, 12 on desktop. Consistent gutter using the spacing scale (do not eyeball spacing values).
- Alignment: left-aligned body content by default (better for scanning long route lists and service descriptions); center-alignment reserved for hero statements and short standalone CTAs only.

### 6.3 The distinctive layout device for this brand

Per the design principle of "spend your boldness in one place": this project's signature visual device is a **route line** — a single continuous line (literal or implied) that threads through: the "How it works" steps, the journey visualization on city/route pages ("Patna → Ranchi"), and possibly the hero. This is not decoration; it's a literal representation of what the company does (moves things from point A to point B), and it's the one place to be bold. Everything else on the page should be calm and disciplined around it.

### 6.4 What to avoid (explicit ban list — generic AI-design tells)

Do not do any of the following unless the client explicitly requests it later:
- Warm cream background (`#F4F1EA`-ish) with a terracotta/clay accent (`#D97757`-ish).
- Near-black background with a single neon/acid accent.
- The "SaaS card kit": every content block chopped into identical rounded cards, one border-radius on everything, the same soft grey box-shadow under each card, decorative gradient washes.
- ALL-CAPS tracked-out eyebrow labels above every heading.
- Middle-dot separated meta strings ("Trusted · Reliable · Affordable").
- Appending "→" to every link/button label.
- Numbered markers (01 / 02 / 03) on content that isn't actually a sequence.
- A wall of "Top places to visit in [City]" filler content purely to pad word count (a pattern visible on competitor sites) — if local content is included, it must be genuinely useful to someone relocating (neighborhoods, cost of living notes, local transport), not tourist trivia.

---

## 7. Component Patterns (Baseline)

Build these as reusable, token-driven components (exact folder location per Section 14):

- **Header/Nav** — logo, primary nav, phone number visibly clickable at all breakpoints, "Get a Free Quote" as the accent-colored CTA.
- **Hero** — headline + subhead + primary CTA + (mobile) immediately visible call/WhatsApp action. No stock photo of generic smiling movers; use an illustration or a real, licensed photo if the client supplies one later.
- **Quote/Lead Form** — Moving From / Moving To / Phone / Move Type / Timeline / Service — short, mobile-optimized, protected by Cloudflare Turnstile (not reCAPTCHA — stay in the Cloudflare ecosystem, see Section 15).
- **Service card grid** — icon (semantic, per Section 4) + short title + one clear sentence, not a paragraph.
- **Trust bar** — only real, verifiable facts pulled from the Company Data File (years in business, districts served, real review count if available). Never fabricated badges.
- **City/Route page template** — one component, driven entirely by the Locations Data Layer (Section 12), that renders a unique page per location/route. See Section 9.3 for uniqueness rules — this is the part most likely to look templated if not handled carefully.
- **Pricing/estimate table** — clear, scannable, mobile-first (consider a card-per-home-size layout on mobile rather than a wide table that requires horizontal scroll).
- **Testimonial block** — only real testimonials the client provides; never invented quotes.
- **Sticky mobile action bar** — Call + WhatsApp (and optionally "Get Quote"), fixed to bottom on mobile viewports only.
- **Footer** — company info (from Company Data File), service links, all-locations link/sitemap, legal links.

---

## 8. Content & Copywriting Rules

This is the section most likely to be gotten wrong by an AI writing at scale across many city/route pages. Follow precisely.

### 8.1 Sell experience, not service

For every page, before writing, identify: *what does this specific person feel right now, and what do they want to feel after the move?* Write to that, then let services/features support it — do not lead with a bullet list of services.

Bad (service-led, generic): "We offer home shifting, office shifting, and car transportation with 24/7 support."
Better (experience-led, specific): "Your next home in Ranchi is 341km from here. We've made that drive for hundreds of families before yours — your furniture arrives before you've finished unpacking your first box."

### 8.2 Banned words & patterns

Do not use these — they are generic filler that reads as AI-written or as tired industry cliché (several appear verbatim on competitor sites):

- "In today's fast-paced world," "In the ever-evolving landscape of..."
- "Look no further," "unlock," "unparalleled," "cutting-edge," "revolutionize," "elevate your..."
- "We understand that moving can be stressful" (state something specific instead of naming the emotion generically)
- "One-stop solution," "hassle-free experience" used more than once per page
- Any sentence that could be pasted onto a plumber's website, a lawyer's website, and a bakery's website and still make sense. If a sentence isn't specific to *moving* and to *this route/city*, rewrite it.

### 8.3 No internal/technical language on the site

Never mention React, Vite, Cloudflare, APIs, "our tech stack," databases, or anything about how the site is built, anywhere in user-facing copy. The visitor cares about their move, not the implementation.

### 8.4 Uniqueness rule for templated pages (critical for SEO — see Section 10.4)

Every city/route page is generated from the same component (Section 7), but each MUST contain genuinely unique content, not just a find-and-replace of the city name into an identical paragraph. For each location/route page, vary at minimum:
- The opening line (reference something real and specific: a known road/highway corridor, a well-known local landmark used only as a *distance/orientation reference*, the district's relationship to the main hub).
- At least one locally-relevant practical note (e.g., typical traffic/access considerations for a large truck in that area, nearest branch, distance from the Patna hub) pulled from structured data, not invented.
- Do not reuse the exact same 3–4 paragraph skeleton competitor-style ("Packers and Movers in Patna, We aim at providing professional level of service..." repeated with only the city swapped). Thin, duplicate-content-pattern pages will actively hurt SEO rankings, not help them.

### 8.5 No AI slop, no sparkle language

No exclamation-mark stacked hype, no "✨" or emoji-as-bullet, no em-dash-heavy "punchy" fragments used as a crutch. Write full, clear sentences a real person would say out loud.

### 8.6 Banned characters and punctuation patterns

These specific characters/patterns are the clearest tells of AI-written copy and must **never** appear anywhere on the site — headings, body copy, meta descriptions, alt text, button labels, error messages, or JSON-LD text fields:

- **Em dash (—) and en dash (–) used as a sentence-punctuation crutch.** Rewrite as a full stop, a comma, or a separate sentence instead. (A hyphen inside a genuinely hyphenated word, like "self-storage" or "3-BHK," is fine — this ban is about dashes standing in for punctuation, not word-hyphens.)
- Arrow characters (→, ➜, » ) tacked onto link/button text.
- Sparkle/emoji characters used as bullets or decoration (✨, 🚀, 💡, ✅ as a bullet marker, etc.). A real checkmark icon in a component is fine (Section 4.1); an emoji character typed into copy is not.
- Middle-dot separated meta strings ("Fast · Reliable · Affordable").
- Curly "smart quote" stacking or repeated exclamation marks (`!!`) for emphasis.
- Semicolons used to fuse two unrelated clauses into one AI-sounding sentence — prefer two plain sentences.

Before marking any copy final, search the text for `—`, `–`, `→`, and repeated punctuation, and rewrite every instance found.

---

## 9. Information Architecture

### 9.1 Core pages
Home · About/Why Us · Services (Home Shifting, Office/Commercial Shifting, Car/Bike Transportation, Packing & Unpacking, Loading & Unloading, Warehousing/Storage, Goods Insurance) · Pricing/Estimate · Branches/Contact · Get a Quote · Blog (optional v2) · Legal (Privacy, Terms)

### 9.2 Location-driven pages (generated from the Locations Data Layer, Section 12)
- One page per **hub city** (e.g., Patna, Ranchi) with full service detail, local branch info, and a rate table.
- One page per **major district/city** in the primary service states (Bihar, Jharkhand, UP, Delhi NCR, West Bengal) with lighter, still-unique content (Section 8.4).
- One page per **interstate route** (e.g., "Patna to Delhi NCR Packers and Movers") for the highest-intent search queries.
- A single **"Where We Serve"** hub page linking to every state/city/route page — this is the sitewide index a person (and search engines) can use to find their specific location instead of relying only on footer link soup.

### 9.3 Do not copy the competitor's IA weaknesses
The reference site (ompackersindia.com) uses a huge flat footer link-list of 60+ cities and thin near-duplicate city pages. Match its *coverage* (this client legitimately serves a similarly large area — see the location data already compiled) but not its *thinness*. Group locations sensibly (by state, then by hub), and ensure the "Where We Serve" page itself is a genuinely useful, well-organized page — not a link dump.

---

## 10. SEO & Technical Standards

1. **Semantic HTML** throughout — one `<h1>` per page, logical heading hierarchy, `<nav>`, `<main>`, `<footer>` landmarks.
2. **Structured data (JSON-LD)**:
   - `Organization` on the homepage.
   - `MovingCompany` (a `LocalBusiness` subtype) on the homepage and every branch/hub page, populated **only** from the Company Data File — never fabricate `aggregateRating`, `review`, or `award` fields that the client hasn't provided.
   - `Service` schema for each service page.
   - `FAQPage` schema where genuine FAQ content exists.
   - `BreadcrumbList` on all nested pages (services, locations).
3. **Meta tags**: unique `<title>` and `meta description` per page (no duplicated titles across city pages — interpolate the real distinguishing detail, not just the city name into an identical template string with zero other variation).
4. **Canonical tags** on every page, especially the generated location pages, to avoid duplicate-content penalties.
5. **`sitemap.xml`** auto-generated from the same Locations Data Layer that drives the pages (single source of truth — if a new district is added to the data file, it must automatically appear in the sitemap without manual editing).
6. **`robots.txt`** configured correctly; do not accidentally block crawling of location pages.
7. **Images**: served via Cloudinary transformations in modern formats (WebP/AVIF) at responsive sizes; every meaningful image has descriptive `alt` text including relevant location/service context where natural (never keyword-stuffed).
8. **Core Web Vitals targets**: LCP < 2.5s, INP < 200ms, CLS < 0.1, measured on throttled mobile — this audience is mobile and often on average network conditions, not fibre broadband.
9. **Local SEO**: NAP (Name, Address, Phone) consistency between the site's Company Data File and the Google Business Profile the client already has/will set up — these must match exactly, character for character.
10. **hreflang / internationalization**: not required for v1 (single-language site).

---

## 11. Data Layer — Company Information File

Create ONE static data file (location per existing folder conventions — see Section 14; do not scatter company facts across components) exporting a single typed object, imported everywhere the company's facts are needed (footer, schema.org JSON-LD, contact page, header phone number, WhatsApp links, etc.).

Example shape (adapt exact filename/casing to the existing project conventions):

```ts
// company.ts — single source of truth for all static company facts
export const company = {
  legalName: "1st Om Packers and Movers Pvt. Ltd.",
  brandName: "1st Om Packers and Movers",
  tagline: "", // TODO: confirm with client
  foundedYear: null, // TODO: confirm with client — do not guess
  phone: {
    primary: "", // TODO
    whatsapp: "", // TODO
  },
  email: {
    general: "", // TODO
  },
  headOffice: {
    addressLine: "", // TODO
    city: "",
    state: "Bihar",
    pincode: "",
  },
  branches: [
    // { city, addressLine, phone, mapEmbedUrl }
  ],
  certifications: [
    // ONLY include entries the client has actually provided proof of.
    // Never copy competitor certifications (ISO numbers, IBA codes, trademarks) — those belong to a different company.
  ],
  socials: {
    facebook: "",
    instagram: "",
    // etc.
  },
  serviceCategories: [
    "Home Shifting",
    "Office/Commercial Shifting",
    "Car Transportation",
    "Bike Transportation",
    "Packing & Unpacking",
    "Loading & Unloading",
    "Warehousing & Storage",
    "Goods Insurance",
  ],
} as const;
```

**Rule:** No component may hardcode a phone number, email, address, or service list inline. Everything imports from this file. If the client updates a phone number, it changes in exactly one place and the whole site updates.

---

## 12. Data Layer — Service Locations

This client's differentiator is genuine, wide route coverage (already compiled into a master route/location spreadsheet during discovery). This must live in **structured data files**, not hardcoded into page components, because it drives:
- The city/district pages (Section 9.2)
- The interstate route pages
- The sitemap
- The "Where We Serve" page
- Any location dropdown in the quote form

Suggested structure (adapt file naming/location to existing conventions — do not create a new top-level data pattern that conflicts with what's already there):

```
locations/
  bihar.ts            // all Bihar districts, typed, with slug + hub flag
  jharkhand.ts
  uttar-pradesh.ts
  delhi-ncr.ts
  west-bengal.ts
  other-relocation-markets.ts   // Mumbai, Pune, Bengaluru, Hyderabad, etc.
  other-states-served.ts
  interstate-routes.ts          // Patna–Delhi, Patna–Kolkata, etc.
  index.ts                      // aggregates and exports everything above
```

Each entry follows one consistent typed shape, e.g.:

```ts
export type ServiceLocation = {
  slug: string;          // "patna", "patna-to-ranchi"
  name: string;          // display name
  state: string;
  type: "hub" | "district" | "city" | "route";
  isPrimaryHub?: boolean;
};
```

**Rule:** Adding a new city/route to the business must only ever require adding one entry to the relevant file in `locations/`. It must never require touching a page component, the sitemap generator, or the nav — all of those must read from this data layer automatically.

---

## 13. Frontend Tech Stack

Standard stack (matches the project's established conventions — pulled from Unyrise Tech's internal frontend package guide):

- **React** (latest)
- **Vite** (latest) — build tool
- **Tailwind CSS** (latest, v4+ CSS-first configuration — see Section 2)
- **React Router DOM** (latest) — routing, including the dynamic location/route pages
- **Redux Toolkit + RTK Query** (latest) — state and data fetching from the Workers API
- **GSAP + ScrollTrigger** (latest) — scroll-driven motion (Section 5)
- **Lenis** (latest) — smooth scrolling
- **Framer Motion** (latest) — component-level animation/microinteractions
- **react-helmet-async** (latest) — per-page meta tags / SEO head management
- **lucide-react** (latest) — icons (Section 4.1)
- **react-icons/fa6** (latest) — social icons specifically (lucide does not export brand/social icons)
- React Three Fiber / Three.js — only if a specific interactive 3D moment is later approved; not required for v1, do not add "because it's in the stack" if there's no real use for it on this project.

**Do not pin exact version numbers anywhere** — in `package.json`, in documentation, in this file, or in code comments. Always install the latest stable release of each package at implementation time; the lockfile will pin actual resolved versions automatically. If a breaking change in a "latest" release causes a real problem, resolve it directly rather than working around it by pinning an old version as a permanent fix.

---

## 14. Folder Structure — MANDATORY

**The project already has an established folder structure.** Do not scaffold a new one. Do not restructure, rename, or "improve" the existing structure on your own initiative. Do not default to a generic Next.js/CRA/Vite-starter layout out of habit.

Before creating any file:
1. Look at what already exists in the repository.
2. Match its existing naming conventions, casing, and nesting exactly (kebab-case vs camelCase, `components/` vs `Components/`, whatever is already there).
3. Place new files (theme tokens, company data, locations data, new components/pages) into the location that is consistent with how similar existing files are organized.
4. If no structure exists yet for a given concern (e.g., there's no `data/` folder yet for the Company Info File and Locations files), propose exactly one location, state the reasoning in one line, and proceed — don't leave it ambiguous, but don't silently invent a structure that conflicts with an existing pattern either.

If you are ever unsure where something belongs, stop and ask rather than guessing and scattering files inconsistently.

---

## 15. Backend Architecture

- **Framework:** Hono (latest) — chosen specifically for its first-class Cloudflare Workers support.
- **Runtime/host:** Cloudflare Workers.
- **Folder structure** — even though Hono is lightweight, organize it like a standard Node.js API, with clear separation of concerns (again: follow the existing repo structure if one is already established; this is the pattern to use if the backend folder is being set up fresh):

```
src/
  index.ts            // Hono app entry, route mounting
  routes/             // route definitions only — no business logic here
  controllers/        // request/response handling, calls services
  services/           // business logic (lead creation, email trigger, etc.)
  middlewares/         // auth, validation, rate-limiting, error handling
  db/
    schema/           // D1 table schema (Drizzle ORM, latest)
    client.ts         // D1 binding + Drizzle client setup
  utils/
  types/
  config/             // environment/config access (typed, no scattered process.env-style reads)
```

- **Database:** Cloudflare D1, accessed via Drizzle ORM (latest) for typed queries and migrations — do not hand-write raw SQL scattered through controllers.
- **Validation:** Zod (latest) for request payload validation (e.g., the quote form) at the route/middleware boundary.
- **Spam protection on public forms:** Cloudflare Turnstile — stay inside the Cloudflare ecosystem rather than adding Google reCAPTCHA.
- **NEVER** put business logic directly inside route handler files — routes call controllers, controllers call services. This keeps the codebase testable and keeps Workers cold-start-friendly (no giant monolithic handler files).

---

## 16. Infrastructure & Deployment

**Guiding principle: default to Cloudflare's own services for everything possible; only reach for an external service where Cloudflare genuinely doesn't offer an equivalent yet.**

| Concern | Service | Notes |
|---|---|---|
| Frontend hosting | **Cloudflare Pages** | Connected to the repo; production + preview deployments per the project's existing Git workflow. |
| Backend/API | **Cloudflare Workers** (Hono) | See Section 15. |
| Database | **Cloudflare D1** | Primary relational store (leads, quotes, branches, any dynamic content). |
| Caching / rate limiting / sessions | **Cloudflare KV** | Use for anything that fits a key-value access pattern before reaching for D1. |
| Background/async jobs (e.g., "send confirmation email after quote submitted") | **Cloudflare Queues** | If/when async processing is needed, rather than blocking the request. |
| Bot/spam protection | **Cloudflare Turnstile** | On the quote form and any other public form. |
| Site analytics | **Cloudflare Web Analytics** | Privacy-friendly, no cookie banner burden, stays in-ecosystem — prefer this over Google Analytics unless the client specifically needs GA for ad platform integration later. |
| Media storage (images) | **Cloudinary** (external) | Chosen specifically for its generous 25GB free tier; used for all uploaded/served imagery with on-the-fly responsive/WebP transformations. |
| Transactional email (quote confirmations, lead notifications to the client) | **Brevo** (external) | Cloudflare does not yet offer a mature outbound transactional email product suitable for this; re-evaluate if Cloudflare ships a first-party equivalent later. |
| DNS | **Cloudflare** | (Assumed already the case given the rest of the stack.) |

**Rule:** Before introducing any new third-party service beyond Cloudinary and Brevo, check whether Cloudflare already offers an equivalent (Workers, D1, KV, R2, Queues, Turnstile, Images, Stream, Email Routing, etc.) and prefer that first. Document any exception here with a one-line reason, the same way Cloudinary and Brevo are documented above.

---

## 17. Accessibility & Performance Budget

- Color contrast: all text/background combinations from the token table (Section 2.3) must meet WCAG AA at minimum — verify `--color-text-muted` on `--color-background` and on `--color-surface` specifically, since muted text is the most common accessibility failure point.
- Visible keyboard focus states on every interactive element (forms, nav, buttons) — do not remove the default focus ring without providing an equally visible custom one.
- All form fields have real, associated `<label>` elements (not placeholder-as-label).
- Respect `prefers-reduced-motion` (Section 5).
- Performance budget: aim for a total page weight (excluding third-party embeds) under ~1.5MB on location/service pages; hero imagery must be responsive and appropriately compressed via Cloudinary, not a single oversized asset served to every device.

---

## 18. Absolute Don'ts — Final Checklist

Before marking any page "done," confirm none of the following are true:

- [ ] A hardcoded hex color exists anywhere in a component instead of a token reference.
- [ ] A hardcoded phone number/email/address exists anywhere instead of importing from the Company Data File.
- [ ] A city/route page reuses an identical paragraph skeleton with only the place-name swapped.
- [ ] Any fabricated certification, award, rating, or statistic appears anywhere on the site.
- [ ] Any mention of the tech stack, frameworks, or "how the site was built" appears in user-facing copy.
- [ ] A generic sparkle/wand/magic icon appears anywhere.
- [ ] A stock illustration/photo unrelated to moving, homes, or routes was used "because it looked modern."
- [ ] Every section on the page uses the identical fade-up-on-scroll animation.
- [ ] The page is missing a mobile bottom action bar (Call/WhatsApp).
- [ ] The page has no unique `<title>`/meta description, or duplicates another page's.
- [ ] A new folder pattern was invented instead of following the existing project structure.
- [ ] A package version number was pinned in a spec, comment, or documentation instead of "latest."
- [ ] An em dash, en dash, arrow character, emoji-as-bullet, or middle-dot meta string appears anywhere in site copy (Section 8.6).

If any box would be checked, fix it before calling the page complete.

---

## 19. Definition of Done (per page)

A page is complete only when:
1. It reads correctly and converts well at 375px width first, then scales up cleanly.
2. All copy passes the banned-words/AI-slop check (Section 8.2, 8.5).
3. All data (company facts, location facts) is pulled from Sections 11/12's data files — nothing hardcoded inline.
4. Structured data (JSON-LD) is present and accurate, with no fabricated fields.
5. Meta title/description/canonical are unique to that page.
6. Lighthouse (mobile, throttled) shows Performance, Accessibility, Best Practices, and SEO all in the green, with Core Web Vitals targets from Section 10.8 met.
7. The client, looking at it, says "this looks like a company we'd trust with our furniture" — not "this looks like a template with our name pasted in."
