import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { leads } from "./leads";

export const quotations = sqliteTable("quotations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  quoteNumber: text("quote_number").notNull().unique(),
  leadId: integer("lead_id").references(() => leads.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  movingFrom: text("moving_from").notNull(),
  movingTo: text("moving_to").notNull(),
  moveDate: text("move_date"),
  inventoryData: text("inventory_data"), // JSON string
  packagingCharges: real("packaging_charges").default(0).notNull(),
  transportCharges: real("transport_charges").default(0).notNull(),
  loadingCharges: real("loading_charges").default(0).notNull(),
  unloadingCharges: real("unloading_charges").default(0).notNull(),
  insuranceDeclaredValue: real("insurance_declared_value").default(0).notNull(),
  insuranceRatePercent: real("insurance_rate_percent").default(0).notNull(),
  insuranceCharges: real("insurance_charges").default(0).notNull(),
  otherCharges: real("other_charges").default(0).notNull(),
  discount: real("discount").default(0).notNull(),
  gstRate: real("gst_rate").default(0).notNull(),
  gstAmount: real("gst_amount").default(0).notNull(),
  totalAmount: real("total_amount").default(0).notNull(),
  status: text("status", { enum: ["draft", "sent", "accepted", "rejected"] })
    .default("draft")
    .notNull(),
  validUntil: text("valid_until"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Quotation = typeof quotations.$inferSelect;
export type NewQuotation = typeof quotations.$inferInsert;
