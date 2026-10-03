import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
  Check,
  ArrowRight,
  Truck,
  Boxes,
  Home,
  Car,
  Bike,
  Building2,
  Clock,
  Receipt,
  ShieldAlert,
  ChevronDown,
  Zap,
  BadgePercent,
  FileText,
  Users,
  Percent,
  CheckCircle,
} from "lucide-react";
import SEO from "../../../../configs/seo";
import { company } from "../../../../data/company";
import Button from "../../shared/components/Button";

import {
  estimatorOptions as rawEstimatorOptions,
  pricingTabs,
  localHouseholdRates,
  interstateCorridors,
  vehicleRates,
  addOnServices,
  inclusionsVsExtras,
  scamComparison,
  pricingFaqs,
} from "../../../../data/pricing";

const ICON_MAP = {
  home: Home,
  bike: Bike,
  car: Car,
  office: Building2,
};

const estimatorOptions = rawEstimatorOptions.map((opt) => ({
  ...opt,
  icon: ICON_MAP[opt.iconKey] || Home,
}));


const Pricing = () => {
  const [activeTab, setActiveTab] = useState("local");
  const [calcMoveType, setCalcMoveType] = useState("2bhk");
  const [calcRouteType, setCalcRouteType] = useState("local");
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [includeUnpacking, setIncludeUnpacking] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const selectedEstimator =
    estimatorOptions.find((item) => item.id === calcMoveType) ||
    estimatorOptions[1];

  return (
    <>
      <SEO
        title="Transparent Pricing & Relocation Cost Estimates | 1st Om Packers and Movers"
        description="Clear, upfront pricing with zero hidden charges. Calculate moving costs for 1 BHK, 2 BHK, 3 BHK, car, bike, and commercial moves locally and across India."
      />

      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden">
        {/* Glow ambient lights */}
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
                <span className="text-text font-semibold">Pricing</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-3xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/25 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck size={15} className="text-accent" />
                <span>Zero-Hidden-Fee Guarantee</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Transparent Moving Estimates. What You Agree To Is What You Pay.
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
                We believe in complete pricing honesty. No bait-and-switch quotes, no surprise moving-day demands for tape or stairs, and no hidden highway tolls.
              </p>
            </div>

            {/* Quick Hero Call/Quote Action Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <Button to="/get-quote" size="md" className="w-full sm:w-auto shadow-md">
                Get a Fixed Binding Quote
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

          {/* ── 2. FOUR TRUST PILLARS BAR ───────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/80 shadow-xs">
            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Receipt size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">Binding Written Quote</p>
                <p className="text-xs text-text-muted">Zero moving-day surprises</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <CheckCircle size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">Free Pre-Move Survey</p>
                <p className="text-xs text-text-muted">In-person or virtual survey</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">Tolls & Fuel Included</p>
                <p className="text-xs text-text-muted">No road extortion</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-sm">GST Invoice Ready</p>
                <p className="text-xs text-text-muted">100% corporate claimable</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE LIVE RELOCATION COST CALCULATOR ────────── */}
      <section className="bg-background py-12 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Zap size={14} className="text-accent" />
              <span>Real-Time Relocation Calculator</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              Estimate Your Relocation Cost in 30 Seconds
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Adjust your consignment size, distance scope, and add-on preferences to view realistic price brackets.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-surface rounded-3xl border border-border shadow-md p-6 sm:p-8">
            
            {/* Step 1: Distance / Scope */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
                Step 1: Choose Transit Scope
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setCalcRouteType("local")}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    calcRouteType === "local"
                      ? "border-primary bg-primary text-white shadow-xs"
                      : "border-border bg-background text-text hover:border-primary/40"
                  }`}
                >
                  Local Move (Within City / &le; 40 km)
                </button>
                <button
                  type="button"
                  onClick={() => setCalcRouteType("interstate")}
                  className={`p-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-all text-center cursor-pointer ${
                    calcRouteType === "interstate"
                      ? "border-primary bg-primary text-white shadow-xs"
                      : "border-border bg-background text-text hover:border-primary/40"
                  }`}
                >
                  Interstate Move (City-to-City)
                </button>
              </div>
            </div>

            {/* Step 2: Consignment Volume */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2.5">
                Step 2: Choose Consignment Volume
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {estimatorOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = calcMoveType === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCalcMoveType(opt.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col justify-between gap-2 text-left cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                          : "border-border bg-background text-text hover:border-primary/40"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon size={16} className={isSelected ? "text-primary" : "text-text-muted"} />
                        {isSelected && <Check size={14} className="text-primary" />}
                      </div>
                      <span className="leading-snug">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Optional Add-on Toggles */}
            <div className="mb-8 pt-4 border-t border-border">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                Step 3: Service Customizations
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer select-none hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={includeUnpacking}
                    onChange={(e) => setIncludeUnpacking(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-text block">Destination Unpacking & Room Setup</span>
                    <span className="text-text-muted text-[11px]">Included in household shifting quotes</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background cursor-pointer select-none hover:border-primary/30 transition-all">
                  <input
                    type="checkbox"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="w-4 h-4 rounded text-primary border-border focus:ring-primary accent-primary"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-text block">All-Risk Goods Transit Insurance</span>
                    <span className="text-text-muted text-[11px]">Recommended for long distance & interstate (+1.5%)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Dynamic Result Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-background to-primary/5 border border-primary/25 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  <BadgePercent size={14} />
                  <span>Estimated Total ({calcRouteType === "local" ? "Local Move" : "Interstate Corridor"})</span>
                </div>

                <p className="font-display font-black text-text text-3xl sm:text-4xl">
                  {calcRouteType === "local"
                    ? selectedEstimator.localPrice
                    : selectedEstimator.interstatePrice}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-text-muted pt-1">
                  <span className="inline-flex items-center gap-1.5">
                    <Truck size={14} className="text-primary" />
                    {selectedEstimator.truck}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    {selectedEstimator.crew}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" />
                    {selectedEstimator.duration}
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
                  }&type=${calcMoveType}&scope=${calcRouteType}`}
                  size="md"
                  className="w-full md:w-auto shadow-md"
                >
                  Book Free Survey & Lock Price
                </Button>
              </div>
            </div>

            <p className="text-[11px] text-text-muted text-center mt-3">
              *Estimates are indicative and based on typical consignments. Actual price is confirmed in writing post-survey with zero hidden extras.
            </p>
          </div>

        </div>
      </section>

      {/* ── 4. SEGMENTED RATE TABLES (TABBED NAVIGATION) ──────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Boxes size={14} />
                <span>Rate Master Matrix</span>
              </div>
              <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight">
                Standard Pricing Reference Brackets
              </h2>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-background border border-border/80 overflow-x-auto scrollbar-none shadow-2xs">
              {pricingTabs.map((tab) => {
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
                        layoutId="activePricingTabPill"
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

          {/* ── Tab Content ── */}
          <div className="bg-background rounded-2xl border border-border shadow-xs overflow-hidden">
            
            {/* TAB 1: Local Household Rates */}
            {activeTab === "local" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Home Size / Volume</th>
                      <th className="p-4 sm:p-5 hidden md:table-cell">Packing Standard</th>
                      <th className="p-4 sm:p-5 hidden sm:table-cell">Vehicle & Crew</th>
                      <th className="p-4 sm:p-5">Duration</th>
                      <th className="p-4 sm:p-5 text-right">Indicative Range</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {localHouseholdRates.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.size}
                          <span className="block text-xs font-normal text-text-muted md:hidden mt-1">
                            {row.packing}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden md:table-cell">
                          {row.packing}
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden sm:table-cell">
                          <span className="font-semibold text-text block">{row.vehicle}</span>
                          <span className="text-xs">{row.crew}</span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted">{row.time}</td>
                        <td className="p-4 sm:p-5 font-display font-bold text-text text-right whitespace-nowrap">
                          {row.priceRange}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to={`/get-quote?service=${row.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Quote</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 2: Interstate Corridors */}
            {activeTab === "interstate" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Interstate Corridor</th>
                      <th className="p-4 sm:p-5">Distance & Transit</th>
                      <th className="p-4 sm:p-5">1 BHK Est.</th>
                      <th className="p-4 sm:p-5">2 BHK Est.</th>
                      <th className="p-4 sm:p-5">3 BHK Est.</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {interstateCorridors.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.corridor}
                          <span className="block text-xs font-normal text-text-muted mt-0.5">
                            {row.truckType}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted">
                          <span className="font-semibold text-text block">{row.distance}</span>
                          <span className="text-xs">{row.transit}</span>
                        </td>
                        <td className="p-4 sm:p-5 font-semibold text-text whitespace-nowrap">
                          {row.range1BHK}
                        </td>
                        <td className="p-4 sm:p-5 font-semibold text-text whitespace-nowrap">
                          {row.range2BHK}
                        </td>
                        <td className="p-4 sm:p-5 font-bold text-primary whitespace-nowrap">
                          {row.range3BHK}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to="/get-quote?scope=interstate"
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Lock Rate</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: Vehicle Transportation */}
            {activeTab === "vehicles" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Vehicle Category</th>
                      <th className="p-4 sm:p-5 hidden sm:table-cell">Transit Mode</th>
                      <th className="p-4 sm:p-5 hidden md:table-cell">Insurance Coverage</th>
                      <th className="p-4 sm:p-5">Local Transit</th>
                      <th className="p-4 sm:p-5 text-right">Interstate Transit</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {vehicleRates.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.vehicleType}
                          <span className="block text-xs font-normal text-text-muted sm:hidden mt-0.5">
                            {row.method}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden sm:table-cell">
                          {row.method}
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-xs">
                            <ShieldCheck size={14} />
                            {row.insurance}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 font-semibold text-text whitespace-nowrap">
                          {row.localRate}
                        </td>
                        <td className="p-4 sm:p-5 font-bold text-primary text-right whitespace-nowrap">
                          {row.interstateRate}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to={`/get-quote?service=${row.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Book</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: Add-ons & Standalone Services */}
            {activeTab === "addons" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-surface text-text font-display font-bold text-xs uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="p-4 sm:p-5">Service Description</th>
                      <th className="p-4 sm:p-5 hidden sm:table-cell">Details & Inclusions</th>
                      <th className="p-4 sm:p-5">Billing Unit</th>
                      <th className="p-4 sm:p-5 text-right">Standard Rate</th>
                      <th className="p-4 sm:p-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {addOnServices.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface/50 transition-colors">
                        <td className="p-4 sm:p-5 font-bold text-text">
                          {row.service}
                          <span className="block text-xs font-normal text-text-muted sm:hidden mt-0.5">
                            {row.description}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted hidden sm:table-cell">
                          {row.description}
                        </td>
                        <td className="p-4 sm:p-5 text-text-muted">
                          {row.unit}
                        </td>
                        <td className="p-4 sm:p-5 font-display font-bold text-primary text-right whitespace-nowrap">
                          {row.rate}
                        </td>
                        <td className="p-4 sm:p-5 text-center whitespace-nowrap">
                          <Link
                            to={`/get-quote?service=${row.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                          >
                            <span>Add</span>
                            <ArrowRight size={12} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

          <p className="text-xs text-text-muted mt-4">
            Note: All prices are starting estimates based on standard route conditions. Final quote is guaranteed in writing post physical or virtual survey.
          </p>

        </div>
      </section>

      {/* ── 5. "WHAT'S INCLUDED VS WHAT'S EXTRA" TRANSPARENCY CHECKLIST ── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
              <CheckCircle2 size={14} />
              <span>100% Bill Transparency</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              What Is Included In Every Quote vs. Optional Extras
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              We eliminate unexpected moving-day arguments by declaring every deliverable in writing before packing begins.
            </p>
          </div>

          <div className="max-w-4xl mx-auto bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
              
              {/* Left Column: Standard Inclusions */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 text-emerald-600 font-display font-bold text-base mb-6">
                  <CheckCircle2 size={20} />
                  <h3>Always Included As Standard</h3>
                </div>

                <ul className="space-y-4" role="list">
                  {inclusionsVsExtras
                    .filter((item) => item.included)
                    .map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/15 text-emerald-600 shrink-0 mt-0.5">
                          <Check size={13} strokeWidth={3} />
                        </span>
                        <div>
                          <strong className="text-text block font-semibold">{item.feature}</strong>
                          <span className="text-text-muted text-xs">{item.note}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Right Column: Quoted Separately */}
              <div className="p-6 sm:p-8 bg-background sm:bg-surface">
                <div className="flex items-center gap-2 text-text font-display font-bold text-base mb-6">
                  <Percent size={20} className="text-accent" />
                  <h3>Quoted Upfront / Optional Add-Ons</h3>
                </div>

                <ul className="space-y-4" role="list">
                  {inclusionsVsExtras
                    .filter((item) => !item.included)
                    .map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5 font-bold text-[11px]">
                          +
                        </span>
                        <div>
                          <strong className="text-text block font-semibold">{item.feature}</strong>
                          <span className="text-text-muted text-xs">{item.note}</span>
                        </div>
                      </li>
                    ))}
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 6. "WHY LOW-BALL COMPETITORS COST 3X MORE" ─────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-600 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldAlert size={14} />
              <span>Consumer Protection Notice</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              Beware of Low-Ball Estimates: The Hidden Cost Trap
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Unverified aggregators lure customers with a fake low quote, then extort money once your goods are inside their truck.
            </p>
          </div>

          {/* Clean Open Comparison Table (Zero Box Loop, Clean Enterprise Alignment) */}
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border text-text font-display font-bold">
                  <th className="py-3.5 pr-4 w-1/4">Cost Parameter</th>
                  <th className="py-3.5 px-4 w-3/8 text-primary font-bold">1st Om Binding Standards</th>
                  <th className="py-3.5 pl-4 w-3/8 text-text-muted">Informal Market Practice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {scamComparison.map((item, idx) => (
                  <tr key={idx} className="hover:bg-background/40 transition-colors">
                    <td className="py-4 pr-4 font-bold text-text align-top">
                      {item.aspect}
                    </td>
                    <td className="py-4 px-4 text-text font-medium align-top leading-relaxed">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={16} className="text-primary shrink-0 mt-0.5" />
                        <span>{item.firstOm}</span>
                      </div>
                    </td>
                    <td className="py-4 pl-4 text-text-muted align-top leading-relaxed">
                      {item.scam}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* ── 7. PRICING FAQS ACCORDION ─────────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <HelpCircle size={14} />
              <span>Transparent Answers</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              Frequently Asked Questions About Moving Prices
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Everything you need to know about quotes, insurance, and billing policies.
            </p>
          </div>

          <div className="space-y-3" role="list">
            {pricingFaqs.map((faq, idx) => {
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
                    <span>{faq.q}</span>
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
                          {faq.a}
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

      {/* ── 8. FINAL HIGH-CONVERTING BOTTOM CTA BANNER ──────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary/95 to-primary text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Zero Advance Required
            </span>
            <h2
              className="font-display font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Get Your Fixed, Binding Relocation Quote Today
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Schedule a free doorstep or video inventory check. We guarantee a written, all-inclusive price with zero hidden surprises.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/get-quote" size="lg" className="w-full sm:w-auto shadow-lg">
                Book Free Pre-Move Survey
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
                <Check size={14} className="text-accent" /> 100% Binding Written Quote
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Zero Moving-Day Demands
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Full GST Invoices
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
