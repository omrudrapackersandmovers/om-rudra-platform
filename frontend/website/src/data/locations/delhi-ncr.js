/** @typedef {{ slug: string, name: string, state: string, type: "hub" | "district" | "city", isPrimaryHub?: boolean }} ServiceLocation */

/** @type {ServiceLocation[]} */
export const delhiNcrLocations = [
  { slug: "delhi", name: "Delhi", state: "Delhi NCR", type: "hub" },
  { slug: "noida", name: "Noida", state: "Delhi NCR", type: "city" },
  { slug: "greater-noida", name: "Greater Noida", state: "Delhi NCR", type: "city" },
  { slug: "gurgaon", name: "Gurgaon (Gurugram)", state: "Delhi NCR", type: "city" },
  { slug: "faridabad", name: "Faridabad", state: "Delhi NCR", type: "city" },
  { slug: "ghaziabad-ncr", name: "Ghaziabad (NCR)", state: "Delhi NCR", type: "city" },
];
