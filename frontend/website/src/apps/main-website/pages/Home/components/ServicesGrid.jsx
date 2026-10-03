import { useState } from "react";
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
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { company } from "../../../../../data/company";
import Button from "../../../shared/components/Button";

/**
 * Streamlined services data:
 * - Crisp 1-sentence value proposition per card (low cognitive load, instant scanning).
 * - Focused single primary CTA for high conversion.
 * - Stable grid with Framer Motion layout animation to eliminate filter layout shifts.
 */
const services = [
  {
    icon: Home,
    title: "Home Shifting",
    category: "household",
    categoryLabel: "Residential",
    badge: "Dedicated Trucks",
    perk: "Zero Co-Loading • Room Setup",
    ctaText: "Get Home Move Quote",
    tagline:
      "Dedicated closed trucks, 5-layer packing, and complete room-by-room setup for a zero-damage move.",
    slug: "home-shifting",
    image: "/images/services/HomeShiftingServices.webp",
  },
  {
    icon: Building2,
    title: "Office Relocation",
    category: "commercial",
    categoryLabel: "Commercial",
    badge: "Zero Downtime",
    perk: "Weekend Moves • Server Safety",
    ctaText: "Get Corporate Quote",
    tagline:
      "Zero-downtime office moves scheduled around business hours with specialized IT & server handling.",
    slug: "office-commercial-shifting",
    image: "/images/services/Office&CommercialShifting.webp",
  },
  {
    icon: Car,
    title: "Car Transportation",
    category: "vehicles",
    categoryLabel: "Automotive",
    badge: "Enclosed Carrier",
    perk: "Hydraulic Carrier • Live Tracking",
    ctaText: "Get Car Move Quote",
    tagline:
      "Enclosed hydraulic carrier with live GPS tracking, zero road wear, and full transit insurance.",
    slug: "car-transportation",
    image: "/images/services/CarTransportationServices.webp",
  },
  {
    icon: Bike,
    title: "Bike Transportation",
    category: "vehicles",
    categoryLabel: "Two-Wheeler",
    badge: "Wooden Crating",
    perk: "Crate Packaging • Zero Scratch",
    ctaText: "Get Bike Move Quote",
    tagline:
      "Reinforced wooden crate packaging and doorstep transit to ensure zero scratch or paint damage.",
    slug: "bike-transportation",
    image: "/images/services/Bike&Two-WheelerTransportation.webp",
  },
  {
    icon: Package,
    title: "Packing & Unpacking",
    category: "handling",
    categoryLabel: "Packaging",
    badge: "5-Ply Cartons",
    perk: "5-Ply Cartons • Room Indexing",
    ctaText: "Book Packing Crew",
    tagline:
      "Export-grade 5-ply cartons, bubble wrap cushioning, and systematic room-by-room labeling.",
    slug: "packing-unpacking",
    image: "/images/services/Packing&UnpackingServices.webp",
  },
  {
    icon: Boxes,
    title: "Loading & Unloading",
    category: "handling",
    categoryLabel: "Ground Crew",
    badge: "Heavy Dollies",
    perk: "Appliance Dollies • Wall Guards",
    ctaText: "Book Loading Crew",
    tagline:
      "Trained full-time crew using heavy appliance dollies and doorway protectors for safe transit.",
    slug: "loading-unloading",
    image: "/images/services/Loading&UnloadingServices.webp",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Storage",
    category: "handling",
    categoryLabel: "Secure Storage",
    badge: "24/7 CCTV Safe",
    perk: "Moisture-Free • Flexible Terms",
    ctaText: "Check Storage Rates",
    tagline:
      "Moisture-free, 24/7 CCTV-monitored secure storage with flexible weekly or monthly terms.",
    slug: "warehousing-storage",
    image: "/images/services/Warehousing&SecureStorage.webp",
  },
  {
    icon: ShieldCheck,
    title: "Transit Insurance",
    category: "handling",
    categoryLabel: "Protection",
    badge: "100% Value Cover",
    perk: "100% Declared Value • Fast Claims",
    ctaText: "Protect Your Shipment",
    tagline:
      "Comprehensive all-risk transit policy with prompt paperless claims and zero hidden deductions.",
    slug: "goods-insurance",
    image: "/images/services/GoodsTransitInsurance.webp",
  },
];

const categoryTabs = [
  { id: "all", label: "All Services", count: 8 },
  { id: "household", label: "Household & Office", count: 2 },
  { id: "vehicles", label: "Vehicle Transport", count: 2 },
  { id: "handling", label: "Packing & Storage", count: 4 },
];

const ServicesGrid = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredServices =
    activeTab === "all"
      ? services
      : activeTab === "household"
      ? services.filter((s) => s.category === "household" || s.category === "commercial")
      : services.filter((s) => s.category === activeTab);

  return (
    <section
      className="bg-background py-16 sm:py-24 border-b border-border/60"
      aria-labelledby="services-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Section Header ────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              <Boxes size={14} />
              <span>Comprehensive Moving Solutions</span>
            </div>
            <h2
              id="services-heading"
              className="font-display font-extrabold text-text tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Every part of your move, handled with precision
            </h2>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-3xl">
              From the first roll of packing tape to the final furniture setup in your new home, our dedicated crew and specialized vehicles ensure a zero-damage experience.
            </p>
          </div>

          {/* Quick Stats or Reassurance Pill */}
          <div className="hidden lg:flex flex-col items-end text-right shrink-0">
            <div className="flex items-center gap-2 text-primary font-display font-bold text-lg">
              <ShieldCheck size={20} className="text-accent" />
              <span>100% In-House Fleet</span>
            </div>
            <span className="text-xs text-text-muted mt-1">
              Zero third-party vendor subcontracting
            </span>
          </div>
        </div>

        {/* ── Category Filter Tabs with Sliding Active Pill ─────────── */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-surface border border-border/80 w-fit max-w-full overflow-x-auto mb-8 sm:mb-10 scrollbar-none shadow-xs">
          {categoryTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 outline-none select-none ${
                  isActive ? "text-white" : "text-text-muted hover:text-text"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilterBubble"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-primary shadow-xs"
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full font-bold transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-background border border-border text-text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Stabilized Services Grid Container (Prevents Layout Shift) ── */}
        <div className="min-h-[420px] lg:min-h-[720px]">
          <AnimatePresence mode="wait">
            <motion.ul
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7"
              role="list"
            >
              {filteredServices.map((service, idx) => {
                const Icon = service.icon;
                return (
                  <motion.li
                    key={service.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: idx * 0.035,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                    className="flex"
                  >
                    <div className="group relative flex flex-col w-full rounded-[var(--radius-lg)] border border-border/80 bg-surface hover:border-primary/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                      
                      {/* 16:9 Aspect Ratio Image Container */}
                      <Link
                        to={`/services/${service.slug}`}
                        className="relative aspect-video w-full overflow-hidden bg-text/5 block focus:outline-none"
                        tabIndex={-1}
                        aria-hidden="true"
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                        {/* Hallmark Badge on Top Left */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                            {service.badge}
                          </span>
                        </div>

                        {/* Semantic Icon on Bottom Right */}
                        <div className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-full bg-white text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground group-hover:rotate-6 transition-all duration-300 shadow-md">
                          <Icon size={17} strokeWidth={2} />
                        </div>
                      </Link>

                      {/* Card Content */}
                      <div className="flex flex-col flex-1 p-5 sm:p-6">
                        
                        {/* Category indicator */}
                        <span className="text-[11px] font-bold uppercase tracking-wider text-accent mb-1.5">
                          {service.categoryLabel}
                        </span>

                        {/* Service Title */}
                        <h3 className="font-display font-bold text-text text-base sm:text-lg mb-2 group-hover:text-primary transition-colors leading-snug">
                          <Link to={`/services/${service.slug}`} className="focus:outline-none focus:underline">
                            {service.title}
                          </Link>
                        </h3>

                        {/* Punchy 1-Sentence Value Prop */}
                        <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-6 line-clamp-2 min-h-[38px] flex-1">
                          {service.tagline}
                        </p>

                        {/* Seamless Interactive Action CTA Pill */}
                        <div className="pt-2 mt-auto">
                          <Link
                            to={`/get-quote?service=${service.slug}`}
                            className="group/btn relative w-full px-4 py-2.5 rounded-full bg-surface border border-border text-text text-xs font-display font-bold flex items-center justify-between transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent group-hover:shadow-[0_8px_20px_rgba(245,166,35,0.3)] select-none shine-sweep"
                          >
                            <span>{service.ctaText}</span>
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary group-hover:bg-accent-foreground/15 group-hover:text-accent-foreground flex items-center justify-center transition-all duration-200">
                              <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                            </span>
                          </Link>
                        </div>

                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </AnimatePresence>
        </div>

        {/* ── Enterprise & Custom Moves Reassurance Strip ──────────── */}
        <div className="mt-12 sm:mt-16 rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <PhoneCall size={22} />
            </div>
            <div>
              <h4 className="font-display font-bold text-text text-base sm:text-lg mb-1">
                Need a customized commercial schedule or bulk interstate transport?
              </h4>
              <p className="text-text-muted text-xs sm:text-sm max-w-xl">
                Our logistics coordinators plan customized routes, dedicated convoys, and structured enterprise contracts with formal SLA guarantees.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Button to="/get-quote" size="sm" className="w-full sm:w-auto">
              Request Assessment
            </Button>
            {company.phone.primary && (
              <a
                href={`tel:${company.phone.primary}`}
                className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-full border border-border bg-background text-text text-xs font-semibold hover:border-primary/40 hover:bg-surface transition-colors"
              >
                Call: {company.phone.primary}
              </a>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ServicesGrid;
