import { Link } from "react-router";
import { PhoneCall, ArrowRight, CheckCircle2, Plus, Minus } from "lucide-react";
import { company } from "../../../../../data/company";

const questions = [
  { question: "What happens after I request a quote?", answer: "Our team contacts you to discuss your route, moving date, inventory and building access. Confirm the service scope and price with the team before booking." },
  { question: "What affects the price of my move?", answer: "The amount and type of goods, distance, packing needs, stairs or lift access, loading access and moving date can affect the quote. Share these details so the team can assess your move." },
  { question: "Can I move just a car, bike or a few items?", answer: "You can enquire about vehicle transport, packing, loading or a smaller shipment separately. Tell us what you need moved and where it needs to go." },
  { question: "Is transit insurance included?", answer: "Ask the team which insurance options are available for your move. Confirm the premium, coverage, exclusions and claim process before agreeing to a policy." },
];

export default function MovingHelp() {
  return (
    <div className="bg-background pb-12 sm:pb-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-labelledby="moving-help-heading">
        <div className="rounded-lg bg-gradient-to-br from-hero-overlay via-hero-overlay to-primary p-7 sm:p-10 lg:p-14 text-white grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div><h2 id="moving-help-heading" className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.8rem)] leading-tight mb-4">Your move starts<br />with a conversation.</h2><p className="text-white/85 max-w-lg text-base leading-relaxed">Not sure about the truck, packing or timing? Speak to our team and work through the details before moving day.</p><Link to="/get-quote" className="mt-6 inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-md bg-accent hover:bg-primary text-white text-sm font-bold">Get a free quote<ArrowRight size={17} aria-hidden="true" /></Link></div>
          <div className="border border-white/20 rounded-lg p-6 sm:p-8 bg-white/5"><p className="text-sm text-white/75 mb-3">Talk to Om Rudra</p><a href={`tel:${company.phone.primary.replace(/[^+\d]/g, "")}`} className="inline-flex items-center gap-3 min-h-11 text-xl sm:text-2xl font-bold hover:underline"><PhoneCall size={22} aria-hidden="true" />{company.phone.primaryDisplay}</a><ul className="mt-5 space-y-3 text-sm text-white/90">{["Discuss your route and moving date", "Share your packing and handling needs", "Confirm the service scope before booking"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={17} className="shrink-0" aria-hidden="true" />{item}</li>)}</ul></div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16" aria-labelledby="moving-questions-heading">
        <h2 id="moving-questions-heading" className="font-display font-extrabold text-[clamp(1.8rem,3vw,2.8rem)] mb-6 tracking-tight">Before you <span className="text-primary">make your move.</span></h2>
        {questions.map((item) => <details key={item.question} className="group border-b border-border"><summary className="faq-question flex items-center justify-between gap-5 cursor-pointer min-h-16 py-4 text-sm sm:text-base font-semibold hover:text-primary">{item.question}<span className="shrink-0 w-8 h-8 rounded-full bg-brand-soft text-primary flex items-center justify-center"><Plus size={18} className="group-open:hidden" aria-hidden="true" /><Minus size={18} className="hidden group-open:block" aria-hidden="true" /></span></summary><p className="text-text-muted text-base leading-relaxed max-w-3xl pr-10 pb-5">{item.answer}</p></details>)}
      </section>
    </div>
  );
}
