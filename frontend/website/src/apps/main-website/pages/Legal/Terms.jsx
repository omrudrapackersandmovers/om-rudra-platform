import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  Scale,
  FileCheck,
  ShieldAlert,
  Truck,
  AlertTriangle,
  FileText,
  Mail,
  PhoneCall,
  MapPin,
  Clock,
  Car,
  CheckCircle2,
} from "lucide-react";
import { company } from "@/data/company";
import SEO from "@/configs/seo";
import Button from "../../shared/components/Button";

const sections = [
  { id: "contract-scope", label: "1. Scope & Quotation Validity" },
  { id: "pricing-inventory", label: "2. Binding Price & Inventory" },
  { id: "prohibited-goods", label: "3. Prohibited & Hazardous Goods" },
  { id: "transit-insurance", label: "4. Transit Insurance & Claims" },
  { id: "vehicle-transport", label: "5. Vehicle Carrier Protocols" },
  { id: "delivery-inspection", label: "6. Delivery Inspection & LR" },
  { id: "delays-force-majeure", label: "7. Route Delays & Force Majeure" },
  { id: "jurisdiction", label: "8. Dispute Arbitration & Court" },
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState("contract-scope");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90;
      const elPosition = el.getBoundingClientRect().top;
      const offsetPosition = elPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <SEO
        title="Terms of Service - Moving Contract & Legal Policies | 1st Om Packers"
        description={`Official Terms of Service and Operational Relocation Policies governing ${company.legalName}. Carriage by Road Act 2007 compliant, binding quotation integrity, and transit insurance guidelines.`}
      />

      {/* ── 1. HERO SECTION ──────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-b from-surface via-background to-background pt-10 pb-12 sm:pt-14 sm:pb-16 border-b border-border/70 overflow-hidden">
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"
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
                <span className="text-text font-semibold">Terms of Service</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-text text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Scale size={14} className="text-accent" />
                <span>Carriage by Road Act 2007 Aligned - Legal Operating Agreement</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Terms of Service &amp; Relocation Operations Policy
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-3xl">
                These Terms of Service govern all freight handling, packaging, household shifting, vehicle carrier, and commercial logistics services executed by{" "}
                <span className="text-text font-semibold">{company.legalName}</span>. By commissioning our relocation services or accepting a formal consignment note (Lorry Receipt), you enter into a legally binding contract under the laws of the Republic of India.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <a
                href={`mailto:${company.email.legal}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-text text-xs sm:text-sm font-semibold hover:border-primary/40 hover:bg-background transition-colors"
              >
                <Mail size={15} className="text-primary" />
                <span>{company.email.legal}</span>
              </a>
              <span className="text-[11px] text-text-muted">
                Effective Date: September 2026
              </span>
            </div>
          </div>

          {/* Trust Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border/80 shadow-xs">
            <div className="flex items-center gap-3 p-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Scale size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">Carriage Act 2007</p>
                <p className="text-[11px] text-text-muted">Statutory Carrier Rules</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <FileCheck size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">Binding Quotation</p>
                <p className="text-[11px] text-text-muted">Zero Hidden Surcharges</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">Sealed Carrier</p>
                <p className="text-[11px] text-text-muted">Consignment Note (LR)</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-700 flex items-center justify-center shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">48-Hr Claim Window</p>
                <p className="text-[11px] text-text-muted">Dedicated Surveyor Redress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN POLICY BODY & STICKY NAV ─────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">

            {/* Left Column: Sticky Index Navigation & Desk Contact */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm">
                <h3 className="font-display font-bold text-text text-sm uppercase tracking-wider mb-4">
                  Document Contents
                </h3>
                <nav className="space-y-1" aria-label="Terms sections">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                        activeSection === sec.id
                          ? "bg-primary text-white shadow-xs"
                          : "text-text-muted hover:bg-background hover:text-text"
                      }`}
                    >
                      <span>{sec.label}</span>
                      <ChevronRight
                        size={13}
                        className={`transition-transform ${activeSection === sec.id ? "rotate-90 text-white" : "text-text-muted"}`}
                      />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Legal & Compliance Desk Contact Box */}
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-text font-display font-bold text-sm">
                  <Scale size={16} className="text-primary" />
                  <span>Legal &amp; Claims Desk</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Have inquiries concerning contract terms, require corporate MSAs, or need transit insurance documentation?
                </p>
                <div className="space-y-2 pt-1 border-t border-border/70 text-xs">
                  <div className="flex items-center gap-2 text-text">
                    <Mail size={14} className="text-primary shrink-0" />
                    <a href={`mailto:${company.email.legal}`} className="text-primary font-bold hover:underline break-all">
                      {company.email.legal}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <ShieldAlert size={14} className="text-primary shrink-0" />
                    <a href={`mailto:${company.email.claims}`} className="text-primary font-bold hover:underline break-all">
                      {company.email.claims}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-text">
                    <PhoneCall size={14} className="text-primary shrink-0" />
                    <a href={`tel:${company.phone.primary}`} className="font-bold text-text hover:underline">
                      {company.phone.primary}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: In-Depth Legal Content */}
            <div className="lg:col-span-8 space-y-12 text-text leading-relaxed text-sm sm:text-base">

              {/* Section 1 */}
              <div id="contract-scope" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  1. Scope &amp; Quotation Validity
                </h2>
                <p className="text-text-muted">
                  <strong>1.1 Indicative vs. Binding Quotes:</strong> Online estimates, instant rates, and verbal approximations are indicative and do not constitute a legally binding contractual offer. A binding quotation is executed exclusively following:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-text-muted">
                  <li>A physical on-site pre-move survey conducted by a certified 1st Om moving officer, OR</li>
                  <li>A verified digital video survey where complete household contents, cabinet interiors, and access corridors are documented, OR</li>
                  <li>A confirmed itemized inventory sheet mutually endorsed by both the consignor (client) and company operations.</li>
                </ul>
                <p className="text-text-muted">
                  <strong>1.2 30-Day Price Lock Guarantee:</strong> All formal written quotations issued by {company.legalName} remain valid for <strong>30 calendar days</strong> from the date of issuance. If move execution is scheduled beyond 30 days, quotation amounts may be recalibrated to reflect statutory fuel surcharge updates or highway tax modifications.
                </p>
                <p className="text-text-muted">
                  <strong>1.3 Booking Confirmation &amp; Slot Reservation:</strong> A move date and dedicated vehicle allocation are legally locked upon receipt of the agreed token advance (typically 10% to 20% of total moving charges). Rescheduling requests must be conveyed at least 48 hours prior to packing day to prevent slot forfeiture.
                </p>
              </div>

              {/* Section 2 */}
              <div id="pricing-inventory" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  2. Binding Price Integrity &amp; Inventory Adjustments
                </h2>
                <p className="text-text-muted">
                  <strong>2.1 Zero Unfair Destination Surcharges:</strong> {company.legalName} guarantees that no arbitrary or hidden charges will be demanded on moving day or at destination unloading, provided the surveyed inventory, floor configurations, and physical logistics conditions remain identical to the agreed scope.
                </p>
                <p className="text-text-muted">
                  <strong>2.2 Permissible Cost Adjustments:</strong> Price variations will be applied transparently if any of the following physical discrepancies occur:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-xl bg-background border border-border/80 space-y-1">
                    <p className="font-bold text-text text-xs uppercase tracking-wider">Undeclared Additional Inventory</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Unlisted heavy furniture, oversized gym equipment, additional carton loads, or major appliances added on packing day will be charged at transparent per-carton and labor rates.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border/80 space-y-1">
                    <p className="font-bold text-text text-xs uppercase tracking-wider">Non-Operational Lifts &amp; Long Carry</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      If elevators at origin or destination are out of service requiring manual stair carrying beyond the 2nd floor, or if society rules force vehicle parking over 50 meters away, standard long-carry rates apply.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border/80 space-y-1">
                    <p className="font-bold text-text text-xs uppercase tracking-wider">Rope / Pulley Balcony Hoisting</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Solid teak beds, oversized marble dining tables, or double-door refrigerators that cannot navigate building stairwells and require external pulley hoisting will be quoted prior to rigging.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border/80 space-y-1">
                    <p className="font-bold text-text text-xs uppercase tracking-wider">Society Entry &amp; Association Dues</p>
                    <p className="text-xs text-text-muted leading-relaxed">
                      Specific gated community or housing society entry permits, non-refundable lift usage fees, and security deposits mandated by residential societies remain the responsibility of the customer.
                    </p>
                  </div>
                </div>
                <p className="text-text-muted pt-1">
                  <strong>2.3 Payment Schedule:</strong> Unless contracted under corporate credit terms, household moving payments follow the standard schedule: token advance at booking, 80% upon loading and Lorry Receipt issuance, and the remaining 10% to 20% prior to offloading at the destination address.
                </p>
              </div>

              {/* Section 3 */}
              <div id="prohibited-goods" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  3. Strictly Prohibited &amp; Hazardous Consignments
                </h2>
                <p className="text-text-muted">
                  To ensure highway safety, adhere to Indian Explosives Act regulations, and protect other cargo in shared carriers, the following articles are <strong>strictly prohibited</strong> from being loaded into any {company.legalName} vehicle:
                </p>
                <div className="p-4 sm:p-5 rounded-xl bg-rose-50/80 border-2 border-rose-200/90 space-y-2.5">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-950 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle size={14} className="text-rose-700 shrink-0" />
                    <span>Dangerous Goods - Zero Carriage Tolerance</span>
                  </div>
                  <ul className="text-xs sm:text-sm text-text leading-relaxed list-disc pl-5 space-y-1.5">
                    <li><strong className="text-text font-semibold">Combustibles &amp; Flammables:</strong> LPG cylinders (empty or filled), kerosene cans, petrol, diesel, paint thinners, solvent adhesives, fireworks, matches, and aerosol pressure cans.</li>
                    <li><strong className="text-text font-semibold">Batteries &amp; Inverters:</strong> Unsealed tubular lead-acid batteries containing loose sulfuric acid electrolyte. (Spill-proof SMF or dry gel batteries are permitted if disconnected).</li>
                    <li><strong className="text-text font-semibold">Perishable &amp; Liquid Foodstuffs:</strong> Fresh meats, vegetables, open liquid oil containers, unsealed pickles, and dairy products prone to spoilage or leakage during transit.</li>
                    <li><strong className="text-text font-semibold">Contraband &amp; Firearms:</strong> Narcotics, unlicensed weapons, ammunition, illegal substances, and any contraband prohibited under the Indian Penal Code and NDPS Act.</li>
                    <li><strong className="text-text font-semibold">Living Beings:</strong> Domestic pets, livestock, plants, and botanical saplings (separate climate-controlled courier must be arranged).</li>
                  </ul>
                </div>
                <p className="text-text-muted">
                  <strong>3.2 High-Value Personal Custody Mandatory:</strong> The customer explicitly agrees to retain sole physical custody of personal jewelry, gold/silver bullion, loose cash, bearer bonds, credit/debit cards, original educational certificates, passports, land title deeds, and prescription medications. {company.legalName} accepts <strong>zero liability</strong> for undeclared cash or jewelry placed inside packed cartons.
                </p>
              </div>

              {/* Section 4 */}
              <div id="transit-insurance" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  4. Transit Insurance, Risk Cover &amp; 48-Hour Claim Protocol
                </h2>
                <p className="text-text-muted">
                  <strong>4.1 Transit Insurance Underwriting:</strong> Transit insurance is executed with accredited national public and private general insurance underwriters (such as National Insurance, IFFCO Tokio, or Oriental Insurance). Insurance premium is charged at 3% (or agreed contract rate) of total declared consignment valuation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/80 border-2 border-emerald-200/90 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-950 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 size={14} className="text-emerald-700 shrink-0" />
                      <span>Covered Perils</span>
                    </div>
                    <p className="text-xs sm:text-sm text-text font-normal leading-relaxed">
                      Vehicle overturn, major highway collisions, fire during transport, highway theft/burglary substantiated by police FIR, bridge collapses, and severe transit perils.
                    </p>
                  </div>
                  <div className="p-4 sm:p-5 rounded-xl bg-rose-50/80 border-2 border-rose-200/90 space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-100 text-rose-950 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle size={14} className="text-rose-700 shrink-0" />
                      <span>Exclusions &amp; Limitations</span>
                    </div>
                    <p className="text-xs sm:text-sm text-text font-normal leading-relaxed">
                      Pre-existing scratches, internal electronic circuit board failure without external cabinet impact, customer-packed boxes without crew inspection, and normal transit wear.
                    </p>
                  </div>
                </div>
                <p className="text-text-muted pt-1">
                  <strong>4.2 Statutory 48-Hour Claim Filing Protocol:</strong> In the unfortunate event of visible damage or shortfall upon delivery:
                </p>
                <ol className="list-decimal pl-5 space-y-1.5 text-text-muted">
                  <li>The damage must be explicitly endorsed on the destination driver copy of the Lorry Receipt (LR) before signing.</li>
                  <li>The customer must email detailed high-resolution photographs, inventory box serial numbers, and incident description to <a href={`mailto:${company.email.claims}`} className="text-primary font-bold hover:underline">{company.email.claims}</a> within <strong>48 hours</strong> of consignment delivery.</li>
                  <li>Damaged items and original packing materials must be retained for physical inspection by the appointed insurance surveyor. Discarding damaged articles prior to surveyor inspection invalidates claim settlement.</li>
                </ol>
              </div>

              {/* Section 5 */}
              <div id="vehicle-transport" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  5. Vehicle Carrier (Car &amp; Bike) Relocation Regulations
                </h2>
                <p className="text-text-muted">
                  For two-wheelers, luxury sedans, and SUVs transported via open or enclosed specialized car carriers:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-text-muted">
                  <li>
                    <strong>Vehicle Condition Inspection Report:</strong> A comprehensive physical inspection sheet detailing existing scratches, odometer reading, dent marks, windshield condition, and tyre wear will be jointly signed at pickup.
                  </li>
                  <li>
                    <strong>Fuel Tank Level:</strong> Fuel tank must contain no more than approximately <strong>one-quarter (1/4) tank</strong> of fuel. This minimizes flammability hazards during transit while ensuring sufficient fuel for driving on and off carrier hydraulic ramps.
                  </li>
                  <li>
                    <strong>Documentation Compliance:</strong> Consignor must provide self-attested photocopies of the Vehicle Registration Certificate (RC), Valid Comprehensive Insurance Policy, and Pollution Under Control (PUC) certificate for state border checkpoints.
                  </li>
                  <li>
                    <strong>Personal Belongings Inside Vehicle:</strong> No heavy luggage or household goods are permitted to be packed inside the car boot or cabin, as carrier insurance strictly covers the automobile chassis, not internal cargo.
                  </li>
                </ul>
              </div>

              {/* Section 6 */}
              <div id="delivery-inspection" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  6. Physical Delivery Inspection &amp; Consignment Note (LR) Sign-Off
                </h2>
                <p className="text-text-muted">
                  <strong>6.1 Mandatory Consignee Presence:</strong> The consignor, consignee, or their legally authorized adult representative must be present at the destination address during unloading.
                </p>
                <p className="text-text-muted">
                  <strong>6.2 Box Count Verification:</strong> Before the moving crew departs the destination premises:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-text-muted">
                  <li>Every numbered carton must be checked off against the origin inventory packing checklist.</li>
                  <li>Furniture items unpacked and reassembled must be physically examined for structural soundness.</li>
                  <li>Any discrepancy in carton count or noticeable package tampering must be recorded in the remarks column of the delivery receipt copy.</li>
                </ul>
                <p className="text-text-muted">
                  <strong>6.3 Unconditional Delivery Discharge:</strong> Executing the delivery sheet with &quot;Received in Good Condition&quot; without specific written remarks constitutes conclusive legal proof that the consignment was delivered complete and undamaged. Subsequent claims filed days later without written LR remarks will be rejected by underwriter surveyors.
                </p>
              </div>

              {/* Section 7 */}
              <div id="delays-force-majeure" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  7. Route Delays, Weather &amp; Force Majeure
                </h2>
                <p className="text-text-muted">
                  <strong>7.1 Estimated Transit Durations:</strong> Transit schedules provided in quotations are realistic operational estimates calculated under normal highway driving conditions. While our logistics dispatch desk maintains a 96% on-time delivery record, unexpected highway occurrences may alter timelines.
                </p>
                <p className="text-text-muted">
                  <strong>7.2 Force Majeure Events:</strong> {company.legalName} shall not be held financially liable for transit delays, missed scheduled delivery hours, or storage demurrage resulting from causes beyond reasonable human control, including:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-text-muted">
                  <li>Acts of God, torrential monsoon flooding, landslides in hilly terrains, or earthquakes.</li>
                  <li>Unannounced highway bandhs, civil unrest, political strikes, or communal disruptions.</li>
                  <li>Regional border RTO strike actions, state highway blockades, or emergency bridge closures.</li>
                  <li>Vehicle mechanical breakdowns occurring on interstate expressways (in which case emergency replacement carriers are dispatched within 24 hours).</li>
                </ul>
                <p className="text-text-muted">
                  Our dedicated move coordination desk proactively sends transit location updates via WhatsApp and phone SMS throughout any unavoidable weather delay.
                </p>
              </div>

              {/* Section 8 */}
              <div id="jurisdiction" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  8. Dispute Arbitration &amp; Patna Civil Court Jurisdiction
                </h2>
                <p className="text-text-muted">
                  <strong>8.1 Amicable Executive Resolution:</strong> Both parties agree to make good-faith efforts to resolve any contractual dispute, compensation claim, or service dissatisfaction through mutual consultation with {company.legalName} senior customer operations leadership before initiating formal legal proceedings.
                </p>
                <p className="text-text-muted">
                  <strong>8.2 Sole Arbitrator Appointment:</strong> If mutual resolution is not achieved within 30 business days of written notice, the dispute shall be referred to arbitration in accordance with the Arbitration and Conciliation Act 1996. The arbitration shall be conducted by a sole independent arbitrator appointed by mutual consent. The venue and seat of arbitration shall be Patna, Bihar, and proceedings shall be conducted in English or Hindi.
                </p>
                <p className="text-text-muted">
                  <strong>8.3 Exclusive Jurisdiction:</strong> Subject to the arbitration clause above, any legal action, suit, or judicial proceeding arising out of or relating to these Terms of Service or relocation operations shall be subject to the exclusive jurisdiction of the competent Civil Courts located in <strong>Patna, Bihar, India</strong>.
                </p>

                <div className="p-5 rounded-xl bg-background border border-border/80 space-y-3 mt-4 text-xs">
                  <div className="font-bold text-text uppercase tracking-wider">
                    Official Carrier &amp; Legal Entity Information
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="text-text-muted">Official Entity:</div>
                      <div className="font-bold text-text">{company.legalName}</div>
                    </div>
                    <div>
                      <div className="text-text-muted">Legal &amp; Contracts Desk:</div>
                      <a href={`mailto:${company.email.legal}`} className="font-bold text-primary hover:underline">
                        {company.email.legal}
                      </a>
                    </div>
                    <div>
                      <div className="text-text-muted">Direct Support Line:</div>
                      <a href={`tel:${company.phone.primary}`} className="font-bold text-text hover:underline">
                        {company.phone.primary}
                      </a>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/70 text-text-muted">
                    <span>Registered Office: </span>
                    <span className="text-text font-medium">
                      {company.headOffice.addressLine}, {company.headOffice.city}, {company.headOffice.state} - {company.headOffice.pincode}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 3. BOTTOM REASSURANCE & CONTACT STRIP ────────────────────── */}
      <section className="bg-surface py-12 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-text text-lg mb-1">
                Have a Question Concerning Legal Terms or Commercial Contracts?
              </h3>
              <p className="text-xs sm:text-sm text-text-muted">
                Our legal and operations compliance desk responds promptly to all customer and corporate inquiries.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`mailto:${company.email.legal}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-display font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-sm"
              >
                <Mail size={15} />
                <span>Email Legal Counsel</span>
              </a>
              <Button to="/contact" variant="outline" size="sm">
                General Support Desk
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Terms;
