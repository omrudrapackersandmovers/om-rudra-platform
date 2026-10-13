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
  documentDate: text("document_date"),
  forwardingNoteNumber: text("forwarding_note_number"),
  forwardingNoteDate: text("forwarding_note_date"),
  packageType: text("package_type"),
  grossWeightKg: real("gross_weight_kg"),
  volume: real("volume"),
  volumeUnit: text("volume_unit"),
  distanceKm: real("distance_km"),
  expectedDeliveryDate: text("expected_delivery_date"),
  agreedDelayDays: integer("agreed_delay_days"),
  invoiceNumber: text("invoice_number"),
  invoiceDate: text("invoice_date"),
  ewayBillNumber: text("eway_bill_number"),
  consignorGstin: text("consignor_gstin"),
  consigneeGstin: text("consignee_gstin"),
  gstPayer: text("gst_payer"),
  gstPayerGstin: text("gst_payer_gstin"),
  insuranceCompany: text("insurance_company"),
  insurancePolicyNumber: text("insurance_policy_number"),
  insurancePolicyDate: text("insurance_policy_date"),
  insuredValue: real("insured_value"),
  hazardousGoods: integer("hazardous_goods", { mode: "boolean" }),
  higherRiskCharges: real("higher_risk_charges"),
  packingCharges: real("packing_charges"),
  loadingCharges: real("loading_charges"),
  unloadingCharges: real("unloading_charges"),
  otherCharges: real("other_charges"),
  advancePaid: real("advance_paid"),
  receivedBy: text("received_by"),
  deliveredAt: text("delivered_at"),
  deliveryRemarks: text("delivery_remarks"),
  inventoryItems: text("inventory_items", { mode: "json" }).$type<{ description: string; quantity: number; packageType?: string; weightKg?: number; volume?: number }[]>(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Bilty = typeof bilties.$inferSelect;
export type NewBilty = typeof bilties.$inferInsert;
