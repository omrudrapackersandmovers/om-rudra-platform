import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowLeftRight, X, CheckCircle2, Loader2, PhoneCall } from "lucide-react";
import CustomSelect from "../../../shared/components/CustomSelect";
import { allServiceLocations } from "@/data/locations";
import { localAreaOptions } from "@/data/locations/coverage";
const enquiryLocations = [...allServiceLocations, ...localAreaOptions];
import LocationAutocomplete from "./LocationAutocomplete";
import { company } from "../../../../../data/company";

const initialForm = { movingFrom: "", movingTo: "", service: "Home shifting", name: "", phone: "", email: "", moveType: "", timeline: "", moveSize: "" };
const services = ["Home shifting", "Office shifting", "Car transport", "Bike transport", "Packing & unpacking only", "Loading & unloading only", "Warehousing / storage", "Transit insurance", "Other"];
const timelines = ["Urgent (within 2 to 3 days)", "Within a week", "Within 15 days", "Within a month", "Not fixed yet"];
const moveTypes = ["Within the city", "Within the state", "To another state"];
const sizes = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK / Villa", "Few items / Single room", "Car / Vehicle only", "Bike / Two-wheeler only", "Office / Commercial setup"];
const serviceSizes = { "Car transport": "Car / Vehicle only", "Bike transport": "Bike / Two-wheeler only", "Office shifting": "Office / Commercial setup" };
const inputClass = "w-full min-h-[50px] px-3 border rounded-md bg-background text-text text-base focus:border-primary focus:ring-2 focus:ring-primary/20";

function resolveLocation(value) {
  const normalized = value.trim().toLowerCase();
  return enquiryLocations.find((loc) => (loc.name === loc.state ? loc.name : `${loc.name}, ${loc.state}`).toLowerCase() === normalized)
    || enquiryLocations.find((loc) => loc.name.toLowerCase() === normalized);
}
function inferMoveType(from, to) {
  const origin = resolveLocation(from);
  const destination = resolveLocation(to);
  if (!origin || !destination) return "";
  if ((origin.city || origin.name).toLowerCase() === (destination.city || destination.name).toLowerCase() && origin.state === destination.state) return "Within the city";
  return origin.state === destination.state ? "Within the state" : "To another state";
}

export default function RouteEnquiryBar({ defaultService = "Home shifting" }) {
  const [form, setForm] = useState(() => ({ ...initialForm, service: defaultService, moveSize: serviceSizes[defaultService] || "" }));
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const dialogRef = useRef(null);
  const submittingRef = useRef(false);
  const detailsFormRef = useRef(null);

  useEffect(() => {
    if (!detailsOpen) return;
    const bodyOverflow = document.body.style.overflow;
    const rootOverflow = document.documentElement.style.overflow;
    const lenis = window.__lenis;
    const wasStopped = lenis?.isStopped;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = rootOverflow;
      if (lenis && !wasStopped) lenis.start();
    };
  }, [detailsOpen]);

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "service") next.moveSize = serviceSizes[value] || (serviceSizes[prev.service] ? "" : prev.moveSize);
      if (field === "movingFrom" || field === "movingTo") next.moveType = inferMoveType(next.movingFrom, next.movingTo);
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setServerError("");
  }

  function continueEnquiry(event) {
    event.preventDefault();
    const nextErrors = {};
    if (form.movingFrom.trim().length < 2) nextErrors.movingFrom = "Enter your pickup city.";
    if (form.movingTo.trim().length < 2) nextErrors.movingTo = "Enter your destination city.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setStatus("idle");
    setServerError("");
    dialogRef.current.showModal();
    setDetailsOpen(true);
  }

  function closeDetails() {
    if (!submittingRef.current) dialogRef.current.close();
  }

  async function submitEnquiry(event) {
    event.preventDefault();
    if (submittingRef.current) return;
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter your full name (at least two characters).";
    if (!/^[6-9]\d{9}$/.test(form.phone)) nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!form.moveType) nextErrors.moveType = "Choose your move type.";
    if (!form.timeline) nextErrors.timeline = "Choose your preferred timeline.";
    setErrors(nextErrors);
    setServerError("");
    if (Object.keys(nextErrors).length) {
      detailsFormRef.current?.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    submittingRef.current = true;
    setStatus("submitting");
    const rawBase = (import.meta.env.VITE_API_URL || "https://api.omrudrapackersandmovers.com").trim().replace(/\/+$/, "");
    const apiBase = /^https?:\/\//.test(rawBase) ? rawBase : `https://${rawBase}`;
    try {
      const response = await fetch(`${apiBase}/api/leads`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, name: form.name.trim(), movingFrom: form.movingFrom.trim(), movingTo: form.movingTo.trim(), email: form.email.trim() }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        if (data.details) setErrors(Object.fromEntries(Object.entries(data.details).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])));
        setServerError(data.error === "Validation error" ? "Review the highlighted details and try again." : "We could not send your enquiry. Try again, or call our team.");
        setStatus("idle");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("idle");
      setServerError("We could not connect. Your details are still here. Try again, or call our team.");
    } finally {
      submittingRef.current = false;
    }
  }

  function field(id, label, options, required = false, type = "text") {
    if (options) return <CustomSelect id={`enquiry-${id}`} name={id} label={label} value={form[id]} onChange={(value) => update(id, value)} options={options} placeholder={id === "moveType" ? "Select move type" : id === "timeline" ? "When do you plan to move?" : "Select home or move size"} required={required} error={errors[id]} disabled={status === "submitting"} />;
    const placeholders = { name: "Enter your full name", phone: "10-digit mobile number", email: "you@example.com" };
    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={`enquiry-${id}`} className="text-sm font-semibold">{label}{required && <span className="text-danger" aria-hidden="true"> *</span>}</label>
        <input id={`enquiry-${id}`} name={id} type={type} placeholder={placeholders[id]} value={form[id]} autoComplete={id === "name" ? "name" : id === "phone" ? "tel-national" : "email"} maxLength={id === "phone" ? 10 : id === "name" ? 120 : 254} inputMode={id === "phone" ? "numeric" : undefined} onChange={(event) => update(id, id === "phone" ? event.target.value.replace(/\D/g, "").slice(0,10) : event.target.value)} required={required} aria-invalid={!!errors[id]} aria-describedby={errors[id] ? `error-${id}` : undefined} className={`${inputClass} placeholder:text-text-muted ${errors[id] ? "border-danger" : "border-border"}`} />
        {errors[id] && <p id={`error-${id}`} className="text-danger text-sm" role="alert">{errors[id]}</p>}
      </div>
    );
  }

  return (
    <>
      <div id="quote-form-section" className="relative z-40 px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 lg:pb-14 scroll-mt-4" aria-label="Start your moving enquiry">
        <form onSubmit={continueEnquiry} noValidate className="max-w-6xl mx-auto rounded-lg bg-background border border-border shadow-card p-4 sm:p-5 grid lg:grid-cols-[1fr_auto_1fr_0.85fr_auto] gap-3 lg:gap-4 items-start">
          <LocationAutocomplete id="route-pickup" name="movingFrom" label="Moving from" value={form.movingFrom} onChange={(value) => update("movingFrom",value)} placeholder="Pickup city or area" error={errors.movingFrom} required />
          <button type="button" onClick={() => { setForm((prev) => ({ ...prev, movingFrom: prev.movingTo, movingTo: prev.movingFrom })); setErrors({}); }} className="hidden lg:flex mt-8 min-h-11 w-11 items-center justify-center text-text-muted hover:text-primary rounded-md" aria-label="Swap pickup and destination"><ArrowLeftRight size={18} /></button>
          <LocationAutocomplete id="route-destination" name="movingTo" label="Moving to" value={form.movingTo} onChange={(value) => update("movingTo",value)} placeholder="Destination city or area" error={errors.movingTo} required />
          <CustomSelect id="route-service" label="What are you moving?" value={form.service} onChange={(value) => update("service", value)} options={services} placeholder="Select a moving service" />
          <button type="submit" className="lg:mt-7 min-h-[50px] px-6 rounded-md bg-accent hover:bg-primary text-white text-sm font-bold inline-flex items-center justify-center gap-2 transition-colors">Continue<ArrowRight size={18} aria-hidden="true" /></button>
          <p className="lg:col-span-5 text-xs text-text-muted">Step 1 of 2  /  Your route first. Contact details next.</p>
        </form>
      </div>
      <dialog ref={dialogRef} data-lenis-prevent aria-modal="true" onClose={() => setDetailsOpen(false)} aria-labelledby="enquiry-heading" onCancel={(event) => { if (submittingRef.current) event.preventDefault(); }} className="enquiry-dialog m-auto w-[calc(100%_-_2rem)] max-w-2xl max-h-[90dvh] overflow-y-auto overscroll-contain rounded-lg bg-background p-0 text-text border border-border shadow-card">
        <div className="p-5 sm:p-8">
          <div className="flex justify-between items-start gap-4 mb-5"><div><p className="text-primary text-sm font-semibold mb-2">{status === "success" ? "Enquiry received" : "Step 2 of 2"}</p><h2 id="enquiry-heading" className="font-display font-bold text-2xl">{status === "success" ? "Your request is with our team." : "Finish your moving enquiry"}</h2></div><button type="button" onClick={closeDetails} disabled={status === "submitting"} aria-label="Close enquiry" className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-md hover:bg-surface disabled:opacity-40"><X size={20} /></button></div>
          {status === "success" ? (
            <div role="status"><CheckCircle2 size={36} className="text-success mb-4" /><p className="text-text-muted text-base">We will contact you on your provided number to discuss the move and prepare your quote.</p><button type="button" onClick={() => { dialogRef.current.close(); setForm({ ...initialForm, service: defaultService, moveSize: serviceSizes[defaultService] || "" }); setStatus("idle"); }} className="mt-6 min-h-12 px-6 bg-accent text-white font-semibold rounded-md">Done</button></div>
          ) : (
            <form ref={detailsFormRef} onSubmit={submitEnquiry} noValidate>
              <div className="bg-surface rounded-md p-4 mb-5 text-sm"><p className="font-semibold break-words">{form.movingFrom} to {form.movingTo}</p><p className="text-text-muted mt-1">{form.service}</p><button type="button" onClick={closeDetails} disabled={status === "submitting"} className="min-h-11 text-primary font-semibold underline underline-offset-4">Edit route or service</button></div>
              <fieldset disabled={status === "submitting"} className="grid sm:grid-cols-2 gap-4 disabled:opacity-60">
                {field("name","Your name",null,true)}
                {field("phone","Mobile number (+91)",null,true,"tel")}
                {field("moveType","Move type",moveTypes,true)}
                {field("timeline","Preferred timeline",timelines,true)}
                {inferMoveType(form.movingFrom, form.movingTo) && <p className="sm:col-span-2 text-xs text-text-muted -mt-1">Move type is suggested from your route. You can change it if needed.</p>}
                {field("moveSize","Move size (optional)",sizes)}
                {field("email","Email (optional)",null,false,"email")}
              </fieldset>
              {serverError && <p className="mt-4 text-danger text-sm" role="alert">{serverError}</p>}
              <p className="text-xs text-text-muted mt-5">We will use these details to respond to your moving enquiry. <Link to="/privacy" className="text-primary underline">Privacy policy</Link></p>
              <div className="flex flex-col sm:flex-row gap-3 mt-5"><button type="submit" disabled={status === "submitting"} className="flex-1 min-h-12 px-5 rounded-md bg-accent hover:bg-primary text-white text-sm font-bold inline-flex items-center justify-center gap-2 disabled:opacity-60">{status === "submitting" ? <><Loader2 size={17} className="animate-spin" />Sending enquiry...</> : "Request my free quote"}</button><a href={`tel:${company.phone.primary.replace(/[^+\d]/g, "")}`} className="min-h-12 px-5 border border-border rounded-md text-sm font-semibold inline-flex items-center justify-center gap-2"><PhoneCall size={16} />Call instead</a></div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
