import React, { useState, useRef, useEffect, useMemo } from "react";
import { MapPin, X, Loader2, LocateFixed, Building2, Navigation } from "lucide-react";
import { allServiceLocations, hubLocations } from "@/data/locations";

const POPULAR_HUBS = [
  { name: "Patna", state: "Bihar", type: "hub" },
  { name: "Ranchi", state: "Jharkhand", type: "hub" },
  { name: "Delhi NCR", state: "Delhi NCR", type: "hub" },
  { name: "Kolkata", state: "West Bengal", type: "hub" },
  { name: "Dhanbad", state: "Jharkhand", type: "hub" },
  { name: "Lucknow", state: "Uttar Pradesh", type: "hub" },
  { name: "Muzaffarpur", state: "Bihar", type: "hub" },
  { name: "Bengaluru", state: "Karnataka", type: "metro" },
  { name: "Mumbai", state: "Maharashtra", type: "metro" },
];

export default function LocationAutocomplete({
  id,
  name,
  label,
  value = "",
  onChange,
  placeholder = "Enter city or area",
  error,
  required = false,
  isOrigin = false,
  onDetectLocation,
  isDetecting = false,
  headerAction,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching locations
  const filteredOptions = useMemo(() => {
    const q = (value || "").trim().toLowerCase();
    if (!q) {
      return POPULAR_HUBS.map((h) => ({
        label: `${h.name}, ${h.state}`,
        city: h.name,
        state: h.state,
        type: h.type,
      }));
    }

    const matches = [];
    const seen = new Set();

    // 1. Exact/prefix matches in service locations
    allServiceLocations.forEach((loc) => {
      const cityNorm = loc.name.toLowerCase();
      const stateNorm = loc.state.toLowerCase();
      const slugNorm = loc.slug.toLowerCase();

      if (
        cityNorm.includes(q) ||
        stateNorm.includes(q) ||
        slugNorm.includes(q)
      ) {
        const key = `${loc.name}, ${loc.state}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push({
            label: key,
            city: loc.name,
            state: loc.state,
            type: loc.type || "district",
            isHub: loc.type === "hub",
          });
        }
      }
    });

    // 2. Sort: Hubs first, then alphabetical
    matches.sort((a, b) => {
      if (a.isHub && !b.isHub) return -1;
      if (!a.isHub && b.isHub) return 1;
      return a.city.localeCompare(b.city);
    });

    return matches.slice(0, 8);
  }, [value]);

  const handleSelect = (option) => {
    onChange(option.label);
    setIsOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0 && highlightIndex < filteredOptions.length) {
        handleSelect(filteredOptions[highlightIndex]);
      } else if (filteredOptions.length > 0) {
        handleSelect(filteredOptions[0]);
      } else {
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className="relative flex flex-col gap-2">
      {/* Label and Quick Action */}
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-text tracking-wide">
          {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
        </label>

        {isOrigin && onDetectLocation && (
          <button
            type="button"
            onClick={onDetectLocation}
            disabled={isDetecting}
            className="text-xs font-semibold text-primary hover:text-accent flex items-center gap-1 cursor-pointer transition-colors"
            title="Auto-detect location from network"
          >
            {isDetecting ? (
              <Loader2 size={12} className="animate-spin text-primary" />
            ) : (
              <LocateFixed size={12} className="text-primary" />
            )}
            <span>{isDetecting ? "Detecting..." : "Auto-detect"}</span>
          </button>
        )}
        {headerAction}
      </div>

      {/* Input container */}
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
          <MapPin size={16} className={value ? "text-primary" : "text-text-muted"} />
        </div>

        <input
          ref={inputRef}
          id={id}
          name={name}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
            setHighlightIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-controls={`${id}-listbox`}
          className={`w-full pl-10 pr-9 py-3.5 text-[0.95rem] text-text bg-background border rounded-[var(--radius-md)] placeholder:text-text-muted transition-all duration-150 ${
            error
              ? "border-danger ring-4 ring-danger/10"
              : "border-border hover:border-text-muted/60 focus:border-primary focus:ring-4 focus:ring-primary/10"
          }`}
        />

        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text rounded-full hover:bg-surface transition-colors cursor-pointer"
            aria-label="Clear location"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown suggestions list */}
      {isOpen && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-border/90 rounded-2xl shadow-[0_12px_36px_rgba(20,35,60,0.12)] py-2 z-50 max-h-64 overflow-y-auto"
        >
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted border-b border-border/50 flex items-center justify-between">
            <span>{value ? "Matching Service Locations" : "Popular Operational Hubs"}</span>
            <span className="text-primary font-medium lowercase text-[10px]">where we serve</span>
          </div>

          {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-text-muted text-center">
              No matching branch found. You can still type custom locations.
            </div>
          ) : (
            filteredOptions.map((opt, idx) => {
              const isSelected = highlightIndex === idx;
              return (
                <div
                  key={opt.label}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  className={`px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs sm:text-sm ${
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-text hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {opt.isHub || opt.type === "hub" ? (
                      <Building2 size={14} className="text-primary shrink-0" />
                    ) : (
                      <Navigation size={13} className="text-text-muted shrink-0" />
                    )}
                    <div className="truncate">
                      <span className="font-medium text-text">{opt.city}</span>
                      <span className="text-text-muted text-[11px] ml-1.5">({opt.state})</span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      opt.isHub || opt.type === "hub"
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "bg-surface border border-border text-text-muted"
                    }`}
                  >
                    {opt.isHub || opt.type === "hub" ? "Branch Hub" : "Direct Service"}
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-medium text-danger mt-0.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
