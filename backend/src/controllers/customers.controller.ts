import { Context } from "hono";
import { z } from "zod";
import { eq, and, ne } from "drizzle-orm";
import { getDb } from "../db/client";
import { customers, leads } from "../db/schema";
import { customerHistory } from "../services/customers.service";
import { Bindings } from "../types";
type C = Context<{Bindings:Bindings}>;
const validId = (c:C) => {const id=Number(c.req.param("id")); return Number.isSafeInteger(id) && id>0 ? id : null;};
export async function handleGetCustomers(c:C) {
 const search=(c.req.query("search") || "").toLowerCase();
 const rows=await getDb(c.env.DB).select().from(customers);
 return c.json({customers:rows.filter(r=>`${r.name} ${r.phone} ${r.email || ""}`.toLowerCase().includes(search))});
}
export async function handleGetCustomer(c:C) {
 const id=validId(c); if(!id) return c.json({error:"Invalid customer ID"},400);
 const history=await customerHistory(c.env,id); return history ? c.json(history) : c.json({error:"Customer not found"},404);
}
export async function handleUpdateCustomer(c:C) {
 const id=validId(c); if(!id) return c.json({error:"Invalid customer ID"},400);
 const body=await c.req.json().catch(()=>null);
 const parsed=z.object({name:z.string().trim().min(1).max(200),email:z.union([z.string().trim().email(),z.literal("")]).optional(),notes:z.string().max(5000).optional()}).strict().safeParse(body);
 if(!parsed.success) return c.json({error:"Enter a name and a valid email address."},400);
 const [customer]=await getDb(c.env.DB).update(customers).set({...parsed.data,email:parsed.data.email || null,updatedAt:new Date().toISOString()}).where(eq(customers.id,id)).returning();
 return customer ? c.json({customer}) : c.json({error:"Customer not found"},404);
}
export async function handleDeleteLead(c:C) {return changeDeleted(c,false);}
export async function handleRestoreLead(c:C) {return changeDeleted(c,true);}
async function changeDeleted(c:C,restore:boolean) {
 const id=validId(c); if(!id) return c.json({error:"Invalid lead ID"},400);
 const [lead]=await getDb(c.env.DB).update(leads).set({deletedAt:restore ? null : new Date().toISOString()}).where(and(eq(leads.id,id),ne(leads.moveType,"Contact enquiry"))).returning();
 return lead ? c.json({lead}) : c.json({error:"Sales lead not found"},404);
}
