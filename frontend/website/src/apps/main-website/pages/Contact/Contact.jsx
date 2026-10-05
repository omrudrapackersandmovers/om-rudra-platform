import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ChevronRight, MapPin, PhoneCall, MessageCircle, Mail, Plus, Minus, ExternalLink } from "lucide-react";
import { company } from "../../../../data/company";
import CustomSelect from "../../shared/components/CustomSelect";
import { contactSubjects, validateContact } from "../../utils/contactValidation";
import SEO from "../../../../configs/seo";

const phone = company.phone.primary.replace(/[^+\d]/g, "");
const whatsappNumber = company.phone.whatsapp.replace(/\D/g, "");
const whatsapp = text => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
const address = `${company.headOffice.addressLine}, ${company.headOffice.city}, ${company.headOffice.state} ${company.headOffice.pincode}`;
const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
const fieldClass = "w-full rounded-[var(--radius-md)] border border-border bg-background px-4 py-3.5 text-[0.95rem] outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
const questions = [
  ["What should I share for a moving quote?", "Tell us your pickup and destination, preferred moving date and what you need to move. Include floor, lift and parking details so the team can understand access at both addresses."],
  ["Can I discuss a move within Patna?", "Yes. Share both local addresses or neighbourhoods, along with your inventory. You can also browse Patna local areas on our Where We Serve page."],
  ["Can I arrange a home or office survey?", "Ask the team about a survey when you call or message. They will discuss the details and agree on a suitable time with you."],
  ["Who do I contact about an existing booking?", "Call or WhatsApp the team using the number on this page. Include your booking reference, name and route so they can find your move details."],
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const submitting = useRef(false);
  const [securityToken, setSecurityToken] = useState("");
  const securityRef = useRef(null);
  const widgetRef = useRef(null);
  const submitted = status === "success";
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!siteKey || submitted) return;
    let disposed = false;
    const render = () => {
      if (disposed || !window.turnstile || !securityRef.current || widgetRef.current !== null) return;
      widgetRef.current = window.turnstile.render(securityRef.current, { sitekey: siteKey, callback: setSecurityToken, "expired-callback": () => setSecurityToken(""), "error-callback": () => { setSecurityToken(""); setError("Could not complete the security check. Refresh or call our team."); } });
    };
    let script = document.querySelector('script[data-contact-turnstile]');
    if (!script) {
      script = document.createElement("script"); script.dataset.contactTurnstile = "true";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true; document.head.appendChild(script);
    }
    script.addEventListener("load", render); render();
    return () => { disposed = true; script.removeEventListener("load", render); if (widgetRef.current !== null) { window.turnstile?.remove(widgetRef.current); widgetRef.current = null; } };
  }, [siteKey, submitted]);
  const update = (name, value) => {
    setForm(current => ({ ...current, [name]: value }));
    setErrors(current => ({ ...current, [name]: undefined })); setError("");
  };
  const change = event => update(event.target.name, event.target.value);
  const showErrors = next => {
    setErrors(next);
    const first = ["name", "phone", "email", "subject", "message"].find(key => next[key]);
    if (first) document.getElementById(`contact-${first}`)?.focus();
  };
  const blur = event => {
    const name = event.target.name;
    setErrors(current => ({ ...current, [name]: validateContact(form)[name] }));
  };
  const submit = async event => {
    event.preventDefault();
    if (submitting.current) return;
    const validation = validateContact(form);
    if (Object.keys(validation).length) { showErrors(validation); return; }
    setErrors({});
    if (siteKey && !securityToken) { setError("Please complete the security check."); return; }
    submitting.current = true;
    setStatus("submitting"); setError("");
    try {
      const base = (import.meta.env.VITE_API_URL || "https://api.omrudrapackersandmovers.com").trim().replace(/\/+$/, "").replace(/\/api$/, "");
      const response = await fetch(`${base}/api/leads/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value.trim()])), turnstileToken: securityToken }), signal: AbortSignal.timeout(15000) });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.success) {
        if (response.status === 400 && result?.details) {
          const fields = Object.fromEntries(Object.entries(result.details).filter(([key, messages]) => ["name", "phone", "email", "subject", "message"].includes(key) && Array.isArray(messages) && messages.length).map(([key, messages]) => [key, messages[0]]));
          if (Object.keys(fields).length) showErrors(fields);
        }
        setError(response.status === 429 ? "Too many attempts. Please wait a moment before trying again." : response.status === 400 && result?.details ? "Please review the highlighted fields." : "We could not send your message. Please try again or call our team.");
        setStatus("idle"); return;
      }
      setReference(result.reference); setStatus("success");
    } catch (failure) { setError(failure.name === "TimeoutError" ? "The request timed out. Please try again or call our team." : "Could not connect. Please check your connection and try again, or call our team."); setStatus("idle"); }
    finally { submitting.current = false; setSecurityToken(""); if (widgetRef.current !== null) window.turnstile?.reset(widgetRef.current); }
  };
  function renderInput(name) {
    const config = {
      name: { label: "Your name", placeholder: "Enter your full name", type: "text", autoComplete: "name", maxLength: 100 },
      phone: { label: "Phone number", placeholder: "10-digit mobile number", type: "tel", autoComplete: "tel-national", maxLength: 10 },
      email: { label: "Email", placeholder: "you@example.com", type: "email", autoComplete: "email", maxLength: 254 },
    }[name];
    return <div key={name}><label htmlFor={`contact-${name}`} className="block text-sm font-semibold">{config.label} <span className="text-danger">*</span></label><input id={`contact-${name}`} required name={name} type={config.type} placeholder={config.placeholder} autoComplete={config.autoComplete} inputMode={name === "phone" ? "numeric" : undefined} maxLength={config.maxLength} value={form[name]} onChange={change} onBlur={blur} aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `contact-${name}-error` : undefined} className={`${fieldClass} mt-2 ${errors[name] ? "border-danger" : ""}`} /><FieldError name={name} error={errors[name]} /></div>;
  }
  return <>
    <SEO title="Contact Us - Plan Your Move With Our Patna Team" description={`Call ${company.brandName} on ${company.phone.primaryDisplay}, message on WhatsApp or contact our Patna office to discuss your local or interstate move.`} />
    <section className="bg-surface border-b border-border py-10 sm:py-14"><div className="container mx-auto px-4 sm:px-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-text-muted mb-7"><Link to="/" className="hover:text-primary">Home</Link><ChevronRight size={14} aria-hidden="true" /><span aria-current="page">Contact Us</span></nav>
      <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-16 items-start">
        <div><p className="text-primary font-semibold text-sm">GET IN TOUCH WITH OUR TEAM</p><h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight mt-4">Your questions.<br />Our team, <span className="text-primary">ready to help.</span></h1><p className="text-text-muted text-base sm:text-lg leading-relaxed mt-5 max-w-xl">From moving plans and booking support to feedback and business enquiries, tell us what you need. Our Patna team is here to help.</p>
          <div className="space-y-3 mt-7"><a href={`tel:${phone}`} className="flex items-center gap-4 rounded-xl bg-primary text-white p-5 hover:bg-primary/90"><PhoneCall size={24} className="shrink-0" /><span className="flex-1"><span className="block text-xs opacity-80">Call our moving team</span><span className="block font-semibold text-xl mt-1">{company.phone.primaryDisplay}</span></span><ArrowRight size={20} /></a><a href={whatsapp(`Hello ${company.brandName}, I would like to discuss a move.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-background border border-border rounded-xl p-5 hover:border-primary/40"><MessageCircle size={24} className="text-primary shrink-0" /><span className="flex-1"><span className="block font-semibold">Chat on WhatsApp</span><span className="block text-sm text-text-muted mt-1">Share your route, inventory or moving questions.</span></span><ExternalLink size={17} className="text-primary" /></a></div>
          <p className="text-sm text-text-muted mt-5">Already booked? Have your booking reference and route ready when you contact us.</p>
        </div>
        <div id="enquiry" className="bg-background border border-border rounded-2xl p-5 sm:p-8 scroll-mt-24"><h2 className="font-display font-bold text-2xl">How can we help?</h2><p className="text-sm text-text-muted leading-relaxed mt-2">Ask a question, discuss a booking, share feedback or get in touch about working together.</p>
          {status === "success" ? <div role="status" className="mt-6 rounded-xl bg-brand-soft p-5"><h3 className="font-semibold text-lg">Your message has been received.</h3><p className="text-sm text-text-muted mt-2">Our team will review your enquiry. Your reference is #{reference}.</p><button type="button" onClick={() => { setForm({ name: "", phone: "", email: "", subject: "", message: "" }); setErrors({}); setError(""); setStatus("idle"); }} className="min-h-11 mt-3 text-primary font-semibold">Send another message</button></div> : <form ref={formRef} noValidate onSubmit={submit} className="mt-6 space-y-4"><fieldset disabled={status === "submitting"} className="space-y-4 disabled:opacity-70">
          <div className="grid sm:grid-cols-2 gap-4">{["name", "phone"].map(key => renderInput(key))}</div>
          {renderInput("email")}
          <CustomSelect id="contact-subject" name="subject" label="What can we help with?" required value={form.subject} onChange={value => update("subject", value)} options={contactSubjects} placeholder="Choose an enquiry subject" error={errors.subject} disabled={status === "submitting"} />
          <div><label htmlFor="contact-message" className="block text-sm font-semibold">Your message <span className="text-danger">*</span></label><textarea id="contact-message" required name="message" rows={4} maxLength={2000} placeholder="Tell us how we can help. Include your booking reference or moving details if relevant." value={form.message} onChange={change} onBlur={blur} aria-invalid={!!errors.message} aria-describedby={errors.message ? "contact-message-error" : undefined} className={`${fieldClass} mt-2 resize-y ${errors.message ? "border-danger" : ""}`} /><FieldError name="message" error={errors.message} /></div>
          {siteKey && <div ref={securityRef} />}
          {error && <p role="alert" className="text-danger text-sm">{error} Your details are still here.</p>}
          <button type="submit" className="w-full rounded-full bg-primary text-white px-5 py-3 font-semibold inline-flex justify-center items-center gap-2 hover:bg-primary/90 disabled:cursor-wait">{status === "submitting" ? "Sending your message…" : "Send message"}<ArrowRight size={18} /></button>
          <p className="text-xs text-text-muted leading-relaxed">We use your details to respond to your enquiry. <Link to="/privacy" className="text-primary underline">Privacy policy</Link></p>
          </fieldset></form>}
        </div>
      </div>
    </div></section>
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16"><div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-16"><div><p className="text-primary text-sm font-semibold">OUR PATNA OFFICE</p><h2 className="font-display font-bold text-3xl sm:text-4xl mt-3">Start close to <span className="text-primary">home.</span></h2><p className="text-text-muted leading-relaxed mt-4 max-w-lg">Our team is based in Patna. Call before visiting so we can agree on a suitable time to discuss your move.</p><Link to="/where-we-serve" className="inline-flex gap-2 items-center text-primary font-semibold min-h-11 mt-4">Explore Patna areas and other destinations<ArrowRight size={17} /></Link></div><div className="rounded-2xl bg-surface border border-border p-6 sm:p-8"><h3 className="font-display font-bold text-lg">{company.legalName}</h3><address className="not-italic flex items-start gap-3 mt-5 text-text-muted leading-relaxed"><MapPin size={21} className="text-primary shrink-0 mt-1" /><span>{company.headOffice.addressLine}<br />{company.headOffice.city}, {company.headOffice.state} {company.headOffice.pincode}</span></address><a href={maps} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold min-h-11 mt-3">Find address on Google Maps<ExternalLink size={16} /></a><div className="border-t border-border pt-5 mt-4"><p className="text-sm text-text-muted">Prefer email?</p><a href={`mailto:${company.email.general}`} className="flex items-center gap-2 text-primary min-h-11 text-sm font-semibold"><Mail size={17} className="shrink-0" /><span className="break-all">{company.email.general}</span></a></div></div></div></section>
    <section className="bg-surface border-y border-border py-10 sm:py-14"><div className="container mx-auto px-4 sm:px-6"><h2 className="font-display font-bold text-3xl">From your first message to <span className="text-primary">a moving plan.</span></h2><div className="grid md:grid-cols-3 gap-6 mt-7">{[["01", "Share the essentials", "Send your pickup, destination, inventory and preferred date."], ["02", "Discuss the details", "Review packing needs, address access, availability and any survey arrangements with the team."], ["03", "Confirm your quote", "Ask for the service scope, price and booking terms in writing before you book."]].map(([step, title, description]) => <div key={step} className="border-t border-border pt-5"><p className="font-display text-primary font-bold text-2xl">{step}</p><h3 className="font-semibold text-lg mt-3">{title}</h3><p className="text-sm text-text-muted leading-relaxed mt-2">{description}</p></div>)}</div></div></section>
    <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-16"><h2 className="font-display font-bold text-3xl">A few things you may <span className="text-primary">want to know.</span></h2><div className="mt-6">{questions.map(([question, answer]) => <details key={question} className="group border-b border-border"><summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-semibold">{question}<span className="text-primary shrink-0"><Plus size={20} className="group-open:hidden" /><Minus size={20} className="hidden group-open:block" /></span></summary><p className="text-text-muted leading-relaxed pb-5 max-w-3xl">{answer}</p></details>)}</div><div className="mt-10 rounded-2xl bg-text text-background p-6 sm:p-9 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"><div><h2 className="font-display font-bold text-2xl">Ready to discuss your route?</h2><p className="opacity-80 mt-2">Let’s start with where you are and where you want to be.</p></div><a href={`tel:${phone}`} className="inline-flex items-center gap-2 bg-primary text-white rounded-full px-6 py-3 font-semibold shrink-0"><PhoneCall size={18} />Call our team</a></div></section>
  </>;
}

function FieldError({ name, error }) {
  return error ? <p id={`contact-${name}-error`} role="alert" className="text-danger text-sm mt-2 font-normal">{error}</p> : null;
}
