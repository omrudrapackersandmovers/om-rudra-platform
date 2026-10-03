# 1st Om Packers and Movers — User Journey & Admin Panel Specification

**Status:** Final — companion to `design.md`. Read `design.md` first; this file assumes its tokens, data layer, and stack decisions and does not repeat them.
**Purpose:** Define exactly what happens from "someone finds the site" through "the client's team closes the booking," and exactly what the admin panel does and does not do, before any code is written.

---

## 0. The core model — read this first

This is a **lead-generation site with a manual sales process behind it**, not a booking/e-commerce platform. The public site's only job is to turn a visitor into a phone call or a submitted form. Everything after that — quoting the actual price, scheduling the truck, confirming the move, collecting payment — happens **offline, by the client's team, over phone or WhatsApp**, exactly like it does today. Nothing in this spec should introduce online payments, live truck tracking, automated pricing, or customer accounts. If a future request implies one of those, stop and confirm with the client before building it — it is a scope change, not an assumed v1 feature.

The admin panel exists for one reason: **so the client never loses a lead and never has to ask a developer to change a phone number, a price, or a testimonial.**

---

## 1. Customer-Facing User Journey

### 1.1 Entry points (where traffic comes from)

- Organic search for a specific city/route ("packers and movers Ranchi", "Patna to Delhi packers movers")
- Google Business Profile listing (once set up)
- A WhatsApp message forwarded by someone ("check this out")
- Direct — someone typed the domain or has it saved
- Social (Facebook/Instagram, per Unyrise's existing social setup pattern for this client)

The design implication (already captured in `design.md` Section 9): **every one of these entry points can land on a deep page**, not just the homepage. A city/route page must independently carry enough trust-building content and a clear next action — it cannot assume the visitor saw the homepage first.

### 1.2 The journey, step by step

1. **Finds the site.** No action needed from us here beyond what's already specified (SEO, GBP, social).
2. **Lands on a relevant page.** Homepage, a service page, or — most commonly for this business — a city/route page.
3. **Builds trust in seconds, not minutes.** On mobile, above the fold: what the company does, that it serves *this* city/route specifically, and a way to act immediately. This is the hero + trust bar from `design.md` Section 7.
4. **Chooses one of two paths** (both must be equally easy to find, not one buried below the other):
   - **Direct contact** — taps Call or WhatsApp from the persistent mobile action bar (`design.md` Section 6.1). This is the fastest path and, for this audience, often the preferred one — many people relocating want to just talk to someone rather than fill a form.
   - **Quote form** — fills the short form (Moving From / Moving To / Phone / Move Type / Timeline / Service). This path exists for people who found the site outside calling hours, or who want to leave details before a call happens.
5. **Client team follows up manually.** Whichever path was taken, a human on the client's side does the actual conversation, quoting, and scheduling. The site's job ends here.

### 1.3 What "done" looks like for this journey

- A visitor never has to hunt for a phone number — it is visible in the header, in the sticky mobile bar, and in the footer on every single page.
- A visitor filling the form never wonders if it worked — there is a clear, immediate on-screen confirmation after submission (not just a spinner that resolves silently).
- No dead ends: every page, including a 404, has a way to call/WhatsApp or get back to a page with a form.

### 1.4 Explicitly out of scope for v1 (do not build unless asked)

- Customer login/account creation
- Online payment collection
- A "track my shipment" feature (the reference competitor site has one; this client has not asked for it — do not add it speculatively)
- Automated instant price quoting (the rate table on the site is indicative, per `design.md` Section 7 pricing table — a human still finalizes the real quote)
- Live chat widgets — the WhatsApp deep-link already covers the "talk to someone now" need without adding a new tool to maintain

---

## 2. What the Form Submission Actually Captures

The quote form (already specified in `design.md` Section 7) must capture, at minimum:

| Field | Type | Required |
|---|---|---|
| Name | text | Yes |
| Phone | tel | Yes |
| Moving From | text/location | Yes |
| Moving To | text/location | Yes |
| Move type | select: Within city / Within state / Other state | Yes |
| Service needed | select: Home shifting, Office shifting, Car transport, Bike transport, Other | Yes |
| Preferred timeline | select: Urgent, Within a week, Within 15 days, Within a month, Not fixed | Yes |
| Email | email | No |

Keep it to one screen on mobile. Do not add fields "for completeness" that aren't listed here without checking with the client — every extra required field measurably reduces form completion on mobile.

---

## 3. Lead Handling (Backend Flow)

This is the flow already sketched: form submit → Cloudflare Worker validates and checks for spam (Turnstile) → lead is written to Cloudflare D1 → an email notification goes to the client's team via Brevo → the lead appears in the admin panel.

Requirements:
- **No lead is ever silently dropped.** If the email notification fails for any reason, the lead must still be safely stored in D1 and visible in the admin panel — the email is a convenience notification, not the system of record.
- **Every lead gets a status**, starting at `new`, so nothing sits unactioned without anyone noticing (see Section 4.2).
- **Duplicate protection is a nice-to-have, not a blocker for v1** — if the same phone number submits twice within a short window, it's fine to just show both; do not build deduplication logic unless leads volume makes it a real problem later.

---

## 4. Admin Panel — Full Specification

### 4.1 Who uses it

Internal staff at 1st Om Packers and Movers only. Not a multi-tenant system, not customer-facing. Single role for v1 — do not build a permissions/roles system (admin vs. staff vs. viewer) unless the client specifically says they need it; it adds real complexity for no v1 benefit.

**Access:** Cloudflare Access in front of the admin panel is the preferred approach (stays inside the Cloudflare ecosystem per `design.md` Section 16) — a simple login gate, no public sign-up flow, no "forgot password" email flow to build and maintain unless Cloudflare Access alone doesn't cover the requirement.

### 4.2 Module: Leads & Quotes (the most important module — build this first)

- **List view**: every submitted lead, newest first, showing at a glance: name, phone, from → to, service, timeline, status, submitted date.
- **Status field per lead**: `new` → `contacted` → `converted` or `lost`. Staff update this manually as they work the lead. This is the entire "CRM" — do not build pipelines, deal values, or scheduling on top of it for v1.
- **Detail view**: tapping a lead shows the full submitted form data and a free-text notes field staff can add to (e.g., "quoted ₹28,000, following up Thursday").
- **Filter/search**: by status at minimum (so "show me everything still `new`" is one tap). Filter by date range is a reasonable v1 addition; filter by city/route can wait.
- **Notification settings**: which email address(es) get the "new lead" alert — editable here, not hardcoded, so the client can change who gets notified without a developer.
- **Export**: a basic CSV export of leads is useful for the client's own records/accounting — include if it's low-effort, don't block launch on it if not.

### 4.3 Module: Site Content

Everything here maps directly to something a non-technical staff member would otherwise have to ask a developer to change. Each of these is edited in the admin panel and read by the public site at render time — never hardcoded in a component (this is the same "single source of truth" principle as `design.md` Section 2, applied to content that changes more often than colors do).

- **Company info** — the fields defined in `design.md` Section 11 (phone numbers, WhatsApp number, email, head office address, business hours, social links). Note: `design.md` describes this as a static data file maintained by developers for the initial launch; the admin panel's job is to let staff update the *fields that change in the ordinary course of business* (a phone number, hours, an added branch) without a code deployment. Structural/SEO-sensitive fields (page titles, schema.org data shape) stay developer-maintained.
- **Branches** — add/edit a branch: city, address, phone, map link.
- **Pricing/rate table** — edit the indicative rates shown on the pricing section (per home size / distance slab, as already laid out in `design.md` Section 7). This is one of the highest-value admin features: rates change and the client should never need a developer for that.
- **Testimonials** — add a new testimonial (name, text, optional rating), toggle one published/unpublished. **Only real testimonials go in** — the admin panel does not seed or suggest fake ones, and no placeholder testimonial ships to production.

### 4.4 Module: Team & Settings

- Manage which staff logins have access (if Cloudflare Access alone doesn't give the client enough self-service here, keep this minimal — a simple invite/remove list, not a full user-management system).
- Notification email(s) for new leads (can live here or inside the Leads module — pick one location, don't duplicate the setting in two places).

### 4.5 Explicitly out of scope for the admin panel v1

- Editing the Locations Data Layer (districts/routes from `design.md` Section 12) through the admin UI. That data is large, SEO-structural, and changes rarely — it stays a developer-maintained data file for now. Revisit only if the client starts needing to add new service areas frequently enough that it becomes a real bottleneck.
- Blog/CMS authoring tools (no blog is in scope per `design.md` Section 9.1 unless the client asks later).
- Analytics dashboards inside the admin panel — Cloudflare Web Analytics (per `design.md` Section 16) is used directly for that; don't rebuild a second analytics view inside the admin panel.
- Any customer-facing account system, as noted in Section 1.4.

---

## 5. Definition of Done for This Phase

Before writing code, confirm with the client:
1. The two-path journey (direct contact vs. form) in Section 1.2 matches how they actually want to receive leads.
2. The form fields in Section 2 are the right ones — nothing missing that they'd need to ask a customer anyway, nothing extra that will cause people to abandon the form.
3. The four admin modules in Section 4 cover everything they'd otherwise be messaging a developer about day-to-day. If something is missing, add it here — as a line in this document — before it becomes a mid-build surprise.
4. The out-of-scope lists (Sections 1.4 and 4.5) are genuinely out of scope for now, not things the client actually needs on day one.

Once confirmed, this file and `design.md` together are the complete brief — implementation can begin.
