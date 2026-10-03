/** @typedef {{ slug: string, name: string, state: string, type: "hub" | "district" | "city", isPrimaryHub?: boolean }} ServiceLocation */

/** @type {ServiceLocation[]} */
export const westBengalLocations = [
  // ── Hubs ─────────────────────────────────────────────────
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", type: "hub" },
  { slug: "siliguri", name: "Siliguri", state: "West Bengal", type: "hub" },
  { slug: "asansol", name: "Asansol", state: "West Bengal", type: "hub" },

  // ── Districts ─────────────────────────────────────────────
  { slug: "durgapur", name: "Durgapur", state: "West Bengal", type: "city" },
  { slug: "howrah", name: "Howrah", state: "West Bengal", type: "city" },
  { slug: "kharagpur", name: "Kharagpur", state: "West Bengal", type: "city" },
  { slug: "burdwan", name: "Burdwan (Bardhaman)", state: "West Bengal", type: "district" },
  { slug: "malda", name: "Malda (English Bazar)", state: "West Bengal", type: "district" },
  { slug: "murshidabad", name: "Murshidabad (Baharampur)", state: "West Bengal", type: "district" },
  { slug: "nadia", name: "Nadia (Krishnanagar)", state: "West Bengal", type: "district" },
  { slug: "north-24-parganas", name: "North 24 Parganas (Barasat)", state: "West Bengal", type: "district" },
  { slug: "south-24-parganas", name: "South 24 Parganas (Alipore)", state: "West Bengal", type: "district" },
  { slug: "cooch-behar", name: "Cooch Behar", state: "West Bengal", type: "district" },
  { slug: "jalpaiguri", name: "Jalpaiguri", state: "West Bengal", type: "district" },
];
