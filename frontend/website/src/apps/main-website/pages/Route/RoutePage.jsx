import { useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import {
  ChevronRight,
  Truck,
  PhoneCall,
  MessageCircle,
  CheckCircle2,
  Navigation,
  FileCheck,
  Boxes,
  Home,
  Bike,
  Car,
  ChevronDown,
  Zap,
  Building2,
  Warehouse,
  Package,
  ShieldCheck,
  Clock,
  ArrowRight,
  HelpCircle,
  MapPin,
} from "lucide-react";
import { allRoutes, placeImages } from "../../../../data/locations/index";
import {
  estimatorOptions,
  pricingDisclaimer,
  competitiveAdvantages,
} from "../../../../data/pricing";
import { company } from "../../../../data/company";
import QuoteForm from "../Home/components/QuoteForm";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";
import NotFound from "../../shared/components/NotFound";
import ParallaxUnfurlingGallery from "@/components/ui/3d-parallax-unfurling-gallery";

// Specialized interstate relocation services
const INTERSTATE_SERVICES = [
  {
    id: "household",
    title: "Dedicated Household Shifting",
    icon: Home,
    badge: "100% Dedicated Container",
    tagline: "Point-to-point interstate moving with 5-layer defensive packaging and an exclusive locked container vehicle.",
    image: "/images/services/HomeShiftingServices.webp",
    features: [
      "Exclusive locked container vehicle - never co-loaded or transshipped with strangers",
      "5-layer defensive packaging: virgin 5-ply cartons, bubble wrap, stretch film, and foam edge guards",
      "Complete furniture dismantling (beds, wardrobes, modular tables) and destination reassembly",
      "Live GPS highway tracking and regular milestone updates directly from your move coordinator",
    ],
  },
  {
    id: "car",
    title: "Enclosed Hydraulic Car Carrier",
    icon: Car,
    badge: "Zero Highway Wear",
    tagline: "Hydraulic multi-car carriers with wheel chocks and photographic condition inspection reports.",
    image: "/images/services/CarTransportationServices.webp",
    features: [
      "Door-to-door transit inside sealed enclosed hydraulic car carriers",
      "Zero open-highway driving - prevents odometer buildup and stone chip damage",
      "Pre-loading physical condition inspection report and photographic sign-off",
      "Comprehensive goods transit insurance coverage for complete peace of mind",
    ],
  },
  {
    id: "bike",
    title: "Two-Wheeler Timber Crating",
    icon: Bike,
    badge: "Custom Wooden Crate",
    tagline: "Custom-built wooden crate and shock-absorbing foam to guarantee scratch-free long-distance transit.",
    image: "/images/services/Bike&Two-WheelerTransportation.webp",
    features: [
      "Reinforced heavy-duty wooden box crating with internal multi-layer bubble cushioning",
      "Fuel drain and battery disconnection safety protocol prior to highway dispatch",
      "Can be clubbed inside your dedicated household container for combined freight savings",
      "Doorstep pickup and delivery with intact crate unboxing at destination",
    ],
  },
  {
    id: "commercial",
    title: "Corporate & Office Relocation",
    icon: Building2,
    badge: "Zero Downtime",
    tagline: "Scheduled weekend or overnight interstate relocation for workstations, servers, and office archives.",
    image: "/images/services/Office&CommercialShifting.webp",
    features: [
      "Anti-static foam packaging for servers, workstations, and sensitive network electronics",
      "Color-coded department indexing for seamless floor-plan setup at destination",
      "Weekend transit scheduling to prevent disruptions to your business workdays",
      "GST-compliant enterprise billing and corporate transit insurance coverage",
    ],
  },
  {
    id: "warehouse",
    title: "Secure Transit Warehousing",
    icon: Warehouse,
    badge: "24/7 Guarded Bays",
    tagline: "Flexible short-term holding bays between departure and possession dates at destination.",
    image: "/images/services/Warehousing&SecureStorage.webp",
    features: [
      "24/7 CCTV surveillance, fire-retardant bays, and pest-controlled storage chambers",
      "Barcode-tagged inventory tracking for partial or complete consignment dispatch",
      "Ideal for gap periods between lease expiration and new home possession",
      "Doorstep delivery and complete room placement once your new home is ready",
    ],
  },
];

const RoutePage = () => {
  const { slug: rawSlug } = useParams();
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [selectedMoveSize, setSelectedMoveSize] = useState("2bhk");
  const [activeServiceTab, setActiveServiceTab] = useState("household");
  const [activeFaqCategory, setActiveFaqCategory] = useState("all");

  // Normalize slug: handles "route-patna-to-delhi" and "patna-to-delhi"
  const cleanSlug = (rawSlug || "").replace(/^route-/, "");
  const route = allRoutes.find((r) => r.slug === cleanSlug);

  if (!route) {
    return <NotFound />;
  }

  const estimatedDays = route.distanceKm
    ? route.distanceKm > 1500
      ? "4 to 6 days"
      : route.distanceKm > 800
      ? "3 to 4 days"
      : route.distanceKm > 400
      ? "2 to 3 days"
      : "1 to 2 days"
    : "2 to 4 days";

  const highwayCorridor =
    route.slug.includes("delhi")
      ? "Agra to Lucknow Expressway and Purvanchal / NH 19 corridor"
      : route.slug.includes("kolkata")
      ? "NH 19 (Grand Trunk Road) and Durgapur Expressway"
      : route.slug.includes("ranchi")
      ? "NH 20 corridor through southern Bihar and central Jharkhand"
      : route.slug.includes("mumbai") || route.slug.includes("pune")
      ? "NH 19 connecting via central Indian national highways"
      : route.slug.includes("bengaluru") || route.slug.includes("hyderabad")
      ? "North to South national freight corridor connecting eastern India"
      : "National highway freight transit network";

  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20need%20a%20quote%20for%20moving%20from%20${encodeURIComponent(route.from)}%20to%20${encodeURIComponent(route.to)}.`
    : "#";

  // Other outbound corridors from this origin
  const relatedRoutes = allRoutes
    .filter((r) => r.fromSlug === route.fromSlug && r.slug !== route.slug)
    .slice(0, 6);

  // Curated images for this specific interstate route corridor
  const routeGalleryImages = useMemo(() => {
    const originPlace = placeImages[route.from] || "/images/places/bihar.webp";
    const destPlace = placeImages[route.to] || "/images/places/delhi-ncr.webp";

    return [
      originPlace,
      "/images/process-for-home-service/safe-transport.webp",
      destPlace,
      "/images/process-for-home-service/packing.webp",
      "/images/services/HomeShiftingServices.webp",
      "/images/process-for-home-service/loading.webp",
      "/images/services/CarTransportationServices.webp",
      "/images/process-for-home-service/setting-on-new-place.webp",
      "/images/services/Bike&Two-WheelerTransportation.webp",
      "/images/process-for-home-service/unloading.webp",
      "/images/services/Warehousing&SecureStorage.webp",
      "/images/process-for-home-service/packing1.webp",
      "/images/services/Office&CommercialShifting.webp",
      "/images/process-for-home-service/loading1.webp",
      "/images/services/GoodsTransitInsurance.webp",
      "/images/process-for-home-service/unpacking.webp",
      "/images/process-for-home-service/visti-and-survey.webp",
      "/images/services/Loading&UnloadingServices.webp",
      "/images/process-for-home-service/after-shifting.webp",
      "/images/process-for-home-service/loading2.webp",
      "/images/services/Packing&UnpackingServices.webp",
      "/images/process-for-home-service/unloading0.webp",
    ];
  }, [route]);

  // Visual 4-stage operational blueprint with authentic fleet photography
  const processSteps = [
    {
      step: "01",
      title: `Doorstep Survey & Packing in ${route.from}`,
      image: "/images/process-for-home-service/packing.webp",
      desc: `Volumetric inventory assessment followed by 5-layer defensive packing of furniture, electronics, and fragile items with virgin 5-ply cartons and bubble wrap.`,
      highlights: ["5-Layer Packing", "Furniture Care", "Room Indexing"],
    },
    {
      step: "02",
      title: "Exclusive Container Loading & Tamper-Seal",
      image: "/images/process-for-home-service/loading.webp",
      desc: `Consignment is loaded and anchored inside an exclusive weatherproof container. A numbered high-security tamper-evident seal is locked in your presence before dispatch.`,
      highlights: ["Dedicated Truck", "Numbered Seal", "Internal Straps"],
    },
    {
      step: "03",
      title: `Express Highway Transit (${highwayCorridor.split(" ")[0]})`,
      image: "/images/process-for-home-service/safe-transport.webp",
      desc: `Direct interstate transit via express corridor with pre-cleared toll and green cess permits. Active GPS tracking and scheduled daily milestone alerts.`,
      highlights: ["Pre-Cleared Tolls", "GPS Tracking", "Direct Transit"],
    },
    {
      step: "04",
      title: `Unloading & Room Setup in ${route.to}`,
      image: "/images/process-for-home-service/setting-on-new-place.webp",
      desc: `Doorstep seal verification on arrival. Complete furniture reassembly, room-by-room positioning, and total removal of all empty carton packing debris.`,
      highlights: ["Seal Verified", "Room Setup", "Debris Removal"],
    },
  ];

  // Active selected service
  const activeService =
    INTERSTATE_SERVICES.find((s) => s.id === activeServiceTab) ||
    INTERSTATE_SERVICES[0];

  // Institutional Route Standards (Open Table, Zero Box Loop, Zero AI Red/Green Tricks)
  const routeStandards = [
    {
      aspect: "Consignment Containment",
      market: "Co-loaded with unknown commercial cargo in open-tarp trucks, causing transit moisture and loss risks.",
      firstOm: "100% exclusive closed-body container with a single tamper-evident security seal locked in your presence.",
    },
    {
      aspect: "Highway Tolls & Permits",
      market: "Unquoted road taxes, border entry bribes, and green cess demanded unexpectedly mid-highway.",
      firstOm: "100% all-inclusive binding quotation covering all state transit permits, highway toll plazas, and driver allowances.",
    },
    {
      aspect: "Intermediate Transshipment",
      market: "Unloaded, sorted, and re-loaded across 2 to 3 transit hubs, causing frequent surface scratches.",
      firstOm: "Zero transshipment. Your goods stay untouched inside the same locked container from pickup to destination.",
    },
    {
      aspect: "Inventory Accountability",
      market: "Loose unnumbered items without an itemized checklist, making missing pieces impossible to claim.",
      firstOm: "Color-coded itemized inventory manifest with individual box barcodes and signed pre/post transit sign-offs.",
    },
  ];

  // Comprehensive interstate route FAQs (covering every question a user might have)
  const allRouteFaqs = [
    {
      category: "pricing",
      categoryLabel: "Pricing & Tolls",
      q: `How are interstate moving charges calculated from ${route.from} to ${route.to}?`,
      a: `Charges are determined by total inventory volume (in cubic feet), truck size requirement (14ft, 17ft, 19ft, or 24ft closed container), distance (~${route.distanceKm || 1000} km), and packing tier. Local shifting starts from Rs 3,500, while dedicated interstate transit typically ranges from Rs 8,500 for 1 BHK to Rs 42,000 for large 3-4 BHK homes. Every written quote is 100% binding with zero moving-day surprise fees.`,
    },
    {
      category: "pricing",
      categoryLabel: "Pricing & Tolls",
      q: `Are highway toll plaza fees, green cess, and state entry taxes included?`,
      a: `Yes, completely. Every quotation from 1st Om includes all highway toll plaza charges along ${highwayCorridor}, state entry permits, green cess, and driver fuel allowances. You will never be asked for cash or roadside contributions during transit.`,
    },
    {
      category: "pricing",
      categoryLabel: "Pricing & Tolls",
      q: `What are your payment terms, advance booking deposit, and GST invoice options?`,
      a: `We require a nominal token advance (10-15%) to lock your dedicated truck and crew slot. The operational balance is split between loading day and final delivery verification. We provide official 18% or 5% GST tax invoices for corporate moving allowances and employee relocations.`,
    },
    {
      category: "pricing",
      categoryLabel: "Pricing & Tolls",
      q: `What is your rescheduling, cancellation, and refund policy?`,
      a: `We understand that moving dates can shift due to lease or employment changes. You can reschedule your move date at zero penalty up to 24 hours before the scheduled survey/loading slot. If cancelled, token deposits are refunded within 2 business days.`,
    },
    {
      category: "transit",
      categoryLabel: "Transit & Tracking",
      q: `How many days will household goods take from ${route.from} to ${route.to}?`,
      a: `Dedicated closed container transit between ${route.from} and ${route.to} (${route.distanceKm ? `approx ${route.distanceKm} km` : "interstate corridor"}) typically requires ${estimatedDays}. Your move coordinator shares scheduled daily milestone updates from departure to arrival.`,
    },
    {
      category: "transit",
      categoryLabel: "Transit & Tracking",
      q: `Will my goods be transported in an exclusive container or co-loaded with strangers?`,
      a: `100% exclusive container. We allocate a dedicated closed-body container vehicle reserved solely for your household. A numbered tamper-evident security seal is locked at your doorstep in ${route.from} and unlocked only in your presence at ${route.to}. Your items are never mixed with other cargo or offloaded at intermediate warehouses.`,
    },
    {
      category: "transit",
      categoryLabel: "Transit & Tracking",
      q: `How do I track my truck during the highway journey?`,
      a: `Your container vehicle is equipped with active GPS tracking. In addition, your assigned personal move manager provides proactive checkpoint updates (e.g. state border crossings, major toll plazas, and estimated arrival windows) twice daily via WhatsApp and phone.`,
    },
    {
      category: "transit",
      categoryLabel: "Transit & Tracking",
      q: `What safety protocols are followed for long highway corridors?`,
      a: `Long-distance routes are operated by experienced highway drivers with mandatory rest protocols at secure partner parking plazas. Vehicles undergo comprehensive pre-trip mechanical inspections covering tire pressure, brake systems, and weather-proof container seals.`,
    },
    {
      category: "packing",
      categoryLabel: "Packing & Safety",
      q: `What packing materials are included in the quote? Do I need to buy cartons?`,
      a: `You do not need to arrange any packing materials. Our crew arrives with virgin 5-ply heavy-duty corrugated cartons, multi-layer air bubble wrap, high-density edge foam guards, heavy stretch wrap, and waterproof adhesive tapes. All materials and labor are fully covered.`,
    },
    {
      category: "packing",
      categoryLabel: "Packing & Safety",
      q: `How do you protect large smart TVs (55"+), mirrors, and fragile glassware?`,
      a: `Smart TVs and large mirrors receive custom wooden carpentry crating or reinforced double-walled corrugated TV protectors with thick shock-absorbing foam. Kitchen crockery, chinaware, and crystal glassware are individually bubble-wrapped and packed in partitioned dish-pack cartons.`,
    },
    {
      category: "packing",
      categoryLabel: "Packing & Safety",
      q: `How are sacred mandir items and puja idols handled?`,
      a: `Puja idols, mandir structures, and religious artifacts are handled with utmost reverence. They are wrapped in fresh, untouched packing supplies, sealed separately, and placed in the truck cab or uppermost container section according to your family's preferences.`,
    },
    {
      category: "packing",
      categoryLabel: "Packing & Safety",
      q: `What should I pack myself versus what your crew packs?`,
      a: `We recommend personally carrying cash, gold, high-value jewelry, essential identity documents (passports, property deeds), daily medications, laptops, and a 2-day clothing overnight bag. Our professional crew packs everything else, from wardrobes and appliances to kitchen utensils and beds.`,
    },
    {
      category: "vehicle",
      categoryLabel: "Vehicle Transport",
      q: `Can I ship my car or two-wheeler alongside my household furniture?`,
      a: `Yes. Two-wheelers can be crated in timber boxes and loaded securely into your dedicated container truck. For cars, we provide door-to-door transit inside enclosed hydraulic car carriers with wheel chocks and a comprehensive pre-dispatch photographic inspection sign-off.`,
    },
    {
      category: "vehicle",
      categoryLabel: "Vehicle Transport",
      q: `What documents and preparations are needed for vehicle transport?`,
      a: `Please provide clear copies of your Vehicle Registration Certificate (RC), valid insurance certificate, and Pollution Under Control (PUC) certificate. The fuel tank should have roughly 5 to 10 liters (about 1/4th tank) for loading and unloading logistics.`,
    },
    {
      category: "support",
      categoryLabel: "Delivery & Setup",
      q: `Do you reassemble furniture and unpack cartons at the destination?`,
      a: `Yes. Our destination delivery crew reassembles all dismantled beds, wardrobes, dining tables, and workstations. Major appliances are placed in their designated positions, and our crew removes empty cartons and packing waste so your new home is clean and livable.`,
    },
    {
      category: "support",
      categoryLabel: "Delivery & Setup",
      q: `What happens if my destination flat is not ready or keys are delayed?`,
      a: `We provide secure transit warehousing at both our origin and destination fleet hubs. If your possession date is postponed by a few days or weeks, we can store your sealed consignment in our moisture-proof, 24/7 guarded warehouse until you are ready for delivery.`,
    },
    {
      category: "support",
      categoryLabel: "Delivery & Setup",
      q: `How does goods transit insurance work and how are claims settled?`,
      a: `We facilitate comprehensive All-Risk Goods Transit Insurance through leading national insurance underwriters. In the rare event of road contingency or transit damage, our coordinator initiates an immediate inspection and claims filing with fast-track reimbursement.`,
    },
  ];

  const filteredFaqs = useMemo(() => {
    if (activeFaqCategory === "all") return allRouteFaqs;
    return allRouteFaqs.filter((f) => f.category === activeFaqCategory);
  }, [activeFaqCategory]);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MovingCompany",
        name: `${company.brandName} - ${route.from} to ${route.to}`,
        url: `https://1stompackersandmovers.com/route/${route.slug}`,
        telephone: company.phone.primary || undefined,
        description: `Dedicated interstate relocation from ${route.from} to ${route.to}. Sealed closed containers, direct transit, fixed pricing, and transit insurance.`,
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
            name: `${route.from} to ${route.to}`,
            item: `https://1stompackersandmovers.com/route/${route.slug}`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: allRouteFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <SEO
        title={`Packers and Movers from ${route.from} to ${route.to} | 1st Om Movers`}
        description={`Dedicated interstate relocation services between ${route.from} and ${route.to}. Sealed closed containers, ${estimatedDays} transit, 5-layer packing, and upfront fixed pricing.`}
        schemaJson={structuredData}
      />

      {/* ── 1. HERO SECTION WITH 3D PARALLAX UNFURLING GALLERY ──────── */}
      <ParallaxUnfurlingGallery images={routeGalleryImages}>
        <div className="py-8 sm:py-12 max-w-4xl">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-white/70 flex-wrap drop-shadow-sm" role="list">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={13} className="text-white/40" />
              </li>
              <li>
                <Link to="/where-we-serve" className="hover:text-white transition-colors">
                  Routes
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={13} className="text-white/40" />
              </li>
              <li>
                <span className="text-white font-semibold">
                  {route.from} to {route.to}
                </span>
              </li>
            </ol>
          </nav>

          {/* Interstate Corridor Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-5 drop-shadow-sm">
            <Truck size={14} className="text-accent" />
            <span>Interstate Relocation Corridor</span>
          </div>

          {/* Heading */}
          <h1
            className="font-display font-extrabold text-white tracking-tight mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
            style={{ fontSize: "clamp(2rem, 4.2vw, 3.4rem)", lineHeight: "1.12" }}
          >
            Packers and Movers {route.from} to {route.to}
          </h1>

          {/* Description */}
          <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-7 max-w-2xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Dedicated interstate relocation between {route.from} and {route.to}. Packed with multi-layer protective materials, transported in sealed closed containers via {highwayCorridor}, and delivered directly to your new doorstep.
          </p>

          {/* Action CTAs */}
          <div className="flex items-center gap-3.5 flex-wrap mb-8">
            <Button
              to={`/get-quote?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&scope=interstate`}
              size="md"
              className="shadow-lg hover:shadow-xl"
            >
              Request Route Quote
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
              <span>WhatsApp Quote</span>
            </a>
          </div>

          {/* Route Specs (Direct on Parallax Canvas, Zero Boxes) */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 pt-6 border-t border-white/20 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            <div>
              <span className="text-[11px] font-medium text-white/60 block uppercase tracking-wider">Origin</span>
              <span className="font-display font-bold text-white text-sm sm:text-base">{route.from}</span>
            </div>
            <div className="hidden sm:block w-px h-7 bg-white/20" />
            <div>
              <span className="text-[11px] font-medium text-white/60 block uppercase tracking-wider">Destination</span>
              <span className="font-display font-bold text-white text-sm sm:text-base">{route.to}</span>
            </div>
            <div className="hidden sm:block w-px h-7 bg-white/20" />
            <div>
              <span className="text-[11px] font-medium text-white/60 block uppercase tracking-wider">Highway Distance</span>
              <span className="font-display font-bold text-white text-sm sm:text-base">
                {route.distanceKm ? `~${route.distanceKm} km` : "National Corridor"}
              </span>
            </div>
            <div className="hidden sm:block w-px h-7 bg-white/20" />
            <div>
              <span className="text-[11px] font-medium text-white/60 block uppercase tracking-wider">Transit Timeline</span>
              <span className="font-display font-bold text-accent text-sm sm:text-base">{estimatedDays}</span>
            </div>
          </div>
        </div>
      </ParallaxUnfurlingGallery>

      {/* ── 2. TRANSPARENT ROUTE PRICING & MOVE SIZE SELECTOR ──────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Zap size={13} />
                <span>Transparent Route Rates</span>
              </div>
              <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight">
                Interstate Moving Charges: {route.from} to {route.to}
              </h2>
              <p className="text-text-muted text-sm sm:text-base mt-1.5 max-w-2xl">
                Fixed binding estimates with zero moving-day surprise fees. Fully includes highway toll plazas, state transit permits, loading, and 5-layer packing supplies.
              </p>
            </div>

            {/* Move Size Selector Pills */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-surface border border-border overflow-x-auto no-scrollbar shrink-0">
              {estimatorOptions.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMoveSize(item.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedMoveSize === item.id
                      ? "bg-primary text-white shadow-xs"
                      : "text-text-muted hover:text-text"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {estimatorOptions.slice(0, 4).map((item) => {
              const isSelected = selectedMoveSize === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedMoveSize(item.id)}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? "bg-surface border-primary shadow-md ring-1 ring-primary/30"
                      : "bg-surface/60 border-border hover:border-primary/40 hover:bg-surface shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-display font-bold text-text text-base">
                        {item.label}
                      </span>
                      <span
                        className={`p-2 rounded-xl transition-colors ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        <Home size={16} />
                      </span>
                    </div>

                    <div className="mb-5">
                      <span className="text-xs text-text-muted block mb-0.5">Estimated corridor rate</span>
                      <span className="font-display font-extrabold text-primary text-2xl">
                        {item.interstatePrice}
                      </span>
                    </div>

                    <ul className="space-y-2.5 text-xs text-text-muted mb-6" role="list">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                        <span className="font-medium text-text">{item.truck}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                        <span>{item.crew}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                        <span>{estimatedDays} transit via {highwayCorridor.split(" ")[0]}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-primary shrink-0" />
                        <span>Highway tolls & state taxes included</span>
                      </li>
                    </ul>
                  </div>

                  <Button
                    to={`/get-quote?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&type=${item.id}&scope=interstate`}
                    size="sm"
                    variant={isSelected ? "primary" : "outline"}
                    className="w-full text-center"
                  >
                    Reserve {item.id.toUpperCase()} Slot
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Vehicle Transit Options (Car & Bike Carriers) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 rounded-2xl bg-surface border border-border mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bike size={22} />
              </div>
              <div>
                <h3 className="font-display font-bold text-text text-base">
                  Motorcycle & Bike Transport: {route.from} to {route.to}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Timber crate crating, fuel tank drain protocol, and wheel-anchoring in enclosed vehicle carrier compartments.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-block font-bold text-primary text-xs bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    Interstate Rate: Rs 3,500 - Rs 6,800
                  </span>
                  <span className="text-[11px] text-text-muted">Doorstep pickup & drop</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Car size={22} />
              </div>
              <div>
                <h3 className="font-display font-bold text-text text-base">
                  Hydraulic Enclosed Car Carrier: {route.from} to {route.to}
                </h3>
                <p className="text-xs text-text-muted mt-1 leading-relaxed">
                  Dedicated enclosed hydraulic car carrier with photographic pre-dispatch condition inspection and zero highway driving.
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="inline-block font-bold text-primary text-xs bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    Interstate Rate: Rs 9,500 - Rs 22,000
                  </span>
                  <span className="text-[11px] text-text-muted">Pre-inspected & insured</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-text-muted/80 leading-relaxed">
            * {pricingDisclaimer}
          </p>
        </div>
      </section>

      {/* ── 3. VISUAL 4-STAGE OPERATIONAL BLUEPRINT ─────────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Navigation size={13} />
              <span>Corridor Transit Protocol</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-2 text-balance">
              The Dedicated Container Journey: {route.from} to {route.to}
            </h2>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-balance">
              Zero transshipment. Your goods remain untouched inside the exact same locked container from departure until arrival.
            </p>
          </div>

          {/* 4 Process Cards with Authentic Operational Imagery */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-border bg-background overflow-hidden flex flex-col h-full hover:border-primary/40 transition-all shadow-xs group"
              >
                {/* Photo container */}
                <div className="aspect-[16/10] relative overflow-hidden bg-[#0a101d] shrink-0">
                  <img
                    src={step.image}
                    alt={step.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-xs font-bold border border-white/20">
                    STEP {step.step}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-display font-bold text-text text-base mb-2 min-h-[2.75rem] flex items-center leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-text-muted text-xs leading-relaxed mb-4 flex-1 min-h-[4.5rem]">
                    {step.desc}
                  </p>

                  <div className="mt-auto pt-3 border-t border-border/70 flex flex-wrap gap-1.5 min-h-[3.25rem] items-center">
                    {step.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="inline-block px-2.5 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-semibold border border-primary/15 whitespace-nowrap"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. SPECIALIZED INTERSTATE RELOCATION SERVICES ───────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Boxes size={13} />
              <span>Specialized Corridor Fleet</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-2 text-balance">
              Relocation Services on {route.from} to {route.to}
            </h2>
            <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-2xl mx-auto text-balance">
              Tailored long-distance solutions engineered for household consignments, corporate assets, and personal vehicles.
            </p>
          </div>

          {/* Service Selection Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {INTERSTATE_SERVICES.map((s) => {
              const TabIcon = s.icon;
              const isActive = activeServiceTab === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveServiceTab(s.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface border border-border text-text-muted hover:text-text hover:border-primary/40"
                  }`}
                >
                  <TabIcon size={15} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Service Showcase Card */}
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-3">
                  <ShieldCheck size={14} />
                  <span>{activeService.badge}</span>
                </div>

                <h3 className="font-display font-extrabold text-text text-xl sm:text-2xl mb-3">
                  {activeService.title}: {route.from} to {route.to}
                </h3>

                <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6">
                  {activeService.tagline}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
                  {activeService.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-background border border-border/80 flex items-start gap-2.5"
                    >
                      <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                      <span className="text-xs text-text leading-relaxed font-medium">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3.5 flex-wrap">
                  <Button
                    to={`/get-quote?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}&service=${activeService.id}&scope=interstate`}
                    size="md"
                  >
                    Book {activeService.title}
                  </Button>

                  {company.phone.primary && (
                    <a
                      href={`tel:${company.phone.primary}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-background text-sm font-semibold text-text hover:bg-surface transition-all"
                    >
                      <PhoneCall size={15} className="text-primary" />
                      <span>Speak with Move Specialist</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Service authentic photo preview */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-border aspect-[16/11] bg-[#0a101d] relative shadow-md">
                  <img
                    src={activeService.image}
                    alt={`${activeService.title} on ${route.from} to ${route.to}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-semibold">
                    <span>Direct highway corridor: {route.from} ⇄ {route.to}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. OPERATIONAL GOVERNANCE & HIGHWAY STANDARDS (OPEN TABLE, ZERO BOX LOOP) ── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Subtext on separate rows with full available width */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider mb-2.5">
              <ShieldCheck size={14} />
              <span>Highway Governance</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl mb-2">
              Interstate Protection Standards: {route.from} to {route.to}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted max-w-3xl leading-relaxed">
              How our direct fleet model safeguards your move against informal long-distance freight practices.
            </p>
          </div>

          {/* Clean Open Comparison Table (Zero Box-in-Box Loop, Pure Editorial Alignment) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-text font-display font-bold">
                  <th className="py-3.5 pr-4 w-1/4">Transit Parameter</th>
                  <th className="py-3.5 px-4 w-3/8 text-text-muted">Informal Market Practice</th>
                  <th className="py-3.5 pl-4 w-3/8 text-primary font-bold">1st Om Binding Standards</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {routeStandards.map((std, idx) => (
                  <tr key={idx} className="hover:bg-background/40 transition-colors">
                    <td className="py-4 pr-4 font-bold text-text align-top">
                      {std.aspect}
                    </td>
                    <td className="py-4 px-4 text-text-muted align-top leading-relaxed">
                      {std.market}
                    </td>
                    <td className="py-4 pl-4 text-text font-medium align-top leading-relaxed">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{std.firstOm}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 6. RELATED HIGH-VOLUME INTERSTATE CORRIDORS ─────────────── */}
      {relatedRoutes.length > 0 && (
        <section className="bg-background py-14 sm:py-20 border-b border-border/70">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2.5">
                <MapPin size={13} />
                <span>Regional Freight Hub</span>
              </div>
              <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl mb-1.5">
                Other Scheduled Corridors from {route.from}
              </h2>
              <p className="text-xs sm:text-sm text-text-muted max-w-2xl">
                Regular daily fleet dispatches connecting {route.from} across India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedRoutes.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/route/${rel.slug}`}
                  className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-display font-bold text-text text-base group-hover:text-primary transition-colors">
                      {rel.from} to {rel.to}
                    </span>
                    <ArrowRight size={16} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-muted pt-3 border-t border-border/70">
                    <span>{rel.distanceKm ? `~${rel.distanceKm} km highway` : "National Corridor"}</span>
                    <span className="font-semibold text-primary">View Corridor</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 7. INTERACTIVE QUOTE FORM (MOVED ABOVE FAQ) ─────────────── */}
      <QuoteForm
        defaultFrom={route.from}
        defaultTo={route.to}
        defaultMoveType="To another state"
        defaultMoveSize={selectedMoveSize}
      />

      {/* ── 8. COMPREHENSIVE ROUTE FAQS (AT THE VERY END) ───────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={13} />
              <span>Everything You Need to Know</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-2">
              Frequently Asked Questions: {route.from} to {route.to}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Comprehensive guidance covering pricing, highway permits, transit duration, insurance, and vehicle shifting.
            </p>
          </div>

          {/* FAQ Category Filter Pills */}
          <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-full bg-background border border-border mb-8 overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: "All Questions" },
              { id: "pricing", label: "Pricing & Tolls" },
              { id: "transit", label: "Transit & Tracking" },
              { id: "packing", label: "Packing & Safety" },
              { id: "vehicle", label: "Vehicle Transport" },
              { id: "support", label: "Delivery & Setup" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFaqCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFaqCategory === cat.id
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion list */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-background overflow-hidden transition-all shadow-2xs"
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
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-text-muted text-xs sm:text-sm leading-relaxed border-t border-border/60">
                      <p className="mt-3">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default RoutePage;
