import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  ShieldCheck,
  Lock,
  FileText,
  Mail,
  PhoneCall,
  MapPin,
  Clock,
  Eye,
  Database,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { company } from "@/data/company";
import SEO from "@/configs/seo";
import Button from "../../shared/components/Button";

const sections = [
  { id: "overview", label: "1. Scope & Entity Overview" },
  { id: "collection", label: "2. Personal Data We Collect" },
  { id: "purpose", label: "3. Lawful Basis & Usage" },
  { id: "no-resale", label: "4. Zero Third-Party Resale" },
  { id: "security", label: "5. Security & Retention" },
  { id: "rights", label: "6. Your Privacy Rights" },
  { id: "cookies", label: "7. Cookies & Analytics" },
  { id: "grievance", label: "8. Grievance Redressal Officer" },
];

const Privacy = () => {
  const [activeSection, setActiveSection] = useState("overview");

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
        title="Privacy Policy - Customer Data Protection | 1st Om Packers"
        description={`Read the official Privacy Policy of ${company.legalName}. Learn how we protect customer phone numbers, inventory records, and relocation addresses in compliance with DPDP Act regulations.`}
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
                <span className="text-text font-semibold">Privacy Policy</span>
              </li>
            </ol>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-text text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
                <Lock size={14} className="text-accent" />
                <span>Institutional Data Privacy - DPDP Act 2023 Aligned</span>
              </div>

              <h1
                className="font-display font-extrabold text-text tracking-tight mb-4"
                style={{ fontSize: "clamp(2.1rem, 4vw, 3.4rem)", lineHeight: "1.2" }}
              >
                Privacy &amp; Data Protection Policy
              </h1>

              <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-3xl">
                We respect your personal privacy. {company.brandName} handles your personal contact details,
                floor plans, and inventory records with strict confidentiality, industrial-grade encryption, and a zero marketing resale guarantee.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <a
                href={`mailto:${company.email.privacy}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-text text-xs sm:text-sm font-semibold hover:border-primary/40 hover:bg-background transition-colors"
              >
                <Mail size={15} className="text-primary" />
                <span>{company.email.privacy}</span>
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
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">0% Data Resale</p>
                <p className="text-[11px] text-text-muted">Never Shared with Realtors</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center shrink-0">
                <Lock size={20} className="text-accent" />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">SSL/TLS 256-Bit</p>
                <p className="text-[11px] text-text-muted">Encrypted Lead Capture</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">DPDP Aligned</p>
                <p className="text-[11px] text-text-muted">Indian Digital Privacy Law</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 border-l border-border/60">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-700 flex items-center justify-center shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <p className="font-display font-extrabold text-text text-sm sm:text-base">Grievance Desk</p>
                <p className="text-[11px] text-text-muted">Direct Redressal Officer</p>
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
                <nav className="space-y-1" aria-label="Privacy sections">
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

              {/* Data Privacy Desk Contact Box */}
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 text-text font-display font-bold text-sm">
                  <Lock size={16} className="text-primary" />
                  <span>Privacy Inquiries Desk</span>
                </div>
                <p className="text-xs text-text-muted leading-relaxed">
                  Have inquiries concerning your personal records, desire data removal, or wish to update your preferences?
                </p>
                <div className="space-y-2 pt-1 border-t border-border/70 text-xs">
                  <div className="flex items-center gap-2 text-text">
                    <Mail size={14} className="text-primary shrink-0" />
                    <a href={`mailto:${company.email.privacy}`} className="text-primary font-bold hover:underline break-all">
                      {company.email.privacy}
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
              <div id="overview" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-bold text-text text-xl sm:text-2xl tracking-tight">
                  1. Scope &amp; Entity Overview
                </h2>
                <p className="text-text-muted">
                  This Privacy and Data Protection Policy outlines how <strong>{company.legalName}</strong> (referred to as &quot;{company.brandName}&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, maintains, and safeguards information obtained from consumers, residential customers, and commercial clients using our web portal, mobile forms, and direct customer support desks.
                </p>
                <p className="text-text-muted">
                  Our operations are registered in Patna, Bihar, and coordinate household moving, vehicle transportation, and corporate relocations throughout India under relevant statutory frameworks including the <strong>Digital Personal Data Protection (DPDP) Act 2023</strong> and the <strong>Information Technology Act, 2000</strong>.
                </p>
              </div>

              {/* Section 2 */}
              <div id="collection" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                  2. Personal Data We Collect
                </h2>
                <p className="text-text-muted">
                  We gather only the minimum specific data points required to calculate binding moving estimates and carry out logistical execution:
                </p>
                <ul className="space-y-2.5 text-text-muted">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-green-600 mt-1 shrink-0" />
                    <span><strong>Identity &amp; Contact Information:</strong> Full name, primary telephone number, alternate phone number, and optional email address.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-green-600 mt-1 shrink-0" />
                    <span><strong>Relocation Logistics Details:</strong> Origin physical address, destination address, building floor numbers, lift access status, and desired moving schedule.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-green-600 mt-1 shrink-0" />
                    <span><strong>Consignment Inventory Lists:</strong> Categories and quantities of appliances, furniture, delicate glass, and vehicles submitted via our smart forms or WhatsApp surveys.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-green-600 mt-1 shrink-0" />
                    <span><strong>Statutory &amp; Vehicle Documentation:</strong> Clear photocopies of Vehicle Registration Certificate (RC), valid insurance cover, and government photo ID (Aadhaar or Driving License) solely when vehicle relocation or comprehensive transit insurance is arranged.</span>
                  </li>
                </ul>
              </div>

              {/* Section 3 */}
              <div id="purpose" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                  3. Lawful Basis &amp; Usage of Collected Data
                </h2>
                <p className="text-text-muted">
                  Your details are utilized strictly for legitimate operational purposes related to executing your move:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="p-4 rounded-xl bg-background border border-border/80 text-xs sm:text-sm">
                    <div className="font-bold text-text mb-1">Pre-Move Surveying</div>
                    <div className="text-text-muted">Calculating route distances, container dimensions, packing material tiers, and presenting itemized binding quotes.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border/80 text-xs sm:text-sm">
                    <div className="font-bold text-text mb-1">Fleet Transit Updates</div>
                    <div className="text-text-muted">Enabling your dedicated Move Coordinator to provide telephone and WhatsApp updates regarding loading and checkpoint progress.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border/80 text-xs sm:text-sm">
                    <div className="font-bold text-text mb-1">Consignment Documentation</div>
                    <div className="text-text-muted">Generating formal Consignment Notes (Bilty / LR Copies), GST tax invoices, and insurance certificates for corporate reimbursement.</div>
                  </div>
                  <div className="p-4 rounded-xl bg-background border border-border/80 text-xs sm:text-sm">
                    <div className="font-bold text-text mb-1">Customer Support &amp; Claims</div>
                    <div className="text-text-muted">Facilitating claims verification with established underwriters in the rare event of transit road contingencies.</div>
                  </div>
                </div>
              </div>

              {/* Section 4 */}
              <div id="no-resale" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border-2 border-primary/20 shadow-xs space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-green-500/10 text-green-700 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck size={14} />
                  <span>Our Binding Customer Pledge</span>
                </div>
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                  4. Zero Third-Party Resale or Commercial Renting
                </h2>
                <p className="text-text font-medium">
                  We maintain a strict anti-monetization policy regarding customer databases.
                </p>
                <p className="text-text-muted">
                  Unlike aggregator portals that sell your moving requirement to 5 to 10 unverified local contractors, {company.brandName} handles all relocations directly through our permanent company fleet.
                </p>
                <p className="text-text-muted">
                  We never sell, rent, trade, or disclose your contact details or destination addresses to real estate brokers, interior designers, telemarketers, or commercial databases.
                </p>
              </div>

              {/* Section 5 */}
              <div id="security" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                  5. Data Storage, Technical Controls &amp; Retention
                </h2>
                <p className="text-text-muted">
                  All customer transmissions submitted through our online quote generator and contact consoles are protected via 256-bit SSL/TLS end-to-end encryption.
                </p>
                <div className="space-y-3 text-text-muted">
                  <p>
                    <strong>Access Controls:</strong> Access to customer names, addresses, and telephone numbers is restricted strictly to authorized operations supervisors and designated Move Coordinators handling your specific transit manifest.
                  </p>
                  <p>
                    <strong>Retention Period:</strong> Lead inquiries that do not result in a confirmed relocation booking are automatically purged from active databases after 90 days. Booking invoices, consignment notes, and tax records are retained for statutory periods required under Indian tax and transport regulations.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div id="rights" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                  6. Your Rights Under Indian Data Protection Laws
                </h2>
                <p className="text-text-muted">
                  Under the Digital Personal Data Protection Act 2023, you possess explicit legal rights over your personal data:
                </p>
                <ul className="space-y-2 text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">A.</span>
                    <span><strong>Right to Access:</strong> You may request a summary of the personal information we maintain regarding your relocation history.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">B.</span>
                    <span><strong>Right to Rectification:</strong> You may rectify inaccurate phone numbers, pickup dates, or addresses at any time before departure.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">C.</span>
                    <span><strong>Right to Erasure:</strong> Following completion of your relocation and settlement of accounts, you may request the deletion of non-statutory records from our databases.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-primary">D.</span>
                    <span><strong>Right to Withdraw Consent:</strong> You may opt out of promotional service notifications at any moment by notifying our privacy desk.</span>
                  </li>
                </ul>
              </div>

              {/* Section 7 */}
              <div id="cookies" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                  7. Cookies &amp; Website Telemetry
                </h2>
                <p className="text-text-muted">
                  Our web application utilizes basic, privacy-preserving session cookies designed to store user form selections (such as selected moving service or origin city) so that navigating between pages does not reset your inputs. We do not employ intrusive cross-site tracking pixels or sell behavioural browsing logs.
                </p>
              </div>

              {/* Section 8 */}
              <div id="grievance" className="scroll-mt-24 p-6 sm:p-8 rounded-2xl bg-surface border-2 border-primary/25 shadow-sm space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary text-white text-xs font-bold uppercase tracking-wider">
                  <UserCheck size={14} />
                  <span>Statutory Appointment</span>
                </div>
                <h2 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                  8. Grievance Redressal &amp; Data Protection Officer
                </h2>
                <p className="text-text-muted">
                  In compliance with the Digital Personal Data Protection Act 2023 and the Information Technology (Intermediary Guidelines) Rules, details of our appointed Grievance Officer are published below:
                </p>
                <div className="p-5 rounded-xl bg-background border border-border space-y-2 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="text-text-muted">Designation:</div>
                      <div className="font-bold text-text">Grievance &amp; Privacy Officer</div>
                    </div>
                    <div>
                      <div className="text-text-muted">Official Entity:</div>
                      <div className="font-bold text-text">{company.legalName}</div>
                    </div>
                    <div>
                      <div className="text-text-muted">Dedicated Privacy Email:</div>
                      <a href={`mailto:${company.email.privacy}`} className="font-bold text-primary hover:underline">
                        {company.email.privacy}
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
                    <span>Postal Address: </span>
                    <span className="text-text font-medium">
                      {company.headOffice.addressLine}, {company.headOffice.city}, {company.headOffice.state} - {company.headOffice.pincode}
                    </span>
                  </div>
                  <div className="text-[11px] text-text-muted pt-1">
                    All formal data grievance notifications receive a verified response and resolution within statutory 30-day timelines.
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
                Have a Question Concerning Your Personal Privacy?
              </h3>
              <p className="text-xs sm:text-sm text-text-muted">
                Our dedicated privacy team responds promptly to all customer access and update inquiries.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`mailto:${company.email.privacy}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-display font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-sm"
              >
                <Mail size={15} />
                <span>Email Privacy Officer</span>
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

export default Privacy;
