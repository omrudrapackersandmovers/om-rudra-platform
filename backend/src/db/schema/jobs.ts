import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { quotations } from "./quotations";
import { leads } from "./leads";

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobNumber: text("job_number").notNull().unique(),
  quoteId: integer("quote_id").references(() => quotations.id),
  leadId: integer("lead_id").references(() => leads.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time"),
  vehicleAssigned: text("vehicle_assigned"),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  crewMembers: text("crew_members"),
  specialNotes: text("special_notes"),
  status: text("status", { enum: ["scheduled", "in_progress", "completed", "cancelled"] })
    .default("scheduled")
    .notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
