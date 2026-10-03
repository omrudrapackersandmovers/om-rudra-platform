import { useState, useMemo } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  MapPin,
  Navigation,
  Search,
  Building2,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  PhoneCall,
  Clock,
  Compass,
  X,
  Check,
  Shield,
  FileCheck,
  Users,
} from "lucide-react";
import {
  locationsByState,
  allRoutes,
  placeImages,
  allServiceLocations,
} from "../../../../data/locations/index";
import SEO from "../../../../configs/seo";
import { company } from "../../../../data/company";
import Button from "../../shared/components/Button";

const STATE_ORDER = [
  "Bihar",
  "Jharkhand",
  "Uttar Pradesh",
  "Delhi NCR",
  "West Bengal",
  "Maharashtra",
  "Karnataka",
  "Telangana",
  "Gujarat",
  "Rajasthan",
  "Madhya Pradesh",
  "Tamil Nadu",
  "Chandigarh",
];

const stateMeta = {
  Bihar: {
    hubName: "Patna Central Headquarters",
    badge: "Primary HQ & Fleet Base",
    tagline: "Comprehensive 38-district coverage with dedicated local and interstate fleet dispatch.",
  },
  Jharkhand: {
    hubName: "Ranchi & Jamshedpur Regional Hubs",
    badge: "Core Industrial Fleet",
    tagline: "Regular scheduled routes across Ranchi, Jamshedpur, Dhanbad, Bokaro, and industrial zones.",
  },
  "Uttar Pradesh": {
    hubName: "Lucknow & Varanasi Hubs",
    badge: "Regional Operating Base",
    tagline: "Direct corridors connecting Purvanchal, Central UP, and NCR with dedicated closed container trucks.",
  },
  "Delhi NCR": {
    hubName: "Delhi & Noida Terminal",
    badge: "North India Gateway",
    tagline: "Daily scheduled express moves serving Delhi, Gurgaon, Noida, Greater Noida, and Faridabad.",
  },
  "West Bengal": {
    hubName: "Kolkata & Siliguri Hubs",
    badge: "Eastern Commercial Terminal",
    tagline: "Connecting Kolkata, Howrah, Durgapur, Asansol, and North Bengal with guaranteed timelines.",
  },
  Maharashtra: {
    hubName: "Mumbai & Pune Corridor Terminal",
    badge: "West India Corridor",
    tagline: "Long-haul interstate container service for corporate and residential relocations.",
  },
  Karnataka: {
    hubName: "Bengaluru Tech Corridor Hub",
    badge: "South India Hub",
    tagline: "Specialized IT equipment shifting and direct household transport from Eastern India.",
  },
  Telangana: {
    hubName: "Hyderabad Hub",
    badge: "South Central Hub",
    tagline: "Direct container transport to Hyderabad and Cyberabad tech corridors.",
  },
  Gujarat: {
    hubName: "Ahmedabad & Surat Hub",
    badge: "Western Corridor",
    tagline: "Safe commercial and residential shifting between Gujarat and Eastern states.",
  },
  Rajasthan: {
    hubName: "Jaipur Terminal",
    badge: "Desert Corridor Hub",
    tagline: "Doorstep delivery and vehicle transportation across Jaipur, Jodhpur, and Udaipur.",
  },
  "Madhya Pradesh": {
    hubName: "Indore & Bhopal Hub",
    badge: "Central India Gateway",
    tagline: "Direct interstate container transit connecting MP with Bihar and Jharkhand.",
  },
  "Tamil Nadu": {
    hubName: "Chennai Coastal Terminal",
    badge: "South Coast Corridor",
    tagline: "All-India closed-body container transport to Chennai, Coimbatore, and Madurai.",
  },
  Chandigarh: {
    hubName: "Chandigarh Tricity Terminal",
    badge: "North Gateway",
    tagline: "Express corporate and residential transit serving Chandigarh, Mohali, and Panchkula.",
  },
};

const regionFilters = [
  { id: "all", label: "All Regions" },
  { id: "Bihar", label: "Bihar (HQ Base)" },
  { id: "Jharkhand", label: "Jharkhand" },
  { id: "north", label: "UP & Delhi NCR" },
  { id: "east", label: "West Bengal & East" },
  { id: "national", label: "West & South India" },
  { id: "routes", label: "Interstate Corridors" },
];

const WhereWeServe = () => {
  const [activeRegion, setActiveRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Search filter across all individual cities and towns
  const matchingLocations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allServiceLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(q) ||
        loc.state.toLowerCase().includes(q) ||
        (loc.district && loc.district.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Filtered states for the state showcase
  const filteredStates = useMemo(() => {
    if (activeRegion === "all") return STATE_ORDER;
    if (activeRegion === "Bihar") return ["Bihar"];
    if (activeRegion === "Jharkhand") return ["Jharkhand"];
    if (activeRegion === "north") return ["Uttar Pradesh", "Delhi NCR", "Chandigarh"];
    if (activeRegion === "east") return ["West Bengal"];
    if (activeRegion === "national")
      return [
        "Maharashtra",
        "Karnataka",
        "Telangana",
        "Gujarat",
        "Rajasthan",
        "Madhya Pradesh",
        "Tamil Nadu",
      ];
    if (activeRegion === "routes") return [];
    return STATE_ORDER;
  }, [activeRegion]);

  return (
    <>
      <SEO
        title="Where We Serve  -  Service Locations & Interstate Moving Routes"
        description="Explore 50+ districts and national interstate corridors served by 1st Om Packers and Movers across Bihar, Jharkhand, UP, Delhi NCR, and all across India."
      />

      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden">
        {/* Glow ambient background effects */}
        <div
          className="absolute -top-32 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
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
                <span className="text-text font-semibold">Where We Serve</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-3xl">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Compass size={14} className="text-accent" />
                <span>All-India Relocation & Logistics Network</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Our Service Locations &amp; Interstate Moving Routes
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
                We operate full-time packing crews across Bihar, Jharkhand, and Uttar Pradesh, with dedicated closed-container transport corridors running daily to every major Indian commercial center.
              </p>
            </div>

            {/* Quick Hero CTA Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <Button to="/get-quote" size="md" className="w-full sm:w-auto shadow-md">
                Get Quote for Any Route
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

          {/* ── 2. NETWORK REACH METRICS BAR ────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/80 shadow-xs">
            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">50+ Districts</p>
                <p className="text-xs text-text-muted">Doorstep Crew Service</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <Building2 size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">6 Regional Hubs</p>
                <p className="text-xs text-text-muted">Patna Central HQ</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">100% Dedicated Fleet</p>
                <p className="text-xs text-text-muted">Zero Cargo Co-Loading</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Navigation size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">Daily Departures</p>
                <p className="text-xs text-text-muted">Major National Highways</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. LIVE CITY & SERVICEABILITY CHECKER (INSTANT SEARCH) ── */}
      <section className="bg-background pt-8 pb-6 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted">
                <Search size={18} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any city or district (e.g., Patna, Muzaffarpur, Ranchi, Delhi, Pune)..."
                className="w-full pl-11 pr-10 py-3.5 text-xs sm:text-sm rounded-full bg-surface border-2 border-border focus:border-primary focus:bg-background transition-all outline-none shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-4 flex items-center text-text-muted hover:text-text cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown / Card */}
            {searchQuery.trim() && (
              <div className="mt-3 p-4 rounded-2xl bg-surface border border-primary/20 shadow-lg">
                <div className="flex items-center justify-between pb-2 border-b border-border mb-3">
                  <span className="text-xs font-bold text-text">
                    Found {matchingLocations.length} locations matching &ldquo;{searchQuery}&rdquo;
                  </span>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                {matchingLocations.length === 0 ? (
                  <div className="text-center py-4 text-xs text-text-muted">
                    No direct district listing found, but we provide dedicated container transport nationwide!{" "}
                    <Link to="/get-quote" className="text-primary font-bold hover:underline ml-1">
                      Request custom quote &rarr;
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                    {matchingLocations.map((loc) => (
                      <Link
                        key={loc.slug}
                        to={`/packers-movers-${loc.slug}`}
                        className="p-2.5 rounded-xl border border-border bg-background hover:border-primary/40 hover:bg-surface transition-all flex items-center justify-between group"
                      >
                        <div className="truncate pr-2">
                          <span className="text-xs font-bold text-text group-hover:text-primary block truncate">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-text-muted block">
                            {loc.state}
                          </span>
                        </div>
                        {loc.type === "hub" ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary text-white shrink-0">
                            MAIN HUB
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 shrink-0">
                            ACTIVE
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1.5 rounded-full bg-surface border border-border/80 w-fit max-w-full mx-auto overflow-x-auto mt-6 scrollbar-none shadow-2xs">
            {regionFilters.map((tab) => {
              const isActive = activeRegion === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveRegion(tab.id)}
                  className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors duration-200 cursor-pointer whitespace-nowrap select-none ${
                    isActive ? "text-white" : "text-text-muted hover:text-text"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeWhereRegionPill"
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
        </div>
      </section>

      {/* ── 4. STATE-BY-STATE DIRECTORY SHOWCASE ──────────────────── */}
      {activeRegion !== "routes" && (
        <section className="bg-background py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
                  <MapPin size={14} />
                  <span>State & District Operating Network</span>
                </div>
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl">
                  District & City Level Service Coverage
                </h2>
              </div>
              <span className="text-xs text-text-muted">
                Showing {filteredStates.length} key operational states
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {filteredStates.map((state) => {
                const locations = locationsByState[state] || [];
                const image = placeImages[state];
                const meta = stateMeta[state] || {
                  hubName: `${state} Logistics Terminal`,
                  badge: "Operating Market",
                  tagline: "Dedicated door-to-door relocation and vehicle carrier transit.",
                };

                return (
                  <div
                    key={state}
                    className="group relative rounded-3xl border border-border bg-surface overflow-hidden flex flex-col hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Visual Media Header */}
                    {image && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-background border-b border-border/60">
                        <img
                          src={image}
                          alt={`1st Om Packers and Movers in ${state}`}
                          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />

                        {/* Hallmark Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-extrabold text-white uppercase tracking-wider border border-white/10">
                            {meta.badge}
                          </span>
                        </div>

                        {/* Bottom Overlay Title */}
                        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-end justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
                              State Coverage
                            </span>
                            <h3 className="font-display font-black text-white text-xl sm:text-2xl drop-shadow-sm leading-tight">
                              {state}
                            </h3>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-white/95 text-primary text-xs font-bold shadow-xs">
                            {locations.length} Cities
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Main Hub Callout */}
                      <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                        <Building2 size={16} className="text-primary shrink-0" />
                        <div className="truncate">
                          <span className="text-[10px] uppercase font-bold text-text-muted block">
                            Key Dispatch Hub
                          </span>
                          <span className="text-xs font-bold text-text truncate block">
                            {meta.hubName}
                          </span>
                        </div>
                      </div>

                      <p className="text-text-muted text-xs leading-relaxed mb-4">
                        {meta.tagline}
                      </p>

                      {/* City Links Grid */}
                      <div className="flex-1 mb-5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block mb-2">
                          Featured Districts & Towns:
                        </span>
                        <ul className="grid grid-cols-2 gap-1.5" role="list">
                          {locations.slice(0, 10).map((loc) => (
                            <li key={loc.slug}>
                              <Link
                                to={`/packers-movers-${loc.slug}`}
                                className="text-xs text-text hover:text-primary transition-colors flex items-center justify-between p-1.5 rounded-lg hover:bg-background group/item"
                              >
                                <span className="truncate group-hover/item:translate-x-0.5 transition-transform">
                                  {loc.name}
                                </span>
                                {loc.type === "hub" && (
                                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary shrink-0 ml-1">
                                    Hub
                                  </span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 border-t border-border">
                        <Link
                          to={`/get-quote?from=${encodeURIComponent(state)}`}
                          className="w-full py-2.5 px-4 rounded-full bg-surface border border-border text-text text-xs font-display font-bold flex items-center justify-between hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
                        >
                          <span>Get Quote from {state}</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── 5. INTERSTATE HIGHWAY CORRIDORS SECTION ───────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
                <Navigation size={14} className="text-accent" />
                <span>Express Interstate Transit</span>
              </div>
              <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-2">
                Dedicated Interstate Relocation Corridors
              </h2>
              <p className="text-text-muted text-xs sm:text-sm max-w-2xl">
                Daily closed-container direct departures on India&apos;s major highway routes. Your goods travel locked in a dedicated truck with zero transshipment midway.
              </p>
            </div>

            <div className="shrink-0">
              <Button to="/get-quote?scope=interstate" size="sm">
                Get Interstate Quote
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allRoutes.map((route) => (
              <Link
                key={route.slug}
                to={`/route/${route.slug}`}
                className="group p-5 rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
                      DIRECT CORRIDOR
                    </span>
                    {route.distanceKm && (
                      <span className="text-xs font-bold text-text-muted">
                        ~{route.distanceKm} km
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-display font-bold text-text text-sm sm:text-base group-hover:text-primary transition-colors mb-2">
                    <span>{route.from}</span>
                    <ArrowRight size={14} className="text-accent shrink-0 group-hover:translate-x-1 transition-transform" />
                    <span>{route.to}</span>
                  </div>

                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    Dedicated closed container truck with GPS updates and door-to-door delivery.
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>View Corridor Details</span>
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. INTERSTATE RELOCATION ASSURANCE PILLARS ────────────── */}
      <section className="bg-background py-14 sm:py-20 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} />
              <span>National Safety Protocols</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              How We Protect Your Goods Across State Borders
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Long-distance moves demand higher standards. Our operational safeguards ensure zero losses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Truck size={20} />
              </div>
              <h3 className="font-display font-bold text-text text-base mb-2">
                100% Dedicated Container
              </h3>
              <p className="text-text-muted text-xs leading-relaxed">
                Your goods are never co-loaded or mixed with stranger cargo. The truck is sealed in your presence at your doorway.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center mb-4">
                <Navigation size={20} className="text-accent" />
              </div>
              <h3 className="font-display font-bold text-text text-base mb-2">
                Live GPS Transit Tracking
              </h3>
              <p className="text-text-muted text-xs leading-relaxed">
                Your dedicated Move Coordinator provides regular highway location updates directly on WhatsApp throughout the journey.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <FileCheck size={20} />
              </div>
              <h3 className="font-display font-bold text-text text-base mb-2">
                GST &amp; e-Way Bill Clearance
              </h3>
              <p className="text-text-muted text-xs leading-relaxed">
                Full legal documentation and consignment notes ensure seamless transit across state commercial border checkpoints.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="font-display font-bold text-text text-base mb-2">
                Destination Unloading Team
              </h3>
              <p className="text-text-muted text-xs leading-relaxed">
                Our local partner branch crew receives the truck at your new city, unloads, assembles furniture, and places each carton.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. FINAL HIGH-CONVERTING BOTTOM CTA BANNER ──────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary/95 to-primary text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Moving To Another City Or State?
            </span>
            <h2
              className="font-display font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Get a Guaranteed Doorstep-to-Doorstep Written Quote
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Tell us your origin and destination. Our logistics coordinators will assign a dedicated container and schedule a free survey.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/get-quote" size="lg" className="w-full sm:w-auto shadow-lg">
                Book Free Route Survey
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
                <Check size={14} className="text-accent" /> Zero Co-Loading Guarantee
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Live WhatsApp GPS Updates
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> All-Risk Transit Insurance Option
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhereWeServe;
