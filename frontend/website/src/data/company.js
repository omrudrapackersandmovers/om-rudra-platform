/**
 * company.js — Single source of truth for all static company facts.
 *
 * Every component that needs a phone number, address, email, or service list
 * MUST import from this file. Never hardcode any of these values inline.
 *
 * Fields marked "TODO: confirm with client" must be filled before launch.
 */

export const company = {
  legalName: "1st Om Packers and Movers Pvt. Ltd.",
  brandName: "1st Om Packers and Movers",
  tagline: "Safer Moves, Brighter Tomorrows",

  logo: {
    primary: "/images/primary-logo.webp",
    horizontal: "/images/horizontal-lockup.webp",
    reverse: "/images/reverse-logo.webp",
    icon: "/images/icon.webp",
    monochrome: "/images/monochrome.webp",
    packageMockup: "/images/packgae.webp",
  },

  foundedYear: 2026,

  phone: {
    primary: "+91 7033488691",
    primaryDisplay: "+91 7033488691",
    whatsapp: "+91 7033488691",
  },

  email: {
    general: "hello@1stompackersandmovers.com",
    privacy: "privacy@1stompackersandmovers.com",
    legal: "legal@1stompackersandmovers.com",
    claims: "claims@1stompackersandmovers.com",
  },

  headOffice: {
    addressLine: "Ram Krishna Nagar, Soranpur, Goraiya Asthan",
    city: "Patna",
    state: "Bihar",
    pincode: "800027",
  },

  /**
   * branches — each entry: { city, addressLine, phone, mapEmbedUrl }
   * Only include branches the client has confirmed.
   */
  branches: [
    // TODO: confirm branch details with client
  ],

  /**
   * businessHours — shown on contact page and in schema.org
   */
  businessHours: {
    weekdays: "9:00 AM - 7:00 PM", // TODO: confirm with client
    weekends: "9:00 AM - 5:00 PM", // TODO: confirm with client
  },

  /**
   * certifications — ONLY include entries the client has actually provided
   * proof of. Never copy competitor certifications.
   */
  certifications: [
    // TODO: confirm certifications with client
  ],

  socials: {
    facebook: "", // TODO: confirm with client
    instagram: "", // TODO: confirm with client
    youtube: "", // TODO: confirm with client
  },

  /**
   * serviceCategories — drives services nav, footer links, quote form dropdown,
   * and schema.org Service data. Order matters (displayed as-is).
   */
  serviceCategories: [
    "Home Shifting",
    "Office/Commercial Shifting",
    "Car Transportation",
    "Bike Transportation",
    "Packing & Unpacking",
    "Loading & Unloading",
    "Warehousing & Storage",
    "Goods Insurance",
  ],

  /**
   * statsForTrustBar - only real, verifiable numbers go here.
   * Leave null if the client hasn't confirmed the figure.
   */
  stats: {
    yearsInBusiness: null, // TODO: confirm with client
    districtsServed: 50, // approximate from location data - confirm
    statesServed: 6, // Bihar, Jharkhand, UP, Delhi NCR, WB + others
    familiesMoved: null, // TODO: confirm with client - do not fabricate
  },
};
