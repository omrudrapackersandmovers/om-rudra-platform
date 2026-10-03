/** @typedef {{ slug: string, name: string, state: string, type: "hub" | "district" | "city", isPrimaryHub?: boolean }} ServiceLocation */

/** @type {ServiceLocation[]} */
export const uttarPradeshLocations = [
  // ── Hubs ─────────────────────────────────────────────────
  { slug: "varanasi", name: "Varanasi", state: "Uttar Pradesh", type: "hub" },
  { slug: "lucknow", name: "Lucknow", state: "Uttar Pradesh", type: "hub" },
  { slug: "allahabad", name: "Prayagraj (Allahabad)", state: "Uttar Pradesh", type: "hub" },
  { slug: "gorakhpur", name: "Gorakhpur", state: "Uttar Pradesh", type: "hub" },

  // ── Districts / Cities ────────────────────────────────────
  { slug: "agra", name: "Agra", state: "Uttar Pradesh", type: "city" },
  { slug: "kanpur", name: "Kanpur", state: "Uttar Pradesh", type: "city" },
  { slug: "meerut", name: "Meerut", state: "Uttar Pradesh", type: "city" },
  { slug: "bareilly", name: "Bareilly", state: "Uttar Pradesh", type: "city" },
  { slug: "aligarh", name: "Aligarh", state: "Uttar Pradesh", type: "city" },
  { slug: "moradabad", name: "Moradabad", state: "Uttar Pradesh", type: "city" },
  { slug: "saharanpur", name: "Saharanpur", state: "Uttar Pradesh", type: "city" },
  { slug: "ghaziabad", name: "Ghaziabad", state: "Uttar Pradesh", type: "city" },
  { slug: "jhansi", name: "Jhansi", state: "Uttar Pradesh", type: "city" },
  { slug: "mathura", name: "Mathura", state: "Uttar Pradesh", type: "city" },
  { slug: "firozabad", name: "Firozabad", state: "Uttar Pradesh", type: "city" },
  { slug: "deoria", name: "Deoria", state: "Uttar Pradesh", type: "district" },
  { slug: "kushinagar", name: "Kushinagar", state: "Uttar Pradesh", type: "district" },
  { slug: "basti", name: "Basti", state: "Uttar Pradesh", type: "district" },
  { slug: "ballia", name: "Ballia", state: "Uttar Pradesh", type: "district" },
  { slug: "azamgarh", name: "Azamgarh", state: "Uttar Pradesh", type: "district" },
  { slug: "ghazipur", name: "Ghazipur", state: "Uttar Pradesh", type: "district" },
  { slug: "mirzapur", name: "Mirzapur", state: "Uttar Pradesh", type: "district" },
  { slug: "sonbhadra", name: "Sonbhadra (Robertsganj)", state: "Uttar Pradesh", type: "district" },
];
