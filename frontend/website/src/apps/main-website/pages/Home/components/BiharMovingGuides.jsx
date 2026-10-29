import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const guides = [
  { slug: "patna", place: "Patna", text: "Find your locality, prepare both building addresses and compare local shifting with an interstate move." },
  { slug: "gaya", place: "Gaya", text: "Separate a Gaya city, Manpur or Bodh Gaya pickup and prepare the receiving address for your route." },
  { slug: "muzaffarpur", place: "Muzaffarpur", text: "Plan a city or district pickup with your inventory, loading entrance and complete destination." },
  { slug: "bhagalpur", place: "Bhagalpur", text: "Identify your town and property before comparing packing, transport and delivery arrangements." },
];
const localities = [
  ["patna-boring-road", "Boring Road"],
  ["patna-patna-city", "Patna City"],
  ["patna-gola-road", "Gola Road"],
  ["patna-danapur", "Danapur"],
];

export default function BiharMovingGuides() {
  return <section className="bg-surface border-y border-border py-12 sm:py-16" aria-labelledby="bihar-moving-guides">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-primary text-sm font-semibold">START WITH YOUR PICKUP</p>
      <h2 id="bihar-moving-guides" className="font-display font-bold text-3xl sm:text-4xl mt-3">Plan your move in Bihar.</h2>
      <p className="text-text-muted max-w-3xl mt-4 leading-relaxed">Our office is in Ram Krishna Nagar, Patna. These guides help you prepare a home or office move within Bihar, or a pickup for another city. Share your exact addresses so the team can confirm availability and the service scope.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">
        {guides.map(guide => <article key={guide.slug} className="bg-background border border-border rounded-lg p-5 sm:p-6">
          <h3 className="font-display font-bold text-xl"><Link to={`/packers-movers-${guide.slug}`} className="hover:text-primary">Packers and movers in {guide.place}</Link></h3>
          <p className="text-sm text-text-muted leading-relaxed mt-3">{guide.text}</p>
          <Link to={`/packers-movers-${guide.slug}`} className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-primary mt-3">Read the {guide.place} guide<ArrowRight size={16} aria-hidden="true" /></Link>
        </article>)}
      </div>
      <nav aria-label="Patna moving areas" className="mt-7 border-t border-border pt-5">
        <p className="text-sm font-semibold">Moving within Patna?</p>
        <ul className="flex flex-wrap gap-x-6 mt-2">{localities.map(([slug, name]) => <li key={slug}><Link className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4" to={`/packers-movers-${slug}`}>Home shifting in {name}</Link></li>)}</ul>
      </nav>
      <p className="text-sm text-text-muted mt-4">Compare <Link className="text-primary underline" to="/pricing">moving cost factors and indicative prices</Link>, then <Link className="text-primary underline" to="/get-quote">request a quote for your own inventory</Link>.</p>
    </div>
  </section>;
}
