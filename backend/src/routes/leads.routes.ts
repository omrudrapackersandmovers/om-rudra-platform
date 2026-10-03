import { Hono } from "hono";
import { handleCreateLead } from "../controllers/leads.controller";
import { verifyTurnstile } from "../middlewares/turnstile";
import { Bindings } from "../types";
export const leadsRouter = new Hono<{ Bindings: Bindings }>();

leadsRouter.get("/", (c) => {
  return c.json({
    status: "active",
    service: "1st Om Packers Leads API",
    message: "Ready to accept inbound relocation inquiries via POST.",
  });
});

leadsRouter.post("/", verifyTurnstile, handleCreateLead);
