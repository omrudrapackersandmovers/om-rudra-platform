import { responsiveImageSet } from "../../../../../utils/responsiveImages";
import { useState } from "react";
import { Link } from "react-router";
import { MapPin, ArrowRight } from "lucide-react";
import { locationsByState, placeImages } from "../../../../../data/locations/index";

const STATE_CARDS = [
  {
    state: "Bihar",
    mainHub: "Patna",
    image: placeImages["Bihar"],
    cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"],
  },
  {
    state: "Jharkhand",
    mainHub: "Ranchi & Jamshedpur",
    image: placeImages["Jharkhand"],
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
  },
  {
    state: "Uttar Pradesh",
    mainHub: "Lucknow & Varanasi",
    image: placeImages["Uttar Pradesh"],
    cities: ["Varanasi", "Lucknow", "Prayagraj", "Kanpur", "Gorakhpur", "Agra"],
  },
  {
    state: "Delhi NCR",
    mainHub: "Delhi & Noida",
    image: placeImages["Delhi NCR"],
    cities: ["Delhi", "Noida", "Greater Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
  },
  {
    state: "West Bengal",
    mainHub: "Kolkata & Siliguri",
    image: placeImages["West Bengal"],
    cities: ["Kolkata", "Siliguri", "Asansol", "Durgapur", "Howrah", "Kharagpur"],
  },
  {
    state: "Maharashtra",
    mainHub: "Mumbai & Pune",
    image: placeImages["Maharashtra"],
    cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Navi Mumbai", "Nashik"],
  },
];

// 6 Top Interstate Routes - creates exactly 2 full rows on desktop (3 x 2)
const FEATURED_ROUTES = [
  {
    slug: "patna-to-delhi",
    from: "Patna",
    to: "Delhi NCR",
    originHub: "Interstate moving",
    distanceKm: 1000,
    serviceType: "Check availability",
  },
  {
    slug: "patna-to-kolkata",
    from: "Patna",
    to: "Kolkata",
    originHub: "Interstate moving",
    distanceKm: 581,
    serviceType: "Check availability",
  },
  {
    slug: "patna-to-ranchi",
    from: "Patna",
    to: "Ranchi",
    originHub: "Interstate moving",
    distanceKm: 341,
    serviceType: "Check availability",
  },
  {
    slug: "patna-to-mumbai",
    from: "Patna",
    to: "Mumbai",
    originHub: "Interstate moving",
    distanceKm: 1874,
    serviceType: "Check availability",
  },
  {
    slug: "ranchi-to-delhi",
    from: "Ranchi",
    to: "Delhi NCR",
    originHub: "Interstate moving",
    distanceKm: 1280,
    serviceType: "Check availability",
  },
  {
    slug: "jamshedpur-to-kolkata",
    from: "Jamshedpur",
    to: "Kolkata",
    originHub: "Interstate moving",
    distanceKm: 270,
    serviceType: "Check availability",
  },
];

const filters = ["All regions", "Bihar", "Jharkhand", "Uttar Pradesh", "Delhi NCR", "West Bengal", "Maharashtra"];

export default function LocationsSnapshot() {
  const [activeRegion, setActiveRegion] = useState("All regions");
  const visibleRegions = activeRegion === "All regions" ? STATE_CARDS : STATE_CARDS.filter((item) => item.state === activeRegion);
  function getCityLink(state, name) {
    const location = (locationsByState[state] || []).find((item) => item.name.toLowerCase() === name.toLowerCase());
    return location ? `/packers-movers-${location.slug}` : "/where-we-serve";
  }
  return (
    <section className="bg-background py-12 sm:py-16" aria-labelledby="locations-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div><h2 id="locations-heading" className="font-display font-extrabold text-[clamp(1.8rem,3.3vw,2.8rem)] tracking-tight mb-3"><span className="text-primary">A new city.</span> The same moving team.</h2><p className="text-base text-text-muted max-w-2xl">Explore your destination and ask us about availability for your route.</p></div>
          <Link to="/where-we-serve" className="inline-flex items-center gap-2 min-h-11 text-sm text-primary font-semibold shrink-0 hover:underline">All locations<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className="flex gap-6 overflow-x-auto border-b border-border mt-7 mb-8" aria-label="Filter service regions">
          {filters.map((region) => <button key={region} type="button" aria-pressed={activeRegion === region} onClick={() => setActiveRegion(region)} className={`shrink-0 inline-flex items-center gap-2 min-h-12 border-b-2 text-sm font-semibold ${activeRegion === region ? "text-primary border-primary" : "text-text-muted border-transparent hover:text-text"}`}><MapPin size={16} aria-hidden="true" />{region}</button>)}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visibleRegions.map((item) => (
            <article key={item.state} className="relative rounded-lg overflow-hidden bg-hero-overlay min-h-[260px] sm:min-h-[320px] flex flex-col justify-end isolate">
              <img src={item.image} srcSet={responsiveImageSet(item.image)} sizes="(min-width: 1024px) 400px, 50vw" alt={`Moving destinations in ${item.state}`} className="absolute inset-0 -z-20 w-full h-full object-cover" loading="lazy" width="640" height="480" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-hero-overlay/95 via-hero-overlay/25 to-transparent" />
              <div className="p-3 sm:p-6"><h3 className="font-display text-white font-bold text-lg sm:text-2xl mb-2">{item.state}</h3><ul className="flex flex-wrap gap-x-3 gap-y-0">{item.cities.slice(0,4).map((city, index) => <li key={city} className={index > 1 ? "hidden sm:block" : ""}><Link to={getCityLink(item.state,city)} className="inline-flex min-h-11 items-center text-white text-sm underline decoration-white/40 underline-offset-4 hover:decoration-white">{city}</Link></li>)}</ul></div>
            </article>
          ))}
        </div>
        <div className="mt-12 sm:mt-16">
          <h3 className="font-display font-bold text-xl sm:text-2xl mb-5">Popular interstate routes</h3>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">{FEATURED_ROUTES.map((route) => <li key={route.slug}><Link to={`/route/${route.slug}`} className="flex items-center justify-between gap-3 min-h-14 py-3 border-b border-border text-sm font-semibold hover:text-primary"><span>{route.from} to {route.to}</span><ArrowRight size={17} className="text-primary" aria-hidden="true" /></Link></li>)}</ul>
        </div>
      </div>
    </section>
  );
}
