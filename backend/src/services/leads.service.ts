import { createDbClient } from "../db/client";
import { leads, NewLead } from "../db/schema/leads";
import { sendLeadNotificationEmail } from "./email.service";
import { Bindings } from "../types";

export const createLead = async (
  env: Bindings,
  leadData: {
    name: string;
    phone: string;
    movingFrom: string;
    movingTo: string;
    moveType: string;
    service: string;
    timeline: string;
    email?: string;
  }
) => {
  const db = createDbClient(env.DB);

  const newLeadRecord: NewLead = {
    name: leadData.name.trim(),
    phone: leadData.phone.trim(),
    movingFrom: leadData.movingFrom.trim(),
    movingTo: leadData.movingTo.trim(),
    moveType: leadData.moveType,
    service: leadData.service,
    timeline: leadData.timeline,
    email: leadData.email ? leadData.email.trim() : null,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  // Insert lead into Cloudflare D1
  const [inserted] = await db.insert(leads).values(newLeadRecord).returning();

  // Trigger non-blocking email notification
  sendLeadNotificationEmail(
    newLeadRecord,
    env.BREVO_API_KEY,
    env.NOTIFICATION_EMAIL
  ).catch((err) => {
    console.error("Non-blocking notification error:", err);
  });

  return inserted;
};
