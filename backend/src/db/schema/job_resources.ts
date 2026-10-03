import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { jobs } from "./jobs";
import { vehicles } from "./vehicles";
import { staff } from "./staff";

export const jobVehicles = sqliteTable("job_vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  vehicleId: integer("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  role: text("role").default("primary"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const jobStaff = sqliteTable("job_staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  staffId: integer("staff_id")
    .notNull()
    .references(() => staff.id),
  roleOnJob: text("role_on_job"),
  payType: text("pay_type", { enum: ["per_job", "per_day"] }).default("per_job"),
  rateUsed: real("rate_used").default(0),
  daysWorked: real("days_worked").default(1),
  amountPayable: real("amount_payable").default(0),
  amountPaid: real("amount_paid").default(0),
  paymentStatus: text("payment_status", { enum: ["pending", "partial", "paid"] })
    .default("pending")
    .notNull(),
  paymentDate: text("payment_date"),
  paymentMode: text("payment_mode"),
  paymentNotes: text("payment_notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const jobExpenses = sqliteTable("job_expenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  jobId: integer("job_id")
    .notNull()
    .references(() => jobs.id),
  category: text("category", { enum: ["fuel", "toll", "helper_extra", "vehicle_repair", "misc"] }).notNull(),
  amount: real("amount").default(0).notNull(),
  description: text("description"),
  paidBy: text("paid_by"),
  receiptNote: text("receipt_note"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type JobVehicle = typeof jobVehicles.$inferSelect;
export type NewJobVehicle = typeof jobVehicles.$inferInsert;

export type JobStaff = typeof jobStaff.$inferSelect;
export type NewJobStaff = typeof jobStaff.$inferInsert;

export type JobExpense = typeof jobExpenses.$inferSelect;
export type NewJobExpense = typeof jobExpenses.$inferInsert;
