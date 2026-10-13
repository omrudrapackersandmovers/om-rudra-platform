import { eq, and, ne, desc } from "drizzle-orm";
import { getDb } from "../db/client";
import { customers, leads, quotations, jobs, invoices } from "../db/schema";
import { Bindings } from "../types";
export const normalizeCustomerPhone = (phone: string) => {
 const digits = phone.replace(/[^0-9]/g, "");
 return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits.length === 11 && digits.startsWith("0") ? digits.slice(1) : digits;
};
export async function ensureCustomer(env: Bindings, name: string, phone: string, email?: string) {
 const normalized = normalizeCustomerPhone(phone);
 if (!normalized) return null;
 const db = getDb(env.DB), now = new Date().toISOString();
 await db.insert(customers).values({name:name.trim(),phone:normalized,email:email?.trim() || null,createdAt:now,updatedAt:now}).onConflictDoNothing({target:customers.phone});
 const [customer] = await db.select().from(customers).where(eq(customers.phone, normalized));
 return customer.id;
}
export async function customerHistory(env: Bindings, id: number) {
 const db = getDb(env.DB);
 const [customer] = await db.select().from(customers).where(eq(customers.id,id));
 if (!customer) return null;
 const [enquiries, quotes, customerJobs, customerInvoices] = await Promise.all([
 db.select().from(leads).where(and(eq(leads.customerId,id),ne(leads.moveType,"Contact enquiry"))).orderBy(desc(leads.createdAt)),
 db.select().from(quotations).where(eq(quotations.customerId,id)).orderBy(desc(quotations.createdAt)),
 db.select().from(jobs).where(eq(jobs.customerId,id)).orderBy(desc(jobs.createdAt)),
 db.select().from(invoices).where(eq(invoices.customerId,id)).orderBy(desc(invoices.createdAt))]);
 return {customer,leads:enquiries,quotes,jobs:customerJobs,invoices:customerInvoices};
}
