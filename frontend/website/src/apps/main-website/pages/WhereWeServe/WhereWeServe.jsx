import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronRight, MapPin, Search, PhoneCall, Plus, Minus } from "lucide-react";
import { allServiceLocations, allRoutes } from "../../../../data/locations";
import { coverageStates, localAreaOptions } from "../../../../data/locations/coverage";
import { company } from "../../../../data/company";
import SEO from "../../../../configs/seo";

const states = [...new Set([...coverageStates, ...allServiceLocations.map(location => location.state)])];
const directory = [...allServiceLocations, ...localAreaOptions];
const locationBySlug = new Map(allServiceLocations.map(location => [location.slug, location]));
const routeState = route => locationBySlug.get(route.toSlug)?.state || "Other destinations";
const origins = [...new Set(allRoutes.map(route => route.from))];
const destinations = [...new Set(allRoutes.map(routeState))];
const quote = (from = "", to = "") => `/get-quote?${new URLSearchParams({ from, to, ...(to ? { scope: "interstate" } : {}) })}`;
const questions = [
  ["Do you move within Patna?", "Share your pickup and delivery addresses, including your neighbourhood, floor and lift access. The team can help plan packing, transport and unloading for your local move."],
  ["Is every listed location a branch office?", "Our office is in Patna. The directory shows moving destinations and local areas; it does not indicate branch offices in those places."],
  ["What if I cannot find my city or route?", "Send your full pickup and destination addresses. The team will check service availability and discuss a suitable moving plan with you."],
  ["How do I get a quote for my location?", "Choose a location or route below to start an enquiry with your address filled in. Add your inventory and preferred moving date so the team can prepare your quote."],
];

export default function WhereWeServe() {
  const [state, setState] = useState("Patna local areas");
  const [query, setQuery] = useState("");
  const [origin, setOrigin] = useState("All origins");
  const [destination, setDestination] = useState("All destinations");
  const [routeQuery, setRouteQuery] = useState("");
  const search = query.trim().toLowerCase();
  const groups = states.filter(item => state === "All locations" || state === item || (state === "Patna local areas" && item === "Bihar")).map(item => {
    const places = directory.filter(location => location.state === item && (state !== "Patna local areas" || (location.type === "locality" && location.city === "Patna")));
    return { state: item, total: places.length, places: places.filter(location => `${location.name} ${location.state} ${location.district || ""}`.toLowerCase().includes(search)) };
  }).filter(group => !search || group.places.length || (!group.total && group.state.toLowerCase().includes(search)));
  const routes = allRoutes.filter(route => (origin === "All origins" || route.from === origin) && (destination === "All destinations" || routeState(route) === destination) && `${route.from} ${route.to} ${routeState(route)}`.toLowerCase().includes(routeQuery.trim().toLowerCase()));
  const resetLocations = () => { setState("All locations"); setQuery(""); };
  const resetRoutes = () => { setOrigin("All origins"); setDestination("All destinations"); setRouteQuery(""); };
  return <>
    <SEO title="Where We Serve — Locations & Interstate Moving Routes" description="Find moving locations across Bihar, Jharkhand and other Indian states, explore Patna neighbourhoods and check interstate routes with Om Rudra Packers and Movers." />
    <section className="bg-surface border-b border-border py-10 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-7"><Link to="/" className="hover:text-primary">Home</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Where We Serve</span></nav>
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-16 items-center">
          <div><p className="text-primary font-semibold text-sm">BASED IN PATNA. MOVING WITH YOU.</p><h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mt-4">Your neighbourhood.<br />Your next <span className="text-primary">destination.</span></h1><p className="text-text-muted text-base sm:text-lg leading-relaxed mt-5 max-w-xl">From a move across Patna to a new home in another state, find your location and tell us where you want to go.</p><div className="flex flex-wrap gap-3 mt-6"><Link to="/get-quote" className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-3 font-semibold hover:bg-primary-dark">Request a free quote<ArrowRight size={18} /></Link><a href="#locations" className="inline-flex items-center gap-2 px-5 py-3 font-semibold text-primary hover:underline">Find your location<ArrowRight size={17} /></a></div></div>
          <aside className="bg-background border border-border rounded-2xl p-6 sm:p-8"><MapPin size={28} className="text-primary" /><p className="text-sm text-text-muted mt-5">Our home base</p><h2 className="font-display font-bold text-2xl mt-1">Patna, Bihar</h2><p className="text-text-muted leading-relaxed mt-3">{company.headOffice.addressLine}<br />{company.headOffice.city}, {company.headOffice.state} {company.headOffice.pincode}</p><div className="border-t border-border pt-5 mt-5"><p className="text-sm text-text-muted">Need help with your route?</p><a href={`tel:${company.phone.primary}`} className="inline-flex items-center gap-2 text-primary font-semibold min-h-11"><PhoneCall size={17} />{company.phone.primaryDisplay || company.phone.primary}</a></div></aside>
        </div>
      </div>
    </section>
    <section id="locations" className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5"><div><p className="text-primary font-semibold text-sm">LOCAL AREAS, CITIES & STATES</p><h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">Find where we <span className="text-primary">serve.</span></h2><p className="text-text-muted mt-3">Start with Patna’s local areas, or choose All locations or a state to explore more destinations.</p></div><SearchField label="Search locations" placeholder="Search city, district or area" value={query} onChange={setQuery} /></div>
      <Filters label="Filter locations" options={["Patna local areas", "All locations", ...states]} value={state} onChange={setState} />
      <p className="text-sm text-text-muted mt-5" aria-live="polite">{state === "Patna local areas" ? `${groups.reduce((count, group) => count + group.places.length, 0)} local areas in Patna.` : `${groups.reduce((count, group) => count + group.places.length, 0)} listed locations across ${groups.length} states and regions.`}</p>
      <div className="space-y-6 mt-7">{groups.map(group => <article key={group.state} className="border border-border rounded-2xl p-4 sm:p-6"><div className="flex flex-wrap justify-between items-center gap-3 border-b border-border pb-4"><h3 className="font-display font-bold text-xl flex items-center gap-2"><MapPin size={19} className="text-primary" />{state === "Patna local areas" ? "Patna local areas" : group.state}</h3><Link to={quote(state === "Patna local areas" ? "Patna, Bihar" : group.state)} className="text-primary inline-flex items-center gap-2 text-sm font-semibold min-h-11">Enquire about {state === "Patna local areas" ? "Patna" : group.state}<ArrowRight size={16} /></Link></div>{group.places.length ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">{group.places.map(location => <Link key={location.slug} to={quote(location.name + (location.type === "locality" ? "" : `, ${location.state}`))} className="rounded-lg border border-border p-3 sm:p-4 hover:bg-brand-soft hover:border-primary/40 transition-colors"><span className="flex justify-between gap-2 items-center text-sm font-semibold"><span>{location.name}</span><ArrowRight size={15} className="text-primary shrink-0" /></span><span className="block text-xs text-text-muted mt-1">{location.type === "locality" ? "Local area" : "City / district"}</span></Link>)}</div> : <p className="text-sm text-text-muted mt-4">Share your city or town in {group.state} so the team can check pickup, delivery and route availability.</p>}</article>)}</div>
      {!groups.length && <EmptyState text="No locations match your search. Try another place name or reset the filters." onReset={resetLocations} />}
      <p className="text-sm text-text-muted mt-6">Our office is in Patna. Listed places are moving destinations and local areas. Share your exact address to confirm availability.</p>
    </section>
    <section id="interstate-routes" className="bg-surface border-y border-border py-10 sm:py-16"><div className="container mx-auto px-4 sm:px-6"><div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5"><div><p className="text-primary font-semibold text-sm">CITY TO CITY</p><h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">Find your <span className="text-primary">interstate route.</span></h2><p className="text-text-muted mt-3">Choose your starting city and destination state, or search for a route.</p></div><SearchField label="Search interstate routes" placeholder="Search city or destination state" value={routeQuery} onChange={setRouteQuery} /></div>
      <Filters label="Moving from" options={["All origins", ...origins]} value={origin} onChange={setOrigin} />
      <Filters label="Destination state / region" options={["All destinations", ...destinations]} value={destination} onChange={setDestination} />
      <p className="text-sm text-text-muted mt-5" aria-live="polite">{routes.length} routes match your filters.</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">{routes.map(route => <Link key={route.slug} to={quote(route.from, route.to)} className="bg-background border border-border rounded-xl p-4 flex justify-between items-center gap-3 hover:bg-brand-soft hover:border-primary/40 transition-colors"><span><span className="font-semibold">{route.from} <span className="text-primary mx-1">→</span> {route.to}</span><span className="block text-xs text-text-muted mt-1">{routeState(route)}</span></span><ArrowRight size={17} className="text-primary shrink-0" /></Link>)}</div>
      {!routes.length && <EmptyState text="No listed routes match these filters. Try another city or reset your filters." onReset={resetRoutes} />}
      <p className="text-sm text-text-muted mt-6">Another route in mind? <Link to="/get-quote?scope=interstate" className="text-primary underline font-semibold">Send your pickup and destination</Link> to check availability.</p>
    </div></section>
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16"><h2 className="font-display font-bold text-3xl">Before you <span className="text-primary">plan your move.</span></h2><div className="mt-6">{questions.map(([question, answer]) => <details key={question} className="group border-b border-border"><summary className="flex justify-between items-center gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-semibold">{question}<span className="text-primary shrink-0"><Plus size={20} className="group-open:hidden" /><Minus size={20} className="hidden group-open:block" /></span></summary><p className="text-text-muted leading-relaxed pb-5 max-w-3xl">{answer}</p></details>)}</div><div className="rounded-2xl bg-text text-background p-6 sm:p-10 mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"><div><h2 className="font-display text-2xl sm:text-3xl font-bold">Tell us where you are moving.</h2><p className="mt-2 opacity-80">Your route, your inventory, a quote for your move.</p></div><Link to="/get-quote" className="inline-flex items-center gap-3 bg-primary text-white rounded-full px-6 py-3 font-semibold shrink-0">Request a free quote<ArrowRight size={18} /></Link></div></section>
  </>;
}
function Filters({ label, options, value, onChange }) {
  return <div className="mt-6"><p className="font-semibold text-sm mb-3">{label}</p><div className="flex flex-wrap gap-2" role="group" aria-label={label}>{options.map(option => <button type="button" key={option} aria-pressed={value === option} onClick={() => onChange(option)} className={`min-h-11 px-4 py-2 rounded-full border text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${value === option ? "bg-primary border-primary text-white" : "bg-background border-border text-text-muted hover:text-primary hover:bg-brand-soft"}`}>{option}</button>)}</div></div>;
}
function SearchField({ label, placeholder, value, onChange }) {
  return <label className="flex gap-2 items-center bg-background border border-border rounded-xl px-3 sm:w-80 shrink-0 focus-within:border-primary"><Search size={18} className="text-text-muted shrink-0" /><input type="search" aria-label={label} placeholder={placeholder} value={value} onChange={event => onChange(event.target.value)} className="w-full min-w-0 bg-transparent py-3 outline-none text-sm" /></label>;
}
function EmptyState({ text, onReset }) {
  return <div className="rounded-xl border border-border bg-background p-6 mt-6"><p className="text-text-muted">{text}</p><button type="button" onClick={onReset} className="min-h-11 text-primary font-semibold mt-2 hover:underline">Reset filters</button></div>;
}
