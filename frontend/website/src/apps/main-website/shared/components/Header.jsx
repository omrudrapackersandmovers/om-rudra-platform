import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  Home,
  Building2,
  Car,
  Bike,
  Package,
  Boxes,
  Warehouse,
  ShieldCheck,
  ArrowRight,
  MessageCircle,
  Search,
  CheckCircle2,
} from "lucide-react";
import { company } from "@/data/company";
import Button from "./Button";
import GlobalSearchModal from "@/components/search/GlobalSearchModal";

const servicesList = [
  {
    icon: Home,
    title: "Home Shifting",
    desc: "Household moving with dedicated closed trucks",
    slug: "home-shifting",
  },
  {
    icon: Building2,
    title: "Office Relocation",
    desc: "Zero-downtime weekend corporate moves",
    slug: "office-commercial-shifting",
  },
  {
    icon: Car,
    title: "Car Transportation",
    desc: "Enclosed covered trailers with zero road-driving",
    slug: "car-transportation",
  },
  {
    icon: Bike,
    title: "Bike Moving",
    desc: "Reinforced wooden crating & secure harness",
    slug: "bike-transportation",
  },
  {
    icon: Package,
    title: "Packing & Unpacking",
    desc: "5-ply corrugated boxes & multi-layer bubble wrap",
    slug: "packing-unpacking",
  },
  {
    icon: Boxes,
    title: "Loading & Unloading",
    desc: "Full-time crew with hydraulic equipment",
    slug: "loading-unloading",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Storage",
    desc: "24/7 guarded, pest-controlled storage bays",
    slug: "warehousing-storage",
  },
  {
    icon: ShieldCheck,
    title: "Transit Insurance",
    desc: "100% declared value protection policy",
    slug: "goods-insurance",
  },
];

const navLinks = [
  { label: "Pricing", to: "/pricing" },
  { label: "Where We Serve", to: "/where-we-serve" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setSearchModalOpen(false);
  }, [location.pathname]);

  // Global keyboard shortcut for Ctrl+K / Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click outside to close services dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20need%20a%20moving%20quote.`
    : "#";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-[0_4px_25px_rgba(10,25,50,0.06)] border-b border-border/80"
          : "bg-background/85 backdrop-blur-md border-b border-border/50"
      }`}
    >
      {/* ── Main Navigation Bar ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Zone 1: Brand Logo */}
          <Link
            to="/"
            className="flex items-center shrink-0 py-1 focus:outline-none transition-transform duration-200 hover:scale-[1.02]"
            aria-label={`${company.brandName}, return to homepage`}
          >
            <img
              src={company.logo.horizontal}
              alt={company.brandName}
              className="h-8 sm:h-9 lg:h-10 w-auto object-contain"
            />
          </Link>

          {/* Zone 2: Desktop Nav Links Enclosed in Airy Frosted Capsule */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 p-1 rounded-full bg-surface/60 border border-border/50 backdrop-blur-xs"
            aria-label="Primary navigation"
          >
            {/* Services Dropdown Button */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-medium transition-all cursor-pointer ${
                  servicesOpen || location.pathname.startsWith("/services")
                    ? "text-primary bg-background shadow-xs font-bold"
                    : "text-text-muted hover:text-text hover:bg-background/50"
                }`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    servicesOpen ? "rotate-180 text-primary" : "text-text-muted"
                  }`}
                />
              </button>

              {/* Services Mega Dropdown Panel */}
              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[580px] z-50">
                  <div className="bg-background/98 backdrop-blur-xl rounded-2xl border border-border shadow-[0_20px_50px_rgba(10,25,50,0.12)] p-5 overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
                    
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                        Our Specialized Relocation Services
                      </span>
                      <Link
                        to="/services"
                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        onClick={() => setServicesOpen(false)}
                      >
                        <span>View all services</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {servicesList.map((svc) => {
                        const SvcIcon = svc.icon;
                        return (
                          <Link
                            key={svc.slug}
                            to={`/services/${svc.slug}`}
                            onClick={() => setServicesOpen(false)}
                            className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-surface transition-all"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center shrink-0 transition-colors mt-0.5">
                              <SvcIcon size={16} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-text group-hover:text-primary transition-colors">
                                {svc.title}
                              </p>
                              <p className="text-[11px] text-text-muted leading-tight line-clamp-1 mt-0.5">
                                {svc.desc}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Bottom reassurance strip */}
                    <div className="mt-3 pt-3 border-t border-border bg-surface/60 -mx-5 -mb-5 px-5 py-2.5 flex items-center justify-between text-[11px] text-text-muted">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 size={13} className="text-primary shrink-0" />
                        100% Dedicated Closed Trucks
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 size={13} className="text-primary shrink-0" />
                        Binding Written Quote
                      </span>
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle2 size={13} className="text-primary shrink-0" />
                        Transit Insurance
                      </span>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? "text-primary bg-background shadow-xs font-bold"
                      : "text-text-muted hover:text-text hover:bg-background/50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Zone 3: Desktop Right Actions Cluster (Utility + Divider + Primary Hero CTA) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Minimalist Search Trigger */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-border/70 bg-surface/70 hover:bg-surface hover:border-primary/40 text-xs font-medium text-text-muted hover:text-text transition-all shadow-2xs cursor-pointer group"
              aria-label="Search site (Ctrl+K)"
            >
              <Search size={14} className="text-text-muted group-hover:text-primary transition-colors" />
              <span className="hidden xl:inline text-xs font-medium text-text-muted group-hover:text-text transition-colors">Search</span>
              <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-background border border-border text-text-muted/80">
                ⌘K
              </kbd>
            </button>

            {/* Hairline Separator */}
            <div className="hidden xl:block w-px h-5 bg-border/80 mx-0.5 shrink-0" />

            {/* Helpline Unit with Live Pulse Status */}
            {company.phone.primary && (
              <a
                href={`tel:${company.phone.primary}`}
                className="hidden xl:inline-flex items-center gap-2 text-xs font-semibold text-text hover:text-primary transition-colors group px-2 py-1 rounded-full hover:bg-surface"
                aria-label={`Call helpline: ${company.phone.primary}`}
              >
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                  <PhoneCall size={12} />
                </span>
                <span className="flex flex-col text-left">
                  <span className="text-[9px] uppercase tracking-wider font-bold text-text-muted leading-none">
                    Helpline
                  </span>
                  <span className="font-mono text-xs font-bold text-text group-hover:text-primary transition-colors mt-0.5 leading-none">
                    {company.phone.primary}
                  </span>
                </span>
              </a>
            )}

            {/* Primary Action Button */}
            <Button
              to="/get-quote"
              size="sm"
              className="shadow-xs hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get a Free Quote
            </Button>
          </div>

          {/* Mobile Right Controls: Search + Phone + Menu toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-surface border border-border/80 text-text hover:text-primary transition-colors cursor-pointer"
              aria-label="Search site"
            >
              <Search size={16} />
            </button>

            {company.phone.primary && (
              <a
                href={`tel:${company.phone.primary}`}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-colors"
                aria-label="Call helpline"
              >
                <PhoneCall size={15} />
              </a>
            )}

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-surface border border-border/80 text-text hover:bg-background transition-colors"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>
      </div>

      {/* ── Mobile Slide-down Menu ──────────────────────────────── */}
      {menuOpen && (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-border bg-background shadow-xl max-h-[85vh] overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-2">
            
            {/* Mobile Search Quick Trigger */}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs text-text-muted font-medium mb-1 text-left hover:border-primary/40 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Search size={15} className="text-primary" />
                <span>Search services, cities, routes...</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                Search
              </span>
            </button>

            {/* Direct Quick Actions Bar */}
            <div className="grid grid-cols-2 gap-2 pb-3 mb-2 border-b border-border">
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface border border-border text-text text-xs font-bold"
                >
                  <PhoneCall size={14} className="text-primary" />
                  <span>Call Helpline</span>
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-surface border border-border text-text text-xs font-bold"
              >
                <MessageCircle size={14} className="text-success" />
                <span>WhatsApp Us</span>
              </a>
            </div>

            {/* Mobile Nav Links */}
            <NavLink
              to="/services"
              onClick={() => setMenuOpen(false)}
              className="px-3.5 py-2.5 rounded-lg text-sm font-bold text-text hover:bg-surface flex items-center justify-between"
            >
              <span>Services Directory</span>
              <ArrowRight size={15} className="text-text-muted" />
            </NavLink>

            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? "text-primary bg-surface font-bold"
                      : "text-text hover:bg-surface"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Quote CTA Button */}
            <div className="pt-3 border-t border-border mt-2">
              <Button
                to="/get-quote"
                onClick={() => setMenuOpen(false)}
                className="w-full"
                size="md"
              >
                Get a Free Quote
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  );
};

export default Header;
