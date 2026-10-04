import { useState } from "react";
import { Link } from "react-router";
import { Home, Building2, Car, Bike, Package, Boxes, Warehouse, ShieldCheck, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Home Shifting",
    category: "household",
    categoryLabel: "Residential",
    badge: "Household Moves",
    perk: "Packing, transport & delivery",
    ctaText: "Get Home Move Quote",
    tagline:
      "Packing, transport and delivery for your household belongings.",
    slug: "home-shifting",
    image: "/images/services/HomeShiftingServices.webp",
  },
  {
    icon: Building2,
    title: "Office Relocation",
    category: "commercial",
    categoryLabel: "Commercial",
    badge: "Business Moves",
    perk: "Furniture, equipment & files",
    ctaText: "Get Corporate Quote",
    tagline:
      "Plan your office move around equipment, access and business hours.",
    slug: "office-commercial-shifting",
    image: "/images/services/Office&CommercialShifting.webp",
  },
  {
    icon: Car,
    title: "Car Transportation",
    category: "vehicles",
    categoryLabel: "Automotive",
    badge: "Car Transport",
    perk: "Pickup, transport & delivery",
    ctaText: "Get Car Move Quote",
    tagline:
      "Discuss pickup, carrier options and delivery arrangements for your car’s destination.",
    slug: "car-transportation",
    image: "/images/services/CarTransportationServices.webp",
  },
  {
    icon: Bike,
    title: "Bike Transportation",
    category: "vehicles",
    categoryLabel: "Two-Wheeler",
    badge: "Two-Wheeler Moves",
    perk: "Packing, loading & transport",
    ctaText: "Get Bike Move Quote",
    tagline:
      "Packing and transport for your bike or scooter.",
    slug: "bike-transportation",
    image: "/images/services/Bike&Two-WheelerTransportation.webp",
  },
  {
    icon: Package,
    title: "Packing & Unpacking",
    category: "handling",
    categoryLabel: "Packaging",
    badge: "Packing Support",
    perk: "Fragile items & furniture",
    ctaText: "Book Packing Crew",
    tagline:
      "Packing support for furniture, boxes and fragile items.",
    slug: "packing-unpacking",
    image: "/images/services/Packing&UnpackingServices.webp",
  },
  {
    icon: Boxes,
    title: "Loading & Unloading",
    category: "handling",
    categoryLabel: "Ground Crew",
    badge: "Handling Support",
    perk: "Loading & unloading",
    ctaText: "Book Loading Crew",
    tagline:
      "Help with heavy items, packed boxes, loading and unloading.",
    slug: "loading-unloading",
    image: "/images/services/Loading&UnloadingServices.webp",
  },
  {
    icon: Warehouse,
    title: "Warehousing & Storage",
    category: "handling",
    categoryLabel: "Secure Storage",
    badge: "Storage Options",
    perk: "Space, duration & access",
    ctaText: "Check Storage Rates",
    tagline:
      "Discuss storage space, duration, access and availability.",
    slug: "warehousing-storage",
    image: "/images/services/Warehousing&SecureStorage.webp",
  },
  {
    icon: ShieldCheck,
    title: "Transit Insurance",
    category: "handling",
    categoryLabel: "Protection",
    badge: "Insurance Guidance",
    perk: "Coverage, terms & claims",
    ctaText: "Protect Your Shipment",
    tagline:
      "Understand available cover, exclusions and claim requirements.",
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

export default function ServicesGrid() {
  const [activeTab, setActiveTab] = useState("all");
  const filteredServices = activeTab === "all" ? services : activeTab === "household" ? services.filter((service) => ["household", "commercial"].includes(service.category)) : services.filter((service) => service.category === activeTab);
  return (
    <section className="bg-background py-12 sm:py-16" aria-labelledby="services-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 id="services-heading" className="font-display font-extrabold text-[clamp(1.8rem,3.3vw,2.8rem)] tracking-tight mb-3"><span className="text-primary">Moving services</span> for every kind of move.</h2>
        <p className="text-text-muted text-base max-w-2xl">A complete move or help with a few items. Choose your service.</p>
        <div className="flex gap-5 sm:gap-8 overflow-x-auto border-b border-border mt-7 mb-7" aria-label="Filter moving services">
          {categoryTabs.map((tab) => <button key={tab.id} type="button" aria-pressed={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} className={`min-h-12 shrink-0 border-b-2 text-sm font-semibold transition-colors ${activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-text-muted hover:text-text"}`}>{tab.label}</button>)}
        </div>
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7 sm:gap-6">
          {filteredServices.map((service) => (
            <li key={service.slug} className="flex flex-col">
              <Link to={`/services/${service.slug}`} className="block overflow-hidden rounded-lg bg-surface group">
                <img src={service.image} alt={service.title} className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-300" loading="lazy" width="640" height="480" />
              </Link>
              <h3 className="font-display font-bold text-base sm:text-lg mt-3 mb-2"><Link to={`/services/${service.slug}`} className="hover:text-primary">{service.title}</Link></h3>
              <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-2 flex-1">{service.tagline}</p>
              <Link to={`/get-quote?service=${service.slug}`} className="inline-flex items-center gap-2 min-h-11 text-primary hover:underline font-semibold text-sm self-start">Get a quote<ArrowRight size={16} aria-hidden="true" /></Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
