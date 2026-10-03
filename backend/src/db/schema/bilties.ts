import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { jobs } from "./jobs";

export const bilties = sqliteTable("bilties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lrNumber: text("lr_number").notNull().unique(),
  jobId: integer("job_id").references(() => jobs.id),
  consignorName: text("consignor_name").notNull(),
  consignorAddress: text("consignor_address").notNull(),
  consignorPhone: text("consignor_phone").notNull(),
  consigneeName: text("consignee_name").notNull(),
  consigneeAddress: text("consignee_address").notNull(),
  consigneePhone: text("consignee_phone").notNull(),
  fromCity: text("from_city").notNull(),
  toCity: text("to_city").notNull(),
  truckNumber: text("truck_number").notNull(),
  driverName: text("driver_name").notNull(),
  driverPhone: text("driver_phone").notNull(),
  packagesCount: integer("packages_count").default(1).notNull(),
  goodsDescription: text("goods_description").notNull(),
  declaredValue: real("declared_value").default(0).notNull(),
  freightAmount: real("freight_amount").default(0).notNull(),
  freightStatus: text("freight_status", { enum: ["paid", "to_pay"] })
    .default("to_pay")
    .notNull(),
  riskType: text("risk_type", { enum: ["owner_risk", "carrier_risk"] })
    .default("owner_risk")
    .notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Bilty = typeof bilties.$inferSelect;
export type NewBilty = typeof bilties.$inferInsert;
