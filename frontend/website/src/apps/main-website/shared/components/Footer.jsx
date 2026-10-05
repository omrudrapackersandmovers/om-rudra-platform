import { responsiveImageSet } from "../../../../utils/responsiveImages";
import { Link } from "react-router";
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
import { FaInstagram, FaYoutube, FaXTwitter, FaPinterestP, FaThreads } from "react-icons/fa6";

const socialLinks = [
  { key: "instagram", label: "Instagram", icon: FaInstagram },
  { key: "youtube", label: "YouTube", icon: FaYoutube },
  { key: "x", label: "X", icon: FaXTwitter },
  { key: "pinterest", label: "Pinterest", icon: FaPinterestP },
  { key: "threads", label: "Threads", icon: FaThreads },
];

const trustItems = [
  { icon: ShieldCheck, text: "Ask About Transit Insurance" },
  { icon: Truck, text: "Home & Office Relocation" },
  { icon: CheckCircle2, text: "Packing & Handling Support" },
  { icon: Clock, text: "Call Our Moving Team" },
  { icon: MapPin, text: "Explore Service Locations" },
  { icon: ShieldCheck, text: "Discuss Vehicle Arrangements" },
  { icon: Truck, text: "Car & Bike Transport" },
  { icon: CheckCircle2, text: "Request a Moving Quote" },
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
    <footer className="bg-[#252326] text-white relative border-t border-white/10" role="contentinfo">

      {/* ── Marquee Trust Standards Strip ─────────────────────────── */}
      <div className="border-y border-white/10 py-5 overflow-hidden relative select-none bg-[#302c30]">
        {/* Edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#302c30] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#302c30] to-transparent z-10 pointer-events-none" />

        <div
          className="footer-trust-strip flex items-center gap-12 whitespace-nowrap w-max"
        >
          {[...trustItems, ...trustItems].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-white/85 tracking-wide">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center text-rose-400 shrink-0 shadow-xs">
                  <Icon size={14} strokeWidth={2.2} />
                </div>
                <span>{item.text}</span>
                <span className="text-white/25 ml-6">•</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Main Footer Columns ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-9 lg:gap-8 xl:gap-10">

          {/* Column 1: Brand & Unified Contact Group (lg:col-span-4) */}
          <div className="col-span-2 lg:col-span-4 flex flex-col items-start pr-0 lg:pr-4">

            {/* Prominent, large brand logo taking full commanding presence */}
            <Link
              to="/"
              className="block mb-5"
              aria-label={`${company.brandName}, return to homepage`}
            >
              <img
                width="416" height="208" loading="lazy" src={company.logo.reverse} srcSet={responsiveImageSet(company.logo.reverse)} sizes="208px"
                alt={company.brandName}
                className="w-48 sm:w-52 h-auto object-contain"
              />
            </Link>

            <p className="font-display font-semibold text-sm text-white leading-relaxed mb-5">{cleanLegalName}</p>

            {/* Unified Contact Information Group - Clean Natural Flow without Box */}
            <address className="not-italic w-full max-w-sm space-y-4 text-sm">
              {company.headOffice.addressLine && (
                <div className="flex items-start gap-3.5 text-white/70">
                  <MapPin size={18} className="text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    {company.headOffice.addressLine}, {company.headOffice.city}, {company.headOffice.state} {company.headOffice.pincode}
                  </span>
                </div>
              )}

              {company.phone.primary && (
                <div className="flex items-center gap-3.5">
                  <PhoneCall size={18} className="text-rose-400 shrink-0" />
                  <a
                    href={`tel:${company.phone.primary.replace(/[^+\d]/g, "")}`}
                    className="font-bold text-white hover:text-white transition-colors"
                  >
                    {company.phone.primary}
                  </a>
                </div>
              )}

              {company.email.general && (
                <div className="flex items-center gap-3.5">
                  <Mail size={18} className="text-rose-400 shrink-0" />
                  <a
                    href={`mailto:${company.email.general}`}
                    className="min-w-0 break-all text-white/70 hover:text-white transition-colors"
                  >
                    {company.email.general}
                  </a>
                </div>
              )}
            </address>
            <nav aria-label="Social accounts" className="flex flex-wrap gap-2 mt-6">
              {socialLinks.filter(item => company.socials[item.key]).map(({ key, label, icon: Icon }) => (
                <a key={key} href={company.socials[key]} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${company.brandName} on ${label} (opens in a new tab)`} title={label} className="inline-flex items-center justify-center w-11 h-11 rounded-[var(--radius-md)] border border-white/20 text-white/85 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <Icon size={19} aria-hidden="true" />
                </a>
              ))}
            </nav>

          </div>

          {/* Column 2: Our Services (lg:col-span-3) */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1 h-5 rounded-full bg-accent shrink-0" />
              <h3 className="font-display font-bold text-sm text-white tracking-wide uppercase">
                Our Services
              </h3>
            </div>
            <ul className="space-y-0 text-sm" role="list">
              {serviceLinks.map((link) => (
                 <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group/link flex items-center gap-2.5 text-white/70 hover:text-white transition-all duration-200 text-sm min-h-11 py-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/link:bg-rose-400 group-hover/link:scale-125 transition-all duration-200 shrink-0" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-200 font-medium">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1 h-5 rounded-full bg-accent shrink-0" />
              <h3 className="font-display font-bold text-sm text-white tracking-wide uppercase">
                Quick Links
              </h3>
            </div>
            <ul className="space-y-0 text-sm" role="list">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="group/link flex items-center gap-2.5 text-white/70 hover:text-white transition-all duration-200 text-sm min-h-11 py-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/link:bg-rose-400 group-hover/link:scale-125 transition-all duration-200 shrink-0" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-200 font-medium">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Popular Routes (lg:col-span-3) */}
          <div className="col-span-2 lg:col-span-3">
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1 h-5 rounded-full bg-accent shrink-0" />
              <h3 className="font-display font-bold text-sm text-white tracking-wide uppercase">
                Popular Routes
              </h3>
            </div>
            <ul className="space-y-0 text-sm" role="list">
              {popularRoutes.map((route) => (
                <li key={route.to}>
                  <Link
                    to={route.to}
                    className="group/link flex items-center gap-2.5 text-white/70 hover:text-white transition-all duration-200 text-sm min-h-11 py-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover/link:bg-rose-400 group-hover/link:scale-125 transition-all duration-200 shrink-0" />
                    <span className="group-hover/link:translate-x-0.5 transition-transform duration-200 font-medium">
                      {route.label}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  to="/where-we-serve"
                  className="group/all inline-flex items-center gap-2 text-xs font-bold text-rose-300 hover:text-white transition-colors py-1 pl-4"
                >
                  <span className="group-hover/all:translate-x-1 transition-transform">Explore all routes</span>
                  <ArrowRight size={13} className="group-hover/all:translate-x-1.5 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────────── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-4">
          <p className="text-xs text-white/70 text-center sm:text-left leading-relaxed">
            &copy; {currentYear} {cleanLegalName}. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-xs text-white/70">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                to="/privacy"
                className="whitespace-nowrap text-white/70 hover:text-white hover:underline underline-offset-4 transition-colors duration-200 cursor-pointer"
              >
                Privacy Policy
              </Link>
              <span className="text-white/30 select-none">•</span>
              <Link
                to="/terms"
                className="whitespace-nowrap text-white/70 hover:text-white hover:underline underline-offset-4 transition-colors duration-200 cursor-pointer"
              >
                Terms of Service
              </Link>
            </div>

            <span className="hidden sm:inline text-white/30 select-none">•</span>

            <a
              href="https://unyrisetech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group/credit whitespace-nowrap inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors duration-200 cursor-pointer"
            >
              <span>Made with</span>
              <span className="inline-flex items-center justify-center shrink-0 w-4 h-4 mx-0.5" aria-label="love">
                <Heart size={14} className="text-red-500 fill-red-500 group-hover/credit:scale-125 transition-transform duration-200" />
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
