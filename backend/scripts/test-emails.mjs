import assert from "node:assert/strict";
import fs from "node:fs";
import { DatabaseSync } from "node:sqlite";
import ts from "typescript";

const db = new DatabaseSync(":memory:");
db.exec("PRAGMA foreign_keys=ON");
for (const file of ["0000_init.sql", "0001_phase1_schema.sql", "0003_fleet_staff_finance.sql", "0007_contact_support.sql", "0008_internal_complaints.sql", "0009_contact_other_subject.sql", "0010_email_outbox.sql"]) db.exec(fs.readFileSync(`drizzle/${file}`, "utf8"));
const sql = (query, ...params) => db.prepare(query).run(...params);
const rows = () => db.prepare("SELECT * FROM email_outbox ORDER BY id").all();
const latest = () => rows().at(-1);
const lead = (email = "customer@example.com", source = "website") => Number(sql(`INSERT INTO leads(name,phone,email,moving_from,moving_to,move_type,service,timeline,support_source)
  VALUES('Customer','9876543210',?,'Ranchi','Patna','Home shifting','Home shifting','Next week',?)`, email, source).lastInsertRowid);
const quote = (id, status = "sent") => Number(sql(`INSERT INTO quotations(quote_number,lead_id,customer_name,customer_phone,moving_from,moving_to,status,total_amount)
  VALUES(?,?,'Customer','9876543210','Ranchi','Patna',?,10000)`, `Q-${crypto.randomUUID()}`, id, status).lastInsertRowid);
const job = (leadId, quoteId) => Number(sql(`INSERT INTO jobs(job_number,lead_id,quote_id,customer_name,customer_phone,pickup_address,delivery_address,scheduled_date)
  VALUES(?, ?,?,'Customer','9876543210','Ranchi','Patna','2026-11-01')`, `J-${crypto.randomUUID()}`, leadId, quoteId).lastInsertRowid);
const id = lead();
assert.deepEqual(rows().map(r=>r.kind), ["enquiry_received", "staff_enquiry"]);
lead(); assert.equal(rows().at(-2).last_error, "acknowledgement_cooldown");
const sample = lead("seed@example.com", "sample"); assert.equal(rows().length, 4);
const draft = quote(id, "draft"); assert.equal(rows().length, 4);
sql("UPDATE quotations SET status='sent' WHERE id=?", draft); assert.equal(latest().kind, "quote_sent");
const before = rows().length;
sql("UPDATE quotations SET status='sent' WHERE id=?", draft); assert.equal(rows().length, before);
sql("UPDATE quotations SET total_amount=12000 WHERE id=?", draft); assert.equal(latest().kind, "quote_revised");
assert.equal(JSON.parse(latest().payload).total_amount, 12000);
sql("UPDATE quotations SET status='accepted' WHERE id=?", draft); assert.equal(rows().length, before+1);
const booking = job(null, draft); assert.equal(latest().kind, "booking_confirmed"); assert.equal(latest().recipient,"customer@example.com");
sql("UPDATE jobs SET scheduled_date='2026-11-02' WHERE id=?",booking); assert.equal(latest().kind,"booking_updated");
sql("UPDATE jobs SET status='in_progress' WHERE id=?",booking); assert.equal(latest().kind,"move_started");
sql("UPDATE jobs SET status='completed' WHERE id=?",booking); assert.equal(latest().kind,"move_completed");
sql("UPDATE jobs SET status='cancelled' WHERE id=?",booking); assert.equal(latest().kind,"booking_cancelled");
const invoice = Number(sql(`INSERT INTO invoices(invoice_number,job_id,customer_name,customer_phone,pickup_address,delivery_address,subtotal,total_amount,advance_paid,balance_due)
  VALUES('INV-1',?,'Customer','9876543210','Ranchi','Patna',10000,10000,1000,9000)`,booking).lastInsertRowid);
assert.equal(latest().kind,"invoice_issued"); assert.equal(latest().recipient,"customer@example.com");
for (const amount of [2000,3000]) {
  db.exec("BEGIN");
  sql("INSERT INTO invoice_payments(invoice_id,amount,payment_mode,payment_date) VALUES(?,?,'upi','2026-10-11')",invoice,amount);
  sql("UPDATE invoices SET advance_paid=advance_paid+?,balance_due=MAX(0,total_amount-advance_paid-?) WHERE id=?",amount,amount,invoice);
  db.exec("COMMIT");
  assert.equal(latest().kind,"payment_received"); assert.equal(JSON.parse(latest().payload).payment_amount,amount);
}
assert.equal(db.prepare("SELECT advance_paid FROM invoices WHERE id=?").get(invoice).advance_paid,6000);
const contact=Number(sql("INSERT INTO leads(name,phone,email,moving_from,moving_to,move_type,service,timeline,notes,support_notes) VALUES('Support customer','9876543210','support@example.com','','','Contact enquiry','Feedback or complaint','Not specified','Customer message','PRIVATE NOTE')").lastInsertRowid);
sql("UPDATE leads SET support_status='resolved' WHERE id=?",contact);
assert.equal(latest().kind,"support_updated"); assert(!latest().payload.includes("PRIVATE NOTE"));
const n=rows().length; sql("UPDATE leads SET support_notes='Another private note' WHERE id=?",contact);assert.equal(rows().length,n);
quote(sample); assert.equal(latest().status,"skipped");
const missing=lead(null); assert.equal(rows().at(-2).status,"skipped");quote(missing);assert.equal(latest().status,"skipped");
const count=rows().length;db.exec("BEGIN");lead("rollback@example.com");db.exec("ROLLBACK");assert.equal(rows().length,count);

const company={legalName:"Om Rudra Packers and Movers Private Limited",brandName:"Om Rudra Packers and Movers",email:{general:"hello@omrudrapackersandmovers.com"},phone:{primary:"+91 7033488691",primaryDisplay:"+91 7033488691"}};
function load(file, names, injected) {
  const source=fs.readFileSync(file,"utf8").replace(/^import .*;\r?\n/gm, "").replace(/export /g, "");
  const js=ts.transpile(source,{target:ts.ScriptTarget.ES2022});
  return new Function(...Object.keys(injected),js+`;return {${names.join(",")}};`)(...Object.values(injected));
}
const templates=load("src/services/email-templates.ts",["customerEmail","leadEmail"],{company});
const d1={prepare(query){let params=[];return{bind(...values){params=values;return this;},async all(){return{results:db.prepare(query).all(...params)};},async first(){return db.prepare(query).get(...params)||null;},async run(){const result=db.prepare(query).run(...params);return{meta:{changes:result.changes}};}};}};
let fetchMock;
const outbox=load("src/services/email-outbox.service.ts",["drainEmailOutbox","renderOutboxEmail"],{company,...templates,fetch:(...args)=>fetchMock(...args)});
for(const row of rows().filter(r=>r.kind!=="staff_enquiry")){const mail=outbox.renderOutboxEmail(row);assert(mail.textContent);assert(mail.htmlContent.includes("lockup-red-1080.png"));assert(!mail.htmlContent.includes("PRIVATE NOTE"));assert(!mail.htmlContent.includes("admin.omrudrapackersandmovers.com"));}
const hostile=templates.customerEmail("enquiry_received",{name:"<script>bad</script>",service:"Home"},42);assert(!hostile.htmlContent.includes("<script>"));
sql("DELETE FROM email_outbox");
const queue=()=>{sql("INSERT INTO email_outbox(kind,entity_id,recipient,payload) VALUES('enquiry_received',1,'customer@example.com',?)",JSON.stringify({name:"Customer",service:"Home"}));return latest().id;};
const env={DB:d1,BREVO_API_KEY:"test-key",BREVO_SENDER_EMAIL:company.email.general,NOTIFICATION_EMAIL:company.email.general};
let requests=0;
fetchMock=async (_url,options)=>{requests++;const payload=JSON.parse(options.body);assert.match(payload.headers.idempotencyKey,/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-8[a-f0-9]{3}-[a-f0-9]{12}$/);assert(payload.replyTo.email===company.email.general);return new Response(JSON.stringify({messageId:"test-id"}),{status:201});};
const accepted=queue();await Promise.all([outbox.drainEmailOutbox(env),outbox.drainEmailOutbox(env)]);assert.equal(requests,1);assert.equal(latest().status,"accepted");await outbox.drainEmailOutbox(env);assert.equal(requests,1);
queue();fetchMock=async()=>new Response("{}",{status:429});await outbox.drainEmailOutbox(env);assert.equal(latest().status,"queued");assert.equal(latest().last_error,"brevo_http_429");assert.equal(latest().uncertain_since,null);
sql("DELETE FROM email_outbox WHERE id<>?",accepted);
queue();fetchMock=async()=>new Response("{}",{status:400});await outbox.drainEmailOutbox(env);assert.equal(latest().status,"failed");
sql("DELETE FROM email_outbox WHERE id<>?",accepted);
queue();fetchMock=async()=>{throw Error("Timeout")};await outbox.drainEmailOutbox(env);assert.equal(latest().status,"queued");assert(latest().uncertain_since);
sql("UPDATE email_outbox SET next_attempt=0,uncertain_since=unixepoch()-800 WHERE status='queued'");await outbox.drainEmailOutbox(env);assert.equal(latest().status,"uncertain");
sql("DELETE FROM email_outbox WHERE id<>?",accepted);
queue();fetchMock=async()=>new Response(JSON.stringify({code:"duplicate_parameter"}),{status:400});await outbox.drainEmailOutbox(env);assert.equal(latest().status,"accepted");
queue();requests=0;fetchMock=async()=>{requests++;return new Response("{}",{status:201});};await outbox.drainEmailOutbox({...env,CUSTOMER_EMAILS_ENABLED:"false"});assert.equal(requests,0);await outbox.drainEmailOutbox({...env,BREVO_API_KEY:undefined});assert.equal(requests,0);
console.log("Email trigger, snapshot, rollback, recipient, payment, privacy, lease, retry, pause and deduplication checks passed. No real emails sent.");
db.close();
