import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  RotateCcw,
  MessageCircle,
  PhoneCall,
  MapPin,
  Truck,
  ArrowRight,
  ArrowLeftRight,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react";
import CustomSelect from "../../../shared/components/CustomSelect";
import Button from "../../../shared/components/Button";
import TopoField from "@/components/ui/topo-field";
import { company } from "@/data/company";
import LocationAutocomplete from "./LocationAutocomplete";
import { detectUserCity, detectFromBrowserGps } from "@/apps/main-website/utils/geoService";
import { calculateFareEstimate } from "@/apps/main-website/utils/fareEstimator";

const moveTypes = [
  "Within the city",
  "Within the state",
  "To another state",
];

const services = [
  "Home shifting",
  "Office shifting",
  "Car transport",
  "Bike transport",
  "Packing & unpacking only",
  "Loading & unloading only",
  "Warehousing / storage",
  "Other",
];

const timelines = [
  "Urgent (within 2 to 3 days)",
  "Within a week",
  "Within 15 days",
  "Within a month",
  "Not fixed yet",
];

// Mapping slugs and shorthand keywords to canonical dropdown labels
const SERVICE_SLUG_MAP = {
  "home-shifting": "Home shifting",
  "home": "Home shifting",
  "household": "Home shifting",
  "residential": "Home shifting",
  "1-bhk": "Home shifting",
  "1-bhk-home": "Home shifting",
  "2-bhk": "Home shifting",
  "2-bhk-home": "Home shifting",
  "3-bhk": "Home shifting",
  "3-bhk-home": "Home shifting",
  "4-bhk": "Home shifting",
  "villa": "Home shifting",
  "office-shifting": "Office shifting",
  "office": "Office shifting",
  "office-commercial-shifting": "Office shifting",
  "commercial": "Office shifting",
  "corporate": "Office shifting",
  "car-transport": "Car transport",
  "car": "Car transport",
  "car-transportation": "Car transport",
  "car-sedan": "Car transport",
  "car-suv": "Car transport",
  "vehicle": "Car transport",
  "bike-transport": "Bike transport",
  "bike": "Bike transport",
  "bike-two-wheeler-transportation": "Bike transport",
  "bike-standard": "Bike transport",
  "bike-premium": "Bike transport",
  "two-wheeler": "Bike transport",
  "scooter": "Bike transport",
  "packing-unpacking": "Packing & unpacking only",
  "packing": "Packing & unpacking only",
  "loading-unloading": "Loading & unloading only",
  "loading": "Loading & unloading only",
  "warehousing-storage": "Warehousing / storage",
  "warehousing": "Warehousing / storage",
  "storage": "Warehousing / storage",
  "goods-transit-insurance": "Home shifting",
};

const MOVE_TYPE_MAP = {
  "local": "Within the city",
  "within-city": "Within the city",
  "city": "Within the city",
  "intracity": "Within the city",
  "state": "Within the state",
  "within-state": "Within the state",
  "intrastate": "Within the state",
  "interstate": "To another state",
  "inter-state": "To another state",
  "national": "To another state",
  "another-state": "To another state",
};

const TIMELINE_MAP = {
  "urgent": "Urgent (within 2 to 3 days)",
  "immediate": "Urgent (within 2 to 3 days)",
  "2-3-days": "Urgent (within 2 to 3 days)",
  "week": "Within a week",
  "1-week": "Within a week",
  "15-days": "Within 15 days",
  "2-weeks": "Within 15 days",
  "month": "Within a month",
  "30-days": "Within a month",
  "not-fixed": "Not fixed yet",
  "flexible": "Not fixed yet",
};

const moveSizes = [
  "1 BHK (1 Bedroom / Studio)",
  "2 BHK (Standard Apartment)",
  "3 BHK (Large Apartment)",
  "4+ BHK / Independent Villa",
  "Few Items / Single Room",
  "Car / Vehicle Only",
  "Bike / Two-Wheeler Only",
  "Office / Commercial Setup",
];

const MOVE_SIZE_MAP = {
  "1bhk": "1 BHK (1 Bedroom / Studio)",
  "1-bhk": "1 BHK (1 Bedroom / Studio)",
  "1bhk apartment": "1 BHK (1 Bedroom / Studio)",
  "studio": "1 BHK (1 Bedroom / Studio)",
  "1rk": "1 BHK (1 Bedroom / Studio)",
  "2bhk": "2 BHK (Standard Apartment)",
  "2-bhk": "2 BHK (Standard Apartment)",
  "2bhk apartment": "2 BHK (Standard Apartment)",
  "3bhk": "3 BHK (Large Apartment)",
  "3-bhk": "3 BHK (Large Apartment)",
  "3bhk apartment": "3 BHK (Large Apartment)",
  "4bhk": "4+ BHK / Independent Villa",
  "4-bhk": "4+ BHK / Independent Villa",
  "4+bhk": "4+ BHK / Independent Villa",
  "villa": "4+ BHK / Independent Villa",
  "few-items": "Few Items / Single Room",
  "single-room": "Few Items / Single Room",
  "car": "Car / Vehicle Only",
  "bike": "Bike / Two-Wheeler Only",
  "office": "Office / Commercial Setup",
  "commercial": "Office / Commercial Setup",
};

const initialForm = {
  name: "",
  phone: "",
  movingFrom: "",
  movingTo: "",
  moveType: "",
  service: "Home shifting",
  moveSize: "",
  timeline: "",
  email: "",
};

// Resolver helper functions
function resolveMoveSize(val) {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  if (MOVE_SIZE_MAP[cleaned]) return MOVE_SIZE_MAP[cleaned];
  const exact = moveSizes.find((m) => m.toLowerCase() === cleaned);
  if (exact) return exact;
  const partial = moveSizes.find((m) => m.toLowerCase().includes(cleaned) || cleaned.includes(m.toLowerCase()));
  return partial || "";
}

function resolveService(val) {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  if (SERVICE_SLUG_MAP[cleaned]) return SERVICE_SLUG_MAP[cleaned];
  const exact = services.find((s) => s.toLowerCase() === cleaned);
  if (exact) return exact;
  const partial = services.find((s) => s.toLowerCase().includes(cleaned) || cleaned.includes(s.toLowerCase()));
  return partial || "";
}

function resolveMoveType(val) {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  if (MOVE_TYPE_MAP[cleaned]) return MOVE_TYPE_MAP[cleaned];
  const exact = moveTypes.find((m) => m.toLowerCase() === cleaned);
  if (exact) return exact;
  return "";
}

function resolveTimeline(val) {
  if (!val) return "";
  const cleaned = val.trim().toLowerCase();
  if (TIMELINE_MAP[cleaned]) return TIMELINE_MAP[cleaned];
  const exact = timelines.find((t) => t.toLowerCase() === cleaned);
  if (exact) return exact;
  return "";
}

/**
 * Super Smart QuoteForm
 * - Auto-detects and populates from query params: `service`, `from`, `to`, `scope`, `moveType`, `timeline`
 * - Intelligently infers moveType if origin and destination are given
 * - Shows an auto-detection reassurance badge with 1-click reset
 * - Interactive preset chips for 1-click instant selection
 * - Direct WhatsApp quote pre-fill sync
 */
const QuoteForm = ({
  defaultService = "",
  defaultFrom = "",
  defaultTo = "",
  defaultMoveType = "",
  defaultTimeline = "",
  defaultMoveSize = "",
  isStandalonePage = false,
}) => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  // Sync state with URL query parameters and incoming props
  useEffect(() => {
    const pService = searchParams.get("service") || searchParams.get("s") || defaultService;
    const pFrom = searchParams.get("from") || searchParams.get("origin") || searchParams.get("source") || searchParams.get("pickup") || defaultFrom;
    const pTo = searchParams.get("to") || searchParams.get("dest") || searchParams.get("destination") || searchParams.get("drop") || defaultTo;
    const pScope = searchParams.get("scope") || searchParams.get("moveType") || defaultMoveType;
    const pTimeline = searchParams.get("timeline") || searchParams.get("time") || defaultTimeline;
    const pSize = searchParams.get("size") || searchParams.get("moveSize") || searchParams.get("bhk") || searchParams.get("type") || defaultMoveSize;

    let resolvedService = resolveService(pService);
    let resolvedMoveType = resolveMoveType(pScope);
    const resolvedTimeline = resolveTimeline(pTimeline);
    const resolvedMoveSize = resolveMoveSize(pSize);
    const resolvedFrom = pFrom ? decodeURIComponent(pFrom).trim() : "";
    const resolvedTo = pTo ? decodeURIComponent(pTo).trim() : "";

    // If a size like 1bhk, 2bhk was provided but no service, associate with Home shifting
    if (!resolvedService && pSize) {
      const lower = pSize.toLowerCase();
      if (lower.includes("car")) resolvedService = "Car transport";
      else if (lower.includes("bike") || lower.includes("wheeler")) resolvedService = "Bike transport";
      else if (lower.includes("office") || lower.includes("commercial")) resolvedService = "Office shifting";
      else if (lower.includes("bhk") || lower.includes("villa") || lower.includes("home") || lower.includes("room")) resolvedService = "Home shifting";
    }

    // Smart inference: if from and to are present, deduce moveType if not explicit
    if (!resolvedMoveType && resolvedFrom && resolvedTo) {
      if (resolvedFrom.toLowerCase() === resolvedTo.toLowerCase()) {
        resolvedMoveType = "Within the city";
      } else {
        resolvedMoveType = "To another state";
      }
    } else if (!resolvedMoveType && pScope) {
      resolvedMoveType = resolveMoveType(pScope);
    }

    const hasAnyDetected = Boolean(
      resolvedService || resolvedFrom || resolvedTo || resolvedMoveType || resolvedTimeline || resolvedMoveSize
    );

    setForm((prev) => ({
      ...prev,
      service: resolvedService || prev.service,
      movingFrom: resolvedFrom || prev.movingFrom,
      movingTo: resolvedTo || prev.movingTo,
      moveType: resolvedMoveType || prev.moveType,
      moveSize: resolvedMoveSize || prev.moveSize,
      timeline: resolvedTimeline || prev.timeline,
    }));
  }, [searchParams, defaultService, defaultFrom, defaultTo, defaultMoveType, defaultTimeline, defaultMoveSize]);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  // Silent edge geo-detection on mount if no explicit origin is provided
  useEffect(() => {
    const hasExplicitFrom =
      searchParams.get("from") ||
      searchParams.get("origin") ||
      searchParams.get("source") ||
      searchParams.get("pickup") ||
      defaultFrom;

    if (!hasExplicitFrom && !form.movingFrom) {
      detectUserCity().then((geo) => {
        if (geo && geo.formatted) {
          setForm((prev) => {
            if (prev.movingFrom) return prev;
            return { ...prev, movingFrom: geo.formatted };
          });
        }
      });
    }
  }, [defaultFrom, searchParams]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = "Please enter your full name.";
    } else if (form.name.trim().length < 2) {
      errs.name = "Full name must be at least 2 characters.";
    }

    if (!form.phone.trim()) {
      errs.phone = "Please enter your mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      errs.phone = "Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).";
    }

    if (form.email && form.email.trim()) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailPattern.test(form.email.trim())) {
        errs.email = "Please enter a valid email address with a domain (e.g. name@example.com).";
      }
    }

    if (!form.movingFrom.trim()) errs.movingFrom = "Please enter your origin location.";
    if (!form.movingTo.trim()) errs.movingTo = "Please enter your destination location.";
    if (!form.moveType) errs.moveType = "Please select a move type.";
    if (!form.timeline) errs.timeline = "Please select your preferred timeline.";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (serverError) setServerError("");
  };

  const handlePhoneChange = (e) => {
    const rawDigits = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, phone: rawDigits }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
    if (serverError) setServerError("");
  };

  const handleSelectChange = (fieldName, selectedValue) => {
    setForm((prev) => ({ ...prev, [fieldName]: selectedValue }));
    if (errors[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    if (serverError) setServerError("");
  };

  const handleFromChange = (val) => {
    setForm((prev) => {
      let deducedMoveType = prev.moveType;
      if (val && prev.movingTo) {
        const f = val.toLowerCase();
        const t = prev.movingTo.toLowerCase();
        if (f === t) deducedMoveType = "Within the city";
        else if (f.includes("bihar") && t.includes("bihar")) deducedMoveType = "Within the state";
        else if (f.includes("jharkhand") && t.includes("jharkhand")) deducedMoveType = "Within the state";
        else deducedMoveType = "To another state";
      }
      return { ...prev, movingFrom: val, moveType: deducedMoveType };
    });
    if (errors.movingFrom) setErrors((prev) => ({ ...prev, movingFrom: undefined }));
  };

  const handleToChange = (val) => {
    setForm((prev) => {
      let deducedMoveType = prev.moveType;
      if (prev.movingFrom && val) {
        const f = prev.movingFrom.toLowerCase();
        const t = val.toLowerCase();
        if (f === t) deducedMoveType = "Within the city";
        else if (f.includes("bihar") && t.includes("bihar")) deducedMoveType = "Within the state";
        else if (f.includes("jharkhand") && t.includes("jharkhand")) deducedMoveType = "Within the state";
        else deducedMoveType = "To another state";
      }
      return { ...prev, movingTo: val, moveType: deducedMoveType };
    });
    if (errors.movingTo) setErrors((prev) => ({ ...prev, movingTo: undefined }));
  };

  const handleSwapLocations = () => {
    setForm((prev) => ({
      ...prev,
      movingFrom: prev.movingTo,
      movingTo: prev.movingFrom,
    }));
    if (errors.movingFrom) setErrors((prev) => ({ ...prev, movingFrom: undefined }));
    if (errors.movingTo) setErrors((prev) => ({ ...prev, movingTo: undefined }));
  };

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const geo = await detectFromBrowserGps();
      if (geo && geo.formatted) {
        handleFromChange(geo.formatted);
      }
    } catch {
      const fallbackGeo = await detectUserCity();
      if (fallbackGeo && fallbackGeo.formatted) {
        handleFromChange(fallbackGeo.formatted);
      }
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleQuickMoveType = (type) => {
    setForm((prev) => ({ ...prev, moveType: type }));
    if (errors.moveType) setErrors((prev) => ({ ...prev, moveType: undefined }));
  };

  const handleQuickOrigin = (city) => {
    handleFromChange(city);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setServerError("Please resolve the highlighted issues in the form before submitting.");
      return;
    }

    setStatus("submitting");

    try {
      const rawBase = (import.meta.env.VITE_API_URL || "https://api.1stompackersandmovers.workers.dev").trim();
      const apiBase = rawBase
        ? rawBase.startsWith("http://") || rawBase.startsWith("https://")
          ? rawBase.replace(/\/+$/, "")
          : `https://${rawBase.replace(/\/+$/, "")}`
        : "https://api.1stompackersandmovers.workers.dev";
      const res = await fetch(`${apiBase}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setStatus("idle");
        if (errorData.details) {
          const fieldErrors = {};
          for (const [field, messages] of Object.entries(errorData.details)) {
            const firstMsg = Array.isArray(messages) ? messages[0] : messages;
            fieldErrors[field] = firstMsg;
          }
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
          setServerError("Please correct the highlighted fields with red warnings below.");
        } else {
          setServerError(errorData.error || "Unable to submit your quote request. Please verify your details or call our team directly.");
        }
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      console.error("Quote submission error:", err);
      setStatus("idle");
      setServerError("Unable to reach the relocation server. Please check your connection or call us directly at +91 7033488691.");
    }
  };

  // Dynamic WhatsApp prefill URL for 1-click customer quote
  const whatsappUrl = useMemo(() => {
    const cleanNum = company.phone.whatsapp ? company.phone.whatsapp.replace(/\D/g, "") : "917033488691";
    const sizePart = form.moveSize ? ` (${form.moveSize.split(" (")[0]})` : "";
    const msg = `Hi 1st Om Packers, I would like a quote for ${form.service || "relocation"}${sizePart} from ${form.movingFrom || "[Origin]"} to ${form.movingTo || "[Destination]"} (${form.moveType || "Standard move"}). Timeline: ${form.timeline || "Soon"}.`;
    return `https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`;
  }, [form]);

  // Live dynamic fare estimate
  const fareEstimate = useMemo(() => {
    return calculateFareEstimate({
      service: form.service,
      moveSize: form.moveSize,
      moveType: form.moveType,
    });
  }, [form.service, form.moveSize, form.moveType]);

  if (status === "success") {
    return (
      <section className="relative overflow-hidden bg-[#eef3f8] py-16 sm:py-24 border-y border-border/80" aria-labelledby="quote-form-heading">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
          <TopoField mode="light" speed={0.5} density={1.1} length={1.2} opacity={0.75} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white/95 backdrop-blur-md border border-border/90 rounded-3xl p-8 sm:p-12 text-center shadow-[0_20px_60px_rgba(20,35,60,0.08)]">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-6">
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>
            <h2 className="font-display font-bold text-text text-2xl sm:text-3xl mb-3">
              We Received Your Quote Request!
            </h2>
            <p className="text-text-muted text-base leading-relaxed mb-6 max-w-md mx-auto">
              A senior move planner is reviewing your inventory scope. You will receive an itemized, binding written quote shortly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              {company.phone.primary && (
                <a
                  href={`tel:${company.phone.primary}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-display font-bold shadow-sm hover:bg-primary/90 transition-all"
                >
                  <PhoneCall size={16} />
                  <span>Call Us: {company.phone.primary}</span>
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white text-sm font-display font-bold shadow-sm hover:brightness-105 transition-all"
              >
                <MessageCircle size={16} />
                <span>Instant WhatsApp Update</span>
              </a>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setStatus("idle");
                setForm(initialForm);
              }}
              showArrow={false}
            >
              Submit Another Request
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="quote-form-section"
      className={`relative overflow-hidden bg-[#eef3f8] ${isStandalonePage ? "py-10 sm:py-16" : "py-16 sm:py-24"} border-y border-border/80 scroll-mt-20 lg:scroll-mt-24`}
      aria-labelledby="quote-form-heading"
    >
      {/* Animated Topo Field Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-70">
        <TopoField mode="light" speed={0.5} density={1.1} length={1.2} opacity={0.75} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (condensed when standalone page hero is present) */}
        {!isStandalonePage && (
          <div className="mb-10 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3.5 backdrop-blur-xs">
              <ShieldCheck size={14} className="text-accent" />
              <span>Transparent Pricing - Quick Response</span>
            </div>
            <h2
              id="quote-form-heading"
              className="font-display font-extrabold text-text mb-3 tracking-tight"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.35rem)" }}
            >
              Get a free quote
            </h2>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed max-w-xl">
              Fill in the details below and we will contact you with a transparent price, usually within a few hours.
            </p>
          </div>
        )}

        {/* Card Form Container */}
        <div className="bg-white/95 backdrop-blur-md border border-border/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(20,35,60,0.08)]">

          {/* Service Select in One Line */}
          <div className="mb-7 pb-5 border-b border-border/80">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
                Select Service:
              </label>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-0.5 w-full">
              {[
                { label: "Home Shifting", val: "Home shifting" },
                { label: "Office Relocation", val: "Office shifting" },
                { label: "Car Transport", val: "Car transport" },
                { label: "Bike Transport", val: "Bike transport" },
                { label: "Storage", val: "Warehousing / storage" },
              ].map((chip) => {
                const isSelected = form.service === chip.val;
                return (
                  <button
                    key={chip.val}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, service: chip.val }));
                    }}
                    className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors duration-200 cursor-pointer select-none active:scale-[0.98] ${
                      isSelected
                        ? "bg-primary text-white border border-primary shadow-xs"
                        : "bg-surface border border-border text-text hover:border-primary/40 hover:bg-background"
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7"
          >
            {/* Top Alert Banner for Server/Validation Errors */}
            {serverError && (
              <div
                className="sm:col-span-2 p-4 rounded-xl bg-danger/10 border border-danger/30 text-danger flex items-start gap-3 animate-in fade-in duration-200"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-danger" />
                <div className="space-y-0.5 text-left">
                  <p className="text-sm font-semibold text-danger">{serverError}</p>
                  <p className="text-xs text-danger/80">
                    Please review the highlighted input fields below and correct them before continuing.
                  </p>
                </div>
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-semibold text-text tracking-wide">
                Your name <span className="text-danger" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
                  errors.name
                    ? "border-danger ring-4 ring-danger/10"
                    : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
                placeholder="Rahul Singh"
                aria-required="true"
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-sm font-semibold text-text tracking-wide">
                Phone number <span className="text-danger" aria-hidden="true">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-surface border border-border/80 rounded-md text-xs font-bold text-text pointer-events-none select-none">
                  <span>+91</span>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={form.phone}
                  onChange={handlePhoneChange}
                  className={`w-full pl-16 pr-10 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
                    errors.phone
                      ? "border-danger ring-4 ring-danger/10"
                      : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                  }`}
                  placeholder="98XXXXXXXX"
                  aria-required="true"
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {/^[6-9]\d{9}$/.test(form.phone) && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-success flex items-center">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Moving From with Autocomplete & Auto-detect */}
            <div className="flex flex-col gap-2">
              <LocationAutocomplete
                id="movingFrom"
                name="movingFrom"
                label="Moving from"
                value={form.movingFrom}
                onChange={handleFromChange}
                placeholder="e.g. Patna, Bihar"
                error={errors.movingFrom}
                required
                isOrigin={true}
                onDetectLocation={handleDetectLocation}
                isDetecting={isDetectingLocation}
              />
              
              {/* Quick origin chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-text-muted font-medium">Top Hubs:</span>
                {["Patna", "Ranchi", "Kolkata", "Delhi NCR", "Lucknow"].map((hub) => (
                  <button
                    key={hub}
                    type="button"
                    onClick={() => handleQuickOrigin(hub)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted hover:text-text hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    {hub}
                  </button>
                ))}
              </div>
            </div>

            {/* Moving To with Autocomplete & Swap Button */}
            <div className="flex flex-col gap-2">
              <LocationAutocomplete
                id="movingTo"
                name="movingTo"
                label="Moving to"
                value={form.movingTo}
                onChange={handleToChange}
                placeholder="e.g. Ranchi / Delhi NCR / Mumbai"
                error={errors.movingTo}
                required
                headerAction={
                  <button
                    type="button"
                    onClick={handleSwapLocations}
                    className="text-xs font-semibold text-primary hover:text-accent flex items-center gap-1 cursor-pointer transition-colors"
                    title="Swap origin and destination"
                  >
                    <ArrowLeftRight size={12} />
                    <span>Swap route</span>
                  </button>
                }
              />
              
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[11px] text-text-muted font-medium">Popular:</span>
                {["Delhi NCR", "Ranchi", "Kolkata", "Bengaluru", "Mumbai"].map((dest) => (
                  <button
                    key={dest}
                    type="button"
                    onClick={() => handleToChange(dest)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-surface border border-border text-text-muted hover:text-text hover:border-primary/40 transition-colors cursor-pointer"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Move type (Custom Dropdown) */}
            <div className="flex flex-col gap-1.5">
              <CustomSelect
                id="moveType"
                label="Move type"
                value={form.moveType}
                onChange={(val) => handleSelectChange("moveType", val)}
                options={moveTypes}
                placeholder="Select move type"
                error={errors.moveType}
                required
              />
              <div className="flex items-center gap-1.5">
                {[
                  { label: "Local", val: "Within the city" },
                  { label: "Same State", val: "Within the state" },
                  { label: "Interstate", val: "To another state" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleQuickMoveType(item.val)}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors cursor-pointer ${
                      form.moveType === item.val
                        ? "bg-primary text-white border-primary"
                        : "bg-surface border-border text-text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>


            {/* Move size / Home configuration (Select & Quick Chips) */}
            <div className="flex flex-col gap-1.5">
              <CustomSelect
                id="moveSize"
                label="Home / move size"
                value={form.moveSize}
                onChange={(val) => handleSelectChange("moveSize", val)}
                options={moveSizes}
                placeholder="Select size (e.g. 1 BHK, 2 BHK, Vehicle)"
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {[
                  { label: "1 BHK", val: "1 BHK (1 Bedroom / Studio)" },
                  { label: "2 BHK", val: "2 BHK (Standard Apartment)" },
                  { label: "3 BHK", val: "3 BHK (Large Apartment)" },
                  { label: "4+ BHK", val: "4+ BHK / Independent Villa" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        moveSize: item.val,
                        service: prev.service || "Home shifting",
                      }));
                    }}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors cursor-pointer ${
                      form.moveSize === item.val
                        ? "bg-primary text-white border-primary"
                        : "bg-surface border-border text-text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline (Custom Dropdown & Quick Chips) */}
            <div className="flex flex-col gap-1.5">
              <CustomSelect
                id="timeline"
                label="Preferred timeline"
                value={form.timeline}
                onChange={(val) => handleSelectChange("timeline", val)}
                options={timelines}
                placeholder="When do you plan to move?"
                error={errors.timeline}
                required
              />
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {[
                  { label: "2-3 Days", val: "Urgent (within 2 to 3 days)" },
                  { label: "Within 1 Wk", val: "Within a week" },
                  { label: "15 Days", val: "Within 15 days" },
                  { label: "Flexible", val: "Not fixed yet" },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleSelectChange("timeline", item.val)}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-medium border transition-colors cursor-pointer ${
                      form.timeline === item.val
                        ? "bg-primary text-white border-primary"
                        : "bg-surface border-border text-text-muted hover:text-text"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email (optional) */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-text tracking-wide">
                Email <span className="text-text-muted font-normal text-xs">(optional)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full px-4 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
                  errors.email
                    ? "border-danger ring-4 ring-danger/10"
                    : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
                }`}
                placeholder="you@example.com"
                aria-invalid={errors.email ? "true" : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-xs font-medium text-danger mt-0.5" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Live Dynamic Price Range Indicator Banner */}
            <div className="relative mt-3 sm:col-span-2 rounded-xl border border-primary/20 bg-primary/[0.02] py-2.5 px-4 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
              {/* Embedded Top Tag */}
              <span className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                Live Estimate
              </span>

              <div className="flex items-center gap-2 text-xs text-text-muted pt-1 sm:pt-0 min-w-0">
                <span className="font-semibold text-text-main shrink-0">
                  {form.moveType || "Standard Move"}
                </span>
                <span className="text-border shrink-0">•</span>
                <span className="truncate">
                  Includes packing, loading & transit insurance
                </span>
              </div>

              <div className="flex items-baseline gap-1.5 shrink-0">
                <span className="text-base sm:text-lg font-bold font-display text-primary">
                  {fareEstimate.min} – {fareEstimate.max}
                </span>
              </div>
            </div>

            {/* Submit & Assurance */}
            <div className="sm:col-span-2 pt-2">
              {status === "error" && (
                <div className="p-4 mb-4 rounded-[var(--radius-md)] bg-danger/10 border border-danger/20 text-sm text-danger font-medium" role="alert">
                  Something went wrong while submitting. Please call or WhatsApp us directly.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <Button
                  type="submit"
                  disabled={status === "submitting"}
                  variant="accent"
                  size="lg"
                  className="sm:col-span-8 w-full shadow-md"
                >
                  {status === "submitting" ? "Sending your request..." : "Get Free Binding Quote"}
                </Button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:col-span-4 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-[#25D366] text-white font-display font-bold text-xs sm:text-sm hover:brightness-105 transition-all shadow-sm"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Quote</span>
                </a>
              </div>
              
              <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-xs text-text-muted">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-primary shrink-0" />
                  <span>100% Binding Written Price</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                  <span>Zero Spam Guarantee</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck size={15} className="text-accent shrink-0" />
                  <span>Dedicated Closed Fleet</span>
                </span>
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};

export default QuoteForm;
