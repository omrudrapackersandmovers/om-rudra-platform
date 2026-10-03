/**
 * interstate-routes.js
 *
 * High-intent interstate routes — each gets its own page targeting
 * queries like "Patna to Delhi packers and movers."
 *
 * slug format: "[origin]-to-[destination]"
 * These slugs resolve to /route/[slug] pages.
 */

/** @typedef {{ slug: string, from: string, to: string, fromSlug: string, toSlug: string, distanceKm: number | null }} InterstateRoute */

/** @type {InterstateRoute[]} */
export const interstateRoutes = [
  // ── From Patna ────────────────────────────────────────────
  { slug: "patna-to-delhi", from: "Patna", to: "Delhi NCR", fromSlug: "patna", toSlug: "delhi", distanceKm: 1000 },
  { slug: "patna-to-kolkata", from: "Patna", to: "Kolkata", fromSlug: "patna", toSlug: "kolkata", distanceKm: 581 },
  { slug: "patna-to-ranchi", from: "Patna", to: "Ranchi", fromSlug: "patna", toSlug: "ranchi", distanceKm: 341 },
  { slug: "patna-to-mumbai", from: "Patna", to: "Mumbai", fromSlug: "patna", toSlug: "mumbai", distanceKm: 1874 },
  { slug: "patna-to-bengaluru", from: "Patna", to: "Bengaluru", fromSlug: "patna", toSlug: "bengaluru", distanceKm: 2350 },
  { slug: "patna-to-hyderabad", from: "Patna", to: "Hyderabad", fromSlug: "patna", toSlug: "hyderabad", distanceKm: 1870 },
  { slug: "patna-to-lucknow", from: "Patna", to: "Lucknow", fromSlug: "patna", toSlug: "lucknow", distanceKm: 534 },
  { slug: "patna-to-varanasi", from: "Patna", to: "Varanasi", fromSlug: "patna", toSlug: "varanasi", distanceKm: 280 },
  { slug: "patna-to-jamshedpur", from: "Patna", to: "Jamshedpur", fromSlug: "patna", toSlug: "jamshedpur", distanceKm: 334 },
  { slug: "patna-to-dhanbad", from: "Patna", to: "Dhanbad", fromSlug: "patna", toSlug: "dhanbad", distanceKm: 340 },
  { slug: "patna-to-siliguri", from: "Patna", to: "Siliguri", fromSlug: "patna", toSlug: "siliguri", distanceKm: 630 },
  { slug: "patna-to-pune", from: "Patna", to: "Pune", fromSlug: "patna", toSlug: "pune", distanceKm: 1950 },
  { slug: "patna-to-chennai", from: "Patna", to: "Chennai", fromSlug: "patna", toSlug: "chennai", distanceKm: 2180 },
  { slug: "patna-to-jaipur", from: "Patna", to: "Jaipur", fromSlug: "patna", toSlug: "jaipur", distanceKm: 1120 },
  { slug: "patna-to-ahmedabad", from: "Patna", to: "Ahmedabad", fromSlug: "patna", toSlug: "ahmedabad", distanceKm: 1900 },
  { slug: "patna-to-bhopal", from: "Patna", to: "Bhopal", fromSlug: "patna", toSlug: "bhopal", distanceKm: 1180 },
  { slug: "patna-to-indore", from: "Patna", to: "Indore", fromSlug: "patna", toSlug: "indore", distanceKm: 1360 },
  { slug: "patna-to-chandigarh", from: "Patna", to: "Chandigarh", fromSlug: "patna", toSlug: "chandigarh", distanceKm: 1250 },
  { slug: "patna-to-gurgaon", from: "Patna", to: "Gurgaon", fromSlug: "patna", toSlug: "gurgaon", distanceKm: 1040 },
  { slug: "patna-to-noida", from: "Patna", to: "Noida", fromSlug: "patna", toSlug: "noida", distanceKm: 1010 },

  // ── From Ranchi ───────────────────────────────────────────
  { slug: "ranchi-to-delhi", from: "Ranchi", to: "Delhi NCR", fromSlug: "ranchi", toSlug: "delhi", distanceKm: 1280 },
  { slug: "ranchi-to-kolkata", from: "Ranchi", to: "Kolkata", fromSlug: "ranchi", toSlug: "kolkata", distanceKm: 410 },
  { slug: "ranchi-to-mumbai", from: "Ranchi", to: "Mumbai", fromSlug: "ranchi", toSlug: "mumbai", distanceKm: 1830 },
  { slug: "ranchi-to-patna", from: "Ranchi", to: "Patna", fromSlug: "ranchi", toSlug: "patna", distanceKm: 341 },
  { slug: "ranchi-to-bengaluru", from: "Ranchi", to: "Bengaluru", fromSlug: "ranchi", toSlug: "bengaluru", distanceKm: 2100 },
  { slug: "ranchi-to-hyderabad", from: "Ranchi", to: "Hyderabad", fromSlug: "ranchi", toSlug: "hyderabad", distanceKm: 1600 },

  // ── From Gaya ─────────────────────────────────────────────
  { slug: "gaya-to-delhi", from: "Gaya", to: "Delhi NCR", fromSlug: "gaya", toSlug: "delhi", distanceKm: 1080 },
  { slug: "gaya-to-kolkata", from: "Gaya", to: "Kolkata", fromSlug: "gaya", toSlug: "kolkata", distanceKm: 490 },

  // ── From Muzaffarpur ──────────────────────────────────────
  { slug: "muzaffarpur-to-delhi", from: "Muzaffarpur", to: "Delhi NCR", fromSlug: "muzaffarpur", toSlug: "delhi", distanceKm: 1100 },
  { slug: "muzaffarpur-to-kolkata", from: "Muzaffarpur", to: "Kolkata", fromSlug: "muzaffarpur", toSlug: "kolkata", distanceKm: 700 },

  // ── From Bhagalpur ────────────────────────────────────────
  { slug: "bhagalpur-to-delhi", from: "Bhagalpur", to: "Delhi NCR", fromSlug: "bhagalpur", toSlug: "delhi", distanceKm: 1200 },
  { slug: "bhagalpur-to-kolkata", from: "Bhagalpur", to: "Kolkata", fromSlug: "bhagalpur", toSlug: "kolkata", distanceKm: 390 },

  // ── From Jamshedpur ───────────────────────────────────────
  { slug: "jamshedpur-to-delhi", from: "Jamshedpur", to: "Delhi NCR", fromSlug: "jamshedpur", toSlug: "delhi", distanceKm: 1430 },
  { slug: "jamshedpur-to-kolkata", from: "Jamshedpur", to: "Kolkata", fromSlug: "jamshedpur", toSlug: "kolkata", distanceKm: 270 },
  { slug: "jamshedpur-to-mumbai", from: "Jamshedpur", to: "Mumbai", fromSlug: "jamshedpur", toSlug: "mumbai", distanceKm: 1900 },
  { slug: "jamshedpur-to-bengaluru", from: "Jamshedpur", to: "Bengaluru", fromSlug: "jamshedpur", toSlug: "bengaluru", distanceKm: 2000 },
];
