import { allServiceLocations, allRoutes } from "./index.js";
import { editorialGuides } from "./editorialGuides.js";
import { localAreaOptions } from "./coverage.js";

export const allLocationPages = [...allServiceLocations, ...localAreaOptions];
// The client-listed service directory is public search coverage. Editorial guides
// add sourced geography; they are not a prerequisite for a useful enquiry page.
export const indexableLocationPages = allLocationPages;
export const locationPath = location => `/packers-movers-${location.slug}`;
export const locationAddress = location => `${location.name}, ${location.state}`;

export function getLocationPageData(slug) {
  const location = allLocationPages.find(item => item.slug === slug);
  if (!location) return null;
  const parent = location.type === "locality" ? allServiceLocations.find(item => item.name === location.city) : null;
  const citySlug = parent?.slug || location.slug;
  const guide = editorialGuides[location.slug];
  const localAreas = localAreaOptions.filter(item => item.city === (parent?.name || location.name) && item.slug !== location.slug);
  const listedAreas = localAreas.map(item => ({ name: item.name.split(",")[0], location: item }));
  for (const name of guide?.areas || []) {
    if (!listedAreas.some(item => item.name.toLowerCase() === name.toLowerCase())) listedAreas.push({ name });
  }
  const routes = allRoutes.filter(route => route.fromSlug === citySlug || route.toSlug === citySlug);
  const sameState = allLocationPages.filter(item => item.state === location.state && item.slug !== slug && item.type !== "locality");
  const label = location.type === "locality" ? location.name.split(",")[0] : location.name;
  const kind = location.type === "locality" ? "area" : location.type === "district" ? "district" : "city";
  const checklist = kind === "area" ? [
    { title: `Your address in ${label}`, detail: `Include your building or house number, ${label}, ${location.city}, and a nearby landmark so pickup can be discussed precisely.` },
    { title: "Lane and vehicle access", detail: "Share the lane width, parking options and distance between your door and a practical loading point." },
    { title: "Building arrangements", detail: "Tell us about your floor, lift dimensions, society permissions and any permitted loading hours." },
  ] : kind === "district" ? [
    { title: `Where in ${label}?`, detail: `Specify your town, village or neighbourhood within ${label}, ${location.state}; the district name alone may not identify your pickup.` },
    { title: "The last part of the route", detail: "Describe approach roads, parking space and the distance from the vehicle to your door at both addresses." },
    { title: "Pickup and delivery together", detail: "Share the complete destination and your preferred dates so the team can review the whole moving plan." },
  ] : [
    { title: `Your neighbourhood in ${label}`, detail: `Include your locality, building or street and postcode in ${label}, ${location.state}, when discussing access with the team.` },
    { title: "Floors, lifts and parking", detail: "Confirm lift use, building permissions, stairs and loading space at your current and new addresses." },
    { title: "Inventory and special items", detail: "List furniture, appliances and cartons. Flag fragile, heavy or oversized items before the quote is prepared." },
  ];
  const planning = {
    heading: `Choose the right plan for your ${label} move`,
    address: locationAddress(location),
    scope: kind === "area"
      ? `${label} is listed within ${location.city}. Use the locality together with the city, postcode and a map pin so the pickup is assigned to the right address.`
      : kind === "district"
        ? `For ${location.name}, ${location.state}, include your town or village as well as the district. The quote needs the actual pickup and delivery points, rather than a district-wide estimate.`
        : `Use ${location.name}, ${location.state}, together with your neighbourhood and postcode. Share both addresses even when your move stays within the same city.`,
    scenarios: [
      { title: `Moving within ${parent?.name || location.name}`, detail: `For a move starting in ${label}, list the floor, lift access and loading point at both properties. Ask which packing, dismantling and reassembly tasks are included, and arrange keys or building permissions before the agreed day.` },
      { title: `Leaving ${label}`, detail: `Send your full ${locationAddress(location)} pickup address and the destination city and postcode. Discuss the inventory, packing, transport arrangement and delivery window together; confirm who will receive the goods at the other end.` },
      { title: `Moving to ${label}`, detail: `Share your current city and the complete delivery address in ${locationAddress(location)}. Check where unloading can happen, which floor the goods need to reach and whether someone can receive them during the agreed window.` },
    ],
  };
  const faqs = [
    { q: `How do I request a moving quote for ${label}?`, a: `Start with your ${location.type === "locality" ? location.name : `${label}, ${location.state}`} pickup or destination. Add your inventory, preferred date and address-access details. The team reviews availability and the agreed service before preparing your quote.` },
    { q: `What affects the cost of moving ${kind === "area" ? `from ${label}` : `in ${label}`}?`, a: "Your inventory, packing needs, exact route, dates, stairs or lift access and any extra services affect the price. Online ranges are planning guides; ask for the agreed scope and final quote in writing." },
    ...(listedAreas.length ? [{ q: `Can I include an address in ${listedAreas[0].name}?`, a: `Yes, include the full address when you enquire about ${parent?.name || location.name}. Areas listed here help identify your move; exact pickup access and availability must be confirmed with the team.` }] : []),
    { q: `What should I confirm before booking a move involving ${label}?`, a: `Confirm the complete ${locationAddress(location)} address, inventory, packing scope, pickup and delivery windows, total price and payment terms in writing. Ask about any extra handling or transit cover that your move needs. Submitting an enquiry does not confirm a booking.` },
    { q: `Is there an Om Rudra office in ${label}?`, a: location.isPrimaryHub ? "Our office is in Ram Krishna Nagar, Soranpur, Goraiya Asthan, Patna, Bihar 800027. Call the team before visiting to agree a suitable time." : `Our confirmed office is in Patna, Bihar. This page describes enquiries for ${label}; it is not a claim of a branch office here.` },
  ];
  return { location, parent, label, kind, guide, planning, listedAreas, routes, sameState, checklist: guide?.decisions || checklist, faqs: [...(guide?.faqs || []), ...faqs] };
}
