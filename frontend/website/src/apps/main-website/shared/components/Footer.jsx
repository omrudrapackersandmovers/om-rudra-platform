import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Mail,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  Clock,
  Heart,
} from "lucide-react";
import { company } from "../../../../data/company";

const trustItems = [
  { icon: ShieldCheck, text: "100% Full Transit Insurance" },
  { icon: Truck, text: "Dedicated Closed GPS Fleet" },
  { icon: CheckCircle2, text: "Verified Full-Time Crew" },
  { icon: Clock, text: "24/7 Live Shifting Assistance" },
  { icon: MapPin, text: "50+ Direct Hubs Nationwide" },
  { icon: ShieldCheck, text: "Zero Co-Loading Guarantee" },
  { icon: Truck, text: "Door-to-Door Sanitized Packing" },
  { icon: CheckCircle2, text: "Fixed Written Estimates" },
];

const serviceLinks = [
  { label: "Home Shifting", to: "/services/home-shifting" },
  { label: "Office & Commercial Shifting", to: "/services/office-commercial-shifting" },
  { label: "Car Transportation", to: "/services/car-transportation" },
  { label: "Bike Transportation", to: "/services/bike-transportation" },
  { label: "Packing & Unpacking", to: "/services/packing-unpacking" },
  { label: "Loading & Unloading", to: "/services/loading-unloading" },
  { label: "Warehousing & Storage", to: "/services/warehousing-storage" },
  { label: "Goods Transit Insurance", to: "/services/goods-insurance" },
];

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "Pricing & Estimates", to: "/pricing" },
  { label: "Where We Serve", to: "/where-we-serve" },
  { label: "Get a Free Quote", to: "/get-quote" },
  { label: "Contact Us", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const popularRoutes = [
  { label: "Patna to Delhi", to: "/route/patna-to-delhi" },
  { label: "Patna to Kolkata", to: "/route/patna-to-kolkata" },
  { label: "Patna to Ranchi", to: "/route/patna-to-ranchi" },
  { label: "Patna to Mumbai", to: "/route/patna-to-mumbai" },
  { label: "Ranchi to Delhi", to: "/route/ranchi-to-delhi" },
  { label: "Jamshedpur to Kolkata", to: "/route/jamshedpur-to-kolkata" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const cleanLegalName = (company.legalName || "").replace(/\.+$/, "");

  return (
    <footer className="bg-primary text-primary-foreground relative" role="contentinfo">

      {/* ── Marquee Trust Standards Strip ─────────────────────────── */}
      <div className="border-b border-primary-foreground/10 py-4.5 overflow-hidden relative select-none bg-black/15">
        {/* Edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex items-center gap-12 whitespace-nowrap w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
        >
          {[...trustItems, ...trustItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-primary-foreground/90 tracking-wide">
                <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0 shadow-xs">
                  <Icon size={14} strokeWidth={2.2} />
                </div>
                <span>{item.text}</span>
                <span className="text-primary-foreground/25 ml-6">•</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Main Footer Columns ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10 xl:gap-14">

          {/* Column 1: Brand & Unified Contact Group (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4">

            {/* Prominent, large brand logo taking full commanding presence */}
            <Link
              to="/"
              className="block mb-8 focus:outline-none"
              aria-label={`${company.brandName}, return to homepage`}
            >
              <img
                src={company.logo.reverse}
                alt={company.brandName}
                className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[390px] h-auto object-contain -ml-1"
              />
            </Link>

            {/* Unified Contact Information Group - Clean Natural Flow without Box */}
            <address className="not-italic w-full max-w-sm space-y-4 text-sm">
              {company.headOffice.addressLine && (
                <div className="flex items-start gap-3.5 text-primary-foreground/85">
                  <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {company.headOffice.addressLine}, {company.headOffice.city}, {company.headOffice.state} {company.headOffice.pincode}
                  </span>
                </div>
              )}

              {company.phone.primary && (
                <div className="flex items-center gap-3.5">
                  <PhoneCall size={18} className="text-accent shrink-0" />
                  <a
                    href={`tel:${company.phone.primary}`}
                    className="font-bold text-white hover:text-accent transition-colors"
                  >
                    {company.phone.primary}
                  </a>
                </div>
              )}

              {company.email.general && (
                <div className="flex items-center gap-3.5">
                  <Mail size={18} className="text-accent shrink-0" />
                  <a
                    href={`mailto:${company.email.general}`}
                    className="text-primary-foreground/85 hover:text-accent transition-colors"
                  >
                    {company.email.general}
                  </a>
                </div>
              )}
            </address>

          </div>

          {/* Column 2: Our Services (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-8">
              <span className="w-1 h-5 rounded-full bg-accent shrink-0" />
              <h3 className="font-display font-extrabold text-base text-white tracking-wide uppercase whitespace-nowrap">
                Our Services
              </h3>
            </div>
            <ul className="space-y-4 text-sm" role="list">
              {serviceLinks.map((link) => (
                 <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group/link flex items-center gap-2.5 text-primary-foreground/75 hover:text-white transition-all duration-200 text-sm py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/link:bg-accent group-hover/link:scale-125 transition-all duration-200 shrink-0" />
                    <span className="group-hover/link:translate-x-1.5 transition-transform duration-200 font-medium">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-8">
              <span className="w-1 h-5 rounded-full bg-accent shrink-0" />
              <h3 className="font-display font-extrabold text-base text-white tracking-wide uppercase whitespace-nowrap">
                Quick Links
              </h3>
            </div>
            <ul className="space-y-4 text-sm" role="list">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group/link flex items-center gap-2.5 text-primary-foreground/75 hover:text-white transition-all duration-200 text-sm py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/link:bg-accent group-hover/link:scale-125 transition-all duration-200 shrink-0" />
                    <span className="group-hover/link:translate-x-1.5 transition-transform duration-200 font-medium">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Popular Routes (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-8">
              <span className="w-1 h-5 rounded-full bg-accent shrink-0" />
              <h3 className="font-display font-extrabold text-base text-white tracking-wide uppercase whitespace-nowrap">
                Popular Routes
              </h3>
            </div>
            <ul className="space-y-4 text-sm" role="list">
              {popularRoutes.map((route) => (
                <li key={route.to}>
                  <Link
                    to={route.to}
                    className="group/link flex items-center gap-2.5 text-primary-foreground/75 hover:text-white transition-all duration-200 text-sm py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover/link:bg-accent group-hover/link:scale-125 transition-all duration-200 shrink-0" />
                    <span className="group-hover/link:translate-x-1.5 transition-transform duration-200 font-medium">
                      {route.label}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/where-we-serve"
                  className="group/all inline-flex items-center gap-2 text-xs font-bold text-accent hover:text-white transition-colors py-1 pl-4"
                >
                  <span className="group-hover/all:translate-x-1 transition-transform">Explore all 30+ corridors</span>
                  <ArrowRight size={13} className="group-hover/all:translate-x-1.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────────── */}
      <div className="border-t border-primary-foreground/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-4">
          <p className="text-xs text-primary-foreground/60 text-center sm:text-left leading-relaxed">
            &copy; {currentYear} {cleanLegalName}. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-xs text-primary-foreground/70">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/privacy"
                className="whitespace-nowrap text-primary-foreground/70 hover:text-accent hover:underline underline-offset-4 transition-colors duration-200 cursor-pointer"
              >
                Privacy Policy
              </Link>
              <span className="text-primary-foreground/30 select-none">•</span>
              <Link
                to="/terms"
                className="whitespace-nowrap text-primary-foreground/70 hover:text-accent hover:underline underline-offset-4 transition-colors duration-200 cursor-pointer"
              >
                Terms of Service
              </Link>
            </div>

            <span className="hidden sm:inline text-primary-foreground/30 select-none">•</span>

            <a
              href="https://unyrisetech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group/credit whitespace-nowrap inline-flex items-center gap-1.5 text-primary-foreground/80 hover:text-accent transition-colors duration-200 cursor-pointer"
            >
              <span>Made with</span>
              <span className="inline-flex items-center justify-center shrink-0 w-4 h-4 mx-0.5" aria-label="love">
                <Heart size={14} className="text-red-500 fill-red-500 animate-heartbeat group-hover/credit:scale-125 transition-transform duration-200" />
              </span>
              <span>
                by <span className="font-semibold text-white group-hover/credit:text-accent group-hover/credit:underline underline-offset-4 transition-colors duration-200">Unyrise Tech</span>
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom spacer for Mobile Action Bar */}
      <div className="md:hidden h-20" aria-hidden="true" />
    </footer>
  );
};

export default Footer;
