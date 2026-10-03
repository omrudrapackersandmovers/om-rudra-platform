import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Building2,
  Car,
  Bike,
  Package,
  Boxes,
  Warehouse,
  ShieldCheck,
  ChevronRight,
  Search,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Truck,
  Clock,
  Award,
  Users,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
  X,
  FileCheck,
  BadgePercent,
  Check,
  Zap,
} from "lucide-react";
import SEO from "../../../../configs/seo";
import { company } from "../../../../data/company";
import Button from "../../shared/components/Button";

const serviceList = [
  {
    icon: Home,
    title: "Home Shifting",
    category: "household",
    categoryLabel: "Residential",
    badge: "Zero Co-Loading",
    startingPrice: "₹3,500*",
    slug: "home-shifting",
    image: "/images/services/HomeShiftingServices.webp",
    tagline:
      "Dedicated closed trucks, 5-layer packing, and complete room-by-room setup for a zero-damage move.",
    description:
      "Moving your household means moving the rhythm of daily life. We provide dedicated closed-body containers, high-grade multi-layer packaging, and room-by-room furniture placement so your family settles in immediately.",
    points: [
      "Detailed pre-move survey and itemised fixed quote",
      "High-grade packing materials matched to each item type",
      "Dedicated vehicle (never co-loaded with other goods)",
      "Room-by-room unloading, placement & reassembly",
      "Optional complete unpacking and packaging debris removal",
    ],
  },
  {
    icon: Building2,
    title: "Office & Commercial Shifting",
    category: "commercial",
    categoryLabel: "Corporate",
    badge: "Zero Downtime",
    startingPrice: "₹8,000*",
    slug: "office-commercial-shifting",
    image: "/images/services/Office&CommercialShifting.webp",
    tagline:
      "Zero-downtime workplace relocations scheduled around your business hours with specialized IT handling.",
    description:
      "Business moves have a hard deadline. We execute corporate shifts during weekends and after-hours, with anti-static server handling, workstation tagging, and seamless department-wise setup so work resumes Monday morning.",
    points: [
      "After-hours and weekend moves to eliminate downtime",
      "Anti-static packaging for servers, IT rigs, and peripherals",
      "Modular workstation dismantling and architectural reassembly",
      "Color-coded department carton labelling and mapped placement",
      "Factory, corporate HQ, and retail shifting expertise",
    ],
  },
  {
    icon: Car,
    title: "Car Transportation",
    category: "vehicles",
    categoryLabel: "Automotive",
    badge: "Enclosed Carrier",
    startingPrice: "₹7,500*",
    slug: "car-transportation",
    image: "/images/services/CarTransportationServices.webp",
    tagline:
      "Enclosed hydraulic carrier with live GPS tracking, zero road wear, and full transit insurance.",
    description:
      "Your car is one of your most valuable assets. It travels securely fastened inside an enclosed multi-car hydraulic carrier - never driven on public highways - and arrives completely pristine and dust-free.",
    points: [
      "Enclosed hydraulic carrier transport with zero open-road driving",
      "Pre-loading physical condition inspection report with photos",
      "Transit insurance coverage against unforeseen road contingencies",
      "Doorstep pickup and doorstep handover at destination city",
      "Hatchback, sedan, luxury SUV, and EV handling expertise",
    ],
  },
  {
    icon: Bike,
    title: "Bike Transportation",
    category: "vehicles",
    categoryLabel: "Two-Wheeler",
    badge: "Custom Crating",
    startingPrice: "₹2,200*",
    slug: "bike-transportation",
    image: "/images/services/Bike&Two-WheelerTransportation.webp",
    tagline:
      "Reinforced wooden crate packaging and doorstep transit to ensure zero scratch or paint damage.",
    description:
      "Two-wheelers packed inside protective timber crates and heavy bubble foam wrap. Transported with the same precision and safety standards as premium household goods.",
    points: [
      "Heavy wooden crate packing for all-round frame defense",
      "Fuel drain & battery disconnection protocol for safety",
      "Transit insurance included for maximum peace of mind",
      "Clubbable with household shifting for package discounts",
      "Scooters, street bikes, and heavy cruisers handled",
    ],
  },
  {
    icon: Package,
    title: "Packing & Unpacking",
    category: "handling",
    categoryLabel: "Packaging",
    badge: "5-Ply Cartons",
    startingPrice: "₹1,800*",
    slug: "packing-unpacking",
    image: "/images/services/Packing&UnpackingServices.webp",
    tagline:
      "Export-grade 5-ply cartons, bubble wrap cushioning, and systematic room-by-room indexing.",
    description:
      "Good packing is what separates a flawless delivery from heartbreak. Our packaging specialists bring 5-ply cartons, bubble cushioning, foam edge guards, and custom crating tailored to each item's fragility.",
    points: [
      "Virgin 5-ply corrugated cartons and heavy shock-absorbent wrap",
      "Custom timber crating for mirrors, LEDs, and crystal chandeliers",
      "Systematic color-coded indexing by room and contents",
      "Destination unpacking and placement service available",
      "Packing-only service available for self-arranged logistics",
    ],
  },
  {
    icon: Boxes,
    title: "Loading & Unloading",
    category: "handling",
    categoryLabel: "Ground Crew",
    badge: "Trained Handlers",
    startingPrice: "₹1,500*",
    slug: "loading-unloading",
    image: "/images/services/Loading&UnloadingServices.webp",
    tagline:
      "Trained full-time crew using heavy appliance dollies and doorway protectors for safe transit.",
    description:
      "Trained full-time crew who know how to navigate steep stairwells, tight corridors, and elevators without scratching floors, scuffing doorframes, or causing structural shock to heavy appliances.",
    points: [
      "Professional crew equipped with hydraulic dollies and lifting straps",
      "Protective floor runners and doorway corner guards",
      "Appliance handling for refrigerators, washing machines, and HVACs",
      "Furniture dismantling & assembly using power tools",
      "Labour-only support available for client-arranged trucks",
    ],
  },
  {
    icon: Warehouse,
    title: "Warehousing & Storage",
    category: "handling",
    categoryLabel: "Secure Storage",
    badge: "24/7 CCTV Safe",
    startingPrice: "₹1,200/mo*",
    slug: "warehousing-storage",
    image: "/images/services/Warehousing&SecureStorage.webp",
    tagline:
      "Moisture-free, 24/7 CCTV-monitored secure storage with flexible weekly or monthly terms.",
    description:
      "When your new property isn't ready or you need temporary space during transitions, our climate-monitored, pest-controlled facilities keep your possessions dry, protected, and fully accounted for.",
    points: [
      "Weatherproof, clean, and 24/7 CCTV-monitored facility",
      "Flexible short-term and long-term storage rental agreements",
      "Digital barcode inventory so every carton is accounted for",
      "Doorstep retrieval and scheduled redelivery whenever you're ready",
      "Seamless add-on to any residential or commercial move",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Goods Transit Insurance",
    category: "handling",
    categoryLabel: "Protection",
    badge: "100% Value Cover",
    startingPrice: "From 1.5%*",
    slug: "goods-insurance",
    image: "/images/services/GoodsTransitInsurance.webp",
    tagline:
      "Comprehensive all-risk transit policy with prompt paperless claims and zero hidden deductions.",
    description:
      "Protect your goods against unseen road accidents, fire, weather anomalies, or theft. Our comprehensive transit policy covers declared values with full claim guidance from our dedicated insurance team.",
    points: [
      "All-risk transit coverage for household goods, vehicles, and assets",
      "Coverage based on 100% declared valuation, not depreciated rates",
      "Fast, paperless claim assistance managed end-to-end by our team",
      "Compliant documentation issued prior to vehicle dispatch",
      "Available across all relocation categories: local, state, and interstate",
    ],
  },
];

const categoryTabs = [
  { id: "all", label: "All Services" },
  { id: "household", label: "Household & Office" },
  { id: "vehicles", label: "Vehicle Transport" },
  { id: "handling", label: "Packing & Storage" },
];

const moveCalculatorOptions = [
  {
    id: "1bhk",
    label: "1 BHK Home",
    localPrice: "₹3,500 - ₹6,500",
    interstatePrice: "₹8,500 - ₹17,000",
    truck: "10ft - 14ft Closed Container",
    crew: "2-3 Men Crew",
    duration: "Same Day (Local) / 2-4 Days (Interstate)",
  },
  {
    id: "2bhk",
    label: "2 BHK Home",
    localPrice: "₹5,500 - ₹9,500",
    interstatePrice: "₹14,000 - ₹27,000",
    truck: "14ft - 17ft Closed Container",
    crew: "3-4 Men Crew",
    duration: "Same Day (Local) / 3-5 Days (Interstate)",
  },
  {
    id: "3bhk",
    label: "3 BHK / Villa",
    localPrice: "₹8,500 - ₹16,000",
    interstatePrice: "₹22,000 - ₹42,000",
    truck: "19ft - 22ft Dedicated Truck",
    crew: "4-6 Men Crew",
    duration: "Same Day (Local) / 3-6 Days (Interstate)",
  },
  {
    id: "bike",
    label: "Two-Wheeler / Bike",
    localPrice: "₹1,500 - ₹2,800",
    interstatePrice: "₹3,500 - ₹6,800",
    truck: "Specialized Crated Carrier",
    crew: "Trained Handlers",
    duration: "Same Day (Local) / 3-5 Days (Interstate)",
  },
  {
    id: "car",
    label: "Car / SUV",
    localPrice: "₹2,500 - ₹4,500",
    interstatePrice: "₹9,500 - ₹22,000",
    truck: "Hydraulic Enclosed Car Carrier",
    crew: "Specialized Driver & Crew",
    duration: "Same Day (Local) / 4-7 Days (Interstate)",
  },
  {
    id: "office",
    label: "Office / Commercial",
    localPrice: "₹9,000 - ₹25,000+",
    interstatePrice: "₹28,000 - ₹75,000+",
    truck: "Dedicated Multi-Fleet Convoy",
    crew: "Dedicated IT & Furniture Team",
    duration: "Overnight/Weekend / 3-7 Days",
  },
];

const processSteps = [
  {
    step: "01",
    title: "Survey & Transparent Quote",
    description:
      "We conduct a virtual or in-person inventory check and provide a binding quote with zero hidden charges.",
    icon: FileCheck,
    image: "/images/process-for-home-service/visti-and-survey.webp",
    highlight: "100% Price Lock Guarantee",
  },
  {
    step: "02",
    title: "5-Layer Precision Packing",
    description:
      "Our team packs your items using 5-ply cartons, bubble wrap, corner guards, and labeled tagging.",
    icon: Package,
    image: "/images/process-for-home-service/packing.webp",
    highlight: "Export-Grade Materials",
  },
  {
    step: "03",
    title: "Dedicated Sealed Transit",
    description:
      "Goods travel in dedicated closed-body containers with GPS tracking and zero co-loading with strangers.",
    icon: Truck,
    image: "/images/process-for-home-service/safe-transport.webp",
    highlight: "No Co-Loading or Mix-ups",
  },
  {
    step: "04",
    title: "Unloading & Room Setup",
    description:
      "We unload carefully, reassemble large furniture, position items in your designated rooms, and clear debris.",
    icon: Home,
    image: "/images/process-for-home-service/setting-on-new-place.webp",
    highlight: "Ready to Live In",
  },
];

const comparisonPoints = [
  {
    feature: "Pricing Transparency",
    us: "Fixed, written, binding quotation. Zero surprise surcharges on moving day.",
    others: "Low initial quote; demands steep extra charges midway through the move.",
  },
  {
    feature: "Vehicle Allocation",
    us: "100% dedicated closed container sealed for your family alone. Zero co-loading.",
    others: "Open-deck trucks co-loaded with random commercial cargo, risking loss.",
  },
  {
    feature: "Packing Materials",
    us: "Export-grade 5-ply cartons, virgin bubble wrap, foam corner guards & stretch wrap.",
    others: "Used cartons, newspaper stuffing, and minimal scratch protection.",
  },
  {
    feature: "Manpower & Crew",
    us: "Verified, trained full-time staff equipped with power tools and appliance dollies.",
    others: "Unvetted daily-wage casual laborers with zero technical handling training.",
  },
  {
    feature: "Insurance & Claims",
    us: "100% declared value transit policy with dedicated claim assistance officer.",
    others: "No written insurance policy; zero legal liability if goods are broken.",
  },
  {
    feature: "Tracking & Support",
    us: "Dedicated Move Coordinator assigned with live WhatsApp and GPS updates.",
    others: "Switched-off driver phones and zero delivery status visibility.",
  },
];

const faqs = [
  {
    question: "How is the relocation cost calculated for moving services?",
    answer:
      "Relocation costs depend primarily on consignment volume (1BHK, 2BHK, 3BHK, etc.), total transit distance (local within city vs interstate), packaging grade required, floor levels, elevator access, and specialized add-ons like TV wooden crating or complete unpacking. We provide a transparent, upfront itemized estimate with zero surprise charges.",
  },
  {
    question: "Do you provide dedicated vehicles or will our goods be co-loaded?",
    answer:
      "For all full household and commercial moves, we provide a 100% dedicated closed-container truck. Your goods are locked and sealed at your doorstep and delivered directly to your new address without ever mixing with other clients' items or transferring vehicles midway.",
  },
  {
    question: "How are delicate items like TVs, glassware, and crockery protected?",
    answer:
      "We apply a meticulous 5-layer protective system: first an inner scratch-resistant foam sheet, then multi-layer bubble wrap, heavy corrugated edge protectors, reinforced 5-ply cartons, and specialized wooden crating for high-value LED TVs and delicate crystal or artwork.",
  },
  {
    question: "How far in advance should I book my relocation?",
    answer:
      "For local moves within the same city, 2 to 4 days notice is ideal. For interstate relocations, we recommend booking 5 to 7 days in advance so we can conduct an inventory survey, reserve a dedicated truck, and schedule the best packing team for your dates.",
  },
  {
    question: "What items are prohibited from being transported?",
    answer:
      "For road safety and legal compliance, we cannot transport hazardous or inflammable items (gas cylinders, petrol, kerosene, fireworks, acids, batteries with acid), perishable cooked food, live pets, cash, jewelry, and personal confidential legal documents.",
  },
  {
    question: "How does the Goods Transit Insurance claim process work?",
    answer:
      "If transit insurance is opted for, your consignment is covered against transit damages or accidents based on your declared inventory value. In the rare event of transit damage, our dedicated coordinator guides you through a paperless claim process with fast settlement.",
  },
];

const ServicesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [calcMoveType, setCalcMoveType] = useState("2bhk");
  const [calcDistanceType, setCalcDistanceType] = useState("local");
  const [expandedFaq, setExpandedFaq] = useState(0);

  // Filter services based on tab and search query
  const filteredServices = useMemo(() => {
    let result = serviceList;

    if (activeTab !== "all") {
      if (activeTab === "household") {
        result = result.filter(
          (s) => s.category === "household" || s.category === "commercial"
        );
      } else {
        result = result.filter((s) => s.category === activeTab);
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query) ||
          s.tagline.toLowerCase().includes(query) ||
          s.points.some((p) => p.toLowerCase().includes(query))
      );
    }

    return result;
  }, [activeTab, searchQuery]);

  const selectedCalc =
    moveCalculatorOptions.find((m) => m.id === calcMoveType) ||
    moveCalculatorOptions[1];

  return (
    <>
      <SEO
        title="Packing & Relocation Services | 1st Om Packers and Movers"
        description="Comprehensive household, office, car, and bike moving services. 5-layer packing, 100% dedicated closed trucks, transparent pricing, and zero co-loading."
      />

      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden">
        {/* Subtle background glowing radial light */}
        <div
          className="absolute -top-40 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-text-muted" role="list">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={13} className="text-text-muted/60" />
              </li>
              <li>
                <span className="text-text font-semibold">Services</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-3xl">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck size={14} className="text-accent" />
                <span>Certified Zero-Damage Relocation Network</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Comprehensive Moving Services Designed for Total Peace of Mind
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
                From high-density 5-layer protective packing to dedicated closed-container trucks, every single step of your relocation is executed by verified full-time specialists.
              </p>
            </div>

            {/* Quick Hero CTA Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <Button to="/get-quote" size="md" className="w-full sm:w-auto shadow-md">
                Get an Instant Quote
              </Button>
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-text text-xs sm:text-sm font-semibold hover:border-primary/40 hover:bg-background transition-colors"
                >
                  <PhoneCall size={15} className="text-primary" />
                  <span>Call: {company.phone.primary}</span>
                </a>
              )}
            </div>
          </div>

          {/* ── 2. TRUST METRICS STRIP ──────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/80 shadow-xs">
            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Home size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">15,000+</p>
                <p className="text-xs text-text-muted">Moves Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">99.8%</p>
                <p className="text-xs text-text-muted">Zero-Damage Record</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">100%</p>
                <p className="text-xs text-text-muted">Dedicated Closed Fleet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Award size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">4.9 / 5.0</p>
                <p className="text-xs text-text-muted">Verified Customer Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE SEARCH & CATEGORY FILTER BAR ───────────── */}
      <section className="bg-background pt-10 pb-6 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-surface border border-border/80 overflow-x-auto scrollbar-none shadow-2xs">
              {categoryTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap select-none ${
                      isActive ? "text-white" : "text-text-muted hover:text-text"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeServiceFilterPill"
                        transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        className="absolute inset-0 rounded-full bg-primary shadow-xs"
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Real-time Keyword Search Input */}
            <div className="relative w-full md:w-72">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-text-muted">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services (e.g. Car, Office)..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-full bg-surface border border-border focus:border-primary focus:bg-background transition-all outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-2.5 flex items-center text-text-muted hover:text-text cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

          </div>

          {/* Results feedback banner */}
          <div className="flex items-center justify-between mt-4 text-xs text-text-muted">
            <span>
              Showing <strong className="text-text">{filteredServices.length}</strong> of{" "}
              {serviceList.length} services
            </span>
            {searchQuery && (
              <span>
                Filtering by: &ldquo;{searchQuery}&rdquo;{" "}
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline font-semibold ml-1 cursor-pointer"
                >
                  Reset
                </button>
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── 4. PRIMARY SERVICES SHOWCASE GRID ─────────────────────── */}
      <section className="bg-background py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 px-4 bg-surface rounded-2xl border border-dashed border-border max-w-lg mx-auto">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Search size={22} />
              </div>
              <h3 className="font-display font-bold text-text text-lg mb-1">
                No services found for &ldquo;{searchQuery}&rdquo;
              </h3>
              <p className="text-xs text-text-muted mb-4">
                Try searching for keywords like household, office, car, bike, packing, or storage.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveTab("all");
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Show all services
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {filteredServices.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="group relative flex flex-col rounded-2xl border border-border/80 bg-surface hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    {/* Visual Media Header */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-text/5 block">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                        <span className="inline-block px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white uppercase tracking-wider border border-white/10">
                          {service.badge}
                        </span>
                        <span className="inline-block px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-extrabold text-primary shadow-xs">
                          {service.startingPrice}
                        </span>
                      </div>

                      {/* Bottom Info Overlay */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 flex items-end justify-between">
                        <div className="pr-3">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-accent drop-shadow-xs">
                            {service.categoryLabel}
                          </span>
                          <h2 className="font-display font-extrabold text-white text-xl sm:text-2xl drop-shadow-sm leading-tight">
                            {service.title}
                          </h2>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white text-primary flex items-center justify-center shrink-0 group-hover:bg-accent group-hover:text-accent-foreground group-hover:rotate-6 transition-all duration-300 shadow-md">
                          <Icon size={20} strokeWidth={2} />
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="flex flex-col flex-1 p-5 sm:p-6">
                      <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-5">
                        {service.tagline}
                      </p>

                      {/* Key points checklist */}
                      <div className="mb-6 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">
                          What is included:
                        </p>
                        <ul className="space-y-2" role="list">
                          {service.points.slice(0, 4).map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2.5 text-xs text-text">
                              <CheckCircle2
                                size={15}
                                className="text-emerald-500 shrink-0 mt-0.5"
                                aria-hidden="true"
                              />
                              <span className="leading-snug">{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Card Action Controls */}
                      <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row items-center gap-2.5">
                        <Link
                          to={`/get-quote?service=${service.slug}`}
                          className="w-full sm:flex-1 px-4 py-2.5 rounded-full bg-primary text-white text-xs font-display font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-xs select-none"
                        >
                          <span>Get Free Quote</span>
                          <ArrowRight size={13} />
                        </Link>

                        <Link
                          to={`/services/${service.slug}`}
                          className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-border bg-background text-text text-xs font-display font-semibold flex items-center justify-center gap-1.5 hover:border-primary/40 hover:bg-surface transition-all select-none"
                        >
                          <span>Full Details</span>
                          <ChevronRight size={14} className="text-text-muted" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* ── 5. INTERACTIVE MOVE COST ESTIMATOR PREVIEW ─────────────── */}
      <section className="bg-surface py-12 sm:py-20 border-y border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
              <BadgePercent size={14} className="text-accent" />
              <span>Transparent Cost Forecaster</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              Estimate Your Relocation Cost Instantly
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Select your consignment size and move route to get a realistic, zero-obligation cost guideline.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-background rounded-3xl border border-border shadow-md p-6 sm:p-8">
            
            {/* Step 1: Choose Route Type */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
                1. Select Route Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCalcDistanceType("local")}
                  className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    calcDistanceType === "local"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-surface text-text-muted hover:border-primary/30"
                  }`}
                >
                  Local Move (Within City)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcDistanceType("interstate")}
                  className={`px-4 py-3 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    calcDistanceType === "interstate"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-surface text-text-muted hover:border-primary/30"
                  }`}
                >
                  Interstate Relocation (City-to-City)
                </button>
              </div>
            </div>

            {/* Step 2: Choose Move Type */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
                2. Select Consignment Volume
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {moveCalculatorOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setCalcMoveType(opt.id)}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      calcMoveType === opt.id
                        ? "border-primary bg-primary text-white shadow-xs"
                        : "border-border bg-surface text-text hover:border-primary/30"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {calcMoveType === opt.id && <Check size={14} className="shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculation Result Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-surface to-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Estimated Pricing ({calcDistanceType === "local" ? "Local Move" : "Interstate Move"})
                </span>
                <p className="font-display font-extrabold text-text text-2xl sm:text-4xl">
                  {calcDistanceType === "local"
                    ? selectedCalc.localPrice
                    : selectedCalc.interstatePrice}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-text-muted pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck size={14} className="text-primary" />
                    {selectedCalc.truck}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    {selectedCalc.crew}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" />
                    {selectedCalc.duration}
                  </span>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <Button
                  to={`/get-quote?service=${
                    calcMoveType === "car"
                      ? "car-transportation"
                      : calcMoveType === "bike"
                      ? "bike-transportation"
                      : calcMoveType === "office"
                      ? "office-commercial-shifting"
                      : "home-shifting"
                  }&type=${calcMoveType}&scope=${calcDistanceType}`}
                  size="md"
                  className="w-full md:w-auto shadow-md"
                >
                  Lock In This Estimate
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center mt-3">
              *Estimates are indicative based on standard inventory volumes. Final quote is confirmed post-survey with zero hidden costs.
            </p>
          </div>

        </div>
      </section>

      {/* ── 6. "HOW WE HANDLE YOUR MOVE" 4-STEP PROCESS ───────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Zap size={14} className="text-accent" />
              <span>Standard Operating Procedure</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              How We Ensure A Zero-Damage Move
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Our military-precision 4-step relocation protocol guarantees complete security from door to door.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={step.step}
                  className="group relative rounded-2xl bg-surface border border-border/80 flex flex-col justify-between hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  <div>
                    {/* Visual Media Header with WebP image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-text/5">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent pointer-events-none" />

                      {/* Floating Step Number */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white font-display font-black text-xs tracking-wider border border-white/10">
                          STEP {step.step}
                        </span>
                      </div>

                      {/* Floating Semantic Icon */}
                      <div className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-xl bg-white text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground group-hover:rotate-6 transition-all duration-300 shadow-md">
                        <StepIcon size={18} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-display font-bold text-text text-base mb-2 group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-text-muted text-xs leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Footer Highlight */}
                  <div className="px-5 pb-5 pt-1">
                    <div className="pt-3 border-t border-border/60">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-accent/15 text-accent-foreground text-[10px] font-extrabold uppercase tracking-wide">
                        {step.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 7. "WHY 1ST OM VS. LOCAL UNVERIFIED MOVERS" MATRIX ───── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} />
              <span>Safety & Value Comparison</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              Why Choosing 1st Om Protects You
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Don&apos;t risk damaged furniture or unexpected moving-day extortion from unverified aggregators.
            </p>
          </div>

          {/* Clean Open Comparison Table (Zero Box Loop, Clean Institutional Alignment) */}
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-text font-display font-bold">
                  <th className="py-3.5 pr-4 w-1/4">Key Consideration</th>
                  <th className="py-3.5 px-4 w-3/8 text-primary font-bold">1st Om Binding Standards</th>
                  <th className="py-3.5 pl-4 w-3/8 text-text-muted">Informal Market Practice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {comparisonPoints.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/40 transition-colors">
                    <td className="py-4 pr-4 font-bold text-text align-top">
                      {item.feature}
                    </td>
                    <td className="py-4 px-4 text-text font-medium align-top leading-relaxed">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{item.us}</span>
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-text-muted align-top leading-relaxed">
                      {item.others}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ── 8. SERVICES FAQ ACCORDION ─────────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={14} />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              Frequently Asked Questions About Our Services
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Clear answers to help you book your move with total confidence.
            </p>
          </div>

          <div className="space-y-3" role="list">
            {faqs.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? "border-primary/50 bg-surface shadow-xs"
                      : "border-border bg-background hover:border-border/90"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isExpanded ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left font-display font-bold text-sm sm:text-base text-text flex items-center justify-between gap-4 select-none cursor-pointer"
                    aria-expanded={isExpanded}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-text-muted shrink-0 transition-transform duration-200 ${
                        isExpanded ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-text-muted leading-relaxed border-t border-border/50 pt-3">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 9. FINAL HIGH-CONVERTING CTA BANNER ────────────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary/95 to-primary text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Ready To Move Stress-Free?
            </span>
            <h2
              className="font-display font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Get Your Custom Moving Quote in Under 60 Seconds
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Zero advance payment to book. Free doorstep or video survey. Guaranteed zero hidden charges.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/get-quote" size="lg" className="w-full sm:w-auto shadow-lg">
                Book Free Survey & Quote
              </Button>
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 bg-white/10 text-white font-display font-bold text-sm hover:bg-white hover:text-primary transition-all shadow-md"
                >
                  <PhoneCall size={16} />
                  <span>Call: {company.phone.primary}</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> No Cancellation Fee Before Dispatch
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Dedicated Move Manager
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> 100% In-House Fleet
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
