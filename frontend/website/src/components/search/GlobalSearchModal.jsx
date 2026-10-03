import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate, Link } from "react-router";
import {
  Search,
  X,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Truck,
  Home,
  Building2,
  Car,
  Bike,
  Package,
  Boxes,
  Warehouse,
  ShieldCheck,
  Calculator,
  FileCheck,
  PhoneCall,
  MessageCircle,
  AlertTriangle,
  Scale,
  CornerDownLeft,
  ExternalLink,
} from "lucide-react";
import { useSiteSearch } from "@/hooks/useSiteSearch";

// Icon mapping helper
const ICON_MAP = {
  Home,
  Building2,
  Car,
  Bike,
  Package,
  Boxes,
  Warehouse,
  ShieldCheck,
  Calculator,
  FileCheck,
  MapPin,
  Truck,
  PhoneCall,
  MessageCircle,
  AlertTriangle,
  Scale,
};

const GlobalSearchModal = ({ isOpen, onClose, initialQuery = "" }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    results,
    groupedResults,
    categoryCounts,
    totalMatches,
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    trendingQueries,
  } = useSiteSearch(initialQuery);

  // Auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll and pause Lenis smooth scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.stop();
      }
    } else {
      document.body.style.overflow = "";
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = "";
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.start();
      }
    };
  }, [isOpen]);

  // Reset selected index when query or active category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Handle keyboard navigation: ArrowUp, ArrowDown, Enter, Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = results[selectedIndex];
        if (selected) {
          handleSelectResult(selected);
        } else if (query.trim()) {
          // If user hit Enter on search without highlighting item, navigate to /search?q=...
          addRecentSearch(query);
          navigate(`/search?q=${encodeURIComponent(query)}`);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, query, onClose, navigate, addRecentSearch]);

  // Scroll selected item into view in keyboard navigation
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSelectResult = (item) => {
    addRecentSearch(query.trim() || item.title);
    onClose();

    if (item.external) {
      if (item.url.startsWith("tel:") || item.url.startsWith("mailto:")) {
        window.location.href = item.url;
      } else {
        window.open(item.url, "_blank", "noopener,noreferrer");
      }
    } else {
      navigate(item.url);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      addRecentSearch(query.trim());
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      data-lenis-prevent
      className="fixed inset-0 z-[99999] flex items-start justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 cursor-pointer"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
    >
      {/* Modal Card */}
      <div
        data-lenis-prevent
        className="relative w-full max-w-3xl bg-background rounded-2xl sm:rounded-3xl border border-border shadow-2xl overflow-hidden mt-8 sm:mt-14 z-10 animate-in zoom-in-95 fade-in duration-150 flex flex-col max-h-[85vh] cursor-default overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center gap-3 px-4 sm:px-6 py-4 border-b border-border bg-surface/80"
        >
          <Search size={20} className="text-primary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, cities, routes, pricing..."
            className="w-full bg-transparent text-text placeholder:text-text-muted text-base sm:text-lg font-medium focus:outline-none"
            aria-label="Search site"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-text-muted hover:text-text hover:bg-background transition-colors"
              aria-label="Clear query"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md border border-border text-[11px] font-semibold text-text-muted bg-background hover:bg-surface transition-colors"
            title="Press Esc to close"
          >
            <span>ESC</span>
          </button>
        </form>

        {/* Category Filter Pills (shown when search has query & results) */}
        {query.trim() && totalMatches > 0 && (
          <div className="px-4 sm:px-6 py-3 bg-surface/90 border-b border-border flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 min-h-[52px]">
            <span className="text-xs text-text-muted font-bold uppercase tracking-wider shrink-0 mr-1">
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setActiveCategory("All")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                activeCategory === "All"
                  ? "bg-primary text-white shadow-xs font-bold"
                  : "bg-background text-text hover:bg-surface border border-border"
              }`}
            >
              All ({totalMatches})
            </button>
            {Object.keys(groupedResults).map((cat) => {
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary text-white shadow-xs font-bold"
                      : "bg-background text-text hover:bg-surface border border-border"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div
          ref={listRef}
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-6"
        >
          {/* ── State A: Empty Query (Recent & Trending) ────────────────── */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                      <Clock size={13} /> Recent Searches
                    </span>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-text-muted hover:text-primary transition-colors font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-border text-xs text-text hover:border-primary/40 group transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => setQuery(term)}
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {term}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRecentSearch(term);
                          }}
                          className="text-text-muted group-hover:text-text hover:text-red-600 transition-colors ml-0.5"
                          aria-label={`Remove ${term}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-accent" /> Trending Relocation Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {trendingQueries.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setQuery(item)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-border/80 text-xs font-medium text-text hover:border-accent hover:bg-accent/10 transition-all cursor-pointer"
                    >
                      <span>{item}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Quick Directory Access
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/services");
                    }}
                    className="p-3 rounded-xl bg-surface border border-border hover:border-primary/40 hover:bg-background text-left transition-all group"
                  >
                    <Home size={18} className="text-primary mb-1.5 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-text group-hover:text-primary">All Services</div>
                    <div className="text-[10px] text-text-muted">8 specialized moves</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/pricing");
                    }}
                    className="p-3 rounded-xl bg-surface border border-border hover:border-primary/40 hover:bg-background text-left transition-all group"
                  >
                    <Calculator size={18} className="text-accent mb-1.5 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-text group-hover:text-primary">Pricing Guide</div>
                    <div className="text-[10px] text-text-muted">Transparent rate cards</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/where-we-serve");
                    }}
                    className="p-3 rounded-xl bg-surface border border-border hover:border-primary/40 hover:bg-background text-left transition-all group"
                  >
                    <MapPin size={18} className="text-green-600 mb-1.5 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-text group-hover:text-primary">Where We Serve</div>
                    <div className="text-[10px] text-text-muted">100+ cities & hubs</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/get-quote");
                    }}
                    className="p-3 rounded-xl bg-primary text-white text-left transition-all hover:bg-primary/90 group shadow-sm"
                  >
                    <FileCheck size={18} className="text-accent mb-1.5 group-hover:scale-110 transition-transform" />
                    <div className="text-xs font-bold text-white">Get a Free Quote</div>
                    <div className="text-[10px] text-white/80">Instant binding price</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── State B: Search Results Found ───────────────────────────── */}
          {query.trim() && totalMatches > 0 && (
            <div className="space-y-6">
              {/* Grouped results view */}
              {activeCategory === "All" ? (
                Object.keys(groupedResults).map((categoryName) => {
                  const items = groupedResults[categoryName];
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={categoryName} className="space-y-2">
                      <div className="flex items-center justify-between pb-1 border-b border-border/70">
                        <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                          {categoryName}
                        </span>
                        <span className="text-[11px] font-semibold text-text-muted">
                          {items.length} {items.length === 1 ? "match" : "matches"}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {items.map((item) => {
                          const flatIndex = results.findIndex((r) => r.id === item.id);
                          const isSelected = selectedIndex === flatIndex;
                          const ItemIcon = ICON_MAP[item.icon] || MapPin;

                          return (
                            <div
                              key={item.id}
                              data-index={flatIndex}
                              onClick={() => handleSelectResult(item)}
                              onMouseEnter={() => setSelectedIndex(flatIndex)}
                              className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-start sm:items-center justify-between gap-3 ${
                                isSelected
                                  ? "bg-surface border-primary/40 shadow-xs ring-1 ring-primary/20"
                                  : "bg-background border-border hover:bg-surface/70"
                              }`}
                            >
                              <div className="flex items-start sm:items-center gap-3 min-w-0">
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                    isSelected
                                      ? "bg-primary text-white"
                                      : "bg-surface border border-border text-primary"
                                  }`}
                                >
                                  <ItemIcon size={18} />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate">
                                      {item.title}
                                    </span>
                                    {item.subtitle && (
                                      <span className="text-xs text-text-muted hidden sm:inline truncate">
                                        - {item.subtitle}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                                    {item.description}
                                  </p>
                                </div>
                              </div>

                              {/* Right Action buttons */}
                              <div className="flex items-center gap-2 shrink-0">
                                {item.quoteUrl && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      addRecentSearch(item.title);
                                      onClose();
                                      navigate(item.quoteUrl);
                                    }}
                                    className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-[11px] font-bold text-text hover:bg-accent hover:text-accent-foreground transition-all"
                                  >
                                    <span>Get Quote</span>
                                    <ArrowRight size={11} />
                                  </button>
                                )}

                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                                    isSelected
                                      ? "bg-primary text-white translate-x-0.5"
                                      : "text-text-muted group-hover:text-primary"
                                  }`}
                                >
                                  {item.external ? <ExternalLink size={13} /> : <ArrowRight size={14} />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                /* Flat results for single selected category */
                <div className="space-y-1.5">
                  {results.map((item, idx) => {
                    const isSelected = selectedIndex === idx;
                    const ItemIcon = ICON_MAP[item.icon] || MapPin;

                    return (
                      <div
                        key={item.id}
                        data-index={idx}
                        onClick={() => handleSelectResult(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-start sm:items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-surface border-primary/40 shadow-xs ring-1 ring-primary/20"
                            : "bg-background border-border hover:bg-surface/70"
                        }`}
                      >
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-surface border border-border text-primary"
                            }`}
                          >
                            <ItemIcon size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-text group-hover:text-primary transition-colors truncate">
                                {item.title}
                              </span>
                              {item.subtitle && (
                                <span className="text-xs text-text-muted hidden sm:inline truncate">
                                  - {item.subtitle}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Right Action buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.quoteUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                addRecentSearch(item.title);
                                onClose();
                                navigate(item.quoteUrl);
                              }}
                              className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-[11px] font-bold text-text hover:bg-accent hover:text-accent-foreground transition-all"
                            >
                              <span>Get Quote</span>
                              <ArrowRight size={11} />
                            </button>
                          )}

                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                              isSelected
                                ? "bg-primary text-white translate-x-0.5"
                                : "text-text-muted group-hover:text-primary"
                            }`}
                          >
                            {item.external ? <ExternalLink size={13} /> : <ArrowRight size={14} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── State C: Zero Results ─────────────────────────────────── */}
          {query.trim() && totalMatches === 0 && (
            <div className="py-8 px-4 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
                <Search size={22} />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-display font-bold text-text text-base">
                  No direct matches for &quot;{query}&quot;
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Try searching with city names (e.g. <em>Patna</em>, <em>Ranchi</em>, <em>Delhi</em>),
                  service categories (e.g. <em>Car</em>, <em>Home</em>, <em>Office</em>), or interstate routes (e.g. <em>Patna to Bangalore</em>).
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuery("Patna to Delhi")}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-text hover:border-primary font-medium"
                >
                  Patna to Delhi
                </button>
                <button
                  type="button"
                  onClick={() => setQuery("Car Transportation")}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-text hover:border-primary font-medium"
                >
                  Car Transportation
                </button>
                <button
                  type="button"
                  onClick={() => setQuery("Pricing")}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-text hover:border-primary font-medium"
                >
                  Pricing Calculator
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="px-4 sm:px-6 py-3 border-t border-border bg-surface/90 flex items-center justify-between text-xs text-text-muted">
          <div className="hidden sm:flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↵</kbd>
              <span>to select</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[10px]">esc</kbd>
              <span>to dismiss</span>
            </span>
          </div>

          {query.trim() && (
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="text-primary font-bold hover:underline flex items-center gap-1 ml-auto"
            >
              <span>See all {totalMatches} results on search page</span>
              <CornerDownLeft size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
};

export default GlobalSearchModal;
