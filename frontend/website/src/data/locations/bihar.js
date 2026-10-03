/**
 * bihar.js — All Bihar service locations.
 *
 * type: "hub"      → full-service branch, dedicated page with branch info + rate table
 * type: "district" → district/city page with unique content (lighter than hub)
 *
 * isPrimaryHub: true → Patna is the main operational headquarters
 */

/** @typedef {{ slug: string, name: string, state: string, type: "hub" | "district" | "city", isPrimaryHub?: boolean }} ServiceLocation */

/** @type {ServiceLocation[]} */
export const biharLocations = [
  // ── Hubs ─────────────────────────────────────────────────
  { slug: "patna", name: "Patna", state: "Bihar", type: "hub", isPrimaryHub: true },
  { slug: "gaya", name: "Gaya", state: "Bihar", type: "hub" },
  { slug: "muzaffarpur", name: "Muzaffarpur", state: "Bihar", type: "hub" },
  { slug: "bhagalpur", name: "Bhagalpur", state: "Bihar", type: "hub" },

  // ── Districts ─────────────────────────────────────────────
  { slug: "nalanda", name: "Nalanda", state: "Bihar", type: "district" },
  { slug: "arrah", name: "Arrah (Bhojpur)", state: "Bihar", type: "district" },
  { slug: "chapra", name: "Chapra (Saran)", state: "Bihar", type: "district" },
  { slug: "darbhanga", name: "Darbhanga", state: "Bihar", type: "district" },
  { slug: "purnia", name: "Purnia", state: "Bihar", type: "district" },
  { slug: "samastipur", name: "Samastipur", state: "Bihar", type: "district" },
  { slug: "begusarai", name: "Begusarai", state: "Bihar", type: "district" },
  { slug: "sitamarhi", name: "Sitamarhi", state: "Bihar", type: "district" },
  { slug: "madhubani", name: "Madhubani", state: "Bihar", type: "district" },
  { slug: "supaul", name: "Supaul", state: "Bihar", type: "district" },
  { slug: "kishanganj", name: "Kishanganj", state: "Bihar", type: "district" },
  { slug: "araria", name: "Araria", state: "Bihar", type: "district" },
  { slug: "katihar", name: "Katihar", state: "Bihar", type: "district" },
  { slug: "munger", name: "Munger", state: "Bihar", type: "district" },
  { slug: "lakhisarai", name: "Lakhisarai", state: "Bihar", type: "district" },
  { slug: "sheikhpura", name: "Sheikhpura", state: "Bihar", type: "district" },
  { slug: "nawada", name: "Nawada", state: "Bihar", type: "district" },
  { slug: "aurangabad", name: "Aurangabad", state: "Bihar", type: "district" },
  { slug: "rohtas", name: "Rohtas (Sasaram)", state: "Bihar", type: "district" },
  { slug: "kaimur", name: "Kaimur (Bhabua)", state: "Bihar", type: "district" },
  { slug: "buxar", name: "Buxar", state: "Bihar", type: "district" },
  { slug: "siwan", name: "Siwan", state: "Bihar", type: "district" },
  { slug: "gopalganj", name: "Gopalganj", state: "Bihar", type: "district" },
  { slug: "east-champaran", name: "East Champaran (Motihari)", state: "Bihar", type: "district" },
  { slug: "west-champaran", name: "West Champaran (Bettiah)", state: "Bihar", type: "district" },
  { slug: "sheohar", name: "Sheohar", state: "Bihar", type: "district" },
  { slug: "vaishali", name: "Vaishali (Hajipur)", state: "Bihar", type: "district" },
  { slug: "jehanabad", name: "Jehanabad", state: "Bihar", type: "district" },
  { slug: "arwal", name: "Arwal", state: "Bihar", type: "district" },
  { slug: "banka", name: "Banka", state: "Bihar", type: "district" },
  { slug: "jamui", name: "Jamui", state: "Bihar", type: "district" },
  { slug: "khagaria", name: "Khagaria", state: "Bihar", type: "district" },
];
