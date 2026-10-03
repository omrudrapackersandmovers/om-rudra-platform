import { Link } from "react-router";
import {
  Home,
  Search,
  PhoneCall,
  MessageCircle,
  Truck,
  Car,
  Calculator,
  MapPin,
  ChevronRight,
  ArrowRight,
  Compass,
} from "lucide-react";
import { company } from "@/data/company";
import SEO from "@/configs/seo";
import Button from "./Button";

const quickLinks = [
  {
    title: "Household Shifting",
    desc: "5-layer packing with dedicated closed trucks",
    url: "/services/home-shifting",
    icon: Home,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Car Transportation",
    desc: "Enclosed hydraulic vehicle carrier trailers",
    url: "/services/car-transportation",
    icon: Car,
    color: "text-accent",
    bg: "bg-accent/20",
  },
  {
    title: "Transparent Pricing",
    desc: "1 BHK, 2 BHK, 3 BHK & car shifting rate cards",
    url: "/pricing",
    icon: Calculator,
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  {
    title: "Where We Serve",
    desc: "Coverage map across 100+ cities and hubs",
    url: "/where-we-serve",
    icon: MapPin,
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
];

const popularRoutes = [
  { label: "Patna to Delhi", url: "/route/patna-to-delhi" },
  { label: "Patna to Bengaluru", url: "/route/patna-to-bengaluru" },
  { label: "Patna to Kolkata", url: "/route/patna-to-kolkata" },
  { label: "Patna to Mumbai", url: "/route/patna-to-mumbai" },
  { label: "Patna to Hyderabad", url: "/route/patna-to-hyderabad" },
  { label: "Ranchi to Delhi", url: "/route/ranchi-to-delhi" },
];

const NotFound = () => {
  const whatsappUrl = company.phone.whatsapp
    ? `https://wa.me/91${company.phone.whatsapp.replace(/\D/g, "")}?text=Hi%2C%20I%20hit%20a%20broken%20page%20on%20your%20website%20and%20need%20moving%20help.`
    : "#";

  return (
    <>
      <SEO
        title="404 - Page Not Found | 1st Om Packers and Movers"
        description="The relocation page you were looking for doesn't exist or has moved. Explore our household shifting, vehicle carrier, pricing, or nationwide locations."
      />

      {/* ── 1. HERO & 404 SPOTLIGHT ──────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden text-center">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="flex justify-center mb-6">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted" role="list">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={13} /></li>
              <li>
                <span className="text-text font-semibold">404 Error</span>
              </li>
            </ol>
          </nav>

          {/* Large Stylized 404 Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300/80 text-amber-950 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Compass size={14} className="text-amber-800" />
            <span>Route Uncharted - 404 Not Found</span>
          </div>

          <h1
            className="font-display font-extrabold text-text tracking-tight mb-4"
            style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.1 }}
          >
            Lost in Transit?
          </h1>

          <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-8">
            The page or relocation link you were navigating to does not exist on our freight map. Let us guide you back to safety.
          </p>

          {/* Harmonized Button Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              to="/"
              variant="accent"
              size="md"
              icon={<Home size={16} />}
              showArrow={false}
            >
              Back to Home
            </Button>

            <Button
              to="/search"
              variant="outline"
              size="md"
              icon={<Search size={16} />}
              showArrow={false}
            >
              Search Directory
            </Button>

            {company.phone.primary && (
              <Button
                href={`tel:${company.phone.primary}`}
                variant="outline"
                size="md"
                icon={<PhoneCall size={16} className="text-primary" />}
                showArrow={false}
              >
                Call Helpline
              </Button>
            )}

            <Button
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="md"
              icon={<MessageCircle size={16} className="text-success" />}
              showArrow={false}
            >
              WhatsApp Us
            </Button>
          </div>
        </div>
      </section>

      {/* ── 2. QUICK RECOVERY DIRECTORY ──────────────────────────────── */}
      <section className="bg-background py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-text">
              Popular Relocation Destinations
            </h2>
            <p className="text-xs sm:text-sm text-text-muted">
              Here are the most visited sections of our website to help you resume your move
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {quickLinks.map((item) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className="group p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <ItemIcon size={22} />
                    </div>
                    <h3 className="font-display font-bold text-base text-text group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between text-xs font-bold text-primary">
                    <span>Explore Section</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Popular Interstate Corridors */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-border/80">
              <div className="flex items-center gap-2">
                <Truck size={18} className="text-primary" />
                <h3 className="font-display font-bold text-sm sm:text-base text-text">
                  Direct Interstate Relocation Corridors
                </h3>
              </div>
              <Link to="/where-we-serve" className="text-xs font-bold text-primary hover:underline">
                View All National Routes →
              </Link>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-1">
              {popularRoutes.map((route) => (
                <Link
                  key={route.label}
                  to={route.url}
                  className="px-3.5 py-2 rounded-xl bg-background border border-border hover:border-primary/50 text-xs font-semibold text-text hover:text-primary transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>{route.label}</span>
                  <ArrowRight size={12} className="text-text-muted" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BOTTOM HELPLINE STRIP ─────────────────────────────────── */}
      <section className="bg-surface py-10 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-text text-base sm:text-lg mb-1">
                Need Assistance Finding a Specific Booking or Invoice?
              </h3>
              <p className="text-xs sm:text-sm text-text-muted">
                Our central dispatch operations team is available 24/7 to resolve any navigation or booking inquiry.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-display font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-sm"
                >
                  <PhoneCall size={15} />
                  <span>Call {company.phone.primary}</span>
                </a>
              )}
              <Button to="/contact" variant="outline" size="sm">
                Contact Directory
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
