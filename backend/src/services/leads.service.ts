import { createDbClient } from "../db/client";
import { leads, NewLead } from "../db/schema/leads";
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
    moveSize?: string;
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
    notes: leadData.moveSize?.trim() ? `Move size: ${leadData.moveSize.trim()}` : null,
    createdAt: new Date().toISOString(),
  };

  // Insert lead into Cloudflare D1
  const [inserted] = await db.insert(leads).values(newLeadRecord).returning();

  return inserted;
};
