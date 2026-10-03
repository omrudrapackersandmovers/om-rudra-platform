import { Link } from "react-router";
import { MapPin, Building2, Navigation } from "lucide-react";
import InteractiveLink from "@/components/ui/interactive-link";
import { locationsByState, placeImages } from "../../../../../data/locations/index";

/**
 * LocationsSnapshot — purposeful coverage preview with full 2-row grids.
 *
 * Shows 6 key operating states (2 full rows of 3) with explicit Main Hub callouts,
 * and 6 top interstate routes (2 full rows of 3) with origin hubs and distances.
 */

// 6 Core States — creates exactly 2 full rows on desktop (3 x 2)
const STATE_CARDS = [
  {
    state: "Bihar",
    mainHub: "Patna",
    image: placeImages["Bihar"],
    cities: ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia"],
  },
  {
    state: "Jharkhand",
    mainHub: "Ranchi & Jamshedpur",
    image: placeImages["Jharkhand"],
    cities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar"],
  },
  {
    state: "Uttar Pradesh",
    mainHub: "Lucknow & Varanasi",
    image: placeImages["Uttar Pradesh"],
    cities: ["Varanasi", "Lucknow", "Prayagraj", "Kanpur", "Gorakhpur", "Agra"],
  },
  {
    state: "Delhi NCR",
    mainHub: "Delhi & Noida",
    image: placeImages["Delhi NCR"],
    cities: ["Delhi", "Noida", "Greater Noida", "Gurgaon", "Faridabad", "Ghaziabad"],
  },
  {
    state: "West Bengal",
    mainHub: "Kolkata & Siliguri",
    image: placeImages["West Bengal"],
    cities: ["Kolkata", "Siliguri", "Asansol", "Durgapur", "Howrah", "Kharagpur"],
  },
  {
    state: "Maharashtra",
    mainHub: "Mumbai & Pune",
    image: placeImages["Maharashtra"],
    cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Navi Mumbai", "Nashik"],
  },
];

// 6 Top Interstate Routes — creates exactly 2 full rows on desktop (3 x 2)
const FEATURED_ROUTES = [
  {
    slug: "patna-to-delhi",
    from: "Patna",
    to: "Delhi NCR",
    originHub: "Patna Central Hub",
    distanceKm: 1000,
    serviceType: "Daily Direct",
  },
  {
    slug: "patna-to-kolkata",
    from: "Patna",
    to: "Kolkata",
    originHub: "Patna Central Hub",
    distanceKm: 581,
    serviceType: "Fast Freight",
  },
  {
    slug: "patna-to-ranchi",
    from: "Patna",
    to: "Ranchi",
    originHub: "Patna Central Hub",
    distanceKm: 341,
    serviceType: "Next-Day",
  },
  {
    slug: "patna-to-mumbai",
    from: "Patna",
    to: "Mumbai",
    originHub: "Patna Central Hub",
    distanceKm: 1874,
    serviceType: "Dedicated Carrier",
  },
  {
    slug: "ranchi-to-delhi",
    from: "Ranchi",
    to: "Delhi NCR",
    originHub: "Ranchi Regional Hub",
    distanceKm: 1280,
    serviceType: "Express Lane",
  },
  {
    slug: "jamshedpur-to-kolkata",
    from: "Jamshedpur",
    to: "Kolkata",
    originHub: "Jamshedpur Hub",
    distanceKm: 270,
    serviceType: "Fast Lane",
  },
];

const LocationsSnapshot = () => {
  const getCityLink = (state, cityName) => {
    const list = locationsByState[state] ?? [];
    const matched = list.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    return matched ? `/packers-movers-${matched.slug}` : `/where-we-serve`;
  };

  return (
    <section
      className="bg-surface py-16 sm:py-24"
      aria-labelledby="locations-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-12">
          <div className="max-w-2xl">
            <h2
              id="locations-heading"
              className="font-display font-extrabold text-text mb-3 tracking-tight"
              style={{ fontSize: "clamp(1.85rem, 3vw, 2.5rem)", lineHeight: "1.25" }}
            >
              Where we serve
            </h2>
            <p className="text-text-muted text-base sm:text-lg leading-relaxed">
              Operating dedicated branch hubs across 6 core states with verified daily transport corridors connecting major metros nationwide.
            </p>
          </div>
          <InteractiveLink
            to="/where-we-serve"
            size="md"
            className="shrink-0"
          >
            View all locations
          </InteractiveLink>
        </div>

        {/* State Grid - Full 2 Rows (3 x 2 = 6 cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 sm:mb-20">
          {STATE_CARDS.map((item) => {
            const locs = (locationsByState[item.state] ?? []).filter(
              (l) => l.type === "hub" || l.type === "city"
            );
            const displayCities =
              item.cities.length > 0
                ? item.cities
                : locs.slice(0, 6).map((l) => l.name);

            return (
              <div
                key={item.state}
                className="rounded-3xl border border-border/80 bg-background hover:border-primary/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* State Place Poster */}
                  {item.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface/60 border-b border-border/60">
                      <img
                        src={item.image}
                        alt={`1st Om Packers and Movers in ${item.state}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    {/* Top State Title */}
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <MapPin size={16} strokeWidth={2.2} aria-hidden="true" />
                      </div>
                      <h3 className="font-display font-bold text-text text-base sm:text-lg">
                        {item.state}
                      </h3>
                    </div>

                    {/* City Pills with Main Hub clearly badged */}
                    <ul className="flex flex-wrap gap-2" role="list">
                      {displayCities.map((cityName) => {
                        const link = getCityLink(item.state, cityName);
                        const isHub = item.mainHub
                          .toLowerCase()
                          .includes(cityName.toLowerCase());
                        return (
                          <li key={cityName}>
                            <Link
                              to={link}
                              className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all duration-150 inline-flex items-center gap-1.5 ${
                                isHub
                                  ? "bg-primary/10 text-primary border-primary/30 font-semibold hover:bg-primary/15"
                                  : "bg-surface text-text-muted border-border hover:border-primary/30 hover:text-primary"
                              }`}
                            >
                              <span>{cityName}</span>
                              {isHub && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/80">
                                  (Hub)
                                </span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                      {locs.length > displayCities.length && (
                        <li>
                          <Link
                            to="/where-we-serve"
                            className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors"
                          >
                            +{locs.length - displayCities.length} more
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Popular Routes - Full 2 Rows (3 x 2 = 6 cards) with Main Hub */}
        <div className="pt-10 border-t border-border/80">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-2.5">
                <Navigation size={13} className="text-accent" />
                <span>Interstate Network</span>
              </div>
              <h3 className="font-display font-extrabold text-text text-xl sm:text-2xl tracking-tight">
                Popular interstate corridors
              </h3>
            </div>
            <InteractiveLink to="/where-we-serve" size="sm">
              View all 20+ routes
            </InteractiveLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_ROUTES.map((route) => (
              <Link
                key={route.slug}
                to={`/route/${route.slug}`}
                className="p-5 sm:p-6 rounded-3xl border border-border/80 bg-background hover:border-primary/40 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  {/* Origin Hub and Distance */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <Building2 size={13} className="text-accent shrink-0" />
                      <span>{route.originHub}</span>
                    </span>
                    <span className="text-xs font-semibold text-text-muted">
                      {route.distanceKm} km
                    </span>
                  </div>

                  {/* Route Name */}
                  <div className="font-display font-bold text-text text-base sm:text-lg group-hover:text-primary transition-colors flex items-center gap-2 mb-2">
                    <span>{route.from}</span>
                    <span className="text-accent font-extrabold group-hover:translate-x-1 transition-transform">
                      &rarr;
                    </span>
                    <span>{route.to}</span>
                  </div>
                </div>

                {/* Bottom Route Features & Link */}
                <div className="pt-4 mt-4 border-t border-border/70 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {route.serviceType}
                  </span>
                  <span className="font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                    Route details &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationsSnapshot;
