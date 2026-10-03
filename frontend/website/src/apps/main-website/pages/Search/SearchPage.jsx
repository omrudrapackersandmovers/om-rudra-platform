import { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import {
  Search,
  X,
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
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { company } from "@/data/company";
import SEO from "@/configs/seo";
import Button from "../../shared/components/Button";
import { useSiteSearch, CATEGORY_ORDER } from "@/hooks/useSiteSearch";

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

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const urlQuery = searchParams.get("q") || "";
  const urlCategory = searchParams.get("category") || "All";

  const {
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    results,
    groupedResults,
    categoryCounts,
    totalMatches,
    addRecentSearch,
    trendingQueries,
  } = useSiteSearch(urlQuery);

  // Synchronize state from URL params
  useEffect(() => {
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    if (urlCategory && urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  // Handle live typing and updating URL query
  const handleInputChange = (val) => {
    setQuery(val);
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set("q", val);
    } else {
      newParams.delete("q");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const newParams = new URLSearchParams(searchParams);
    if (cat !== "All") {
      newParams.set("category", cat);
    } else {
      newParams.delete("category");
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleSelectTrending = (item) => {
    setQuery(item);
    addRecentSearch(item);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("q", item);
    setSearchParams(newParams, { replace: true });
  };

  return (
    <>
      <SEO
        title={
          query.trim()
            ? `Search Results for "${query}" | 1st Om Packers`
            : "Search Services, Cities & Interstate Routes | 1st Om Packers"
        }
        description={`Search across ${company.legalName}'s nationwide relocation services, 100+ cities, interstate route rates, transparent pricing calculators, and verified company policies.`}
      />

      {/* ── 1. HERO & SEARCH INPUT BANNER ─────────────────────────────── */}
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
                <span className="text-text font-semibold">Site Search</span>
              </li>
              {query.trim() && (
                <>
                  <li aria-hidden="true"><ChevronRight size={13} /></li>
                  <li className="text-primary font-bold truncate max-w-[200px] sm:max-w-xs">
                    &quot;{query}&quot;
                  </li>
                </>
              )}
            </ol>
          </nav>

          <div className="max-w-3xl mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-text text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
              <Search size={14} className="text-accent" />
              <span>Unified Relocation Search Directory</span>
            </div>
            <h1
              className="font-display font-extrabold text-text tracking-tight mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.15 }}
            >
              Search Everything on 1st Om Packers
            </h1>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed">
              Find specialized shifting services, city branches, interstate highway route rates, transparent moving calculators, and verified transit risk policies.
            </p>
          </div>

          {/* Master Search Input Bar */}
          <div className="max-w-3xl">
            <div className="relative flex items-center bg-surface border-2 border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 rounded-2xl shadow-md transition-all">
              <div className="pl-4 sm:pl-5 text-primary">
                <Search size={22} />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search services, cities, routes (e.g. 'Patna to Delhi', 'Car Transport', 'Pricing')..."
                className="w-full py-4 pl-3 pr-12 text-base sm:text-lg font-medium text-text bg-transparent placeholder:text-text-muted focus:outline-none"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => handleInputChange("")}
                  className="absolute right-4 p-1.5 rounded-full text-text-muted hover:text-text hover:bg-background transition-colors"
                  aria-label="Clear search query"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Trending suggestions */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                Trending:
              </span>
              {trendingQueries.slice(0, 5).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => handleSelectTrending(term)}
                  className="px-3 py-1 rounded-full bg-surface border border-border text-xs text-text hover:border-accent hover:bg-accent/10 transition-all font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. SEARCH RESULTS & CATEGORY FILTER TABS ──────────────────── */}
      <section className="bg-background py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Status & Category Filter Bar */}
          {query.trim() && (
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
                <h2 className="font-display font-bold text-lg sm:text-xl text-text">
                  {totalMatches > 0 ? (
                    <>
                      Found <span className="text-primary font-extrabold">{totalMatches}</span>{" "}
                      {totalMatches === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
                    </>
                  ) : (
                    <>No results found for &ldquo;{query}&rdquo;</>
                  )}
                </h2>

                {totalMatches > 0 && (
                  <span className="text-xs text-text-muted">
                    Showing results matching across services, routes, cities, and policies
                  </span>
                )}
              </div>

              {/* Filter Tabs */}
              {totalMatches > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange("All")}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      activeCategory === "All"
                        ? "bg-primary text-white shadow-sm"
                        : "bg-surface text-text hover:bg-background border border-border"
                    }`}
                  >
                    All Results ({totalMatches})
                  </button>

                  {CATEGORY_ORDER.map((cat) => {
                    const count = categoryCounts[cat] || 0;
                    if (count === 0) return null;

                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => handleCategoryChange(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                          activeCategory === cat
                            ? "bg-primary text-white shadow-sm"
                            : "bg-surface text-text hover:bg-background border border-border"
                        }`}
                      >
                        {cat} ({count})
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── Results Cards List ────────────────────────────────────── */}
          {query.trim() && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {results.map((item) => {
                const ItemIcon = ICON_MAP[item.icon] || MapPin;

                return (
                  <div
                    key={item.id}
                    className="group p-5 sm:p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Category Badge & Icon */}
                      <div className="flex items-center justify-between">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-background border border-border text-[11px] font-bold uppercase tracking-wider text-text-muted">
                          <ItemIcon size={13} className="text-primary shrink-0" />
                          <span>{item.category}</span>
                        </div>

                        {item.distanceKm && (
                          <span className="text-xs font-semibold text-primary">
                            {item.distanceKm} km
                          </span>
                        )}
                      </div>

                      {/* Title & Subtitle */}
                      <div>
                        <h3 className="font-display font-bold text-base sm:text-lg text-text group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.subtitle && (
                          <p className="text-xs font-semibold text-accent mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed line-clamp-3">
                        {item.description}
                      </p>

                      {/* Badges */}
                      {Array.isArray(item.badges) && item.badges.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.badges.map((badge, bIdx) => (
                            <span
                              key={bIdx}
                              className="px-2 py-0.5 rounded-full bg-background border border-border/80 text-[10px] font-semibold text-text-muted"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Actions Footer */}
                    <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border/80">
                      {item.external ? (
                        <a
                          href={item.url}
                          target={item.url.startsWith("http") ? "_blank" : undefined}
                          rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                        >
                          <span>Connect Now</span>
                          <ExternalLink size={13} />
                        </a>
                      ) : (
                        <Link
                          to={item.url}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-surface hover:bg-background border border-border text-xs font-bold text-text group-hover:border-primary/40 transition-colors"
                        >
                          <span>View Details</span>
                          <ArrowRight size={13} />
                        </Link>
                      )}

                      {item.quoteUrl && (
                        <Link
                          to={item.quoteUrl}
                          className="inline-flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-accent text-accent-foreground text-xs font-bold hover:bg-accent/90 transition-colors shadow-xs"
                        >
                          <span>Get Quote</span>
                          <ArrowRight size={13} />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query.trim() && totalMatches === 0 ? (
            /* ── Zero Results Fallback ────────────────────────────────── */
            <div className="max-w-2xl mx-auto py-12 px-6 rounded-3xl bg-surface border border-border text-center space-y-5">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center mx-auto">
                <Search size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-text">
                  No direct matches for &ldquo;{query}&rdquo;
                </h3>
                <p className="text-sm text-text-muted leading-relaxed max-w-lg mx-auto">
                  We could not find an exact match. You can search by specific city name, relocation service type, or popular interstate highway route.
                </p>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  Suggested Searches:
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {trendingQueries.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleSelectTrending(term)}
                      className="px-3.5 py-1.5 rounded-full bg-background border border-border text-xs font-semibold text-text hover:border-primary hover:text-primary transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border flex flex-wrap justify-center gap-3">
                <Button to="/services" variant="outline" size="sm">
                  Explore All Services
                </Button>
                <Button to="/where-we-serve" variant="outline" size="sm">
                  View Coverage Map
                </Button>
                <Button to="/get-quote" variant="primary" size="sm">
                  Get a Free Quote
                </Button>
              </div>
            </div>
          ) : (
            /* ── Default State (No Query Entered Yet) ─────────────────── */
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Home size={20} />
                  </div>
                  <h3 className="font-display font-bold text-base text-text">
                    Specialized Relocation Services
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Household shifting, corporate office moves, enclosed car transport, and bike crating.
                  </p>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                  >
                    <span>Browse 8 services</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent-foreground flex items-center justify-center">
                    <MapPin size={20} className="text-accent" />
                  </div>
                  <h3 className="font-display font-bold text-base text-text">
                    Nationwide Service Coverage
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    100+ cities and regional hubs across Bihar, Jharkhand, UP, West Bengal, and Indian metros.
                  </p>
                  <Link
                    to="/where-we-serve"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                  >
                    <span>View all locations</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>

                <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-700 flex items-center justify-center">
                    <Calculator size={20} />
                  </div>
                  <h3 className="font-display font-bold text-base text-text">
                    Transparent Moving Cost Calculator
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Standard rate cards for 1 BHK, 2 BHK, 3 BHK, car shipping, and packing materials.
                  </p>
                  <Link
                    to="/pricing"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                  >
                    <span>View pricing cards</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Popular Relocation Routes Preview */}
              <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-border space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-lg text-text">
                      High-Intent Interstate Highway Routes
                    </h3>
                    <p className="text-xs text-text-muted">
                      Direct sealed container moving along high-demand national freight corridors
                    </p>
                  </div>
                  <Button to="/get-quote" size="sm" variant="accent">
                    Book Any Route
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    "Patna to Delhi",
                    "Patna to Bengaluru",
                    "Patna to Kolkata",
                    "Patna to Mumbai",
                    "Patna to Hyderabad",
                    "Patna to Pune",
                    "Ranchi to Delhi",
                    "Ranchi to Kolkata",
                  ].map((route) => (
                    <button
                      key={route}
                      type="button"
                      onClick={() => handleSelectTrending(route)}
                      className="p-3 rounded-xl bg-background border border-border hover:border-primary/40 text-left transition-all group"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-text group-hover:text-primary">
                        <Truck size={13} className="text-accent shrink-0" />
                        <span className="truncate">{route}</span>
                      </div>
                      <div className="text-[10px] text-text-muted mt-0.5">Click to search rates</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── 3. BOTTOM HELP STRIP ─────────────────────────────────────── */}
      <section className="bg-surface py-12 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display font-bold text-text text-lg mb-1">
                Can&apos;t Find Your Destination or Moving Requirement?
              </h3>
              <p className="text-xs sm:text-sm text-text-muted">
                Our central dispatch officers provide instant custom route availability and binding quotes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={`tel:${company.phone.primary}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-display font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-sm"
              >
                <PhoneCall size={15} />
                <span>Call {company.phone.primary}</span>
              </a>
              <Button to="/contact" variant="outline" size="sm">
                Branch Directory
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SearchPage;
