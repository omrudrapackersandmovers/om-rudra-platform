/**
 * index.js — Locations Data Layer aggregator.
 *
 * This is the single import point for everything location-related.
 * The sitemap generator, "Where We Serve" page, quote form dropdowns,
 * and dynamic location route all import from here.
 *
 * Adding a new city/route: add it to the relevant state file. Done.
 * Never touch this aggregator unless you're adding a whole new state file.
 */

export { biharLocations } from "./bihar";
export { jharkhandLocations } from "./jharkhand";
export { uttarPradeshLocations } from "./uttar-pradesh";
export { delhiNcrLocations } from "./delhi-ncr";
export { westBengalLocations } from "./west-bengal";
export { otherRelocationMarkets } from "./other-relocation-markets";
export { interstateRoutes } from "./interstate-routes";

// ── Aggregated collections ────────────────────────────────────────────────────

import { biharLocations } from "./bihar";
import { jharkhandLocations } from "./jharkhand";
import { uttarPradeshLocations } from "./uttar-pradesh";
import { delhiNcrLocations } from "./delhi-ncr";
import { westBengalLocations } from "./west-bengal";
import { otherRelocationMarkets } from "./other-relocation-markets";
import { interstateRoutes } from "./interstate-routes";

/**
 * All service locations (city/district pages) — used for sitemap + "Where We Serve"
 */
export const allServiceLocations = [
  ...biharLocations,
  ...jharkhandLocations,
  ...uttarPradeshLocations,
  ...delhiNcrLocations,
  ...westBengalLocations,
  ...otherRelocationMarkets,
];

/**
 * Hub cities only — used for branch selectors, primary nav dropdowns
 */
export const hubLocations = allServiceLocations.filter(
  (loc) => loc.type === "hub"
);

/**
 * Primary hub — Patna (used for schema.org headquarters and default context)
 */
export const primaryHub = allServiceLocations.find(
  (loc) => loc.isPrimaryHub === true
);

/**
 * Locations grouped by state — used on the "Where We Serve" page
 */
export const locationsByState = allServiceLocations.reduce((acc, loc) => {
  if (!acc[loc.state]) acc[loc.state] = [];
  acc[loc.state].push(loc);
  return acc;
}, {});

/**
 * Place poster images for states and regions (optimized WebP format)
 */
export const placeImages = {
  Bihar: "/images/places/bihar.webp",
  Jharkhand: "/images/places/jharkhand.webp",
  "Uttar Pradesh": "/images/places/up.webp",
  "Delhi NCR": "/images/places/delhi-ncr.webp",
  "West Bengal": "/images/places/west-bengal.webp",
  Maharashtra: "/images/places/maharashtra.webp",
  Karnataka: "/images/places/karnataka.webp",
  Telangana: "/images/places/telangana.webp",
  Gujarat: "/images/places/gujrat.webp",
  Rajasthan: "/images/places/rajasthan.webp",
  "Madhya Pradesh": "/images/places/mp.webp",
  "Tamil Nadu": "/images/places/tamil-nadu.webp",
  Chandigarh: "/images/places/chandigarh.webp",
};

/**
 * All routes — used for sitemap + route pages
 */
export { interstateRoutes as allRoutes };

/**
 * Hyper-local profile and metadata helpers
 */
export { locationProfiles, getLocationProfile } from "./contextData";
