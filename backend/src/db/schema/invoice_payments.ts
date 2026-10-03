import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { invoices } from "./invoices";

export const invoicePayments = sqliteTable("invoice_payments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  invoiceId: integer("invoice_id")
    .notNull()
    .references(() => invoices.id),
  amount: real("amount").notNull(),
  paymentMode: text("payment_mode", { enum: ["upi", "cash", "neft", "cheque", "other"] }).notNull(),
  paymentDate: text("payment_date").notNull(),
  transactionRef: text("transaction_ref"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type InvoicePayment = typeof invoicePayments.$inferSelect;
export type NewInvoicePayment = typeof invoicePayments.$inferInsert;
