/**
 * bihar.js - All Bihar service locations.
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

  // Client location list, reviewed October 2026. These are destinations, not branches.
  {"slug": "saharsa", "name": "Saharsa", "state": "Bihar", "type": "district"},
  {"slug": "madhepura", "name": "Madhepura", "state": "Bihar", "type": "district"},
  {"slug": "dehri-on-sone", "name": "Dehri-on-Sone", "state": "Bihar", "type": "city"},
  {"slug": "jamalpur", "name": "Jamalpur", "state": "Bihar", "type": "city"},
  {"slug": "mokama", "name": "Mokama", "state": "Bihar", "type": "city"},
  {"slug": "barh", "name": "Barh", "state": "Bihar", "type": "city"},
  {"slug": "maner", "name": "Maner", "state": "Bihar", "type": "city"},
  {"slug": "bihta", "name": "Bihta", "state": "Bihar", "type": "city"},
  {"slug": "bakhtiyarpur", "name": "Bakhtiyarpur", "state": "Bihar", "type": "city"},
  {"slug": "rajgir", "name": "Rajgir", "state": "Bihar", "type": "city"},
  {"slug": "hilsa", "name": "Hilsa", "state": "Bihar", "type": "city"},
  {"slug": "sonpur", "name": "Sonpur", "state": "Bihar", "type": "city"},
  {"slug": "raxaul", "name": "Raxaul", "state": "Bihar", "type": "city"},
  {"slug": "narkatiaganj", "name": "Narkatiaganj", "state": "Bihar", "type": "city"},
  {"slug": "benipatti", "name": "Benipatti", "state": "Bihar", "type": "city"},
  {"slug": "dumraon", "name": "Dumraon", "state": "Bihar", "type": "city"},
  {"slug": "simri-bakhtiyarpur", "name": "Simri Bakhtiyarpur", "state": "Bihar", "type": "city"},
  {"slug": "piro", "name": "Piro", "state": "Bihar", "type": "city"},
  {"slug": "paliganj", "name": "Paliganj", "state": "Bihar", "type": "city"},
  {"slug": "islampur", "name": "Islampur", "state": "Bihar", "type": "city"},
  {"slug": "jhajha", "name": "Jhajha", "state": "Bihar", "type": "city"},
  {"slug": "dalsinghsarai", "name": "Dalsinghsarai", "state": "Bihar", "type": "city"},
  {"slug": "rosera", "name": "Rosera", "state": "Bihar", "type": "city"},
  {"slug": "jhanjharpur", "name": "Jhanjharpur", "state": "Bihar", "type": "city"},
  {"slug": "nirmali", "name": "Nirmali", "state": "Bihar", "type": "city"},
  {"slug": "jogbani", "name": "Jogbani", "state": "Bihar", "type": "city"},
  {"slug": "rafiganj", "name": "Rafiganj", "state": "Bihar", "type": "city"},
  {"slug": "daudnagar", "name": "Daudnagar", "state": "Bihar", "type": "city"},
  {"slug": "dighwara", "name": "Dighwara", "state": "Bihar", "type": "city"},
  {"slug": "marhaura", "name": "Marhaura", "state": "Bihar", "type": "city"},
  {"slug": "dhaka", "name": "Dhaka", "state": "Bihar", "type": "city"},
  {"slug": "bagaha", "name": "Bagaha", "state": "Bihar", "type": "city"},
  {"slug": "jaynagar", "name": "Jaynagar", "state": "Bihar", "type": "city"},
  {"slug": "lalganj", "name": "Lalganj", "state": "Bihar", "type": "city"},
  {"slug": "bikram", "name": "Bikram", "state": "Bihar", "type": "city"},

  { slug: "fatuha", name: "Fatuha", state: "Bihar", type: "city" },
];
