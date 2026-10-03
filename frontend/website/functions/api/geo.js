/**
 * Cloudflare Pages Edge Function: /api/geo
 * Reads edge geolocation metadata from request.cf and returns it as JSON.
 * Zero external network dependencies, privacy-friendly, sub-millisecond edge execution.
 */
export async function onRequest(context) {
  const cf = context.request.cf || {};

  const payload = {
    city: cf.city || "",
    region: cf.region || "",
    regionCode: cf.regionCode || "",
    country: cf.country || "",
    postalCode: cf.postalCode || "",
    latitude: cf.latitude || "",
    longitude: cf.longitude || "",
  };

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "private, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
