/**
 * other-relocation-markets.js
 *
 * Major metros and other states the company serves for interstate moves,
 * even if they don't have a physical branch there.
 *
 * type: "city" — served city (no branch, but route pages exist)
 */

/** @typedef {{ slug: string, name: string, state: string, type: "hub" | "district" | "city", isPrimaryHub?: boolean }} ServiceLocation */

/** @type {ServiceLocation[]} */
export const otherRelocationMarkets = [
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", type: "city" },
  { slug: "pune", name: "Pune", state: "Maharashtra", type: "city" },
  { slug: "bengaluru", name: "Bengaluru", state: "Karnataka", type: "city" },
  { slug: "hyderabad", name: "Hyderabad", state: "Telangana", type: "city" },
  { slug: "chennai", name: "Chennai", state: "Tamil Nadu", type: "city" },
  { slug: "ahmedabad", name: "Ahmedabad", state: "Gujarat", type: "city" },
  { slug: "surat", name: "Surat", state: "Gujarat", type: "city" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", type: "city" },
  { slug: "indore", name: "Indore", state: "Madhya Pradesh", type: "city" },
  { slug: "bhopal", name: "Bhopal", state: "Madhya Pradesh", type: "city" },
  { slug: "nagpur", name: "Nagpur", state: "Maharashtra", type: "city" },
  { slug: "chandigarh", name: "Chandigarh", state: "Chandigarh", type: "city" },
];
