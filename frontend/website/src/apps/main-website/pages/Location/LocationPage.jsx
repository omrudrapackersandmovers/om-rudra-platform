import { useState, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Truck,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Boxes,
  Home,
  Bike,
  Car,
  ArrowUpRight,
  ChevronDown,
  Navigation,
  FileCheck,
  Zap,
  Building2,
  Warehouse,
  Package,
  Search,
  Check,
  ShieldAlert,
  ArrowRight,
  X,
  HelpCircle,
} from "lucide-react";
import {
  allServiceLocations,
  placeImages,
  allRoutes,
  getLocationProfile,
} from "../../../../data/locations/index";
import {
  estimatorOptions,
  pricingDisclaimer,
  competitiveAdvantages,
  scamComparison,
} from "../../../../data/pricing";
import { company } from "../../../../data/company";
import QuoteForm from "../Home/components/QuoteForm";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";
import NotFound from "../../shared/components/NotFound";
import ParallaxStripSlider from "../../../../components/ui/parallax-strip-slider";

// Relocation services specifically available in each location
const LOCATION_SERVICES = [
  {
    id: "household",
    title: "Household Shifting",
    icon: Home,
    badge: "100% Dedicated Truck",
    tagline: "Damage-free residential moving with 5-layer packing and room-by-room furniture setup.",
    features: [
      "Virgin 5-ply cartons, bubble wrap, and foam edge guards",
      "Dedicated closed container - never co-loaded with strangers",
      "Dismantling and reassembly of beds, tables, and wardrobes",
      "Room-by-room positioning and packing debris removal",
    ],
    slug: "home-shifting",
  },
  {
    id: "commercial",
    title: "Office & Corporate Relocation",
    icon: Building2,
    badge: "Zero Business Downtime",
    tagline: "Scheduled weekend or overnight moves with anti-static server handling and workstation setup.",
    features: [
      "Weekend and after-hours shifts to prevent working-day disruptions",
      "Anti-static packaging for servers, desktops, and networking gear",
      "Color-coded department indexing and floor-mapped placement",
      "Official GST invoices for seamless corporate accounting",
    ],
    slug: "office-commercial-shifting",
  },
  {
    id: "car",
    title: "Enclosed Car Carrier",
    icon: Car,
    badge: "Zero Highway Wear",
    tagline: "Hydraulic multi-car carriers with wheel chocks and physical pre-inspection reports.",
    features: [
      "Door-to-door hydraulic enclosed carrier transit",
      "No open-highway driving - zero odometer increase or stone chips",
      "Pre-loading photographic condition inspection report",
      "Transit insurance coverage for unforeseen road contingencies",
    ],
    slug: "car-transportation",
  },
  {
    id: "bike",
    title: "Two-Wheeler & Bike Crating",
    icon: Bike,
    badge: "Custom Timber Crate",
    tagline: "Reinforced wooden crating and foam wrap to guarantee zero frame scratch or paint damage.",
    features: [
      "Reinforced timber box crating with shock-absorbing foam",
      "Fuel drain and battery disconnection safety protocol",
      "Doorstep pickup across all city residential sectors",
      "Can be clubbed with household moves for discounted freight",
    ],
    slug: "bike-transportation",
  },
  {
    id: "packing",
    title: "Packing & Unpacking Crew",
    icon: Package,
    badge: "Trained Handlers",
    tagline: "Export-grade supplies and professional packers for delicate crystal, crockery, and LEDs.",
    features: [
      "Custom wooden carpentry for large smart TVs and mirrors",
      "Dish-pack cartons for delicate kitchenware and glassware",
      "Wardrobe hanger cartons for wrinkle-free clothing transit",
      "Destination unpacking and complete carton removal",
    ],
    slug: "packing-unpacking",
  },
  {
    id: "warehouse",
    title: "Secure Warehouse Storage",
    icon: Warehouse,
    badge: "24/7 Guarded Bays",
    tagline: "Moisture-free, pest-controlled warehouse facilities for short-term or long-term household storage.",
    features: [
      "24/7 CCTV surveillance with dedicated barcode item tracking",
      "Moisture-proof, fire-retardant storage chambers",
      "Flexible weekly and monthly rental terms",
      "Convenient doorstep retrieval and dispatch to destination",
    ],
    slug: "warehousing-storage",
  },
];

const LocationPage = () => {
  const { slug: rawSlug } = useParams();
  const [priceScope, setPriceScope] = useState("local");
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [localitySearch, setLocalitySearch] = useState("");
  const [activeServiceTab, setActiveServiceTab] = useState("household");
  const [activeFaqCategory, setActiveFaqCategory] = useState("all");
  const [selectedMoveSize, setSelectedMoveSize] = useState("2bhk");

  // Normalize slug: handles "packers-movers-patna", "patna", etc.
  const cleanSlug = (rawSlug || "").replace(/^packers-movers-/, "");

  // Check if this single-segment slug is an interstate route (e.g. /patna-to-delhi)
  const routeMatch = allRoutes.find(
    (r) => r.slug === cleanSlug || r.slug === rawSlug
  );
  if (routeMatch) {
    return <Navigate to={`/route/${routeMatch.slug}`} replace />;
  }

  const location = allServiceLocations.find((loc) => loc.slug === cleanSlug);

  if (!location) {
    return <NotFound />;
  }

  // Retrieve rich hyper-local profile
  const profile = getLocationProfile(location.slug, location);

  // Filter outbound interstate routes matching this city or regional hub
  const directRoutes = allRoutes.filter(
    (r) =>
      r.fromSlug === location.slug ||
      r.from.toLowerCase() === location.name.toLowerCase()
  );
  const hubSlug = location.state === "Jharkhand" ? "ranchi" : "patna";
  const outboundRoutes =
    directRoutes.length > 0
      ? directRoutes.slice(0, 6)
      : allRoutes.filter((r) => r.fromSlug === hubSlug).slice(0, 6);

  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20need%20packers%20and%20movers%20in%20${encodeURIComponent(location.name)}.`
    : "#";

  // Location slides for full-bleed hero parallax strip slider (16:9 imagery)
  const locationSlides = useMemo(() => {
    const regionalImg =
      placeImages[location.state] ||
      placeImages[location.slug] ||
      "/images/places/bihar.webp";

    return [
      {
        src: regionalImg,
        title: `${location.name} Verified Hub`,
        chapter: `${location.state} Fleet Operations`,
      },
      {
        src: "/images/process-for-home-service/packing.webp",
        title: "5-Layer Defensive Packing",
        chapter: "Virgin Cartons and Bubble Cushioning",
      },
      {
        src: "/images/process-for-home-service/safe-transport.webp",
        title: "Dedicated Sealed Transit",
        chapter: "All-Weather GPS Locked Containers",
      },
      {
        src: "/images/process-for-home-service/setting-on-new-place.webp",
        title: "Doorstep Placement and Setup",
        chapter: "Furniture Reassembly and Zero Waste",
      },
    ];
  }, [location]);

  // Filter localities based on user query
  const filteredLocalities = useMemo(() => {
    if (!profile.localities) return [];
    if (!localitySearch.trim()) return profile.localities;
    const q = localitySearch.toLowerCase().trim();
    return profile.localities.filter((loc) => loc.toLowerCase().includes(q));
  }, [profile.localities, localitySearch]);

  // Selected service object
  const activeService =
    LOCATION_SERVICES.find((s) => s.id === activeServiceTab) ||
    LOCATION_SERVICES[0];

  // Process steps with genuine operational imagery
  const processSteps = [
    {
      step: "01",
      title: `Doorstep Survey in ${location.name}`,
      image: "/images/process-for-home-service/visti-and-survey.webp",
      desc: "Volumetric inventory assessment via doorstep visit or WhatsApp video call. Receive an exact, binding fixed quotation with zero moving-day surprises.",
      highlights: ["Free & No Obligation", "Binding Written Quote", "Guaranteed Slot"],
    },
    {
      step: "02",
      title: "5-Layer Defensive Packing",
      image: "/images/process-for-home-service/packing.webp",
      desc: "Fragile goods, glassware, and electronics wrapped in virgin 5-ply cartons, multi-layer bubble wrap, foam padding, and custom TV crating.",
      highlights: ["Virgin 5-Ply Cartons", "Color-Coded Indexing", "Furniture Disassembly"],
    },
    {
      step: "03",
      title: "Dedicated Sealed Transit",
      image: "/images/process-for-home-service/safe-transport.webp",
      desc: `Goods loaded into an exclusive weather-proof container vehicle. Direct highway transit via ${profile.corridors.split(",")[0]} with regular milestone updates.`,
      highlights: ["Zero Co-Loading", "Locked Sealed Truck", "Door-to-Door Transit"],
    },
    {
      step: "04",
      title: "Unpacking & Room Setup",
      image: "/images/process-for-home-service/setting-on-new-place.webp",
      desc: "Unloading directly into respective bedrooms, complete furniture reassembly, appliance positioning, and total carton waste removal.",
      highlights: ["Bed & Table Reassembly", "Room-by-Room Placement", "Debris Removal"],
    },
  ];

  // Comprehensive Deal-Closing FAQs tailored to this location
  const comprehensiveFaqs = useMemo(() => {
    const defaultList = [
      {
        category: "pricing",
        categoryLabel: "Pricing & Survey",
        q: `How much do packers and movers charge for shifting in ${location.name}?`,
        a: `Local household shifting within ${location.name} typically starts from Rs 3,500 for a 1 BHK, Rs 5,500 for a 2 BHK, and Rs 8,500 for a 3 BHK. Interstate moves from ${location.name} start from Rs 7,500 to Rs 18,000 depending on destination corridor and volume. Final charges depend on inventory volume, packing tier, vehicle size, and floor access with elevator availability.`,
      },
      {
        category: "pricing",
        categoryLabel: "Pricing & Survey",
        q: "Are there any hidden charges, toll fees, or moving-day surprises?",
        a: "Zero. Our written quotation is 100% binding and all-inclusive. Highway toll plaza fees, state transit permits, driver allowances, labor for loading/unloading, and all 5-ply packing materials are explicitly stated upfront. We do not demand unexpected tea tips or roadside surcharges on moving day.",
      },
      {
        category: "pricing",
        categoryLabel: "Pricing & Survey",
        q: `Do you provide a free doorstep or video pre-move survey in ${location.name}?`,
        a: `Yes. We provide completely free, no-obligation pre-move surveys across ${location.name}. A senior moving specialist can visit your home for an on-site volumetric survey, or you can complete a quick 10-minute WhatsApp video survey at your convenience to receive a fixed quotation within 30 minutes.`,
      },
      {
        category: "packing",
        categoryLabel: "Packing & Safety",
        q: "What packing materials are included in the price? Do I need to arrange cartons myself?",
        a: "You do not need to arrange anything. Our packing crew arrives with virgin 5-ply corrugated cartons, multi-layer air bubble rolls, foam corner guards, heavy-duty stretch film, and waterproof adhesive tapes. All packing supplies are fully covered in your quote.",
      },
      {
        category: "packing",
        categoryLabel: "Packing & Safety",
        q: "How do you protect fragile items, large Smart TVs, and glass mirrors?",
        a: "Fragile kitchen crockery and crystal glassware are wrapped in foam sheets and bubble wrap before being packed into reinforced dish-pack cartons. Smart TVs (55 inches and above) and heavy mirrors receive custom wooden carpentry crating or heavy corrugated screen protectors. Mandir idols and puja articles are packed separately with clean, untouched materials with the utmost reverence.",
      },
      {
        category: "packing",
        categoryLabel: "Packing & Safety",
        q: "Will your moving crew dismantle and reassemble heavy furniture like double beds and wardrobes?",
        a: "Yes. Our trained crew includes skilled carpentry hands equipped with power tools to safely dismantle double beds (hydraulic and manual box beds), dining tables, study units, and modular wardrobes before loading. Upon delivery at your new home, our team reassembles and places them exactly where you direct.",
      },
      {
        category: "logistics",
        categoryLabel: "Trucks & Transit",
        q: "Will my household goods be transported in an exclusive truck or shared with strangers?",
        a: "We allocate a 100% dedicated, closed-body weatherproof container exclusively locked for your family. Your goods are never mixed or co-loaded with other clients' consignments, and there is zero intermediate transshipment or warehouse offloading.",
      },
      {
        category: "logistics",
        categoryLabel: "Trucks & Transit",
        q: `Can your moving trucks navigate narrow lanes and congested colonies in ${location.name}?`,
        a: `Yes. In older sectors or dense residential colonies across ${location.name} where heavy 17ft to 24ft container trucks cannot enter, we deploy compact feeder shuttles (Tata Ace and 10ft container vehicles) to carry goods safely from your doorstep to our sealed long-haul truck without any road obstruction.`,
      },
      {
        category: "logistics",
        categoryLabel: "Trucks & Transit",
        q: `How do you manage municipal no-entry windows and highway restrictions in ${location.name}?`,
        a: `Commercial vehicles in ${location.name} are subject to scheduled municipal no-entry hours during morning and evening rush times. Our local operations team plans dispatch schedules around these windows or secures municipal transit permits, guaranteeing on-schedule departures without roadside police delays.`,
      },
      {
        category: "delivery",
        categoryLabel: "Unpacking & Setup",
        q: "Do you unpack cartons and place furniture in the rooms at our new home?",
        a: "Yes. Unlike casual transporters who leave boxes dumped in your living room, our moving team unloads room by room, places heavy furniture and appliances in their designated spots, reassembles dismantled beds, and removes all empty carton debris from your premises.",
      },
      {
        category: "delivery",
        categoryLabel: "Unpacking & Setup",
        q: "What happens if my new apartment is on the 3rd or 4th floor with no elevator?",
        a: "Our pre-move survey notes floor access and elevator availability upfront. Our crew is trained in high-rise manual handling with shoulder dollies and heavy-duty lifting straps. If oversized sofas or mattresses cannot fit through stairwells, we provide external balcony rope hoisting.",
      },
      {
        category: "insurance",
        categoryLabel: "Insurance & Booking",
        q: "What if an item is damaged during the move? How does transit insurance work?",
        a: "We offer comprehensive all-risk transit insurance covering declared goods against unforeseen accidents, fire, or transit damage. Before loading, our team prepares an itemized inventory list with condition notes. In the rare event of damage, our customer desk facilitates direct claim settlements without lengthy paperwork.",
      },
      {
        category: "insurance",
        categoryLabel: "Insurance & Booking",
        q: "What is your payment structure? Do I have to pay 100% upfront?",
        a: "No. We never ask for full advance payment. You only pay a small advance token (10% to 20%) to confirm your moving date and reserve your container. A partial payment is made upon completion of packing and loading inspection, and the final balance is paid only after goods arrive safely and you verify your inventory at destination.",
      },
      {
        category: "insurance",
        categoryLabel: "Insurance & Booking",
        q: "Do you provide official GST invoices and transit bilty for employer reimbursement?",
        a: "Yes. 100% of our moves are accompanied by official GST invoices, consignment notes (bilty), transit insurance certificates, and itemized packing manifests. These documents comply with standard corporate and central/state government employee relocation reimbursement rules.",
      },
      {
        category: "logistics",
        categoryLabel: "Trucks & Transit",
        q: `Can you transport my car or two-wheeler along with my household goods from ${location.name}?`,
        a: "Yes. We transport motorcycles and scooters in custom reinforced wooden crates with protective foam wrap. For cars (hatchbacks, sedans, and SUVs), we operate enclosed hydraulic car carriers with wheel chocks and physical pre-inspection condition reports, guaranteeing zero highway driving or odometer wear.",
      },
    ];

    // Prepend any city-specific unique FAQs from contextData
    if (profile.faqs && profile.faqs.length > 0) {
      const cityFaqs = profile.faqs.map((f) => ({
        category: "city",
        categoryLabel: `${location.name} Specific`,
        q: f.q,
        a: f.a,
      }));
      return [...cityFaqs, ...defaultList];
    }
    return defaultList;
  }, [location.name, profile.faqs]);

  // Filtered FAQs by category tab
  const filteredFaqs = useMemo(() => {
    if (activeFaqCategory === "all") return comprehensiveFaqs;
    return comprehensiveFaqs.filter((f) => f.category === activeFaqCategory);
  }, [comprehensiveFaqs, activeFaqCategory]);

  // Build schema.org FAQ entities
  const faqSchemaEntities = comprehensiveFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MovingCompany",
        name: `${company.brandName} - ${location.name}`,
        url: `https://1stompackersandmovers.com/packers-movers-${location.slug}`,
        telephone: company.phone.primary || undefined,
        description: `Professional household packing, commercial shifting, and vehicle transport services in ${location.name}, ${location.state}. Fixed pricing and verified moving crew.`,
        address: {
          "@type": "PostalAddress",
          addressLocality: location.name,
          addressRegion: location.state,
          addressCountry: "IN",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://1stompackersandmovers.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Locations",
            item: "https://1stompackersandmovers.com/where-we-serve",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `${location.name}, ${location.state}`,
            item: `https://1stompackersandmovers.com/packers-movers-${location.slug}`,
          },
        ],
      },
      ...(faqSchemaEntities.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqSchemaEntities,
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <SEO
        title={`Packers and Movers in ${location.name}, ${location.state} | 1st Om Movers`}
        description={`Reliable packers and movers in ${location.name}. Dedicated closed container trucks, 5-layer packing protection, transparent fixed pricing, and verified moving crews.`}
        schemaJson={structuredData}
      />

      {/* ── 1. HERO SECTION WITH PARALLAX STRIP SLIDER ─────────────── */}
      <section className="relative border-b border-border/70 overflow-hidden bg-[#070b14] min-h-[90vh] lg:min-h-screen flex items-center">
        <ParallaxStripSlider slides={locationSlides} autoplay={true} className="min-h-[90vh] lg:min-h-screen">
          <div className="py-8 sm:py-12 max-w-4xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
              <ol
                className="flex items-center gap-1.5 text-xs sm:text-sm text-white/70 flex-wrap drop-shadow-sm"
                role="list"
              >
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} className="text-white/40" />
                </li>
                <li>
                  <Link
                    to="/where-we-serve"
                    className="hover:text-white transition-colors"
                  >
                    Locations
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={13} className="text-white/40" />
                </li>
                <li>
                  <span className="text-white font-semibold">{location.name}</span>
                </li>
              </ol>
            </nav>

            {/* Type Badge - High Contrast Pill without any arbitrary box */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4 drop-shadow-sm">
              <MapPin size={13} className="text-accent" />
              <span>
                {location.type === "hub"
                  ? `${location.name} Central Headquarters & Fleet Hub`
                  : `${location.state} Verified District Network`}
              </span>
            </div>

            {/* H1 Heading */}
            <h1
              className="font-display font-extrabold text-white tracking-tight mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
              style={{
                fontSize: "clamp(2rem, 4.2vw, 3.3rem)",
                lineHeight: "1.14",
              }}
            >
              Packers and Movers in {location.name}
            </h1>

            {/* Description */}
            <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Safe, scheduled household and commercial shifting across {location.name} and connecting interstate corridors. Managed with dedicated closed container vehicles, trained in-house packers, and binding fixed pricing with zero moving-day surprise fees.
            </p>

            {/* Action Buttons with Uniform Pill Geometry */}
            <div className="flex items-center gap-3.5 flex-wrap mb-8">
              <Button
                to={`/get-quote?from=${encodeURIComponent(location.name + ", " + location.state)}`}
                size="md"
                className="shadow-lg hover:shadow-xl"
              >
                Get Free Quote in {location.name}
              </Button>

              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/50 border border-white/25 text-sm font-semibold text-white hover:bg-black/70 hover:border-white/40 transition-all backdrop-blur-md shadow-sm"
                >
                  <PhoneCall size={15} className="text-accent" />
                  <span>Call {company.phone.primary}</span>
                </a>
              )}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-semibold hover:brightness-105 transition-all shadow-md"
              >
                <MessageCircle size={15} />
                <span>WhatsApp Coordinator</span>
              </a>
            </div>

            {/* Core Value Guarantees (Single Non-Wrapping Line, What Matters Most) */}
            <div className="flex items-center gap-4 sm:gap-6 pt-6 border-t border-white/20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar flex-nowrap">
              <div className="flex items-center gap-2 shrink-0">
                <ShieldCheck size={16} className="text-accent shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                  Zero Hidden Charges
                </span>
              </div>

              <div className="w-px h-4 bg-white/25 shrink-0" />

              <div className="flex items-center gap-2 shrink-0">
                <Truck size={16} className="text-accent shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                  Dedicated Container
                </span>
              </div>

              <div className="w-px h-4 bg-white/25 shrink-0" />

              <div className="flex items-center gap-2 shrink-0">
                <Boxes size={16} className="text-accent shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                  5-Layer Packing
                </span>
              </div>

              <div className="w-px h-4 bg-white/25 shrink-0" />

              <div className="flex items-center gap-2 shrink-0">
                <Clock size={16} className="text-accent shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                  Guaranteed Dispatch
                </span>
              </div>
            </div>
          </div>
        </ParallaxStripSlider>
      </section>

      {/* ── 2. TRANSPARENT PRICING & RATES MATRIX ───────────────────── */}
      <section className="bg-background py-12 sm:py-16 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2">
                <Zap size={13} />
                <span>Upfront Rate Transparency</span>
              </div>
              <h2 className="font-display font-bold text-text text-xl sm:text-2xl">
                Estimated Relocation Charges in {location.name}
              </h2>
              <p className="text-text-muted text-xs sm:text-sm mt-1">
                Fixed, binding quotes calculated by volume and floor access. Zero moving-day price escalations.
              </p>
            </div>

            {/* Scope Switcher */}
            <div className="inline-flex p-1 rounded-full bg-surface border border-border shrink-0">
              <button
                type="button"
                onClick={() => setPriceScope("local")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  priceScope === "local"
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Local Move (Within {location.name})
              </button>
              <button
                type="button"
                onClick={() => setPriceScope("interstate")}
                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  priceScope === "interstate"
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Interstate from {location.name}
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid (4 Move Sizes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {estimatorOptions.slice(0, 4).map((item) => {
              const displayPrice =
                priceScope === "local" ? item.localPrice : item.interstatePrice;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border bg-surface p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-display font-bold text-text text-base">
                        {item.label}
                      </span>
                      <span className="p-2 rounded-xl bg-primary/10 text-primary">
                        <Home size={16} />
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="text-xs text-text-muted block">
                        Estimated Moving Cost
                      </span>
                      <span className="font-display font-extrabold text-primary text-xl sm:text-2xl">
                        {displayPrice}
                      </span>
                    </div>

                    <ul
                      className="space-y-2 text-xs text-text-muted mb-6"
                      role="list"
                    >
                      <li className="flex items-center gap-2">
                        <CheckCircle2
                          size={13}
                          className="text-primary shrink-0"
                        />
                        <span>{item.truck}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2
                          size={13}
                          className="text-primary shrink-0"
                        />
                        <span>{item.crew}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2
                          size={13}
                          className="text-primary shrink-0"
                        />
                        <span>{item.duration}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2
                          size={13}
                          className="text-primary shrink-0"
                        />
                        <span className="line-clamp-1">
                          {item.packingSupplies}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMoveSize(item.id);
                      const el = document.getElementById("quote-form-section");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full text-center py-2 px-4 rounded-full border border-primary/40 bg-background text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Select {item.id.toUpperCase()}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Vehicle & Specialized Transport Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-surface border border-border mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bike size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-text text-sm sm:text-base">
                  Two-Wheeler & Bike Transport in {location.name}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Heavy wooden crating, bubble foam wrapping, fuel drain protocol, and doorstep pickup across {location.name}.
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs font-bold text-primary">
                  <span>Local: Rs 1,500 - Rs 2,800</span>
                  <span className="text-border">|</span>
                  <span>Interstate: Rs 3,500 - Rs 6,800</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Car size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-text text-sm sm:text-base">
                  Enclosed Hydraulic Car Carrier
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Dedicated hydraulic car carriers with wheel chocks, photographic condition reports, and transit insurance.
                </p>
                <div className="mt-2 flex items-center gap-3 text-xs font-bold text-primary">
                  <span>Local: Rs 2,500 - Rs 4,500</span>
                  <span className="text-border">|</span>
                  <span>Interstate: Rs 9,500 - Rs 22,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Clean Open Comparison Table (Zero Box-in-Box Loop, Pure Editorial Alignment) */}
          <div className="pt-2">
            <div className="mb-6 pb-4 border-b border-border">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2.5">
                <ShieldCheck size={14} />
                <span>Operational Governance</span>
              </div>
              <h3 className="font-display font-bold text-text text-lg sm:text-xl mb-1.5">
                Guaranteed Relocation Standards in {location.name}
              </h3>
              <p className="text-xs sm:text-sm text-text-muted max-w-2xl leading-relaxed">
                How our institutional fleet and verified crews protect your move against informal market practices.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border text-text font-display font-bold">
                    <th className="py-3.5 pr-4 w-1/4">Relocation Parameter</th>
                    <th className="py-3.5 px-4 w-3/8 text-text-muted">Informal Market Practice</th>
                    <th className="py-3.5 pl-4 w-3/8 text-primary font-bold">1st Om Binding Standards</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {scamComparison.slice(0, 4).map((scamItem, idx) => (
                    <tr key={idx} className="hover:bg-background/40 transition-colors">
                      <td className="py-4 pr-4 font-bold text-text align-top">
                        {scamItem.aspect}
                      </td>
                      <td className="py-4 px-4 text-text-muted align-top leading-relaxed">
                        {scamItem.scam}
                      </td>
                      <td className="py-4 pl-4 text-text font-medium align-top leading-relaxed">
                        <div className="flex items-start gap-2">
                          <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                          <span>{scamItem.firstOm}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Disclaimer */}
          <p className="text-[11px] text-text-muted/80 mt-4 leading-relaxed">
            * {pricingDisclaimer}
          </p>
        </div>
      </section>

      {/* ── 3. SERVICES SPECIFICALLY AVAILABLE IN THIS LOCATION ────── */}
      <section className="bg-surface py-12 sm:py-16 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Boxes size={13} />
              <span>Tailored Relocation Services</span>
            </div>
            <h2 className="font-display font-bold text-text text-xl sm:text-2xl text-balance">
              Complete Moving Solutions in {location.name}
            </h2>
            <p className="text-text-muted text-xs sm:text-sm mt-1 max-w-2xl mx-auto text-balance">
              From compact studio apartments to multi-floor corporate offices and vehicles, our specialized logistics crews handle every stage.
            </p>
          </div>

          {/* Service Tabs - Single-row horizontal slider starting from left */}
          <div className="w-full overflow-x-auto pb-4 mb-8 no-scrollbar">
            <div className="flex items-center gap-2.5 min-w-max px-4 sm:px-6">
              {LOCATION_SERVICES.map((s) => {
                const TabIcon = s.icon;
                const isActive = activeServiceTab === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveServiceTab(s.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-background text-text-muted border-border hover:text-text hover:bg-surface"
                    }`}
                  >
                    <TabIcon size={15} />
                    <span>{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Service Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeService.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6 sm:p-8 rounded-3xl bg-background border border-border shadow-sm"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    {activeService.badge}
                  </div>
                  <h3 className="font-display font-bold text-text text-xl sm:text-2xl">
                    {activeService.title} in {location.name}
                  </h3>
                  <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                    {activeService.tagline}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {activeService.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-text"
                      >
                        <CheckCircle2
                          size={16}
                          className="text-primary shrink-0 mt-0.5"
                        />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 flex-wrap">
                    <Button
                      to={`/get-quote?from=${encodeURIComponent(location.name + ", " + location.state)}&service=${activeService.slug}`}
                      size="sm"
                    >
                      Book {activeService.title}
                    </Button>
                    <Link
                      to={`/services/${activeService.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-xs font-semibold text-text hover:bg-surface transition-colors"
                    >
                      <span>Explore Service Details</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-4 p-5 rounded-2xl bg-surface border border-border space-y-3">
                  <span className="text-xs font-bold text-text block uppercase tracking-wider">
                    Service Standards in {location.name}
                  </span>
                  <div className="space-y-2 text-xs text-text-muted">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span>Survey Availability</span>
                      <span className="font-semibold text-text">Same Day / Video</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span>Transit Mode</span>
                      <span className="font-semibold text-text">Dedicated Closed Truck</span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span>Packing Protection</span>
                      <span className="font-semibold text-text">5-Layer Defensive Wrap</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Official Documentation</span>
                      <span className="font-semibold text-text">GST Invoice & Bilty</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── 4. 4-STEP RELOCATION WORKFLOW WITH OPERATIONAL IMAGERY ──── */}
      <section className="bg-background py-12 sm:py-16 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2">
              <Navigation size={13} />
              <span>Disciplined Damage-Free Workflow</span>
            </div>
            <h2 className="font-display font-bold text-text text-xl sm:text-2xl text-balance">
              Our 4-Step Moving Journey in {location.name}
            </h2>
            <p className="text-text-muted text-xs sm:text-sm mt-1 max-w-2xl mx-auto text-balance">
              Visual proof of how we handle your belongings from doorstep assessment to placement in your new home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {processSteps.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-surface rounded-2xl border border-border overflow-hidden flex flex-col h-full hover:border-primary/40 hover:shadow-md transition-all group"
              >
                {/* Step Photographic Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-background shrink-0">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-[11px] font-extrabold border border-white/20">
                    STEP {item.step}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-text text-base mb-2 min-h-[2.75rem] flex items-center leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1 min-h-[4.5rem]">
                    {item.desc}
                  </p>

                  <div className="space-y-1.5 mt-auto pt-3 border-t border-border/60">
                    {item.highlights.map((hl, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-center gap-1.5 text-[11px] text-text font-medium"
                      >
                        <CheckCircle2
                          size={12}
                          className="text-primary shrink-0"
                        />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. LOCALITIES & HIGHWAY LOGISTICS ───────────────────────── */}
      <section className="bg-surface py-12 sm:py-16 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            
            {/* Left Column: Local Logistics Details & Interactive Locality Filter */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin size={13} />
                  <span>Ground Operations</span>
                </div>
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl mb-3">
                  Relocation Logistics in {location.name}
                </h2>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-4">
                  Moving in or out of {location.name} requires familiarity with local routes and road conditions. Our drivers operate via {profile.corridors}, selecting optimal timing to navigate urban traffic and highway toll checkpoints smoothly.
                </p>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  {profile.logisticsNote}
                </p>
              </div>

              {/* Localities / Neighborhoods with Interactive Filter */}
              {profile.localities && profile.localities.length > 0 && (
                <div className="p-6 rounded-2xl bg-background border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display font-bold text-text text-base">
                        Neighborhoods Served Across {location.name}
                      </h3>
                      <p className="text-text-muted text-xs">
                        Daily doorstep moving crews and feeder shuttles operate in all major sectors:
                      </p>
                    </div>

                    {/* Quick Filter Input */}
                    {profile.localities.length > 6 && (
                      <div className="relative w-full sm:w-56 shrink-0">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                        />
                        <input
                          type="text"
                          placeholder="Search neighborhood..."
                          value={localitySearch}
                          onChange={(e) => setLocalitySearch(e.target.value)}
                          className="w-full pl-8 pr-7 py-1.5 rounded-full bg-surface border border-border text-xs text-text placeholder:text-text-muted focus:outline-hidden focus:border-primary"
                        />
                        {localitySearch && (
                          <button
                            type="button"
                            onClick={() => setLocalitySearch("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Neighborhood Chips */}
                  <div className="flex flex-wrap gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
                    {filteredLocalities.length > 0 ? (
                      filteredLocalities.map((loc, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full bg-surface border border-border text-xs font-semibold text-text flex items-center gap-1.5 hover:border-primary/40 transition-colors"
                        >
                          <MapPin size={11} className="text-primary" />
                          <span>{loc}</span>
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-text-muted italic py-2">
                        No specific neighborhood matches &quot;{localitySearch}&quot;. We serve all residential and commercial addresses across {location.name}.
                      </p>
                    )}
                  </div>

                  <p className="text-[11px] text-text-muted pt-2 border-t border-border/60">
                    Comprehensive coverage for apartments, private colonies, commercial hubs, and suburban belts across {location.name}.
                  </p>
                </div>
              )}

              {/* Why Choose 1st Om in This Area */}
              <div>
                <h3 className="font-display font-bold text-text text-base mb-3">
                  Why Customers in {location.name} Choose 1st Om
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {competitiveAdvantages.map((adv, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-background border border-border flex items-start gap-3"
                    >
                      <CheckCircle2
                        size={16}
                        className="text-primary shrink-0 mt-0.5"
                      />
                      <div>
                        <span className="font-bold text-text text-xs sm:text-sm block">
                          {adv.title}
                        </span>
                        <span className="text-text-muted text-xs leading-relaxed mt-0.5 block">
                          {adv.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Outbound Interstate Routes & Fast Quote */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Outbound Routes Card */}
              <div className="p-6 rounded-2xl bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-display font-bold text-text text-base">
                    Frequent Routes from {location.name}
                  </h3>
                  <Truck size={16} className="text-primary" />
                </div>
                <p className="text-xs text-text-muted mb-4 leading-relaxed">
                  Scheduled dedicated container dispatches to major relocation destinations:
                </p>

                <div className="space-y-2">
                  {outboundRoutes.map((route) => (
                    <Link
                      key={route.slug}
                      to={`/route/${route.slug}`}
                      className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border hover:border-primary/40 hover:bg-surface/80 transition-all text-xs font-semibold text-text group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        <span>
                          {route.from} to {route.to}
                        </span>
                        {route.distanceKm && (
                          <span className="text-[10px] text-text-muted font-normal">
                            ({route.distanceKm} km)
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-primary text-[11px] font-bold">
                        <span>View Route</span>
                        <ArrowUpRight
                          size={13}
                          className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Fast Callback Card with Unified Pill Buttons */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-primary/25 space-y-4 shadow-xs">
                <div>
                  <h3 className="font-display font-bold text-text text-base mb-1">
                    Need Immediate Advice in {location.name}?
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Speak directly with our regional moving coordinator for slot availability, survey bookings, and vehicle allocation.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <Button
                    to={`/get-quote?from=${encodeURIComponent(location.name + ", " + location.state)}`}
                    size="md"
                    className="w-full text-center"
                  >
                    Request Free Move Survey
                  </Button>

                  {company.phone.primary && (
                    <a
                      href={`tel:${company.phone.primary}`}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-border bg-surface text-xs font-bold text-text hover:bg-surface/80 hover:border-primary/40 transition-all shadow-xs"
                    >
                      <PhoneCall size={14} className="text-primary" />
                      <span>Call {company.phone.primary}</span>
                    </a>
                  )}

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-emerald-500/30 bg-emerald-50 text-xs font-bold text-emerald-950 hover:bg-emerald-100 transition-all shadow-xs"
                  >
                    <MessageCircle size={14} className="text-emerald-700" />
                    <span>WhatsApp Regional Desk</span>
                  </a>
                </div>

                <div className="pt-3 border-t border-border/80 flex items-center gap-2 text-[11px] text-text-muted">
                  <FileCheck size={14} className="text-primary shrink-0" />
                  <span>GST-compliant invoices for corporate reimbursement.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. BOTTOM FULL QUOTE FORM (PLACED BEFORE FAQ) ────────── */}
      <QuoteForm
        key={`${location.slug}-${selectedMoveSize}-${priceScope}`}
        defaultFrom={`${location.name}, ${location.state}`}
        defaultMoveType={priceScope === "local" ? "Within the city" : "To another state"}
        defaultMoveSize={selectedMoveSize}
      />

      {/* ── 7. COMPREHENSIVE DEAL-CLOSING FAQS (AT THE VERY END) ───── */}
      <section className="bg-background py-12 sm:py-16 border-b border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle size={13} />
              <span>Everything You Need to Know</span>
            </div>
            <h2 className="font-display font-bold text-text text-xl sm:text-2xl mb-2">
              Frequently Asked Questions in {location.name}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Clear, honest answers to all pricing, safety, truck allocation, and damage protection questions.
            </p>
          </div>

          {/* FAQ Category Pills */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
            {[
              { id: "all", label: "All Questions" },
              { id: "pricing", label: "Pricing & Survey" },
              { id: "packing", label: "Packing & Safety" },
              { id: "logistics", label: "Trucks & Transit" },
              { id: "delivery", label: "Unpacking & Setup" },
              { id: "insurance", label: "Insurance & Booking" },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFaqCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  activeFaqCategory === cat.id
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "bg-surface text-text-muted border-border hover:text-text"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-surface overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="font-display font-semibold text-text text-sm sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-text-muted shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-border/60"
                      >
                        <div className="p-4 sm:p-5 text-text-muted text-xs sm:text-sm leading-relaxed">
                          <p>{faq.a}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Still Have Questions? Banner */}
          <div className="mt-8 p-5 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-text text-sm block">
                Have a specific question about your move in {location.name}?
              </span>
              <span className="text-xs text-text-muted block mt-0.5">
                Our local dispatch coordinator is available 8:00 AM to 9:00 PM.
              </span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="px-4 py-2 rounded-full border border-border bg-background text-xs font-bold text-text hover:bg-surface hover:border-primary/40 transition-all flex items-center gap-1.5"
                >
                  <PhoneCall size={13} className="text-primary" />
                  <span>Call Us</span>
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle size={13} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. MOBILE STICKY CALLOUT STRIP ─────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border p-3 flex items-center justify-between gap-3 shadow-lg">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-text truncate block">
            Moving in {location.name}?
          </span>
          <span className="text-[10px] text-text-muted truncate block">
            Zero hidden charges
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            to={`/get-quote?from=${encodeURIComponent(location.name + ", " + location.state)}`}
            size="sm"
          >
            Get Quote
          </Button>
          {company.phone.primary && (
            <a
              href={`tel:${company.phone.primary}`}
              className="p-2 rounded-full border border-border bg-background text-primary hover:bg-surface transition-colors"
              aria-label={`Call ${company.phone.primary}`}
            >
              <PhoneCall size={16} />
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default LocationPage;
