import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { jobs } from "./jobs";
import { quotations } from "./quotations";

export const invoices = sqliteTable("invoices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceNumber: text("invoice_number").notNull().unique(),
  jobId: integer("job_id").references(() => jobs.id),
  quoteId: integer("quote_id").references(() => quotations.id),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerGstin: text("customer_gstin"),
  pickupAddress: text("pickup_address").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  sacCode: text("sac_code").default("9965").notNull(),
  subtotal: real("subtotal").default(0).notNull(),
  gstRate: real("gst_rate").default(0).notNull(),
  gstAmount: real("gst_amount").default(0).notNull(),
  totalAmount: real("total_amount").default(0).notNull(),
  advancePaid: real("advance_paid").default(0).notNull(),
  balanceDue: real("balance_due").default(0).notNull(),
  paymentStatus: text("payment_status", { enum: ["unpaid", "partial", "paid"] })
    .default("unpaid")
    .notNull(),
  paymentMode: text("payment_mode"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;
