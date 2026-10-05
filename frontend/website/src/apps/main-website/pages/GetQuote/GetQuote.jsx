import { Link } from "react-router";
import { ArrowRight, ChevronRight, PhoneCall, MessageCircle, MapPin, Package, CalendarDays, Building2, Plus, Minus, Check } from "lucide-react";
import { company } from "../../../../data/company";
import SEO from "../../../../configs/seo";
import QuoteForm from "../Home/components/QuoteForm";

const prepare = [
  { icon: MapPin, title: "Your pickup and destination", text: "Include the city, neighbourhood and full address when you speak with the team." },
  { icon: Package, title: "What you want to move", text: "List furniture, appliances, cartons and any fragile or oversized items." },
  { icon: Building2, title: "Access at both addresses", text: "Mention floors, lifts, stairs, parking and any building restrictions." },
  { icon: CalendarDays, title: "Your preferred date", text: "Share your schedule and let us know if you have flexibility." },
];
const questions = [
  ["Is it free to request a quote?", "Yes. You do not need to make a payment to send a moving enquiry. The team will discuss your requirements and the proposed service before you book."],
  ["Is the price shown in the form my final quote?", "The displayed range is an indicative planning estimate. Your exact route, inventory, packing, access and additional services affect the final quote. Confirm the agreed scope and price with the team before booking."],
  ["What if my date is not decided?", "Choose Not fixed yet in the form. You can discuss possible dates and availability with the team when they review your enquiry."],
  ["Can I enquire about an office, car or bike move?", "Yes. Choose the relevant service at the top of the form and share your route and contact details. The team can discuss the specific requirements for your move."],
  ["What should I confirm before booking?", "Ask for the agreed services, packing and transport arrangements, applicable taxes, insurance options, payment terms and cancellation conditions in writing."],
];

export default function GetQuote() {
  const whatsapp = `https://wa.me/${company.phone.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${company.brandName}, I would like to discuss a moving quote.`)}`;
  return <>
    <SEO title="Get a Free Moving Quote — Local & Interstate Moves" description={`Request a moving quote from ${company.brandName}. Share your route, service and preferred date for home, office, car or bike moving.`} />
    <section className="bg-surface border-b border-border py-8 sm:py-12"><div className="container mx-auto px-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-7"><Link to="/" className="hover:text-primary">Home</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Get a Quote</span></nav>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-8 lg:gap-12 items-start">
        <div className="min-w-0 lg:pt-5"><p className="text-primary text-sm font-semibold">YOUR NEXT MOVE STARTS HERE</p><h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mt-4">Your move.<br />Your details.<br /><span className="text-primary">A quote built around you.</span></h1><p className="text-text-muted text-base sm:text-lg leading-relaxed mt-5">Across Patna or to another city, tell us where you are going and what you need to move. Our team will review the details with you before preparing your quote.</p><ul className="space-y-3 text-sm mt-6">{["No payment to send an enquiry", "Home, office, car and bike moves", "Discuss the service scope before booking"].map(text => <li key={text} className="flex items-start gap-2"><Check size={18} className="text-primary shrink-0" aria-hidden="true" />{text}</li>)}</ul>
          <div className="border-t border-border mt-7 pt-5"><p className="text-sm font-semibold">Prefer to talk it through?</p><div className="flex flex-wrap gap-4 mt-2"><a href={`tel:${company.phone.primary.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-2 text-primary font-semibold text-sm min-h-11"><PhoneCall size={17} />{company.phone.primaryDisplay}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold text-sm min-h-11"><MessageCircle size={18} />Chat on WhatsApp</a></div><p className="text-xs text-text-muted mt-3">For booking support, feedback or other questions, <Link to="/contact" className="text-primary underline">contact our team</Link>.</p></div>
        </div>
        <QuoteForm isStandalonePage embedded />
      </div>
    </div></section>
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16"><p className="text-primary text-sm font-semibold">A LITTLE PREPARATION HELPS</p><h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">The details behind <span className="text-primary">your quote.</span></h2><p className="text-text-muted leading-relaxed mt-3 max-w-2xl">Have these ready for your conversation with the team. More detail helps us understand the packing, transport and handling your move needs.</p><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-7">{prepare.map(({ icon: Icon, title, text }) => <article key={title} className="border border-border rounded-[var(--radius-md)] p-5"><Icon size={25} className="text-primary" /><h3 className="font-display font-bold text-lg mt-4">{title}</h3><p className="text-sm text-text-muted leading-relaxed mt-3">{text}</p></article>)}</div></section>
    <section className="bg-brand-soft border-y border-primary/15 py-10 sm:py-14"><div className="container mx-auto px-4 sm:px-6"><h2 className="font-display font-bold text-3xl">What happens <span className="text-primary">next?</span></h2><div className="grid md:grid-cols-3 gap-7 mt-7">{[["01", "Send your requirements", "Share your route, service, preferred timing and contact details using the form."], ["02", "Discuss your move", "The team reviews your inventory, address access and any survey or packing needs with you."], ["03", "Review your quote", "Confirm the proposed price, inclusions and booking terms before agreeing to your moving plan."]].map(([step, title, text]) => <article key={step} className="border-t border-primary/15 pt-5"><span className="font-display font-bold text-primary text-2xl">{step}</span><h3 className="font-semibold text-lg mt-3">{title}</h3><p className="text-sm text-text-muted leading-relaxed mt-2">{text}</p></article>)}</div><Link to="/pricing" className="inline-flex items-center gap-2 text-primary font-semibold min-h-11 mt-6">Explore the pricing guide<ArrowRight size={17} /></Link></div></section>
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16"><h2 className="font-display font-bold text-3xl">Before you <span className="text-primary">request a quote.</span></h2><div className="mt-6">{questions.map(([question, answer]) => <details key={question} className="group border-b border-border"><summary className="flex justify-between items-center gap-4 py-5 font-semibold cursor-pointer list-none [&::-webkit-details-marker]:hidden">{question}<span className="text-primary shrink-0"><Plus size={20} className="group-open:hidden" /><Minus size={20} className="hidden group-open:block" /></span></summary><p className="text-text-muted leading-relaxed pb-5 max-w-3xl">{answer}</p></details>)}</div></section>
  </>;
}
