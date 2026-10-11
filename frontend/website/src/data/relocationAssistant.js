import { company } from "./company.js";
import { services } from "./services.js";

export const starterQuestions = [
  "What affects my moving cost?",
  "How should I prepare for moving day?",
  "Can you transport my car or bike?",
  "How do I get a quote?",
];

// Shared by the server prompt and the offline quick guide. Company facts stay
// in company.js; never give the assistant access to customer or admin records.
export const relocationContext = `
Company: ${company.legalName}. Brand: ${company.brandName}.
Head office: ${company.headOffice.addressLine}, ${company.headOffice.city}, ${company.headOffice.state}, ${company.headOffice.pincode}.
Phone: ${company.phone.primaryDisplay}. Email: ${company.email.general}.
Service enquiries: Bihar, Jharkhand, Uttar Pradesh, Delhi NCR, West Bengal and interstate routes across India. Availability must be confirmed by the team; a listed city does not prove a branch exists.
Services: ${services.map((service) => `${service.title}: ${service.description} ${service.points.join("; ")}`).join("\n")}
Quotes: customers share pickup and destination cities, moving date, inventory/home size, floors/lift access, packing needs and vehicle details when relevant. Get a written quote before booking. Cost depends on these details, distance, truck/crew requirements, storage, insurance and applicable taxes. No price or availability is confirmed by this chat.
Booking: use /get-quote or contact the team. This assistant cannot submit enquiries, confirm bookings, collect payments, track shipments, access personal records or process insurance claims.
Packing: make an inventory, label boxes by room, photograph valuable items and appliance connections, keep documents/medicines/valuables with you, back up devices, discuss fragile items and access with the team. Ask the team about appliance preparation; follow manufacturer guidance.
Insurance: ask about cover, declared value, premium, exclusions, paperwork and claim procedures. Never promise automatic cover, reimbursement or damage-free transport.
Storage: confirm space, duration, access, terms and redelivery. No facility availability or security certification is confirmed here.
Vehicle moves: confirm RC/registration, insurance documents and handover requirements with the team. Photograph condition; remove loose belongings. Fuel and battery preparation depend on the carrier's instructions.
Useful pages: /services, /pricing, /where-we-serve, /packing-materials, /get-quote, /contact, /privacy.
`;

export function getQuickAnswer(question) {
  const text = question.toLowerCase();
  if (/\b(track|tracking|status|booking reference|shipment)\b/.test(text)) {
    return `For a shipment update, contact the team on ${company.phone.primaryDisplay} with your booking reference. This assistant cannot access booking or tracking records.`;
  }
  if (/\b(price|pricing|cost|charge|charges|rate|rates|expensive|budget)\b|kitna|kharcha/.test(text)) {
    return "Moving cost depends on your pickup and destination, inventory, date, packing needs, floors/lift access and truck requirements. Storage, transit cover and taxes may add to the total. Share these details through “Get a quote” for a written estimate; this chat cannot confirm a price.";
  }
  if (/\b(insurance|insured|claim|damage|damaged|cover)\b/.test(text)) {
    return "Ask the team about transit cover before booking: declared value, premium, exclusions and claim documents. Coverage and reimbursement depend on the policy terms. For damaged goods or an existing claim, contact the team with your booking reference and photographs.";
  }
  if (/\b(car|bike|vehicle|scooter|motorcycle)\b/.test(text)) {
    return "Om Rudra accepts car and bike transportation enquiries. Share the vehicle type, pickup and destination, and preferred date. Confirm carrier options, documents, transit cover and handover arrangements with the team. Photograph the vehicle’s condition and remove loose belongings before handover.";
  }
  if (/\b(quote|book|booking|contact|call|phone|whatsapp)\b/.test(text)) {
    return `Use “Get a quote” or call ${company.phone.primaryDisplay}. Share your pickup and destination cities, moving date, inventory/home size, floors/lift access and packing needs. The team will confirm the scope, availability and written quote before booking.`;
  }
  if (/\b(pack|packing|prepare|preparation|checklist|moving day|fragile|glass|box|boxes)\b/.test(text)) {
    return "Prepare an inventory, sort what you want to move and label boxes by room. Keep documents, medicines and valuables with you. Photograph fragile items, back up devices and discuss special packing with the team. Confirm lift/stair access, parking and building permissions before moving day.";
  }
  if (/\b(storage|store|warehouse|warehousing)\b/.test(text)) {
    return "You can enquire about storage while preparing your next address. Share your inventory and expected duration, then confirm space, access arrangements, terms, collection and redelivery with the team. Availability needs confirmation.";
  }
  if (/\b(service|services|home|house|office|relocation|shift|shifting|move|moving|city|cities|patna|bihar|delhi|india)\b/.test(text)) {
    return `Om Rudra handles enquiries for ${services.map((service) => service.title.toLowerCase()).join(", ")}. The team serves enquiries across Bihar and interstate routes; confirm your exact pickup/destination and availability through “Get a quote”.`;
  }
  return null;
}
