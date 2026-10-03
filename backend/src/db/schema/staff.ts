import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const staff = sqliteTable("staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  role: text("role", { enum: ["driver", "supervisor", "packer", "loader", "helper"] }).notNull(),
  specialization: text("specialization"),
  status: text("status", { enum: ["available", "on_move", "on_leave", "inactive"] })
    .default("available")
    .notNull(),
  idType: text("id_type"),
  idNumber: text("id_number"),
  address: text("address"),
  dailyWage: real("daily_wage"),
  joiningDate: text("joining_date"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
