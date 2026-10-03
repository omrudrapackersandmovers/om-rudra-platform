/**
 * searchIndex.js — Unified site-wide search catalog for 1st Om Packers & Movers.
 *
 * Pre-indexes:
 * 1. Specialized Relocation Services (8 core services)
 * 2. Cities, Relocation Hubs & Districts (100+ locations across states)
 * 3. High-Intent Interstate National Routes (30+ interstate route pairs)
 * 4. Core Pages, Pricing Guides & Statutory Policies
 * 5. Instant Operational Actions (Call Hotline, WhatsApp Assistant, Insurance Claims)
 */

import { allServiceLocations, interstateRoutes } from "./locations";
import { company } from "./company";

// ── 1. Services Catalog ────────────────────────────────────────────────────────
export const servicesSearchData = [
  {
    id: "svc-home-shifting",
    title: "Home Shifting Services",
    category: "Services",
    slug: "home-shifting",
    url: "/services/home-shifting",
    quoteUrl: "/get-quote?service=home-shifting",
    description: "Complete household relocation with 5-layer packing, dedicated closed-body container trucks, and damage-free transit.",
    keywords: ["home shifting", "household moving", "house relocation", "flat shifting", "furniture moving", "residential shifting", "domestic move"],
    badges: ["5-Layer Packing", "Dedicated Closed Fleet"],
    icon: "Home",
  },
  {
    id: "svc-office-relocation",
    title: "Office & Commercial Relocation",
    category: "Services",
    slug: "office-commercial-shifting",
    url: "/services/office-commercial-shifting",
    quoteUrl: "/get-quote?service=office-commercial-shifting",
    description: "Zero-downtime weekend corporate moves, IT server racking, ergonomic workstation disassembly, and asset tagging.",
    keywords: ["office shifting", "corporate relocation", "commercial moving", "server relocation", "workstation shifting", "business move"],
    badges: ["Zero Downtime", "Weekend Execution"],
    icon: "Building2",
  },
  {
    id: "svc-car-transportation",
    title: "Car Transportation Services",
    category: "Services",
    slug: "car-transportation",
    url: "/services/car-transportation",
    quoteUrl: "/get-quote?service=car-transportation",
    description: "Enclosed hydraulic car carrier trailers with zero road-driving, wheel clamps, and doorstep carrier handover.",
    keywords: ["car transport", "car shifting", "car carrier", "vehicle transport", "automobile shipping", "enclosed car trailer", "car move"],
    badges: ["Hydraulic Carrier", "Zero Road-Driving"],
    icon: "Car",
  },
  {
    id: "svc-bike-moving",
    title: "Bike & Two-Wheeler Transportation",
    category: "Services",
    slug: "bike-transportation",
    url: "/services/bike-transportation",
    quoteUrl: "/get-quote?service=bike-transportation",
    description: "Reinforced wooden crating, bubble-foam wrapping, tyre suspension strapping, and scratch-free two-wheeler transit.",
    keywords: ["bike transport", "motorcycle shifting", "two wheeler moving", "scooter transport", "bullet shipping", "bike courier"],
    badges: ["Wooden Crating", "Suspension Strapped"],
    icon: "Bike",
  },
  {
    id: "svc-packing-unpacking",
    title: "Packing & Unpacking Services",
    category: "Services",
    slug: "packing-unpacking",
    url: "/services/packing-unpacking",
    quoteUrl: "/get-quote?service=packing-unpacking",
    description: "Multi-layered corrugated rolls, air bubble cushioning, edge protectors, heavy-duty cartons, and color-coded room labeling.",
    keywords: ["packing service", "unpacking service", "bubble wrap", "carton boxes", "fragile packing", "crockery packing"],
    badges: ["5-Ply Cartons", "Color-Coded Labels"],
    icon: "Package",
  },
  {
    id: "svc-loading-unloading",
    title: "Loading & Unloading Services",
    category: "Services",
    slug: "loading-unloading",
    url: "/services/loading-unloading",
    quoteUrl: "/get-quote?service=loading-unloading",
    description: "Trained in-house moving crew, hydraulic tail lifts, heavy-item dollies, furniture ramps, and precision room positioning.",
    keywords: ["loading service", "unloading service", "laborers", "movers crew", "heavy lifting", "furniture placement"],
    badges: ["Permanent Crew", "Hydraulic Equipment"],
    icon: "Boxes",
  },
  {
    id: "svc-warehousing-storage",
    title: "Warehousing & Secure Storage",
    category: "Services",
    slug: "warehousing-storage",
    url: "/services/warehousing-storage",
    quoteUrl: "/get-quote?service=warehousing-storage",
    description: "24/7 CCTV guarded, fire-insulated, pest-controlled household and commercial storage bays with flexible tenure.",
    keywords: ["warehousing", "storage", "household storage", "furniture storage", "luggage storage", "storage facility"],
    badges: ["24/7 CCTV", "Pest-Controlled Bays"],
    icon: "Warehouse",
  },
  {
    id: "svc-transit-insurance",
    title: "Transit Goods Insurance",
    category: "Services",
    slug: "goods-insurance",
    url: "/services/goods-insurance",
    quoteUrl: "/get-quote?service=goods-insurance",
    description: "Comprehensive 100% declared consignment valuation cover with accredited underwriters and fast-track 48-hour claim processing.",
    keywords: ["transit insurance", "goods insurance", "moving insurance", "cargo protection", "claim policy", "all risk insurance"],
    badges: ["100% Valuation", "48-Hour Claims"],
    icon: "ShieldCheck",
  },
];

// ── 2. Core Pages & Policies Catalog ──────────────────────────────────────────
export const pagesSearchData = [
  {
    id: "page-pricing",
    title: "Pricing & Cost Calculator",
    category: "Pages & Tools",
    url: "/pricing",
    quoteUrl: "/get-quote",
    description: "Transparent rate cards for local and interstate moves: 1 BHK, 2 BHK, 3 BHK, car transport, and packing charges with zero hidden fees.",
    keywords: ["pricing", "cost", "rates", "charges", "estimate", "how much", "calculator", "rate card", "cheap movers", "moving cost"],
    badges: ["Rate Cards", "Zero Hidden Surcharges"],
    icon: "Calculator",
  },
  {
    id: "page-get-quote",
    title: "Get an Instant Quote",
    category: "Pages & Tools",
    url: "/get-quote",
    quoteUrl: "/get-quote",
    description: "Calculate binding price estimates, schedule a free on-site or digital video survey, or connect via 1-click WhatsApp quote.",
    keywords: ["get quote", "book move", "instant estimate", "survey", "schedule move", "quote calculator"],
    badges: ["Binding Quote", "Free Survey"],
    icon: "FileCheck",
  },
  {
    id: "page-where-we-serve",
    title: "Where We Serve (Coverage Map)",
    category: "Pages & Tools",
    url: "/where-we-serve",
    quoteUrl: "/get-quote",
    description: "Comprehensive nationwide serviceability map covering Bihar, Jharkhand, UP, West Bengal, Delhi NCR, and major Indian metro hubs.",
    keywords: ["where we serve", "locations", "cities", "service area", "coverage", "pincodes", "districts", "network"],
    badges: ["Nationwide Fleet", "100+ Cities"],
    icon: "MapPin",
  },
  {
    id: "page-contact",
    title: "Contact & Regional Branch Hubs",
    category: "Pages & Tools",
    url: "/contact",
    quoteUrl: "/get-quote",
    description: "Patna headquarters address, regional hub network (Bengaluru, Hyderabad, Delhi NCR, Pune, Kolkata), and direct department routing.",
    keywords: ["contact", "phone number", "head office", "address", "branch", "support", "helpline", "email", "office location"],
    badges: ["Headquarters Patna", "Regional Hubs"],
    icon: "PhoneCall",
  },
  {
    id: "page-about",
    title: "About 1st Om Packers & Movers",
    category: "Pages & Tools",
    url: "/about",
    quoteUrl: "/get-quote",
    description: "Our founding story, permanent background-verified moving crew, fleet infrastructure, ISO compliance, and core safety standards.",
    keywords: ["about us", "company profile", "who we are", "history", "management", "mission", "values", "fleet size"],
    badges: ["Verified Crew", "ISO Certified"],
    icon: "Building2",
  },
  {
    id: "page-terms",
    title: "Terms of Service & Carriage Policies",
    category: "Legal & Policies",
    url: "/terms",
    quoteUrl: "/contact",
    description: "Carriage by Road Act 2007 operating agreement, binding estimate guarantees, prohibited goods list, and insurance claim procedures.",
    keywords: ["terms of service", "legal agreement", "carriage by road", "liability", "contract", "cancellation policy", "prohibited goods"],
    badges: ["Carriage Act 2007", "Patna Jurisdiction"],
    icon: "Scale",
  },
  {
    id: "page-privacy",
    title: "Privacy & Personal Data Protection Policy",
    category: "Legal & Policies",
    url: "/privacy",
    quoteUrl: "/contact",
    description: "DPDP Act 2023 compliant data protection standards, zero lead resale guarantee, 256-bit SSL encryption, and Grievance Officer details.",
    keywords: ["privacy policy", "data protection", "dpdp act", "zero spam", "security", "grievance officer", "gdpr"],
    badges: ["DPDP Act 2023", "0% Data Resale"],
    icon: "ShieldCheck",
  },
];

// ── 3. Quick Actions & Direct Channels ─────────────────────────────────────────
export const actionsSearchData = [
  {
    id: "act-call-helpline",
    title: `Call 24/7 Helpline (${company.phone.primary})`,
    category: "Instant Actions",
    url: `tel:${company.phone.primary}`,
    external: true,
    description: "Connect immediately with our primary dispatch officer. Average pickup time under 2 rings.",
    keywords: ["call", "phone", "helpline", "toll free", "number", "speak to human", "contact number"],
    badges: ["Under 2 Rings", "24/7 Active"],
    icon: "PhoneCall",
  },
  {
    id: "act-whatsapp",
    title: "Chat with Relocation Specialist on WhatsApp",
    category: "Instant Actions",
    url: `https://wa.me/91${company.phone.whatsapp.replace(/\\D/g, "")}?text=Hi%201st%20Om%20Packers%2C%20I%20am%20looking%20for%20a%20moving%20quote.`,
    external: true,
    description: "Share photos of your inventory for an instant preliminary quotation on WhatsApp (~10 min SLA).",
    keywords: ["whatsapp", "chat", "message", "inventory photos", "quick quote", "online chat"],
    badges: ["~10 Min Response", "Photo Inventory"],
    icon: "MessageCircle",
  },
  {
    id: "act-claims-desk",
    title: "File an Insurance Cargo Claim",
    category: "Instant Actions",
    url: `mailto:${company.email.claims}?subject=Cargo%20Damage%20Claim%20-%20LR%20Number%3A`,
    external: true,
    description: "Fast-track surveyor escalation desk for transit damage or consignment shortfalls within the 48-hour window.",
    keywords: ["claim", "insurance claim", "damaged goods", "loss", "broken items", "surveyor", "cargo claim"],
    badges: ["48-Hour SLA", "Surveyor Escalation"],
    icon: "AlertTriangle",
  },
  {
    id: "act-legal-desk",
    title: "Corporate Contracting & Vendor Onboarding",
    category: "Instant Actions",
    url: `mailto:${company.email.legal}?subject=Corporate%20Relocation%20Vendor%20Inquiry`,
    external: true,
    description: "Direct legal desk for enterprise Master Service Agreements (MSAs), GST invoicing, and corporate relocation accounts.",
    keywords: ["corporate vendor", "company msa", "gst invoice", "b2b moving", "corporate contract"],
    badges: ["GST Invoicing", "Enterprise SLA"],
    icon: "Scale",
  },
];

// ── 4. Build Dynamically Indexed Location & Route Items ───────────────────────

/**
 * Builds searchable location entries from allServiceLocations
 */
export const buildLocationsSearchData = () => {
  return allServiceLocations.map((loc) => {
    const isHub = loc.type === "hub" || loc.isPrimaryHub;
    const areasString = Array.isArray(loc.neighborhoods) ? loc.neighborhoods.join(", ") : "";
    const pincodesString = Array.isArray(loc.pincodes) ? loc.pincodes.join(", ") : "";

    return {
      id: `loc-${loc.slug}`,
      title: `${loc.name} Packers and Movers`,
      subtitle: `${loc.state}${isHub ? " (Primary Relocation Hub)" : ""}`,
      category: "Cities & Locations",
      slug: loc.slug,
      url: `/packers-movers-${loc.slug}`,
      quoteUrl: `/get-quote?from=${encodeURIComponent(loc.name)}`,
      description: loc.metaDescription || `Verified local and domestic household moving, car carrier, and packing services in ${loc.name}, ${loc.state}.`,
      keywords: [
        loc.name.toLowerCase(),
        `${loc.name.toLowerCase()} packers and movers`,
        `${loc.name.toLowerCase()} movers`,
        loc.state.toLowerCase(),
        ...(Array.isArray(loc.neighborhoods) ? loc.neighborhoods.map((n) => n.toLowerCase()) : []),
        ...(Array.isArray(loc.pincodes) ? loc.pincodes : []),
      ],
      badges: [
        isHub ? "Regional Hub" : "District Service",
        loc.state,
      ],
      cityName: loc.name,
      state: loc.state,
      isHub,
      icon: "MapPin",
    };
  });
};

/**
 * Builds searchable route entries from interstateRoutes
 */
export const buildRoutesSearchData = () => {
  return interstateRoutes.map((route) => {
    return {
      id: `route-${route.slug}`,
      title: `${route.from} to ${route.to} Movers`,
      subtitle: route.distanceKm ? `Direct Highway Route (${route.distanceKm} km)` : "Interstate Corridor",
      category: "Interstate Routes",
      slug: route.slug,
      url: `/route/${route.slug}`,
      quoteUrl: `/get-quote?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&scope=interstate`,
      description: `Dedicated sealed-carrier relocation from ${route.from} to ${route.to}. GPS-monitored interstate trucks, guaranteed timeline, and all-risk transit insurance.`,
      keywords: [
        `${route.from.toLowerCase()} to ${route.to.toLowerCase()}`,
        `${route.from.toLowerCase()} to ${route.to.toLowerCase()} movers`,
        `${route.from.toLowerCase()} to ${route.to.toLowerCase()} packers`,
        `${route.from.toLowerCase()} to ${route.to.toLowerCase()} packers and movers`,
        route.from.toLowerCase(),
        route.to.toLowerCase(),
        "interstate",
        "route",
      ],
      badges: [
        route.distanceKm ? `${route.distanceKm} km` : "National Permit",
        "Sealed Container",
      ],
      fromCity: route.from,
      toCity: route.to,
      distanceKm: route.distanceKm,
      icon: "Truck",
    };
  });
};

/**
 * Returns the complete combined searchable catalog
 */
let cachedSearchIndex = null;

export const getSiteSearchIndex = () => {
  if (cachedSearchIndex) return cachedSearchIndex;

  const locations = buildLocationsSearchData();
  const routes = buildRoutesSearchData();

  cachedSearchIndex = [
    ...servicesSearchData,
    ...actionsSearchData,
    ...pagesSearchData,
    ...routes,
    ...locations,
  ];

  return cachedSearchIndex;
};
