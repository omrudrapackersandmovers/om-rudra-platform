import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {build} from 'esbuild';
import {Miniflare,convertV4MiniflareOptions} from 'miniflare';
const bundle=await build({stdin:{contents:`import {Hono} from 'hono';import {adminRouter} from './src/routes/admin.routes';import {createManualLead,getAllLeads} from './src/services/admin.service';import {createLead} from './src/services/leads.service';import {handleGetCustomer,handleUpdateCustomer,handleDeleteLead,handleRestoreLead} from './src/controllers/customers.controller';const app=new Hono();app.route("/api/admin",adminRouter);app.post('/lead',async c=>c.json(await createManualLead(c.env,await c.req.json())));app.post('/public',async c=>c.json(await createLead(c.env,await c.req.json())));app.get('/leads',async c=>c.json(await getAllLeads(c.env,c.req.query('status'))));app.get('/customers/:id',handleGetCustomer);app.patch('/customers/:id',handleUpdateCustomer);app.delete('/leads/:id',handleDeleteLead);app.post('/leads/:id/restore',handleRestoreLead);export default app;`,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'browser'});
const runtime=new Miniflare(convertV4MiniflareOptions({modules:true,script:bundle.outputFiles[0].text,compatibilityDate:'2024-09-23',d1Databases:['DB']}));
try{
 const db=await runtime.getD1Database('DB');
 for(const file of (await readdir('drizzle')).filter(f=>['0000','0001','0007','0008','0009','0012'].some(prefix=>f.startsWith(prefix))).sort()){
 if(file.startsWith('0012'))await db.prepare("INSERT INTO leads(name,phone,moving_from,moving_to,move_type,service,timeline) VALUES('Legacy','+91 98765-43210','A','B','Within City','Home','Soon')").run();
 for(const sql of (await readFile(`drizzle/${file}`,'utf8')).replace(/--[^\n]*/g,'').split(';').map(s=>s.trim()).filter(Boolean))await db.prepare(sql).run();
 }
 const req=(path,method='GET',body)=>runtime.dispatchFetch(`http://localhost${path}`,{method,headers:{'Content-Type':'application/json'},...(body ? {body:JSON.stringify(body)} : {})});
 const json=async(p,m,b)=>{const r=await req(p,m,b);assert.equal(r.status,200,await r.clone().text());return r.json();};
 const body={name:'Repeat',phone:'9876543210',movingFrom:'Patna',movingTo:'Ranchi',moveType:'Within City',service:'Home',timeline:'Soon'};
 const a=await json('/lead','POST',body),b=await json('/public','POST',{...body,phone:'+91 9876543210'});assert.equal(a.customerId,b.customerId);
 await db.prepare("INSERT INTO quotations(quote_number,lead_id,customer_id,customer_name,customer_phone,moving_from,moving_to,total_amount) VALUES('Q1',?,?, 'Repeat','9876543210','A','B',1000)").bind(a.id,a.customerId).run();
 await json(`/leads/${a.id}`,'DELETE');assert.equal((await json('/leads')).length,2);assert.equal((await json('/leads?status=deleted')).length,1);
 await db.prepare("INSERT INTO jobs(job_number,lead_id,customer_id,customer_name,customer_phone,pickup_address,delivery_address,scheduled_date) VALUES('J1',?,?,'Repeat','9876543210','A','B','2026-10-20')").bind(a.id,a.customerId).run();
 await db.prepare("INSERT INTO invoices(invoice_number,customer_id,customer_name,customer_phone,pickup_address,delivery_address) VALUES('I1',?,'Repeat','9876543210','A','B')").bind(a.customerId).run();
 const history=await json(`/customers/${a.customerId}`);assert.equal(history.leads.length,3);assert.equal(history.quotes.length,1);assert.equal(history.jobs.length,1);assert.equal(history.invoices.length,1);assert.ok(history.leads.find(l=>l.id===a.id).deletedAt);
 await json(`/leads/${a.id}/restore`,'POST');assert.equal((await json('/leads')).length,3);
 await json(`/customers/${a.customerId}`,'PATCH',{name:'Updated',email:'client@example.com',notes:'Repeat customer'});assert.equal((await json(`/customers/${a.customerId}`)).customer.notes,'Repeat customer');
 assert.equal((await req('/customers/abc')).status,400);assert.equal((await req('/leads/999','DELETE')).status,404);assert.equal((await req(`/customers/${a.customerId}`,'PATCH',{name:''})).status,400);
 assert.equal((await req('/api/admin/customers')).status,401);
 assert.equal((await req(`/api/admin/leads/${a.id}`,'DELETE')).status,401);
 await db.prepare("INSERT INTO leads(name,phone,moving_from,moving_to,move_type,service,timeline) VALUES('Support','1234567890','A','B','Contact enquiry','Support','Soon')").run();
 const contact=await db.prepare("SELECT id FROM leads WHERE move_type='Contact enquiry'").first();
 assert.equal((await req(`/leads/${contact.id}`,'DELETE')).status,404);
 console.log('Customer backfill, phone grouping, public/manual enquiries, history, delete/restore and validation passed.');
}finally{await runtime.dispose();}
