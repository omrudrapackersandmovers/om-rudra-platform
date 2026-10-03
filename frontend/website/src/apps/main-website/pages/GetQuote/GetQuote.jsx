import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  PhoneCall,
  MessageCircle,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Truck,
  FileCheck,
  Lock,
  Boxes,
  Users,
  ChevronDown,
  AlertTriangle,
  FileText,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import { company } from "@/data/company";
import QuoteForm from "../Home/components/QuoteForm";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

// Process Steps
const quoteSteps = [
  {
    step: "01",
    title: "Submit Details or Photos",
    desc: "Fill in the smart form above or share a quick WhatsApp video walkthrough of your rooms.",
  },
  {
    step: "02",
    title: "Free Pre-Move Survey",
    desc: "A senior relocation planner evaluates furniture volume, floor access, and fragile packing needs.",
  },
  {
    step: "03",
    title: "Binding Itemized Quote",
    desc: "You receive an all-inclusive written quotation detailing materials, vehicle type, and insurance.",
  },
  {
    step: "04",
    title: "Dedicated Sealed Move",
    desc: "On moving day, your goods travel in a sealed, dedicated container with zero co-loading.",
  },
];

// Inclusions Grid
const inclusivePillars = [
  {
    icon: Boxes,
    title: "5-Layer Export Materials",
    description:
      "All heavy-duty 5-ply cartons, bubble wrap, stretch film, corrugated sheets, and waterproof tape are fully included in the agreed price.",
    tag: "All Supplies Included",
  },
  {
    icon: Truck,
    title: "100% Dedicated Closed Fleet",
    description:
      "Your household or commercial goods never share truck space with stranger freight. The container is locked and sealed in your presence.",
    tag: "Zero Co-Loading",
  },
  {
    icon: Users,
    title: "Permanent Verified Crew",
    description:
      "Every move is handled by full-time, background-checked movers equipped with appliance dollies and furniture blankets. No street daily-wagers.",
    tag: "Trained Handlers",
  },
  {
    icon: ShieldCheck,
    title: "Human Move Coordinator",
    description:
      "Direct personal WhatsApp and phone contact with your assigned Move Coordinator for real-time highway updates from origin to destination.",
    tag: "Direct Contact",
  },
];

// Scam Prevention Comparison
const scamComparisons = [
  {
    feature: "Pricing Guarantee",
    unorganized: "Quotes an unrealistically low verbal estimate, then extorts ₹5,000 to ₹15,000 extra on moving day for 'tape, stairs, and parking'.",
    firstOm: "100% binding written contract after survey. The exact amount quoted is the exact amount on your final GST invoice.",
  },
  {
    feature: "Truck Space & Safety",
    unorganized: "Co-loads your household goods on open-body trucks with commercial machinery or hazardous cargo to maximize their margins.",
    firstOm: "Sole-custody, weatherproof closed container sealed in your presence. Your goods never mix with stranger cargo.",
  },
  {
    feature: "Packing Standards",
    unorganized: "Uses flimsy reused grocery cartons, thin single-ply tape, and zero protective edge wrapping.",
    firstOm: "Virgin 5-ply export-grade corrugated boxes, heavy-duty bubble wrap, air-cushion film, and corner edge protectors.",
  },
  {
    feature: "Labor Standards",
    unorganized: "Picks up unvetted daily-wage laborers from street corners with zero training in handling delicate electronics or timber furniture.",
    firstOm: "Permanent, background-checked moving technicians equipped with power tools, appliance dollies, and moving straps.",
  },
  {
    feature: "Tracking & Communication",
    unorganized: "Driver turns off phone mid-transit; dispatch office gives evasive responses with zero accountability.",
    firstOm: "Dedicated Move Coordinator assigned with direct personal mobile and WhatsApp line for real-time highway checkpoint updates.",
  },
];

// FAQs
const quoteFaqs = [
  {
    q: "How accurate is the online moving estimate compared to the final cost?",
    a: "Our smart online form provides a highly reliable price bracket based on real route freight indices and volume averages. Following your form submission, our supervisor conducts a quick virtual video or doorstep survey to confirm item specifics and issues a 100% fixed, binding written quote.",
  },
  {
    q: "Is the doorstep inventory survey really 100% free and without obligation?",
    a: "Yes. Our pre-move survey is completely free with zero booking obligation. Our surveyor visits your residence, notes every piece of furniture, measures narrow doorways or staircases, and presents an itemized written estimate.",
  },
  {
    q: "Can I get an immediate quote on WhatsApp using photos or a room walkthrough video?",
    a: "Yes! Many customers prefer WhatsApp surveys. Simply record a quick 1-minute video walking through each room showing your furniture and appliances, and send it to +91 7033488691. Our supervisor will respond with an accurate quotation within 15 to 30 minutes.",
  },
  {
    q: "Are packing materials, loading, and transit taxes included in the quote?",
    a: "Yes. All standard packing materials (5-ply boxes, bubble wrap, stretch film, tape), professional loading labor, dedicated container vehicle, and toll taxes are bundled into your single written price. We never charge extra for stairs or packing supplies.",
  },
  {
    q: "How does transit insurance coverage work?",
    a: "We offer comprehensive Goods Transit Insurance covering the full declared market value of your possessions against highway hazards, road collisions, fire, and overturning. The insurance policy and documentation are provided upfront prior to dispatch.",
  },
];

const GetQuote = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const whatsappNumber = company.phone.whatsapp
    ? company.phone.whatsapp.replace(/\D/g, "")
    : "917033488691";

  const defaultWhatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%201st%20Om%20Team%2C%20I%20would%20like%20to%20get%20a%20free%20quote%20for%20my%20upcoming%20move.`;

  // Auto-scroll to the quote form when user lands on this page
  useEffect(() => {
    const timer = setTimeout(() => {
      const el = document.getElementById("quote-form-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SEO
        title="Get a Free Moving Quote - Transparent Binding Pricing | 1st Om Packers"
        description="Request a free, transparent moving estimate for household, corporate office, or vehicle shifting across Bihar, Jharkhand, and nationwide corridors. 100% binding upfront price guarantee."
      />

      {/* ── 1. PAGE HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted" role="list">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={13} /></li>
              <li>
                <span className="text-text font-semibold">Get a Quote</span>
              </li>
            </ol>
          </nav>

          {/* Hero Top Grid: Title on Left, Action Cards on Right */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-text text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Zap size={14} className="text-accent fill-accent" />
                <span>Smart Relocation Estimator - 100% Price Lock Guarantee</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Request Your Free, Transparent Relocation Quote
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-3xl">
                Tell us what you are moving and when. Our dispatch planners calculate vehicle volume,
                toll distances, and packing tiers to provide a fixed, all-inclusive price before we touch a single box.
              </p>
            </div>

            {/* Quick Hero Call/WhatsApp Action Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <a
                href={defaultWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-display font-bold text-sm hover:brightness-105 transition-all shadow-md active:scale-95"
              >
                <MessageCircle size={16} />
                <span>Instant WhatsApp Estimate</span>
              </a>

              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-text text-xs sm:text-sm font-semibold hover:border-primary/40 hover:bg-background transition-colors"
                >
                  <PhoneCall size={15} className="text-primary" />
                  <span>Call: {company.phone.primary}</span>
                </a>
              )}
            </div>
          </div>

          {/* ── Full-Width Trust Metrics Strip (Spans 100% width across container) ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/80 shadow-xs">
            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">15,000+</p>
                <p className="text-xs text-text-muted">Moves Completed</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <FileCheck size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">100%</p>
                <p className="text-xs text-text-muted">Binding Price Lock</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">0%</p>
                <p className="text-xs text-text-muted">Hidden Surcharges</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-green-500/10 text-green-700 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-base sm:text-lg">&lt; 15 Min</p>
                <p className="text-xs text-text-muted">Human Response SLA</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. EMBEDDED SUPER SMART QUOTE FORM ────────────────────────── */}
      <QuoteForm isStandalonePage={true} />

      {/* ── 3. 4-STEP QUOTATION PROCESS VISUALIZER ────────────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
              <FileCheck size={13} className="text-accent" />
              <span>Step-by-Step Transparency</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              How We Calculate Your Exact Move Price
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              From your initial request to final key handover, here is how we ensure zero pricing surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quoteSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-background border border-border hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="font-display font-black text-3xl sm:text-4xl text-primary/20 mb-3">
                  {step.step}
                </div>
                <h3 className="font-display font-bold text-text text-base mb-2">
                  {step.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. WHAT IS INCLUDED IN EVERY QUOTE ────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <BadgeCheck size={14} className="text-primary" />
              <span>All-Inclusive Value</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              Everything Included in Your Written Estimate
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              We never quote a cheap bare-bones rate and charge thousands for tape, cartons, or blankets.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inclusivePillars.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <ItemIcon size={22} />
                    </div>
                    <div className="inline-block px-2.5 py-0.5 rounded-md bg-background border border-border text-[11px] font-bold text-primary uppercase tracking-wider mb-2">
                      {item.tag}
                    </div>
                    <h3 className="font-display font-bold text-text text-base sm:text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. QUOTATION SCAM PREVENTION MATRIX ───────────────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-700 text-xs font-bold uppercase tracking-wider mb-3">
              <AlertTriangle size={13} className="text-red-600" />
              <span>Consumer Protection</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              How To Avoid Moving Day Extortion
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              See why low verbal quotes often end up costing double the price on moving day.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-background shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-surface border-b border-border text-text font-display font-bold">
                <tr>
                  <th className="p-4 sm:p-5 w-1/4">Moving Parameter</th>
                  <th className="p-4 sm:p-5 w-3/8 text-text-muted bg-surface">
                    Informal Market Practice
                  </th>
                  <th className="p-4 sm:p-5 w-3/8 text-primary bg-primary/5">
                    1st Om Binding Standards
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {scamComparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface/40 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-text align-top">
                      {row.feature}
                    </td>
                    <td className="p-4 sm:p-5 text-text-muted bg-surface/40 align-top leading-relaxed">
                      <p>{row.unorganized}</p>
                    </td>
                    <td className="p-4 sm:p-5 text-text bg-primary/5 font-medium align-top leading-relaxed">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-primary shrink-0 mt-0.5" />
                        <span>{row.firstOm}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── 6. QUOTATION & SURVEY FAQS ───────────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-t border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
              <FileText size={13} className="text-accent" />
              <span>Clear Answers</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              Frequently Asked Questions About Moving Quotes
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Everything you need to know about pricing calculations, survey schedules, and insurance.
            </p>
          </div>

          <div className="space-y-3">
            {quoteFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-surface border border-border overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-background/80 transition-colors"
                  >
                    <span className="font-display font-bold text-text text-sm sm:text-base">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-text-muted transition-transform shrink-0 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-text-muted text-xs sm:text-sm leading-relaxed border-t border-border/50 pt-4 bg-background/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. FINAL HIGH-CONVERTING BOTTOM CTA ───────────────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary/95 to-primary text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Zero Obligation - 100% Free Doorstep Survey
            </span>
            <h2
              className="font-display font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Lock In Your Binding Move Rate Today
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Connect directly with our senior move planners. What we quote in writing is the exact figure you pay.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={defaultWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white font-display font-bold text-sm hover:brightness-105 transition-all shadow-md active:scale-95"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>

              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 bg-white/10 text-white font-display font-bold text-sm hover:bg-white hover:text-primary transition-all shadow-md active:scale-95"
                >
                  <PhoneCall size={16} />
                  <span>Call {company.phone.primary}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default GetQuote;
