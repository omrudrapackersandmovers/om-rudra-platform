import { Link } from "react-router";
import { allLocationPages, indexableLocationPages, locationPath } from "../../../../data/locations/pageData.js";

const groups = Object.groupBy(allLocationPages, item => item.state);
export default function LocationDirectory() {
  return <section className="container mx-auto px-4 sm:px-6 py-10">
    <h2 className="font-display font-bold text-2xl">City moving guides</h2>
    <p className="text-sm text-text-muted mt-3">Compare address details and listed routes before discussing your move.</p>
    <div className="flex flex-wrap gap-3 mt-5 mb-8">{indexableLocationPages.map(item => <Link key={item.slug} to={locationPath(item)} className="border border-border rounded-[var(--radius-md)] px-4 py-3 text-primary font-semibold hover:bg-brand-soft">{item.name}</Link>)}</div>
    <details className="border border-border rounded-[var(--radius-lg)] p-5 sm:p-7">
      <summary className="cursor-pointer font-display font-bold text-xl">Browse the complete location directory</summary>
      <p className="text-sm text-text-muted mt-3">All listed cities, districts and local areas. Open a page to plan your address details and enquire about availability.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">{Object.entries(groups).map(([state, locations]) => <div key={state}><h3 className="font-semibold mb-3">{state}</h3><ul className="space-y-2 text-sm">{locations.map(item => <li key={item.slug}><Link to={locationPath(item)} className="text-primary hover:underline inline-block py-1">{item.name}</Link></li>)}</ul></div>)}</div>
    </details>
  </section>;
}
