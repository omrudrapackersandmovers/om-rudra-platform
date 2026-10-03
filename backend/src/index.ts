import { Hono } from "hono";
import { cors } from "hono/cors";
import { leadsRouter } from "./routes/leads.routes";
import { adminRouter } from "./routes/admin.routes";
import { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for frontend requests
app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const env = c.env as Bindings;
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "https://admin-omrudrapackersandmovers.pages.dev",
        "https://omrudrapackersandmovers.pages.dev",
        "https://omrudrapackersandmovers.com",
        "https://www.omrudrapackersandmovers.com",
        "https://admin.omrudrapackersandmovers.com",
      ];
      // In development or if no origin (server-to-server / curl), be permissive
      if (!origin || env?.ENVIRONMENT === "development") return origin || "*";
      // Allow only these projects' HTTPS Pages preview deployments.
      const isProjectPreview = /^https:\/\/[a-z0-9-]+\.(admin-omrudrapackersandmovers|omrudrapackersandmovers)\.pages\.dev$/.test(origin);
      if (allowedOrigins.includes(origin) || isProjectPreview) {
        return origin;
      }
      return null;
    },
    allowMethods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// Root status endpoint
app.get("/", (c) => {
  return c.json({ status: "ok", service: "om-rudra-packers-api", version: "1.0.0" });
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", service: "om-rudra-packers-api" });
});

// Geolocation endpoint
app.get("/api/geo", (c) => {
  const cf = (c.req.raw as unknown as { cf?: Record<string, unknown> })?.cf || {};
  return c.json({
    city: cf.city || "",
    region: cf.region || "",
    regionCode: cf.regionCode || "",
    country: cf.country || "",
    postalCode: cf.postalCode || "",
    latitude: cf.latitude || "",
    longitude: cf.longitude || "",
  });
});

// Mount routes
app.route("/api/leads", leadsRouter);
app.route("/api/admin", adminRouter);

// Global 404 handler
app.notFound((c) => {
  return c.json({ error: "Endpoint not found" }, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled Worker Exception:", err);
  return c.json({ error: "An unexpected error occurred" }, 500);
});

export default app;
