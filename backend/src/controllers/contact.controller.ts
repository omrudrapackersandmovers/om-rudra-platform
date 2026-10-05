import { Context } from "hono";
import { z } from "zod";
import { Bindings } from "../types";
import { createDbClient } from "../db/client";
import { leads, NewLead } from "../db/schema/leads";
import { sendLeadNotificationEmail } from "../services/email.service";

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address.").max(254),
  subject: z.enum(["General enquiry", "Moving quote", "Existing booking", "Feedback or complaint", "Business enquiry", "Other"]),
  message: z.string().trim().min(10, "Please include at least 10 characters in your message.").max(2000),
});

export const handleContact = async (c: Context<{ Bindings: Bindings }>) => {
  const body = await c.req.json().catch(() => null);
  const result = contactSchema.safeParse(body);
  if (!result.success) return c.json({ error: "Please check your enquiry details.", details: result.error.flatten().fieldErrors }, 400);
  try {
    const data = result.data;
    const record: NewLead = {
      name: data.name, phone: data.phone, email: data.email || null,
      movingFrom: "", movingTo: "", moveType: "Contact enquiry", service: data.subject,
      timeline: "Not specified", notes: data.message, status: "new", createdAt: new Date().toISOString(),
    };
    const [saved] = await createDbClient(c.env.DB).insert(leads).values(record).returning();
    c.executionCtx.waitUntil(sendLeadNotificationEmail(record, c.env.BREVO_API_KEY, c.env.NOTIFICATION_EMAIL));
    return c.json({ success: true, reference: saved.id }, 201);
  } catch (error) {
    console.error("Contact submission failed", error);
    return c.json({ error: "We could not save your message. Please try again or call our team." }, 500);
  }
};
