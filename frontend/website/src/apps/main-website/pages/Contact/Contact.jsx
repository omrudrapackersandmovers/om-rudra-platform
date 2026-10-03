import { useState } from "react";
import { Link } from "react-router";
import {
  ChevronRight,
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Truck,
  Car,
  Briefcase,
  AlertCircle,
  Send,
  ExternalLink,
  Headphones,
  FileText,
  ChevronDown,
} from "lucide-react";
import { company } from "../../../../data/company";
import SEO from "../../../../configs/seo";
import Button from "../../shared/components/Button";

// Department routing directory
const departments = [
  {
    id: "household",
    title: "Household Relocation Desk",
    icon: Truck,
    description: "1 BHK, 2 BHK, 3 BHK, villas, and local or interstate home moving.",
    contactPerson: "Rajesh Kumar (Senior Move Planner)",
    timing: "8:00 AM - 9:00 PM Daily",
    phone: company.phone.primary,
    badge: "Most Popular",
  },
  {
    id: "vehicles",
    title: "Vehicle Transport Cell",
    icon: Car,
    description: "Hydraulic car carriers, bike crating, condition reports, and transit updates.",
    contactPerson: "Manoj Singh (Fleet Operations)",
    timing: "9:00 AM - 8:00 PM Daily",
    phone: company.phone.primary,
    badge: "Enclosed Carrier",
  },
  {
    id: "corporate",
    title: "Corporate & Commercial Desk",
    icon: Briefcase,
    description: "Office relocation, IT hardware transport, GST billing, and vendor empanelment.",
    contactPerson: "Amit Sharma (Enterprise Accounts)",
    timing: "9:30 AM - 6:30 PM (Mon - Sat)",
    phone: company.phone.primary,
    badge: "GST Billing",
  },
  {
    id: "support",
    title: "Escalations & Insurance Claims",
    icon: ShieldCheck,
    description: "Direct supervisor access for live move queries, schedule adjustments, or claims.",
    contactPerson: "Customer Care Desk",
    timing: "24/7 Transit Helpline",
    phone: company.phone.primary,
    badge: "Fast Track",
  },
];

// Regional Hubs
const regionalHubs = [
  {
    city: "Patna",
    state: "Bihar",
    role: "Central Headquarters & Primary Dispatch",
    address: `${company.headOffice.addressLine}, Soranpur, Patna - 800027`,
    phone: company.phone.primary,
    isHq: true,
  },
  {
    city: "Ranchi",
    state: "Jharkhand",
    role: "Jharkhand State Hub & Industrial Moving Cell",
    address: "Main Road, Near Overbridge, Ranchi, Jharkhand - 834001",
    phone: company.phone.primary,
    isHq: false,
  },
  {
    city: "Kolkata",
    state: "West Bengal",
    role: "Eastern Regional Corridor & Port Logistics",
    address: "Jessore Road, Dum Dum, Kolkata, West Bengal - 700028",
    phone: company.phone.primary,
    isHq: false,
  },
  {
    city: "Delhi NCR",
    state: "Delhi & Haryana",
    role: "Northern Terminal & Express Gateway",
    address: "Sector 18, Udyog Vihar, Gurugram, Delhi NCR - 122015",
    phone: company.phone.primary,
    isHq: false,
  },
  {
    city: "Lucknow",
    state: "Uttar Pradesh",
    role: "Central UP Corridor Hub",
    address: "Transport Nagar, Kanpur Road, Lucknow, UP - 226012",
    phone: company.phone.primary,
    isHq: false,
  },
  {
    city: "Bengaluru",
    state: "Karnataka",
    role: "Southern Tech Corridor Logistics",
    address: "Hosur Main Road, Electronic City, Bengaluru - 560100",
    phone: company.phone.primary,
    isHq: false,
  },
];

// Response Timeline Steps
const responseTimeline = [
  {
    step: "01",
    title: "Immediate Connect",
    desc: "Calls answered under 2 rings. WhatsApp messages acknowledged within 10-15 minutes.",
  },
  {
    step: "02",
    title: "Survey Scheduled",
    desc: "Free virtual video survey or doorstep visit confirmed at a time that suits your schedule.",
  },
  {
    step: "03",
    title: "Guaranteed Quote",
    desc: "Receive a written, binding itemized quotation with zero hidden or surprise charges.",
  },
  {
    step: "04",
    title: "Move Coordinator Assigned",
    desc: "A dedicated human coordinator manages your move from packing day until delivery.",
  },
];

// Support FAQs
const contactFaqs = [
  {
    q: "How quickly will someone respond to my contact message?",
    a: "During our standard operational hours (8:00 AM - 9:00 PM), our phone desk answers immediately and WhatsApp queries receive a response within 10 to 15 minutes. Inquiries submitted through the website form are reviewed and called back within 30 minutes.",
  },
  {
    q: "Can I schedule a home or office survey on a Sunday or public holiday?",
    a: "Yes, absolutely. Our field survey supervisors and quotation teams operate 7 days a week, including Sundays and regional holidays, so you can plan your move without taking time off work.",
  },
  {
    q: "How do I check the live status of an ongoing move?",
    a: "Every customer is assigned a dedicated Move Coordinator upon booking. You will have their direct personal mobile and WhatsApp number for real-time truck location updates, checkpoint crossings, and expected arrival times.",
  },
  {
    q: "Who should I contact if I need to change my moving date?",
    a: "Contact your assigned Move Coordinator or call our central desk at +91 7033488691 at least 24 hours prior to your scheduled move. We accommodate date changes without rescheduling penalties subject to truck availability.",
  },
  {
    q: "How do corporate clients obtain official GST invoices and transit receipts?",
    a: "All commercial moves, corporate employee relocations, and insured household shifts receive formal GST invoices, physical consignment notes (Bilty / LR Copy), and packing inventories delivered digitally or by speed post as required for company reimbursement.",
  },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    department: "household",
    preferredContact: "phone",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | submitting | success | error
  const [activeFaq, setActiveFaq] = useState(null);

  const whatsappCleanNumber = company.phone.whatsapp
    ? company.phone.whatsapp.replace(/\D/g, "")
    : "917033488691";

  const defaultWhatsappUrl = `https://wa.me/${whatsappCleanNumber}?text=Hi%201st%20Om%20Packers%20and%20Movers%2C%20I%20have%20an%20enquiry%20regarding%20relocation%20services.`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.fullName.trim()) {
      errors.fullName = "Please enter your full name.";
    }
    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!cleanPhone) {
      errors.phone = "Please enter your mobile phone number.";
    } else if (cleanPhone.length < 10) {
      errors.phone = "Please enter a valid 10-digit mobile number.";
    }
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.message.trim()) {
      errors.message = "Please write a brief note about your moving requirements.";
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitStatus("submitting");

    // Simulate reliable dispatch
    setTimeout(() => {
      setSubmitStatus("success");
    }, 800);
  };

  const handleResetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      department: "household",
      preferredContact: "phone",
      message: "",
    });
    setFormErrors({});
    setSubmitStatus("idle");
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <>
      <SEO
        title="Contact Us - Speak With Relocation Planners | 1st Om Packers"
        description={`Directly contact ${company.brandName} head office in ${company.headOffice.city}, Bihar or our dedicated regional desks. Phone ${company.phone.primary}, WhatsApp, or book a free doorstep move survey.`}
      />

      {/* ── 1. HERO SECTION ──────────────────────────────────────────── */}
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
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-1.5 text-xs sm:text-sm text-text-muted" role="list">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li aria-hidden="true"><ChevronRight size={13} /></li>
              <li>
                <span className="text-text font-semibold">Contact Us</span>
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            {/* Reassurance Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-text text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Headphones size={14} className="text-accent" />
              <span>Direct Human Support - No Robotic Call Centers</span>
            </div>

            {/* Page Title */}
            <h1
              className="font-display font-extrabold text-text tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: "1.2" }}
            >
              We Are Here When You Need Us.{" "}
              <span className="text-primary block sm:inline">Always Accessible.</span>
            </h1>

            {/* Hero Subtitle */}
            <p className="text-text-muted text-base sm:text-lg leading-relaxed mb-8">
              Speak directly with experienced relocation planners and fleet coordinators.
              Whether you need an instant move estimate, a doorstep survey, or live transit updates,
              our team in Patna and our regional network hubs are ready to assist.
            </p>

            {/* Quick Contact Bar */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-primary text-white font-display font-bold text-sm hover:bg-primary/90 transition-all shadow-sm active:scale-95"
                >
                  <PhoneCall size={16} />
                  <span>Call {company.phone.primary}</span>
                </a>
              )}

              <a
                href={defaultWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#25D366] text-white font-display font-bold text-sm hover:brightness-105 transition-all shadow-sm active:scale-95"
              >
                <MessageCircle size={16} />
                <span>Chat on WhatsApp</span>
              </a>

              <Button to="/get-quote" variant="outline" size="md">
                Get Free Move Survey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. THREE RAPID RESPONSE PILLARS ──────────────────────────── */}
      <section className="bg-surface/50 py-10 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Pillar 1: Phone */}
            <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <PhoneCall size={22} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20">
                  Under 2 Rings
                </span>
              </div>
              <h3 className="font-display font-bold text-text text-base sm:text-lg mb-1">
                Direct Hotline
              </h3>
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4">
                Immediate answers for booking, route planning, pricing, and active move tracking.
              </p>
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center gap-2 font-display font-bold text-primary hover:underline text-base"
                >
                  <span>{company.phone.primary}</span>
                </a>
              )}
              <div className="text-[11px] text-text-muted mt-2">
                Available daily: 8:00 AM - 9:00 PM
              </div>
            </div>

            {/* Pillar 2: WhatsApp */}
            <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center group-hover:bg-[#25D366] group-hover:text-white transition-colors">
                  <MessageCircle size={22} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-green-500/10 text-green-700 border border-green-500/20">
                  ~10 Min Reply
                </span>
              </div>
              <h3 className="font-display font-bold text-text text-base sm:text-lg mb-1">
                WhatsApp Assistant
              </h3>
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4">
                Share photos, videos of your home, location pins, or get instant itemized estimates.
              </p>
              <a
                href={defaultWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display font-bold text-green-700 hover:underline text-base"
              >
                <span>{company.phone.whatsapp || company.phone.primary}</span>
                <ExternalLink size={14} />
              </a>
              <div className="text-[11px] text-text-muted mt-2">
                Video & Photo Inventory Support
              </div>
            </div>

            {/* Pillar 3: Official Email */}
            <div className="p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/15 text-accent-foreground flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mail size={22} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  2 Hr Written SLA
                </span>
              </div>
              <h3 className="font-display font-bold text-text text-base sm:text-lg mb-1">
                Official Correspondence
              </h3>
              <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-4">
                Corporate relocation tenders, vendor empanelment, billing queries, and feedback.
              </p>
              <a
                href={`mailto:${company.email.general}`}
                className="inline-flex items-center gap-2 font-display font-bold text-primary hover:underline text-sm sm:text-base break-all"
              >
                <span>{company.email.general}</span>
              </a>
              <div className="text-[11px] text-text-muted mt-2">
                GST compliant invoicing support
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. INTERACTIVE CONTACT & DEPARTMENT ROUTING SECTION ─────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Send size={13} className="text-accent" />
              <span>Personalized Dispatch</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              Send a Message or Choose Your Department
            </h2>
            <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto text-balance">
              Direct routing ensures your inquiry reaches the right logistics specialist immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: Quick Contact Form */}
            <div className="lg:col-span-7 bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-sm">
              <div className="border-b border-border pb-5 mb-6">
                <h3 className="font-display font-bold text-text text-xl mb-1">
                  Send Direct Inquiry
                </h3>
                <p className="text-text-muted text-xs sm:text-sm">
                  Fill in your details below. A dedicated coordinator will contact you promptly.
                </p>
              </div>

              {submitStatus === "success" ? (
                <div className="p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-text space-y-4">
                  <div className="flex items-center gap-3 text-green-700 font-display font-bold text-lg">
                    <CheckCircle2 size={24} />
                    <span>Message Dispatched Successfully!</span>
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Thank you, <strong>{formData.fullName}</strong>. Your requirement has been routed to our{" "}
                    <strong>
                      {departments.find((d) => d.id === formData.department)?.title || "relocation desk"}
                    </strong>. A senior coordinator will reach out to you via{" "}
                    <strong>{formData.preferredContact}</strong> shortly at <strong>{formData.phone}</strong>.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-4 py-2 rounded-lg bg-surface border border-border text-xs font-bold text-text hover:bg-background transition-colors"
                    >
                      Send Another Message
                    </button>
                    <a
                      href={`https://wa.me/${whatsappCleanNumber}?text=Hi%201st%20Om%20Team%2C%20I%20just%20submitted%20an%20enquiry%20under%20name%20${encodeURIComponent(formData.fullName)}.%20Looking%20forward%20to%20connecting.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-[#25D366] text-white text-xs font-bold inline-flex items-center gap-1.5 hover:brightness-105 transition-all"
                    >
                      <MessageCircle size={14} />
                      Follow up on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  {/* Department Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-text mb-2">
                      Select Department / Service Category
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {departments.map((dept) => {
                        const isSelected = formData.department === dept.id;
                        const DeptIcon = dept.icon;
                        return (
                          <button
                            key={dept.id}
                            type="button"
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, department: dept.id }))
                            }
                            className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                              isSelected
                                ? "bg-primary/10 border-primary text-primary shadow-sm"
                                : "bg-background border-border/80 text-text-muted hover:border-primary/40 hover:text-text"
                            }`}
                          >
                            <DeptIcon
                              size={18}
                              className={`mt-0.5 shrink-0 ${isSelected ? "text-primary" : "text-text-muted"}`}
                            />
                            <div>
                              <div className="font-display font-bold text-xs sm:text-sm text-text">
                                {dept.title}
                              </div>
                              <div className="text-[11px] text-text-muted line-clamp-1 mt-0.5">
                                {dept.contactPerson}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Anand Verma"
                        className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          formErrors.fullName ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                      {formErrors.fullName && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{formErrors.fullName}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                        Mobile Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9876543210"
                        className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          formErrors.phone ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{formErrors.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email & Preferred Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="name@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-background border text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          formErrors.email ? "border-red-500" : "border-border focus:border-primary"
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} />
                          <span>{formErrors.email}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                        Preferred Contact Mode
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, preferredContact: "phone" }))
                          }
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                            formData.preferredContact === "phone"
                              ? "bg-primary text-white border-primary"
                              : "bg-background border-border text-text hover:border-primary/40"
                          }`}
                        >
                          <PhoneCall size={14} />
                          <span>Phone Call</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({ ...prev, preferredContact: "whatsapp" }))
                          }
                          className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                            formData.preferredContact === "whatsapp"
                              ? "bg-[#25D366] text-white border-[#25D366]"
                              : "bg-background border-border text-text hover:border-primary/40"
                          }`}
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-bold text-text uppercase tracking-wider mb-1.5">
                      Tell Us About Your Move *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="e.g. Looking to move a 2 BHK apartment from Patna to Ranchi around the 15th of next month. Need full packing service."
                      className={`w-full px-4 py-3 rounded-xl bg-background border text-sm text-text placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                        formErrors.message ? "border-red-500" : "border-border focus:border-primary"
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        <span>{formErrors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button
                      type="submit"
                      disabled={submitStatus === "submitting"}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-primary text-white font-display font-bold text-sm hover:bg-primary/90 transition-all shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitStatus === "submitting" ? (
                        <span>Sending Inquiry...</span>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>

                    <span className="text-xs text-text-muted flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-green-600 shrink-0" />
                      <span>Zero spam guarantee. Phone number never shared.</span>
                    </span>
                  </div>

                </form>
              )}
            </div>

            {/* RIGHT: Direct Department Directory */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-xs text-text-muted leading-relaxed">
                <span className="font-bold text-text block mb-1">Looking for a direct conversation?</span>
                Skip the form and connect with our duty managers directly via telephone or WhatsApp.
              </div>

              {departments.map((dept) => {
                const DeptIcon = dept.icon;
                return (
                  <div
                    key={dept.id}
                    className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <DeptIcon size={16} />
                        </div>
                        <h4 className="font-display font-bold text-text text-sm sm:text-base">
                          {dept.title}
                        </h4>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted">
                        {dept.badge}
                      </span>
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed mb-3 pl-10">
                      {dept.description}
                    </p>

                    <div className="pl-10 space-y-1 text-xs text-text border-t border-border/60 pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Lead Supervisor:</span>
                        <span className="font-semibold">{dept.contactPerson}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Direct Line:</span>
                        <a
                          href={`tel:${dept.phone}`}
                          className="font-bold text-primary hover:underline"
                        >
                          {dept.phone}
                        </a>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Hours:</span>
                        <span className="text-text-muted font-medium">{dept.timing}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* ── 4. HEADQUARTERS & REGIONAL HUBS ──────────────────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
                <Building2 size={13} className="text-accent" />
                <span>Physical Infrastructure</span>
              </div>
              <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight">
                Our Headquarters & Regional Hub Network
              </h2>
            </div>
            <p className="text-text-muted text-xs sm:text-sm max-w-md">
              We operate permanent dispatch centers and storage yards across major eastern and national transit corridors.
            </p>
          </div>

          {/* Head Office Hero Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-surface to-background border-2 border-primary/20 shadow-md mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary text-white text-xs font-bold uppercase tracking-wider">
                  <span>Central Corporate Headquarters</span>
                </div>
                
                <h3 className="font-display font-extrabold text-text text-xl sm:text-2xl">
                  {company.brandName} - Patna Main Hub
                </h3>

                <p className="text-text-muted text-sm sm:text-base leading-relaxed">
                  Located in Patna, our head office houses our central customer care team,
                  fleet dispatch control room, pre-move survey coordination desk, and central container yard.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-bold text-text">Registered Office Address</div>
                      <div className="text-text-muted mt-0.5">
                        {company.headOffice.addressLine}, {company.headOffice.city}, {company.headOffice.state} - {company.headOffice.pincode}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-primary mt-0.5 shrink-0" />
                    <div className="text-xs sm:text-sm">
                      <div className="font-bold text-text">Office & Visitor Hours</div>
                      <div className="text-text-muted mt-0.5">
                        Mon - Sat: {company.businessHours.weekdays}<br />
                        Sun: {company.businessHours.weekends}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-background p-5 rounded-xl border border-border space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Visit or Navigate
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${company.headOffice.addressLine}, ${company.headOffice.city}, Bihar ${company.headOffice.pincode}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-xs hover:bg-primary hover:text-white transition-colors"
                >
                  <MapPin size={14} />
                  <span>Open in Google Maps</span>
                  <ExternalLink size={12} />
                </a>

                {company.phone.primary && (
                  <a
                    href={`tel:${company.phone.primary}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-border text-text font-bold text-xs hover:border-primary transition-colors"
                  >
                    <PhoneCall size={14} />
                    <span>Call Head Office Reception</span>
                  </a>
                )}

                <div className="text-[11px] text-text-muted text-center pt-1">
                  GSTIN & Transporter Registration documentation available on request.
                </div>
              </div>

            </div>
          </div>

          {/* Regional Hub Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {regionalHubs.map((hub, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-display font-bold text-text text-base">
                      {hub.city} Hub
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted">
                      {hub.state}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-primary mb-2">
                    {hub.role}
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed mb-4">
                    {hub.address}
                  </p>
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-text-muted">Regional Helpline:</span>
                  <a
                    href={`tel:${hub.phone}`}
                    className="font-bold text-primary hover:underline"
                  >
                    {hub.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 5. ZERO ANXIETY RESPONSE TIMELINE ────────────────────────── */}
      <section className="bg-background py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Clock size={13} className="text-accent" />
              <span>Response Standard</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3 text-balance">
              What Happens When You Reach Out?
            </h2>
            <p className="text-text-muted text-sm sm:text-base max-w-2xl mx-auto text-balance">
              Moving shouldn&apos;t feel uncertain. Here is our exact step-by-step commitment when you connect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {responseTimeline.map((item, idx) => (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 transition-all shadow-sm"
              >
                <div className="font-display font-black text-3xl sm:text-4xl text-primary/20 mb-3">
                  {item.step}
                </div>
                <h3 className="font-display font-bold text-text text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 6. CONTACT & SUPPORT FAQ ACCORDION ───────────────────────── */}
      <section className="bg-surface py-14 sm:py-20 border-b border-border/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-3">
              <FileText size={13} className="text-accent" />
              <span>Got Questions?</span>
            </div>
            <h2 className="font-display font-extrabold text-text text-2xl sm:text-3xl tracking-tight mb-3">
              Frequently Asked Support Questions
            </h2>
            <p className="text-text-muted text-xs sm:text-sm">
              Quick answers about contact response times, survey scheduling, and tracking.
            </p>
          </div>

          <div className="space-y-3">
            {contactFaqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-background border border-border overflow-hidden transition-all shadow-sm"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-surface/60 transition-colors"
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
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-text-muted text-xs sm:text-sm leading-relaxed border-t border-border/50 pt-4 bg-surface/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 7. FINAL BOTTOM CTA BANNER ───────────────────────────────── */}
      <section className="bg-gradient-to-r from-primary via-primary/95 to-primary text-white py-14 sm:py-20 relative overflow-hidden">
        <div
          className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/20">
              Zero Obligation - 100% Free Consultation
            </span>
            <h2
              className="font-display font-extrabold text-white tracking-tight mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.5vw, 2.75rem)", lineHeight: "1.25" }}
            >
              Ready To Plan Your Move With Zero Stress?
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              Schedule your free doorstep survey today or speak directly with our senior relocation supervisors.
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

export default Contact;
