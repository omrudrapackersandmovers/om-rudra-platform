import { allServiceLocations, primaryHub } from "@/data/locations";

const GEO_CACHE_KEY = "fopm_detected_geo";

/**
 * Normalizes string for fuzzy comparison
 */
function normalize(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "").trim();
}

/**
 * Matches a detected raw city name with our verified service locations
 */
export function matchWithServiceLocations(rawCity, rawRegion = "") {
  if (!rawCity) return null;

  const cleanCity = normalize(rawCity);
  const cleanRegion = normalize(rawRegion);

  // 1. Exact name match
  const exact = allServiceLocations.find((loc) => normalize(loc.name) === cleanCity);
  if (exact) return `${exact.name}, ${exact.state}`;

  // 2. Slug match
  const slugMatch = allServiceLocations.find((loc) => normalize(loc.slug) === cleanCity);
  if (slugMatch) return `${slugMatch.name}, ${slugMatch.state}`;

  // 3. Substring inclusion
  const partial = allServiceLocations.find(
    (loc) => cleanCity.includes(normalize(loc.name)) || normalize(loc.name).includes(cleanCity)
  );
  if (partial) return `${partial.name}, ${partial.state}`;

  // 4. Check if region matches any of our hubs
  if (cleanRegion) {
    const stateMatch = allServiceLocations.find(
      (loc) => loc.type === "hub" && normalize(loc.state) === cleanRegion
    );
    if (stateMatch) return `${stateMatch.name}, ${stateMatch.state}`;
  }

  // 5. Fallback formatting
  return rawRegion ? `${rawCity}, ${rawRegion}` : rawCity;
}

/**
 * Detects visitor location silently using Cloudflare Pages /api/geo edge endpoint
 * with fallback to cached session data or client GeoIP.
 */
export async function detectUserCity() {
  if (typeof window === "undefined") return null;

  // Check session cache first
  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch {
    // sessionStorage might be disabled or restricted
  }

  try {
    // 1. Query Cloudflare Pages / Worker Edge function
    const rawBase = (import.meta.env.VITE_API_URL || "https://api.1stompackersandmovers.workers.dev").trim();
    const apiBase = rawBase
      ? rawBase.startsWith("http://") || rawBase.startsWith("https://")
        ? rawBase.replace(/\/+$/, "")
        : `https://${rawBase.replace(/\/+$/, "")}`
      : "https://api.1stompackersandmovers.workers.dev";
    const res = await fetch(`${apiBase}/api/geo`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3500),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.city) {
        const formatted = matchWithServiceLocations(data.city, data.region);
        const result = {
          city: data.city,
          region: data.region,
          country: data.country,
          formatted: formatted || `${data.city}, ${data.region || "India"}`,
          isServiceHub: allServiceLocations.some(
            (loc) => normalize(loc.name) === normalize(data.city)
          ),
        };
        try {
          sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(result));
        } catch {}
        return result;
      }
    }
  } catch {
    // Ignore network timeouts / mock mode
  }

  // Graceful fallback: Patna (primary hub)
  const fallback = {
    city: primaryHub?.name || "Patna",
    region: primaryHub?.state || "Bihar",
    country: "IN",
    formatted: `${primaryHub?.name || "Patna"}, ${primaryHub?.state || "Bihar"}`,
    isServiceHub: true,
  };
  return fallback;
}

/**
 * Manual user-initiated GPS detection using navigator.geolocation
 */
export async function detectFromBrowserGps() {
  if (typeof window === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation is not supported by your browser");
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // Use high-speed open reverse geocoding
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(4000) }
          );
          if (res.ok) {
            const data = await res.json();
            const city =
              data.address?.city ||
              data.address?.town ||
              data.address?.state_district ||
              data.address?.county ||
              "";
            const state = data.address?.state || "";
            const formatted = matchWithServiceLocations(city, state) || `${city}, ${state}`;
            resolve({
              city,
              region: state,
              formatted,
            });
            return;
          }
        } catch {
          // Fall through
        }
        resolve({ city: "Patna", region: "Bihar", formatted: "Patna, Bihar" });
      },
      (err) => {
        reject(err);
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  });
}
