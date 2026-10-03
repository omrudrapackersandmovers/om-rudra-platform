import { Context } from "hono";
import { z } from "zod";
import { createLead } from "../services/leads.service";
import { Bindings } from "../types";

const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9"),
  movingFrom: z.string().min(2, "Origin location is required"),
  movingTo: z.string().min(2, "Destination location is required"),
  moveType: z.string().min(2, "Move type is required"),
  service: z.string().min(2, "Service type is required"),
  timeline: z.string().min(2, "Timeline is required"),
  email: z.string().email("Please enter a valid email address with a domain (e.g. name@example.com)").optional().or(z.literal("")),
});

export const handleCreateLead = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const rawBody = await c.req.json();
    const parseResult = createLeadSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return c.json(
        {
          error: "Validation error",
          details: parseResult.error.flatten().fieldErrors,
        },
        400
      );
    }

    const insertedLead = await createLead(c.env, parseResult.data);

    return c.json(
      {
        success: true,
        message: "Your relocation request has been received. Our team will contact you shortly.",
        leadId: insertedLead.id,
      },
      201
    );
  } catch (err) {
    console.error("Error creating lead in controller:", err);
    return c.json(
      {
        error: "Internal server error. Please try again or contact us directly.",
      },
      500
    );
  }
};
