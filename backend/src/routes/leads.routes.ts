import { Hono } from "hono";
import { handleContact } from "../controllers/contact.controller";
import { handleCreateLead } from "../controllers/leads.controller";
import { verifyTurnstile } from "../middlewares/turnstile";
import { Bindings } from "../types";
export const leadsRouter = new Hono<{ Bindings: Bindings }>();

leadsRouter.use("*", async (c, next) => {
  if (c.req.method === "POST" && c.env.LEAD_RATE_LIMITER) {
    const result = await c.env.LEAD_RATE_LIMITER.limit({ key: c.req.header("CF-Connecting-IP") || "local" });
    if (!result.success) { c.header("Retry-After", "60"); return c.json({ error: "Please wait a minute before sending another enquiry." }, 429); }
  }
  await next();
});

leadsRouter.get("/", (c) => {
  return c.json({
    status: "active",
    service: "Om Rudra Packers and Movers Leads API",
    message: "Ready to accept inbound relocation inquiries via POST.",
  });
});

leadsRouter.post("/", verifyTurnstile, handleCreateLead);

leadsRouter.post("/contact", verifyTurnstile, handleContact);
