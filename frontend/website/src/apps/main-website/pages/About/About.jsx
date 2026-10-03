import { Link } from "react-router";
import {
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Award,
  Truck,
  Building2,
  Users,
  PhoneCall,
  Check,
  ArrowRight,
  MapPin,
  PackageCheck,
  FileCheck,
  Clock,
  Compass,
  FileText,
  Boxes,
} from "lucide-react";
import { company } from "../../../../data/company";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

const corePillars = [
  {
    icon: FileCheck,
    title: "One Binding Price, Stated Upfront",
    description:
      "We conduct a thorough pre-move survey before quoting. The number you agree to in writing is the exact number you pay. Zero surprise surcharges for stairs, tape, or fuel.",
    tag: "No Hidden Costs",
  },
  {
    icon: Truck,
    title: "Sole-Custody Dedicated Fleet",
    description:
      "Your goods travel in a 100% dedicated closed container sealed in your presence. We never co-load your household possessions with stranger cargo or commercial freight.",
    tag: "Zero Co-Loading",
  },
  {
    icon: Users,
    title: "Full-Time Verified Specialists",
    description:
      "We never hire unvetted daily-wage street laborers. Every move is executed by permanent, background-checked crew members equipped with power tools and appliance dollies.",
    tag: "Trained Handlers",
  },
  {
    icon: HeartHandshake,
    title: "Direct Human Supervisor Contact",
    description:
      "When a question arises mid-transit, you speak directly with your dedicated Move Coordinator via phone or WhatsApp - not an automated bot or disconnected call center.",
    tag: "WhatsApp GPS Updates",
  },
];

const operationalStats = [
  {
    number: "15,000+",
    label: "Homes Relocated",
    subtext: "Across local & interstate routes",
    icon: Building2,
  },
  {
    number: "1,200+",
    label: "Offices Shifted",
    subtext: "Zero business downtime",
    icon: Building2,
  },
  {
    number: "8,500+",
    label: "Vehicles Delivered",
    subtext: "Cars & bikes in enclosed carriers",
    icon: Truck,
  },
  {
    number: "<0.2%",
    label: "Damage Claim Ratio",
    subtext: "Industry-leading safety record",
    icon: ShieldCheck,
  },
];

const engineeringFeatures = [
  {
    title: "All-Weather Sealed Containers",
    description:
      "Our fleet consists exclusively of closed-body containerized trucks (10ft to 32ft) that protect your possessions from rain, highway dust, sunlight, and road grime.",
    icon: Truck,
  },
  {
    title: "5-Layer Protective Shield",
    description:
      "We use virgin 5-ply corrugated cartons, shock-absorbing bubble cushioning, high-density foam edge protectors, and tailor-made wooden crates for high-value TVs and glass.",
    icon: Boxes,
  },
  {
    title: "Appliance Dollies & Floor Guards",
    description:
      "Our crews deploy heavy-duty appliance dollies, lifting straps, and protective doorway corner guards so your floors, stairs, and doorframes stay completely scratch-free.",
    icon: PackageCheck,
  },
];

const About = () => {
  return (
    <>
      <SEO
        title="About Us - Leading Relocation & Moving Company in Bihar & India"
        description={`Learn about ${company.brandName}, our service origins in Patna, our 100% dedicated closed fleet, and our commitment to zero-damage household and commercial relocation.`}
      />

      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden">
        {/* Glow ambient background effects */}
        <div
          className="absolute -top-32 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs sm:text-sm text-text-muted" role="list">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={13} className="text-text-muted/60" />
              </li>
              <li>
                <span className="text-text font-semibold">About Us</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-3xl">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                <Compass size={14} className="text-accent" />
                <span>Patna Roots • All-India Relocation Standards</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Built on Precision, Empathy, and Complete Pricing Transparency
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-2xl">
                {company.legalName} was founded in Patna with a straightforward conviction: moving to a new home should feel like a celebration, not an unpredictable ordeal.
              </p>
            </div>

            {/* Quick Hero CTA Card */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <Button to="/get-quote" size="md" className="w-full sm:w-auto shadow-md">
                Book a Free Move Survey
              </Button>
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

          {/* ── 2. TRUST METRICS BAR ────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/80 shadow-xs">
            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Building2 size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">15,000+</p>
                <p className="text-xs text-text-muted">Families Relocated</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">99.8%</p>
                <p className="text-xs text-text-muted">Zero-Damage Record</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">100%</p>
                <p className="text-xs text-text-muted">Dedicated Closed Fleet</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-display font-bold text-text text-base sm:text-lg">50+ Districts</p>
                <p className="text-xs text-text-muted">Direct Crew Coverage</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. THE ORIGIN STORY (WHY WE EXIST) ────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Story Editorial Text */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Award size={14} className="text-accent" />
                <span>Our Heritage &amp; Mission</span>
              </div>

              <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight leading-snug">
                Why We Started 1st Om: Solving the Relocation Dilemma
              </h2>

              <div className="space-y-4 text-text-muted text-sm sm:text-base leading-relaxed">
                <p>
                  For decades, families and businesses relocating across Bihar, Jharkhand, and Eastern India faced an impossible choice:
                </p>
                <div className="p-4 rounded-xl bg-surface border border-border text-xs sm:text-sm space-y-2">
                  <p className="text-text font-semibold flex items-start gap-2">
                    <span className="text-red-500 font-bold">1.</span>
                    <span>
                      Gamble with unorganized local contractors who quote an unrealistically low price, only to extort thousands of rupees mid-move for &ldquo;tape, stairs, and truck union fees&rdquo;.
                    </span>
                  </p>
                  <p className="text-text font-semibold flex items-start gap-2">
                    <span className="text-red-500 font-bold">2.</span>
                    <span>
                      Or pay astronomical rates to impersonal national aggregator platforms that subcontract your belongings to third-party drivers and co-load your family&apos;s memories with commercial cargo.
                    </span>
                  </p>
                </div>
                <p>
                  We built <strong>{company.brandName}</strong> to be the definitive, reliable alternative. We combined deep, intimate local knowledge of every highway, toll corridor, and district road with strict corporate standards: dedicated containerized vehicles, 5-layer protective packing, and upfront, binding written contracts.
                </p>
                <p>
                  Today, our network moves thousands of households and corporate workplaces every year between Patna, Ranchi, Kolkata, Lucknow, Delhi NCR, and nationwide corridors - with the exact same care we would give to our own homes.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Button to="/get-quote" size="md">
                  Request Free Survey
                </Button>
                <Link
                  to="/services"
                  className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
                >
                  <span>Explore Our Moving Services</span>
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            {/* Visual Photography Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-border bg-surface overflow-hidden shadow-xl group">
                <div className="aspect-[4/3] w-full overflow-hidden">
                  <img
                    src="/images/process-for-home-service/after-shifting.webp"
                    alt="Happy family settled in their new home with 1st Om Packers and Movers"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 bg-surface border-t border-border">
                  <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-wider mb-2">
                    <HeartHandshake size={16} />
                    <span>The 1st Om Philosophy</span>
                  </div>
                  <blockquote className="font-display font-bold text-text text-base leading-snug">
                    &ldquo;We don&apos;t just transport boxes and furniture. We transport the rhythm of daily life and the security of your family&apos;s hard work.&rdquo;
                  </blockquote>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. CORE OPERATING PILLARS ──────────────────────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Award size={14} className="text-accent" />
              <span>Our Operating Philosophy</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              How We Work Differently
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              We eliminated the chaos of traditional relocation with strict, uncompromised standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {corePillars.map((pillar, idx) => {
              const PillarIcon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl border border-border bg-background hover:border-primary/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <PillarIcon size={22} />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent/15 text-accent-foreground">
                        {pillar.tag}
                      </span>
                    </div>

                    <h3 className="font-display font-bold text-text text-lg mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-border/60 flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 size={15} />
                    <span>Standard on 100% of our moves</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 5. "BY THE NUMBERS" TRACK RECORD ──────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck size={14} />
              <span>Proven Execution Track Record</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              Numbers That Speak For Themselves
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Real, verifiable milestones built over thousands of successful household and corporate shifts.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {operationalStats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-surface border border-border text-center flex flex-col items-center hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                    <StatIcon size={22} />
                  </div>
                  <p className="font-display font-black text-text text-3xl sm:text-4xl mb-1">
                    {stat.number}
                  </p>
                  <p className="font-display font-bold text-text text-sm mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[11px] text-text-muted">
                    {stat.subtext}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 6. FLEET & PACKAGING ENGINEERING ──────────────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Truck size={14} className="text-accent" />
              <span>The Machinery of Safety</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              How We Protect Every Item in Transit
            </h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-2xl mx-auto text-balance">
              Safety isn&apos;t an accident - it&apos;s the result of purpose-built equipment and military-precision materials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engineeringFeatures.map((feat, idx) => {
              const FeatIcon = feat.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-background border border-border flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <FeatIcon size={22} />
                    </div>
                    <h3 className="font-display font-bold text-text text-base mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-border/60">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      Zero Damage Standard
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 7. CORPORATE TRANSPARENCY & HEADQUARTERS ──────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-6">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider block mb-1">
                  Registered Corporate Entity
                </span>
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl">
                  {company.legalName}
                </h2>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold w-fit">
                Verified &amp; Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-text font-bold">
                  <MapPin size={16} className="text-primary" />
                  <span>Corporate Headquarters</span>
                </div>
                <p className="text-text-muted pl-6 leading-relaxed">
                  {company.headOffice.addressLine},<br />
                  {company.headOffice.city}, {company.headOffice.state} - {company.headOffice.pincode}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-text font-bold">
                  <FileText size={16} className="text-primary" />
                  <span>Compliance &amp; Invoicing</span>
                </div>
                <p className="text-text-muted pl-6 leading-relaxed">
                  GST compliant invoicing, consignment notes (LR copy), and asset inventories provided for corporate relocation reimbursement.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-text-muted text-center sm:text-left">
                Need official corporate quotation or vendor registration documentation?
              </span>
              <Button to="/contact" variant="outline" size="sm" showArrow={false}>
                Contact Corporate Desk
              </Button>
            </div>
          </div>

        </div>
      </section>

      {/* ── 8. FINAL HIGH-CONVERTING BOTTOM CTA BANNER ──────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary/95 to-primary text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Experience A Different Kind of Move
            </span>
            <h2
              className="font-display font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Ready To Plan Your Move With Total Peace of Mind?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Schedule a free doorstep or video inventory survey. What we quote is the exact price you pay - guaranteed.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button to="/get-quote" size="lg" className="w-full sm:w-auto shadow-lg">
                Book Free Move Survey
              </Button>
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 bg-white/10 text-white font-display font-bold text-sm hover:bg-white hover:text-primary transition-all shadow-md"
                >
                  <PhoneCall size={16} />
                  <span>Call: {company.phone.primary}</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> 100% Dedicated Closed Container
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Zero Moving-Day Hidden Extras
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check size={14} className="text-accent" /> Full Transit Insurance Available
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
