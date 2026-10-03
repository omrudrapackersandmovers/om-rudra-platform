import { useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { ChevronRight, PhoneCall, ShieldCheck, CheckCircle2, ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { company } from "../../../../data/company";
import QuoteForm from "../Home/components/QuoteForm";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

const serviceDetails = {
  "home-shifting": {
    title: "Home Shifting Services",
    badge: "Residential Relocation",
    image: "/images/services/HomeShiftingServices.webp",
    rating: "4.9/5",
    stat: "15,000+ Homes Moved",
    subtitle: "Complete household relocation handled with care from door to door.",
    overview:
      "Moving your home means trusting someone with your daily life. We pack each room methodically, use protective wrapping on furniture and electronics, and ensure dedicated transport so your goods arrive without delay or damage.",
    benefits: [
      "Customised packing for fragile glassware, crockery, and electronics",
      "Specialised multi-layer wrapping for sofas, beds, and wooden furniture",
      "Dedicated transport vehicle without sharing space with other moves",
      "Room-by-room unloading and placement at your destination home",
      "Optional complete unpacking and packaging waste removal",
    ],
    faqs: [
      {
        q: "How is the relocation cost calculated for household shifting?",
        a: "Pricing depends primarily on total consignment volume (1BHK, 2BHK, 3BHK, villa), moving distance (local within city vs. interstate), packaging quality required, floor levels, elevator availability at both locations, and optional services like full unpacking and furniture dismantling. We provide an upfront, fixed written estimate with zero hidden extras.",
      },
      {
        q: "How far in advance should I confirm my home move?",
        a: "We recommend booking 3 to 5 days prior to your preferred moving date for local moves, and 7 to 10 days for interstate relocations. Early booking allows us to conduct a detailed pre-move inventory survey and allocate a dedicated truck and trained crew for your moving window.",
      },
      {
        q: "Do you provide dedicated vehicles or will our goods be co-loaded?",
        a: "For all complete household relocations, we provide a 100% dedicated closed container truck. Your goods are never mixed, co-loaded, or transferred between vehicles en route, eliminating the risk of lost boxes or delivery delays.",
      },
      {
        q: "Who handles dismantling and reassembling of beds, wardrobes, and modular furniture?",
        a: "Our crew includes trained carpenters equipped with specialized power tools to dismantle complex hydraulic beds, sliding-door wardrobes, dining tables, and modular furniture prior to packing, and reassemble them securely in their designated rooms at your new home.",
      },
      {
        q: "How are delicate items like LED TVs, glassware, and kitchen crockery protected?",
        a: "Delicate items receive specialized multi-layer defense: bubble wrap, foam corner guards, thermocol cushioning, heavy corrugated sheets, and custom TV wooden crating. Fragile boxes are clearly marked with high-visibility stickers and loaded in designated upper safety tiers inside the vehicle.",
      },
      {
        q: "What items are strictly prohibited from being transported?",
        a: "For transit safety and legal compliance, we cannot transport hazardous substances (kerosene, gas cylinders, petrol, fireworks, acids), perishable cooked foods, live plants, cash, jewelry, and original personal legal documents. We advise customers to carry valuables and essential papers personally.",
      },
      {
        q: "Are packing materials included in the quote or charged separately?",
        a: "All standard packing supplies - including 5-ply export-quality cartons, stretch film, heavy-duty bubble wrap, corrugated sheets, waterproof tape, and label markers - are fully inclusive in your written estimate.",
      },
      {
        q: "What happens if items get damaged during transit?",
        a: "While our damage rate is under 0.2%, all relocations can be backed by comprehensive Goods Transit Insurance. In the rare event of transit damage, our support team facilitates a fast, transparent claim process with direct compensation based on declared value.",
      },
    ],
  },
  "office-commercial-shifting": {
    title: "Office & Commercial Shifting",
    badge: "Commercial Relocation",
    image: "/images/services/Office&CommercialShifting.webp",
    rating: "4.9/5",
    stat: "1,200+ Offices Shifted",
    subtitle: "Organised workplace relocation designed to minimise operational downtime.",
    overview:
      "Every hour of relocation downtime affects your business. We plan office relocations around your schedule, including overnight and weekend shifts, ensuring desks, IT equipment, and confidential records are transferred securely.",
    benefits: [
      "After-hours and weekend schedules to protect business continuity",
      "Systematic labelling of workstations, computer cables, and departments",
      "Anti-static packaging for servers, desktop systems, and screens",
      "Disassembly and reassembly of modular workstations and conference tables",
      "Careful handling of archives, physical files, and office inventory",
    ],
    faqs: [
      {
        q: "Can commercial shifting be scheduled after office hours or over weekends?",
        a: "Yes. Over 80% of our corporate relocations are executed between Friday evening and Sunday night or during overnight shifts. This ensures zero disruption to your daily operations so your employees can resume work at their desks by Monday morning.",
      },
      {
        q: "How do you ensure safe handling of servers, IT peripherals, and sensitive equipment?",
        a: "IT hardware receives top-tier protection: servers, CPUs, and monitors are wrapped in anti-static bubble wrap, cushioned inside shock-absorbent containers, and transported in climate-protected, air-suspension vehicles. Cabling and accessories are individually labeled by desk and employee ID.",
      },
      {
        q: "How do you maintain order and department-wise tracking for large office inventories?",
        a: "We assign a dedicated Move Coordinator and implement an alphanumeric color-coded tagging protocol for every floor, department, desk, and cubicle. Every carton and piece of equipment is inventoried and placed exactly at its mapped workstation layout at the destination.",
      },
      {
        q: "Do you assist with dismantling and re-installing modular cubicles and conference setups?",
        a: "Yes. Our technical crew specializes in commercial workstation dismantling, cabling extraction, partition removal, and precise re-installation according to your architectural office floor plan.",
      },
      {
        q: "What documentation is required for corporate relocation across state borders?",
        a: "For interstate commercial moves, we coordinate all compliance paperwork including GST e-Way bills, commercial delivery challans, consignment notes (LR copy), and asset declaration forms to ensure seamless clearance at interstate checkpoints.",
      },
      {
        q: "Can you handle shifting for heavy machinery, laboratories, or factory equipment?",
        a: "Yes. We operate hydraulic tailgates, heavy-duty machine dollies, pallet jacks, and crane lifters capable of moving industrial machinery, medical laboratory gear, and large commercial printers.",
      },
      {
        q: "Is there non-disclosure and confidentiality assurance for corporate documents?",
        a: "Absolutely. We offer sealed security-tagged file crates with serialized numbered locks for human resource records, financial files, and confidential legal archives, backed by a formal non-disclosure agreement (NDA).",
      },
      {
        q: "What is the typical advance notice required for planning an office move?",
        a: "For small offices (up to 25 seats), 5 to 7 days notice is sufficient. For mid to enterprise corporate relocations (50 to 500+ workstations), we recommend engaging 2 to 4 weeks prior to plan surveys, floor mapping, and multi-phase shifting.",
      },
    ],
  },
  "car-transportation": {
    title: "Car Transportation Services",
    badge: "Enclosed Car Carrier",
    image: "/images/services/CarTransportationServices.webp",
    rating: "4.9/5",
    stat: "8,500+ Cars Delivered",
    subtitle: "Enclosed vehicle carrier transport delivering your car safely across cities.",
    overview:
      "We transport personal and luxury vehicles using specialised multi-car covered carriers. Your car is never driven on interstate highways, protecting it from road wear, mileage accumulation, and highway hazards.",
    benefits: [
      "Carried inside closed car carriers, not driven on open roads",
      "Pre-loading physical inspection with odometer and exterior sign-off",
      "Transit insurance coverage against transit incidents",
      "Doorstep pickup and doorstep delivery options",
      "Available across all our operational states and major metros",
    ],
    faqs: [
      {
        q: "How is my car transported - is it driven or carried inside a truck?",
        a: "Your car is 100% carried inside a specialized, enclosed multi-car or single-car hydraulic carrier. It is NEVER driven on interstate highways, ensuring zero odometer increase, zero tire wear, and zero exposure to highway gravel or weather.",
      },
      {
        q: "What is the pre-loading inspection and handover procedure?",
        a: "Before loading, our inspector conducts a thorough condition survey noting existing scratches, dents, odometer reading, fuel level, and accessories. A digital Car Condition Report (CCR) with time-stamped photographs is countersigned and handed to you before departure.",
      },
      {
        q: "Can I keep personal luggage or household items inside the car during transit?",
        a: "Standard transit regulations permit up to 30-40 kg of soft luggage placed securely in the trunk below the window line. However, valuable items, electronics, cash, jewelry, and flammable materials must never be left in the vehicle.",
      },
      {
        q: "How is the car secured inside the carrier during transit?",
        a: "Vehicles are driven onto hydraulic ramps and locked into position using high-tensile wheel chocks, 4-point tire lashings, and industrial safety straps attached to the carrier's chassis, preventing any vibration, sway, or movement during transit.",
      },
      {
        q: "What documents do I need to provide for car relocation?",
        a: "You need to provide clear copies of the Vehicle Registration Certificate (RC), valid vehicle insurance policy, current Pollution Under Control (PUC) certificate, and a copy of the owner's government ID (Aadhaar or Driving License).",
      },
      {
        q: "How much fuel should be in the tank at the time of pickup?",
        a: "We recommend maintaining approximately 1/4th (quarter) tank of fuel - enough for loading, unloading, and short positioning maneuvers, while minimizing vehicle weight and safety hazards.",
      },
      {
        q: "Do you provide doorstep pickup and delivery for vehicles?",
        a: "Yes. Door-to-door service is standard across all operational cities. If city restrictions or narrow residential streets prohibit large multi-car carriers, we use dedicated local recovery flatbeds to transport your car safely to and from our hub.",
      },
      {
        q: "Is transit insurance mandatory, and what does it cover?",
        a: "We strongly recommend transit insurance. It covers declared car valuation against physical transit damages, road accidents, overturning, fire, and natural perils during transit, offering complete financial peace of mind.",
      },
    ],
  },
  "bike-transportation": {
    title: "Bike & Two-Wheeler Transportation",
    badge: "Crated Two-Wheeler Transport",
    image: "/images/services/Bike&Two-WheelerTransportation.webp",
    rating: "4.8/5",
    stat: "12,000+ Bikes Delivered",
    subtitle: "Safe crated transport for motorcycles, scooters, and premium bikes.",
    overview:
      "Two-wheelers require sturdy packaging to prevent scratches and alignment issues during long journeys. We secure each motorcycle with protective wrapping and custom wooden crating before transport.",
    benefits: [
      "Protective wooden crating and bubble wrapping for scratch prevention",
      "Mirrors and delicate parts individually cushioned",
      "Fuel safely drained and battery disconnected for transit safety",
      "Direct tracking and status updates during route movement",
      "Can be booked individually or combined with household relocation",
    ],
    faqs: [
      {
        q: "How is my two-wheeler protected against scratches, dents, and handle misalignment?",
        a: "Every bike undergoes multi-layer packaging: mirrors are individually bubble-wrapped, body panels covered with foam sheets, levers cushioned, and the entire vehicle encased in heavy corrugated sheet wrapping. For premium and sports bikes, we construct a custom wooden crate.",
      },
      {
        q: "How should I prepare my motorcycle or scooter before pickup?",
        a: "Ensure the fuel tank is drained to reserve or empty (as mandated by transport safety regulations), clean the bike to facilitate pre-inspection, remove loose aftermarket accessories, and ensure tire pressure is adequate.",
      },
      {
        q: "What documents are mandatory for transporting a two-wheeler?",
        a: "A copy of the Vehicle Registration Certificate (RC), valid insurance certificate, current PUC certificate, and the owner's photo ID are required.",
      },
      {
        q: "Can I pack a helmet or riding gear with the bike?",
        a: "Yes. One helmet and light riding accessories can be securely packed and fastened inside the storage compartment or wrapped securely onto the rear carrier at no extra cost.",
      },
      {
        q: "Are sports bikes, Royal Enfields, and luxury cruisers handled differently?",
        a: "Yes. Heavy cruisers (e.g. Royal Enfield, Harley-Davidson) and faired sports bikes require customized heavy-duty wooden crating, specialized fork lashings, and dedicated strap anchor points to protect fairings, suspension seals, and exhaust chrome.",
      },
      {
        q: "How long does two-wheeler interstate delivery take?",
        a: "Typical delivery times range from 3 to 7 business days depending on the route distance (e.g., Delhi to Bangalore takes 4-5 days). We provide direct tracking updates throughout transit.",
      },
      {
        q: "Is doorstep pickup and delivery available for two-wheelers?",
        a: "Yes. Our local team picks up the two-wheeler directly from your residence on a specialized pickup vehicle and delivers it to your doorstep at your destination address.",
      },
      {
        q: "What happens in case of accidental damage or missing parts?",
        a: "All two-wheeler consignments are insured against transit incidents. The pre-move condition report serves as an exact baseline for seamless, dispute-free claim settlement in the rare event of transit damage.",
      },
    ],
  },
  "packing-unpacking": {
    title: "Packing & Unpacking Services",
    badge: "Multi-Layer Protection",
    image: "/images/services/Packing&UnpackingServices.webp",
    rating: "4.9/5",
    stat: "Zero Damage Track Record",
    subtitle: "Professional materials and techniques tailored for every household item.",
    overview:
      "Proper packing is the most critical step of any relocation. Our experienced team uses high-grade packaging materials specifically chosen for each category of goods, from fragile crystal to heavy appliances.",
    benefits: [
      "Heavy-duty multi-layer corrugated boxes and wardrobe cartons",
      "Bubble wrap, foam sheets, and corner guards for fragile items",
      "Clear room labelling for organized unpacking at destination",
      "Unpacking assistance to set up your primary living spaces quickly",
      "Available as a standalone service if you have arranged transport",
    ],
    faqs: [
      {
        q: "What specific packaging materials do you use for packing household items?",
        a: "We use export-grade materials: 5-ply virgin kraft corrugated boxes, 45-micron high-density bubble wrap, EPE foam sheets, corrugated roll wrappers, moisture-proof stretch cling film, reinforced edge protectors, and tamper-evident sealing tapes.",
      },
      {
        q: "Can I hire your packing team without booking transportation?",
        a: "Yes. We offer standalone packing services. If you have already arranged your own vehicle or are moving within the same apartment complex, our experienced crew can arrive solely to pack all your household belongings safely.",
      },
      {
        q: "How do you label and organize boxes so unpacking is easy?",
        a: "Every carton is marked with a color-coded room label (Master Bedroom, Kitchen, Living Room, etc.), box sequence number, and a detailed summary checklist of contents. Fragile boxes receive prominent 'Handle With Care / This Side Up' markings.",
      },
      {
        q: "What does complete unpacking service include?",
        a: "Our unpacking service includes opening all cartons, unwrapping protective layers, inspecting item condition, placing goods onto flat surfaces (shelves, countertops, closets) per your instructions, and collecting all discarded packaging waste for disposal.",
      },
      {
        q: "Do you provide wardrobe boxes for hanging clothes and suits?",
        a: "Yes. We supply specialized vertical wardrobe cartons equipped with built-in metal hanger bars, allowing suits, dresses, and formal coats to travel upright without wrinkles or dust.",
      },
      {
        q: "How much time does it take to pack a 2BHK or 3BHK home?",
        a: "A standard 2BHK typically takes 4 to 6 hours with a 3-person team, while a 3BHK takes 6 to 8 hours with a 4 to 5-person team. For large villas, packing can be scheduled across two consecutive days.",
      },
      {
        q: "Are packing materials yours to keep or do you take them back?",
        a: "All corrugated cartons, bubble wrap, and wrapping materials used for your move are purchased by you as part of the service quotation and remain yours, unless you opt for our post-move waste disposal service.",
      },
      {
        q: "Can you pack high-value artifacts, antique paintings, and crystal chandeliers?",
        a: "Yes. Our specialists build customized wooden skeleton crates and use acid-free tissue paper, micro-foam sheets, and custom wood frames to securely immobilize fine art, antique furniture, and crystal chandeliers.",
      },
    ],
  },
  "loading-unloading": {
    title: "Loading & Unloading Services",
    badge: "Trained Ground Crew",
    image: "/images/services/Loading&UnloadingServices.webp",
    rating: "4.9/5",
    stat: "Heavy Lifting Specialists",
    subtitle: "Trained ground crew equipped for heavy lifting and tight corridors.",
    overview:
      "Moving heavy furniture through stairwells and tight apartment elevators requires skill and proper equipment. Our experienced crew ensures zero damage to walls, door frames, or your belongings.",
    benefits: [
      "Trained handlers experienced with tight stairwells and elevators",
      "Use of moving dollies, straps, and protective blankets",
      "Safe handling of heavy appliances such as refrigerators and washers",
      "Careful placement in designated rooms at your new address",
      "Available as a standalone service for loading or unloading only",
    ],
    faqs: [
      {
        q: "Can I book your loading and unloading crew as a standalone service?",
        a: "Yes. If you have rented your own truck (e.g. Tata Ace, canter, or container) or need labor assistance for internal flat shifts, furniture rearrangement, or ground transport, our professional ground crew can be hired on a fixed hourly or job basis.",
      },
      {
        q: "What lifting and moving equipment does your team use?",
        a: "Our crew is equipped with heavy-duty 4-wheel flatbed dollies, 2-wheel appliance hand trucks with stair-climbers, heavy lifting forearm straps, rubberized wall-corner protectors, and quilted furniture padding blankets to prevent scratches.",
      },
      {
        q: "What if my building has no elevator or the elevator is out of service?",
        a: "Our crews are physically trained and conditioned for stair carries up to multiple floors. When booking, simply specify your pickup and destination floor numbers and stairwell conditions so we can deploy the appropriate crew size and equipment.",
      },
      {
        q: "How do you protect doors, walls, and flooring during heavy item loading?",
        a: "We line high-traffic door jambs with protective foam guards, lay floor runners over marble and hardwood floors, and wrap all large furniture in thick moving blankets before navigating hallways and tight corners.",
      },
      {
        q: "How are items stacked inside the truck to prevent transit shifts?",
        a: "We follow professional weight distribution protocols: heaviest appliances (refrigerators, washing machines) are placed at the base against the cabin wall, medium furniture is secured with ratchet straps, and fragile lightweight cartons are loaded on top.",
      },
      {
        q: "How do you handle heavy home appliances like double-door refrigerators and front-load washers?",
        a: "Appliances are secured with drum transit bolts (for washing machines), taped closed, wrapped in protective foam and moving blankets, and maneuvered using specialized appliance dollies with safety straps.",
      },
      {
        q: "Is unpacking and room-by-room placement included in unloading?",
        a: "Standard unloading includes carrying every item into your new premises and placing heavy furniture and room-labeled boxes into their designated rooms per your floor instructions.",
      },
      {
        q: "Are your crew members verified full-time employees?",
        a: "Yes. Unlike unorganized marketplace contractors, our loading crews are full-time, background-verified, and trained professionals covered under workplace safety policies.",
      },
    ],
  },
  "warehousing-storage": {
    title: "Warehousing & Secure Storage",
    badge: "24/7 Monitored Storage",
    image: "/images/services/Warehousing&SecureStorage.webp",
    rating: "4.9/5",
    stat: "CCTV Monitored & Insured",
    subtitle: "Clean, dry, and protected storage facilities for short and long-term needs.",
    overview:
      "When your new property is not ready or you need temporary space during home renovation, our secure warehouses provide clean, pest-controlled storage for your household or commercial inventory.",
    benefits: [
      "Clean, dry, and weather-protected storage facilities",
      "Round-the-clock security and controlled access",
      "Detailed inventory documentation before items are stored",
      "Flexible monthly rental terms with no rigid long-term lock-ins",
      "Seamless door-to-door transfer when you are ready for delivery",
    ],
    faqs: [
      {
        q: "What items can I store in your warehouse, and what is prohibited?",
        a: "You can store household furniture, boxed personal goods, electronics, office archives, and commercial stock. Strictly prohibited items include perishable food, flammable liquids, chemicals, explosives, plants, pets, and illegal contraband.",
      },
      {
        q: "How secure are your storage facilities?",
        a: "Our storage hubs feature 24/7 CCTV surveillance, biometric access control, fire suppression systems, on-site security personnel, pest-controlled environments, and weather-proof raised flooring to protect against water ingress.",
      },
      {
        q: "What are the rental terms and minimum storage duration?",
        a: "We offer highly flexible storage durations ranging from as short as 15 days to multiple months or years. There are no rigid lock-in contracts, and billing is calculated on a prorated weekly or monthly basis.",
      },
      {
        q: "How are my goods inventoried and tracked in storage?",
        a: "Every item and carton receives a barcode-linked serial number and is listed in an official Warehouse Receipt and Inventory Ledger with condition notes. You receive a digital copy of the inventory upon induction into the facility.",
      },
      {
        q: "Can I visit the warehouse to retrieve a specific carton before my lease ends?",
        a: "Yes. With 24-hour advance notice, our warehouse supervisor will locate your pallet or bay and retrieve your requested boxes for inspection, handover, or delivery.",
      },
      {
        q: "How are goods packed for long-term storage to prevent moisture and pest damage?",
        a: "Long-term consignments receive specialized storage packaging: moisture-resistant plastic stretch wrapping, silica gel desiccant packs inside cartons, anti-termite wooden pallets, and breathable dust-protective furniture covers.",
      },
      {
        q: "Do you provide pickup and final delivery to and from the warehouse?",
        a: "Yes. We provide end-to-end logistics: our team picks up goods directly from your current residence, transports them to the warehouse, and delivers and unloads them at your new home whenever you are ready.",
      },
      {
        q: "Is warehouse insurance available for stored consignments?",
        a: "Yes. Comprehensive fire, burglary, natural peril, and allied risk warehouse insurance is available based on your declared inventory valuation throughout the storage period.",
      },
    ],
  },
  "goods-insurance": {
    title: "Goods Transit Insurance",
    badge: "100% Value Transit Cover",
    image: "/images/services/GoodsTransitInsurance.webp",
    rating: "4.9/5",
    stat: "Prompt Claim Assistance",
    subtitle: "Full declared value coverage protecting your belongings throughout transit.",
    overview:
      "While our packing and transit standards are rigorous, transit insurance provides complete peace of mind. We facilitate comprehensive transit coverage so any unforeseen damage or loss is promptly compensated.",
    benefits: [
      "Coverage based on declared value rather than depreciated weight",
      "Protection against road accidents, theft, and natural hazards",
      "Transparent policy terms with full documentation provided upfront",
      "Direct claim assistance coordinated by our support team",
      "Applicable across home, office, and vehicle transportation",
    ],
    faqs: [
      {
        q: "Why do I need transit insurance if your packing and moving team is professional?",
        a: "While our damage rate is under 0.2%, interstate transit involves highway risks completely outside anyone's control - such as third-party road collisions, severe weather, overturned vehicles, flash floods, or highway fire. Insurance protects your declared financial investment against unpredictable risks.",
      },
      {
        q: "What is the difference between Declared Value Cover and Carrier Liability?",
        a: "Carrier Liability is legally capped at nominal token amounts based on weight (e.g. ₹10 to ₹50 per kg regardless of actual worth). Comprehensive Goods Transit Insurance covers the full declared market replacement value of each insured item.",
      },
      {
        q: "What risks are covered under the comprehensive transit insurance policy?",
        a: "The policy covers physical transit damages, total vehicle loss, road accidents, overturning, fire, theft, hijacking, and natural hazards (such as storm, flood, or earthquake) during loading, transit, and unloading.",
      },
      {
        q: "How is the insurance premium calculated?",
        a: "The premium is a transparent percentage (typically 1.5% to 3%) of the total declared value of your consignment, plus applicable government taxes. There are no hidden administrative charges.",
      },
      {
        q: "What documents are required to initiate a damage claim?",
        a: "If damage occurs, note it on the delivery consignment receipt (LR copy), take clear photographs and videos of the damaged item and packaging, and submit the original purchase invoice or valuation estimate within 48 hours of delivery.",
      },
      {
        q: "How long does the insurance claim settlement process take?",
        a: "For standard claims under ₹50,000 with complete documentation, settlements are typically finalized within 7 to 14 business days. Our dedicated Claims Desk handles surveyor coordination on your behalf.",
      },
      {
        q: "Can I insure only select high-value items, like an LED TV or luxury sofa?",
        a: "Most policies require either full-inventory declaration or specific declared high-value items accompanied by their respective invoices. Our team helps you structure the policy to balance premium costs and coverage.",
      },
      {
        q: "Does the insurance cover electrical and internal electronic failure without external damage?",
        a: "Transit insurance covers physical external impact, transit damage, and transit accidents. Pre-existing internal mechanical or electrical faults (such as a TV backlight dying with no external physical blow) are governed by the manufacturer's warranty, not transit insurance.",
      },
    ],
  },
};

const FAQAccordionItem = ({ faq, isOpen, onToggle }) => {
  return (
    <div className="rounded-2xl border border-border/80 bg-background overflow-hidden transition-all duration-200 hover:border-primary/35 shadow-xs">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer select-none focus-visible:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-display font-bold text-text text-base sm:text-lg leading-snug">
          {faq.q}
        </span>
        <span
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
            isOpen
              ? "bg-primary text-white border-primary rotate-180 shadow-xs"
              : "bg-surface text-text-muted border-border/80"
          }`}
        >
          <ChevronDown size={18} strokeWidth={2.5} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 pt-2 text-text-muted text-sm sm:text-base leading-relaxed border-t border-border/50">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = slug ? serviceDetails[slug] : null;
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <SEO
        title={service.title}
        description={service.subtitle}
        schemaJson={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "description": service.overview,
          "provider": {
            "@type": "MovingCompany",
            "name": company.brandName
          }
        }}
      />
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-surface via-surface/80 to-background border-b border-border py-12 sm:py-20 overflow-hidden">
        {/* Subtle decorative background ambient glow */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted flex-wrap" role="list">
              <li>
                <Link to="/" className="hover:text-primary font-medium transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-text-muted/60">
                <ChevronRight size={14} />
              </li>
              <li>
                <Link to="/services" className="hover:text-primary font-medium transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden="true" className="text-text-muted/60">
                <ChevronRight size={14} />
              </li>
              <li>
                <span className="text-text font-semibold">{service.title}</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-6">
              {/* Service Pill Badge */}
              {service.badge && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5">
                  <ShieldCheck size={14} className="text-accent shrink-0" />
                  <span>{service.badge}</span>
                </div>
              )}

              {/* Title */}
              <h1 className="font-display font-extrabold text-text tracking-tight mb-5 sm:mb-6 text-3xl sm:text-4xl lg:text-5xl leading-[1.25]">
                {service.title}
              </h1>

              {/* Subtitle - clean, balanced reading measure and comfortable rhythm */}
              <p className="text-text-muted text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mb-7 sm:mb-8">
                {service.subtitle}
              </p>

              {/* Exactly 2 CTAs: Quote & Call - side-by-side with balanced rhythm */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                <Button
                  to={`/get-quote?service=${service.slug}`}
                  size="lg"
                  className="shadow-lg shadow-accent/25"
                >
                  Get a Free Quote
                </Button>

                {company.phone.primary && (
                  <a
                    href={`tel:${company.phone.primary}`}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border-2 border-primary/20 bg-background hover:bg-surface text-primary font-bold text-sm sm:text-base transition-all duration-200 hover:border-primary/50 shadow-xs active:scale-[0.98]"
                  >
                    <PhoneCall size={18} className="text-accent shrink-0" strokeWidth={2.2} />
                    <span>Call {company.phone.primary}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Media Column - Full 16:9 Image Showcase without cropping or obstruction */}
            <div className="lg:col-span-6">
              <div className="relative w-full">
                <div className="relative aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-border/80 bg-surface group">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    loading="eager"
                  />
                </div>

                {/* Decorative subtle ambient glow backing */}
                <div
                  className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-transparent -z-10 blur-xl opacity-60 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Benefits */}
      <section className="bg-background py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Content Column */}
            <div className="lg:col-span-8 space-y-16 sm:space-y-20">
              {/* How we handle your move */}
              <div>
                <h2 className="font-display font-bold text-text text-2xl sm:text-3xl lg:text-4xl mb-6 tracking-tight">
                  How we handle your move
                </h2>
                <p className="text-text-muted text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
                  {service.overview}
                </p>
              </div>

              {/* Key features and standards */}
              <div>
                <h3 className="font-display font-bold text-text text-xl sm:text-2xl mb-8 tracking-tight">
                  Key features and standards
                </h3>
                <ul className="space-y-4 sm:space-y-5" role="list">
                  {service.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-surface/70 border border-border/80 hover:border-primary/25 hover:bg-surface transition-colors duration-200"
                    >
                      <span
                        className="flex items-center justify-center w-8 h-8 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <CheckCircle2 size={18} strokeWidth={2.5} />
                      </span>
                      <span className="text-base sm:text-lg text-text font-medium leading-relaxed pt-0.5">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-28 p-7 sm:p-8 rounded-3xl border border-border/80 bg-surface shadow-xl space-y-7">
                <div>
                  <h3 className="font-display font-bold text-text text-lg sm:text-xl mb-3 tracking-tight">
                    Need a quick estimate?
                  </h3>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                    Speak directly with our moving supervisors to discuss timing, packing options, and pricing.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button
                    to={`/get-quote?service=${service.slug}`}
                    size="lg"
                    className="w-full shadow-md shadow-accent/20"
                  >
                    Request a Quote
                  </Button>
                  
                  {company.phone.primary && (
                    <a
                      href={`tel:${company.phone.primary}`}
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full border-2 border-primary/20 bg-background hover:bg-surface text-primary font-bold text-sm sm:text-base transition-all duration-200 hover:border-primary/50 shadow-xs"
                    >
                      <PhoneCall size={17} strokeWidth={2.2} className="text-accent" />
                      <span>Call {company.phone.primary}</span>
                    </a>
                  )}
                </div>

                <div className="pt-5 border-t border-border/70">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-text-muted">
                    <ShieldCheck size={18} className="text-primary shrink-0" />
                    <span>Transparent quotes. No hidden delivery fees.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Quote Form for direct action */}
      <QuoteForm defaultService={service.title} />

      {/* Extensive Expandable FAQ Section placed below the form */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="bg-surface/50 border-t border-border py-16 sm:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/15 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <HelpCircle size={14} className="text-accent" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="font-display font-bold text-text text-2xl sm:text-3xl lg:text-4xl tracking-tight mb-4">
                Everything you need to know
              </h2>
              <p className="text-text-muted text-base sm:text-lg leading-relaxed">
                Clear, transparent answers about our {service.title.toLowerCase()} process, pricing, safety standards, and guarantees.
              </p>
            </div>

            {/* Expandable Accordion List */}
            <div className="space-y-4">
              {service.faqs.map((faq, i) => (
                <FAQAccordionItem
                  key={i}
                  faq={faq}
                  isOpen={openFaqIndex === i}
                  onToggle={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                />
              ))}
            </div>

            {/* Reassurance Help Box */}
            <div className="mt-12 sm:mt-16 text-center p-7 sm:p-10 rounded-3xl border border-border/80 bg-background shadow-xs">
              <h3 className="font-display font-bold text-text text-lg sm:text-xl mb-2.5">
                Have a question not listed here?
              </h3>
              <p className="text-text-muted text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
                Speak directly with our moving supervisors to discuss custom routes, special fragile handling, or custom timelines.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {company.phone.primary && (
                  <a
                    href={`tel:${company.phone.primary}`}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full border-2 border-primary/20 bg-background hover:bg-surface text-primary font-bold text-sm sm:text-base transition-all duration-200 hover:border-primary/50 shadow-xs"
                  >
                    <PhoneCall size={17} strokeWidth={2.2} className="text-accent" />
                    <span>Call {company.phone.primary}</span>
                  </a>
                )}
                <Button to={`/get-quote?service=${service.slug}`} size="md">
                  Request a Free Quote
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ServiceDetail;
