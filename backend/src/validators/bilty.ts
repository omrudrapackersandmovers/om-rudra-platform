import { z } from "zod";

const requiredText = z.string().trim().min(1).max(500);
const optionalText = z.string().trim().max(500).nullish().transform(value => value || null);
const amount = z.number().finite().nonnegative().max(1e12);
const optionalAmount = amount.nullish().transform(value => value ?? null);
const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}, "Invalid calendar date").nullish();
const gstin = z.string().trim().toUpperCase().regex(/^\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/, "Invalid GSTIN").nullish();
const phone = z.string().trim().regex(/^\d{10}$/, "Enter a 10-digit mobile number");

export const biltyInputSchema = z.object({
  jobId: z.number().int().positive().nullish(),
  consignorName: requiredText, consignorAddress: requiredText, consignorPhone: phone,
  consigneeName: requiredText, consigneeAddress: requiredText, consigneePhone: phone,
  fromCity: requiredText, toCity: requiredText, truckNumber: requiredText,
  driverName: requiredText, driverPhone: z.union([phone, z.literal("")]).default(""),
  packagesCount: z.number().int().positive().max(1000000),
  goodsDescription: requiredText,
  declaredValue: amount.default(0), freightAmount: amount.default(0),
  freightStatus: z.enum(["paid", "to_pay"]).default("to_pay"),
  riskType: z.enum(["owner_risk", "carrier_risk"]).default("owner_risk"),
  documentDate: calendarDate,
  forwardingNoteNumber: optionalText, forwardingNoteDate: calendarDate,
  packageType: optionalText, grossWeightKg: optionalAmount, volume: optionalAmount,
  volumeUnit: z.enum(["CFT", "CBM"]).nullish(), distanceKm: optionalAmount,
  expectedDeliveryDate: calendarDate, agreedDelayDays: z.number().int().nonnegative().max(365).nullish(),
  invoiceNumber: optionalText, invoiceDate: calendarDate,
  ewayBillNumber: z.string().regex(/^\d{12}$/, "E-way bill number must have 12 digits").nullish(),
  consignorGstin: gstin, consigneeGstin: gstin,
  gstPayer: z.enum(["consignor", "consignee", "transporter", "not_applicable"]).nullish(),
  gstPayerGstin: gstin,
  insuranceCompany: optionalText, insurancePolicyNumber: optionalText,
  insurancePolicyDate: calendarDate, insuredValue: optionalAmount,
  hazardousGoods: z.boolean().default(false),
  higherRiskCharges: optionalAmount, packingCharges: optionalAmount,
  loadingCharges: optionalAmount, unloadingCharges: optionalAmount, otherCharges: optionalAmount,
  advancePaid: optionalAmount,
  receivedBy: optionalText,
  deliveredAt: z.string().datetime({ offset: true }).nullish(),
  deliveryRemarks: z.string().trim().max(5000).nullish(),
  inventoryItems: z.array(z.object({
    description: requiredText, quantity: z.number().int().positive().max(1000000),
    packageType: z.string().trim().max(100).optional(),
    weightKg: amount.optional(), volume: amount.optional(),
  })).max(500).nullish(),
}).superRefine((value, ctx) => {
  const issue = (path: string, message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, path: [path], message });
  const total = getBiltyTotal(value);
  if (value.advancePaid != null && value.advancePaid > total) issue("advancePaid", "Amount received cannot exceed total charges");
  if (value.volume != null && value.volume > 0 && !value.volumeUnit) issue("volumeUnit", "Choose a volume unit");
  if (value.gstPayer && value.gstPayer !== "not_applicable" && !value.gstPayerGstin) issue("gstPayerGstin", "GST payer GSTIN is required");
  if (value.gstPayer === "not_applicable" && value.gstPayerGstin) issue("gstPayerGstin", "Clear GSTIN when GST is not applicable");
  if (value.hazardousGoods && (!value.insuranceCompany || !value.insurancePolicyNumber)) issue("insurancePolicyNumber", "Insurance details are required for hazardous goods");
  if (value.deliveredAt && !value.receivedBy) issue("receivedBy", "Receiver name is required for delivery acknowledgement");
  if (value.documentDate && value.expectedDeliveryDate && value.expectedDeliveryDate < value.documentDate) issue("expectedDeliveryDate", "Delivery date cannot precede the bilty date");
  if (value.documentDate && value.deliveredAt && value.deliveredAt.slice(0, 10) < value.documentDate) issue("deliveredAt", "Actual delivery cannot precede the bilty date");
  if (value.riskType === "owner_risk" && (value.higherRiskCharges || 0) > 0) issue("higherRiskCharges", "Higher risk charges apply to Section 11 bookings");
});

export function getBiltyTotal(value: { freightAmount: number; packingCharges?: number | null; loadingCharges?: number | null; unloadingCharges?: number | null; otherCharges?: number | null; higherRiskCharges?: number | null }) {
  return Math.round((value.freightAmount + (value.packingCharges || 0) + (value.loadingCharges || 0) + (value.unloadingCharges || 0) + (value.otherCharges || 0) + (value.higherRiskCharges || 0)) * 100) / 100;
}

export type BiltyInput = z.infer<typeof biltyInputSchema>;
