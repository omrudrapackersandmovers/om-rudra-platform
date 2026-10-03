/** @typedef {{ slug: string, name: string, state: string, type: "hub" | "district" | "city", isPrimaryHub?: boolean }} ServiceLocation */

/** @type {ServiceLocation[]} */
export const jharkhandLocations = [
  // ── Hubs ─────────────────────────────────────────────────
  { slug: "ranchi", name: "Ranchi", state: "Jharkhand", type: "hub" },
  { slug: "jamshedpur", name: "Jamshedpur", state: "Jharkhand", type: "hub" },
  { slug: "dhanbad", name: "Dhanbad", state: "Jharkhand", type: "hub" },

  // ── Districts ─────────────────────────────────────────────
  { slug: "bokaro", name: "Bokaro", state: "Jharkhand", type: "district" },
  { slug: "hazaribagh", name: "Hazaribagh", state: "Jharkhand", type: "district" },
  { slug: "deoghar", name: "Deoghar", state: "Jharkhand", type: "district" },
  { slug: "giridih", name: "Giridih", state: "Jharkhand", type: "district" },
  { slug: "dumka", name: "Dumka", state: "Jharkhand", type: "district" },
  { slug: "palamu", name: "Palamu (Daltonganj)", state: "Jharkhand", type: "district" },
  { slug: "chaibasa", name: "Chaibasa (West Singhbhum)", state: "Jharkhand", type: "district" },
  { slug: "chakulia", name: "Chakulia (East Singhbhum)", state: "Jharkhand", type: "district" },
  { slug: "simdega", name: "Simdega", state: "Jharkhand", type: "district" },
  { slug: "lohardaga", name: "Lohardaga", state: "Jharkhand", type: "district" },
  { slug: "gumla", name: "Gumla", state: "Jharkhand", type: "district" },
  { slug: "khunti", name: "Khunti", state: "Jharkhand", type: "district" },
  { slug: "chatra", name: "Chatra", state: "Jharkhand", type: "district" },
  { slug: "koderma", name: "Koderma", state: "Jharkhand", type: "district" },
  { slug: "jamtara", name: "Jamtara", state: "Jharkhand", type: "district" },
  { slug: "pakur", name: "Pakur", state: "Jharkhand", type: "district" },
  { slug: "godda", name: "Godda", state: "Jharkhand", type: "district" },
  { slug: "sahibganj", name: "Sahibganj", state: "Jharkhand", type: "district" },
  { slug: "ramgarh", name: "Ramgarh", state: "Jharkhand", type: "district" },
  { slug: "seraikela", name: "Seraikela-Kharsawan", state: "Jharkhand", type: "district" },
];
