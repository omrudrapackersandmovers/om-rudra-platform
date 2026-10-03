import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  vehicleNumber: text("vehicle_number").notNull().unique(),
  vehicleType: text("vehicle_type").notNull(),
  capacityTons: real("capacity_tons"),
  capacityCft: real("capacity_cft"),
  defaultDriverName: text("default_driver_name"),
  defaultDriverPhone: text("default_driver_phone"),
  status: text("status", { enum: ["available", "on_move", "maintenance", "retired"] })
    .default("available")
    .notNull(),
  insuranceExpiry: text("insurance_expiry"),
  fitnessExpiry: text("fitness_expiry"),
  permitExpiry: text("permit_expiry"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
