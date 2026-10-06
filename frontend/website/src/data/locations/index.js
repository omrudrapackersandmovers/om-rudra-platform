/**
 * index.js - Locations Data Layer aggregator.
 *
 * This is the single import point for everything location-related.
 * The sitemap generator, "Where We Serve" page, quote form dropdowns,
 * and dynamic location route all import from here.
 *
 * Adding a new city/route: add it to the relevant state file. Done.
 * Never touch this aggregator unless you're adding a whole new state file.
 */

export { biharLocations } from "./bihar.js";
export { jharkhandLocations } from "./jharkhand.js";
export { uttarPradeshLocations } from "./uttar-pradesh.js";
export { delhiNcrLocations } from "./delhi-ncr.js";
export { westBengalLocations } from "./west-bengal.js";
export { otherRelocationMarkets } from "./other-relocation-markets.js";
export { interstateRoutes } from "./interstate-routes.js";

// ── Aggregated collections ────────────────────────────────────────────────────

import { biharLocations } from "./bihar.js";
import { jharkhandLocations } from "./jharkhand.js";
import { uttarPradeshLocations } from "./uttar-pradesh.js";
import { delhiNcrLocations } from "./delhi-ncr.js";
import { westBengalLocations } from "./west-bengal.js";
import { otherRelocationMarkets } from "./other-relocation-markets.js";
import { interstateRoutes } from "./interstate-routes.js";

/**
 * All service locations (city/district pages) - used for sitemap + "Where We Serve"
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
 * Hub cities only - used for branch selectors, primary nav dropdowns
 */
export const hubLocations = allServiceLocations.filter(
  (loc) => loc.type === "hub"
);

/**
 * Primary hub - Patna (used for schema.org headquarters and default context)
 */
export const primaryHub = allServiceLocations.find(
  (loc) => loc.isPrimaryHub === true
);

/**
 * Locations grouped by state - used on the "Where We Serve" page
 */
export const locationsByState = allServiceLocations.reduce((acc, loc) => {
  if (!acc[loc.state]) acc[loc.state] = [];
  acc[loc.state].push(loc);
  return acc;
}, {});

/**
 * Illustrative landmark views for states and regions (optimized WebP format)
 */
export const placeImages = {
  Bihar: "/images/places/bihar-v2.webp",
  Jharkhand: "/images/places/jharkhand-v2.webp",
  "Uttar Pradesh": "/images/places/up-v2.webp",
  "Delhi NCR": "/images/places/delhi-ncr-v2.webp",
  "West Bengal": "/images/places/west-bengal-v2.webp",
  Maharashtra: "/images/places/maharashtra-v2.webp",
  Karnataka: "/images/places/karnataka-v2.webp",
  Telangana: "/images/places/telangana-v2.webp",
  Gujarat: "/images/places/gujrat-v2.webp",
  Rajasthan: "/images/places/rajasthan-v2.webp",
  "Madhya Pradesh": "/images/places/mp-v2.webp",
  "Tamil Nadu": "/images/places/tamil-nadu-v2.webp",
  Chandigarh: "/images/places/chandigarh-v2.webp",
};

export const placeImageDescriptions = {
  Bihar: "Illustrative view of Golghar in Patna",
  Jharkhand: "Illustrative view of Dassam Falls near Ranchi",
  "Uttar Pradesh": "Illustrative view of Rumi Darwaza in Lucknow",
  "Delhi NCR": "Illustrative view of India Gate in New Delhi",
  "West Bengal": "Illustrative view of Victoria Memorial in Kolkata",
  Maharashtra: "Illustrative view of Gateway of India in Mumbai",
  Karnataka: "Illustrative view of Vidhana Soudha in Bengaluru",
  Telangana: "Illustrative view of Charminar in Hyderabad",
  Gujarat: "Illustrative view of Sabarmati Riverfront in Ahmedabad",
  Rajasthan: "Illustrative view of Hawa Mahal in Jaipur",
  "Madhya Pradesh": "Illustrative view of the Great Stupa at Sanchi",
  "Tamil Nadu": "Illustrative view of Shore Temple in Mamallapuram",
  Chandigarh: "Illustrative view of Sukhna Lake in Chandigarh",
};

/**
 * All routes - used for sitemap + route pages
 */
export { interstateRoutes as allRoutes };

/**
 * Hyper-local profile and metadata helpers
 */
export { locationProfiles, getLocationProfile } from "./contextData.js";
