import { useState } from "react";
import {
  ArrowLeftRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import LocationAutocomplete from "./LocationAutocomplete";

const SERVICES = [
  { id: "home", label: "Home Shifting", service: "Home shifting" },
  { id: "office", label: "Office Relocation", service: "Office shifting" },
  { id: "vehicle", label: "Vehicle Transport", service: "Car transport" },
];

export default function HeroBookingBar({ className = "" }) {
  const [service, setService] = useState("Home shifting");
  const [movingFrom, setMovingFrom] = useState("");
  const [movingTo, setMovingTo] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success
  const [error, setError] = useState("");

  const handleSwap = () => {
    const temp = movingFrom;
    setMovingFrom(movingTo);
    setMovingTo(temp);
  };

  const deduceMoveType = (from, to) => {
    if (!from || !to) return "To another state";
    const f = from.toLowerCase();
    const t = to.toLowerCase();
    if (f === t) return "Within the city";
    if (f.includes("bihar") && t.includes("bihar")) return "Within the state";
    if (f.includes("jharkhand") && t.includes("jharkhand")) return "Within the state";
    return "To another state";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!movingFrom.trim()) {
      setError("Please enter your pickup city.");
      return;
    }
    if (!movingTo.trim()) {
      setError("Please enter your drop city.");
      return;
    }
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setStatus("submitting");

    try {
      const rawBase = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:8787" : "https://api.omrudrapackersandmovers.com")).trim();
      const apiBase = rawBase
        ? rawBase.startsWith("http://") || rawBase.startsWith("https://")
          ? rawBase.replace(/\/+$/, "")
          : `https://${rawBase.replace(/\/+$/, "")}`
        : "https://api.omrudrapackersandmovers.com";

      const payload = {
        name: "Direct Inquiry",
        phone: cleanPhone,
        movingFrom: movingFrom.trim(),
        movingTo: movingTo.trim(),
        moveType: deduceMoveType(movingFrom, movingTo),
        service: service,
        timeline: "Within a week",
        email: "",
      };

      const res = await fetch(`${apiBase}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        setStatus("idle");
        setError("Unable to submit. Please check details or call us.");
        return;
      }

      setStatus("success");
    } catch (err) {
      console.error("Hero booking submit error:", err);
      setStatus("idle");
      setError("Connection error. Please call our team directly.");
    }
  };

  if (status === "success") {
    return (
      <div className={`w-full max-w-4xl rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl border border-white/50 text-text animate-in fade-in duration-200 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-base text-text">
              Quote Request Sent!
            </h3>
            <p className="text-xs sm:text-sm text-text-muted">
              We received your request for <span className="font-semibold text-text">{movingFrom} → {movingTo}</span>. Our team will call you at <span className="font-semibold text-text">+91 {phone}</span> shortly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setMovingFrom("");
              setMovingTo("");
              setPhone("");
            }}
            className="text-xs font-semibold text-primary hover:underline shrink-0 cursor-pointer"
          >
            New Quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-5xl ${className}`}>
      
      {/* Category Tabs: Crisp, clean, typography only */}
      <div className="flex items-center gap-2 mb-3">
        {SERVICES.map((item) => {
          const isActive = service === item.service;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setService(item.service)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer select-none ${
                isActive
                  ? "bg-accent text-accent-foreground font-bold shadow-md"
                  : "bg-white/10 hover:bg-white/20 text-white/90 border border-white/15"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Single-Line Fluid Bar */}
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/30 text-text">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
          
          {/* Pickup Location */}
          <div className="flex-1 min-w-0">
            <LocationAutocomplete
              id="heroFrom"
              name="heroFrom"
              value={movingFrom}
              onChange={(val) => {
                setMovingFrom(val);
                if (error) setError("");
              }}
              placeholder="Pickup City (e.g. Patna)"
              isOrigin={true}
              inputClassName="!rounded-xl sm:!rounded-full !py-3.5 !border-border/80 focus:!border-primary"
            />
          </div>

          {/* Swap Button */}
          <div className="hidden lg:flex items-center justify-center shrink-0">
            <button
              type="button"
              onClick={handleSwap}
              title="Swap cities"
              className="w-8 h-8 rounded-full bg-surface hover:bg-border text-text-muted hover:text-text transition-colors flex items-center justify-center cursor-pointer active:scale-95"
            >
              <ArrowLeftRight size={14} />
            </button>
          </div>

          {/* Drop Location */}
          <div className="flex-1 min-w-0">
            <LocationAutocomplete
              id="heroTo"
              name="heroTo"
              value={movingTo}
              onChange={(val) => {
                setMovingTo(val);
                if (error) setError("");
              }}
              placeholder="Drop City (e.g. Delhi NCR)"
              inputClassName="!rounded-xl sm:!rounded-full !py-3.5 !border-border/80 focus:!border-primary"
            />
          </div>

          {/* Phone Number */}
          <div className="flex-1 min-w-0 relative flex items-center bg-background border border-border/80 rounded-xl sm:rounded-full px-4 py-3.5 hover:border-text-muted/60 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <span className="text-xs font-bold text-text-muted mr-2 select-none">+91</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                setPhone(digits);
                if (error) setError("");
              }}
              placeholder="Mobile Number"
              className="w-full text-[0.95rem] text-text bg-transparent border-0 p-0 focus:outline-none placeholder:text-text-muted font-medium"
            />
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="shrink-0 px-8 py-3.5 rounded-xl sm:rounded-full bg-accent hover:brightness-105 active:scale-95 text-accent-foreground font-display font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <span>Get Free Quote →</span>
            )}
          </button>

        </form>
      </div>

      {/* Validation Error Banner */}
      {error && (
        <div className="mt-2 text-xs font-semibold text-danger flex items-center gap-1.5 bg-danger/10 px-3 py-1.5 rounded-lg border border-danger/20 w-fit">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

    </div>
  );
}
