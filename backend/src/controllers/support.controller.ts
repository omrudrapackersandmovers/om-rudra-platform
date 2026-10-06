import { Context } from "hono";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { Bindings } from "../types";
import { getDb } from "../db/client";
import { leads } from "../db/schema/leads";
import { contactFields, requireOtherSubject } from "./contact.controller";

const updateSchema = z.object({
  supportStatus: z.enum(["new", "in_progress", "resolved", "closed"]).optional(),
  supportNotes: z.string().max(10000).optional(),
}).strict().refine(value => Object.keys(value).length > 0);

const complaintSchema = contactFields.extend({
  supportSource: z.enum(["phone", "whatsapp", "in_person", "email", "other"]),
  bookingReference: z.string().trim().max(100).optional(),
  supportStatus: z.enum(["new", "in_progress", "resolved", "closed"]).default("new"),
  supportNotes: z.string().trim().max(10000).optional(),
}).strict().superRefine(requireOtherSubject);

export const handleCreateComplaint = async (c: Context<{ Bindings: Bindings }>) => {
  const result = complaintSchema.safeParse(await c.req.json().catch(() => null));
  if (!result.success) return c.json({ error: "Check the customer details and include at least 10 characters in the complaint.", details: result.error.flatten().fieldErrors }, 400);
  try {
    const { name, phone, email, subject, subjectOther, message, ...support } = result.data;
    const [saved] = await getDb(c.env.DB).insert(leads).values({
      name, phone, email: email || null, notes: message, ...support,
      movingFrom: "", movingTo: "", moveType: "Contact enquiry",
      service: subject, timeline: "Not specified", status: "new",
      subjectOther: subject === "Other" ? subjectOther : null,
      createdAt: new Date().toISOString(),
    }).returning();
    return c.json({ message: saved }, 201);
  } catch (error) {
    console.error("Create complaint error", error);
    return c.json({ error: "Could not log the complaint. Please try again." }, 500);
  }
};

export const handleGetSupport = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const messages = await getDb(c.env.DB).select().from(leads)
      .where(eq(leads.moveType, "Contact enquiry")).orderBy(desc(leads.createdAt), desc(leads.id));
    return c.json({ messages });
  } catch (error) {
    console.error("Support inbox error", error);
    return c.json({ error: "Could not load contact messages. Please try again." }, 500);
  }
};

export const handleSearchSupportReferences = async (c: Context<{ Bindings: Bindings }>) => {
  const query = (c.req.query("q") || "").trim();
  if (query.length < 2) return c.json({ references: [] });
  if (query.length > 100) return c.json({ error: "Keep the search within 100 characters." }, 400);
  const pattern = `%${query.replace(/[\\%_]/g, value => `\\${value}`)}%`;
  try {
    const result = await c.env.DB.prepare(`
      SELECT j.job_number AS reference, 'job' AS kind, j.customer_name AS name,
        j.customer_phone AS phone, COALESCE(l.email, ql.email, '') AS email,
        j.pickup_address AS origin, j.delivery_address AS destination
      FROM jobs j LEFT JOIN leads l ON l.id = j.lead_id
      LEFT JOIN quotations q ON q.id = j.quote_id LEFT JOIN leads ql ON ql.id = q.lead_id
      WHERE j.job_number LIKE ? ESCAPE '\\' OR j.customer_name LIKE ? ESCAPE '\\' OR j.customer_phone LIKE ? ESCAPE '\\'
      UNION ALL
      SELECT q.quote_number AS reference, 'booking' AS kind, q.customer_name AS name,
        q.customer_phone AS phone, COALESCE(l.email, '') AS email,
        q.moving_from AS origin, q.moving_to AS destination
      FROM quotations q LEFT JOIN leads l ON l.id = q.lead_id
      WHERE q.status = 'accepted' AND (q.quote_number LIKE ? ESCAPE '\\' OR q.customer_name LIKE ? ESCAPE '\\' OR q.customer_phone LIKE ? ESCAPE '\\')
      ORDER BY reference LIMIT 20
    `).bind(pattern, pattern, pattern, pattern, pattern, pattern).all();
    return c.json({ references: result.results });
  } catch (error) {
    console.error("Support reference search error", error);
    return c.json({ error: "Could not search bookings and jobs. Please try again." }, 500);
  }
};

export const handleUpdateSupport = async (c: Context<{ Bindings: Bindings }>) => {
  const id = Number(c.req.param("id"));
  const result = updateSchema.safeParse(await c.req.json().catch(() => null));
  if (!Number.isSafeInteger(id) || id <= 0 || !result.success) {
    return c.json({ error: "Check the message ID, status, and notes." }, 400);
  }
  try {
    const [message] = await getDb(c.env.DB).update(leads).set(result.data)
      .where(and(eq(leads.id, id), eq(leads.moveType, "Contact enquiry"))).returning();
    if (!message) return c.json({ error: "Contact message not found." }, 404);
    return c.json({ message });
  } catch (error) {
    console.error("Support update error", error);
    return c.json({ error: "Could not save changes. Please try again." }, 500);
  }
};
