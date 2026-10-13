import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { build } from "esbuild";
import { Miniflare, convertV4MiniflareOptions } from "miniflare";
import { initialBilty, biltyPayload, biltyBalance } from "../../frontend/admin-panel/src/apps/admin-panel/pages/Bilties/biltyFields.js";

// Exercise actual controllers/services against isolated D1, never the client's DB.
const bundle = await build({
  stdin: { contents: `
    import { Hono } from 'hono';
    import { adminRouter } from './src/routes/admin.routes';
    import { handleCreateBilty, handleUpdateBilty, handleGetBiltyById } from './src/controllers/admin.controller';
    const app = new Hono();
    app.post('/bilties', handleCreateBilty);
    app.put('/bilties/:id', handleUpdateBilty);
    app.get('/bilties/:id', handleGetBiltyById);
    app.route('/api/admin', adminRouter);
    export default app;
  `, resolveDir: process.cwd(), sourcefile: "bilty-test-worker.ts", loader: "ts" },
  bundle: true, write: false, format: "esm", platform: "browser", target: "es2022",
});
const runtime = new Miniflare(convertV4MiniflareOptions({ modules: true, script: bundle.outputFiles[0].text, compatibilityDate: "2024-09-23", d1Databases: ["DB"] }));
try {
  const db = await runtime.getD1Database("DB");
  async function migrate(file) {
    const sql = (await readFile(new URL(`../drizzle/${file}`, import.meta.url), "utf8")).replace(/--[^\n]*/g, "");
    for (const statement of sql.split(";").map(value => value.trim()).filter(Boolean)) await db.prepare(statement).run();
  }
  await migrate("0000_init.sql");
  await migrate("0001_phase1_schema.sql");
  const valid = {
    consignorName: "Sender", consignorPhone: "9876543210", consignorAddress: "Pickup address",
    consigneeName: "Receiver", consigneePhone: "9876543211", consigneeAddress: "Delivery address",
    fromCity: "Patna", toCity: "Ranchi", truckNumber: "BR01AB1234", driverName: "Driver", driverPhone: "9876543212",
    packagesCount: 2, goodsDescription: "Furniture", declaredValue: 150000, freightAmount: 1000,
    freightStatus: "to_pay", riskType: "carrier_risk",
  };
  const legacy = { ...valid, lrNumber: "LEGACY-001" };
  const columns = { consignorName: "consignor_name", consignorPhone: "consignor_phone", consignorAddress: "consignor_address", consigneeName: "consignee_name", consigneePhone: "consignee_phone", consigneeAddress: "consignee_address", fromCity: "from_city", toCity: "to_city", truckNumber: "truck_number", driverName: "driver_name", driverPhone: "driver_phone", packagesCount: "packages_count", goodsDescription: "goods_description", declaredValue: "declared_value", freightAmount: "freight_amount", freightStatus: "freight_status", riskType: "risk_type", lrNumber: "lr_number" };
  await db.prepare(`INSERT INTO bilties (${Object.keys(legacy).map(key => columns[key]).join(",")}) VALUES (${Object.keys(legacy).map(() => "?").join(",")})`).bind(...Object.values(legacy)).run();
  await migrate("0011_bilty_details.sql");
  const request = (path, method = "GET", body) => runtime.dispatchFetch(`http://localhost${path}`, { method, headers: { "Content-Type": "application/json" }, ...(body !== undefined ? { body: JSON.stringify(body) } : {}) });
  let response = await request("/bilties/1");
  assert.equal(response.status, 200);
  const old = (await response.json()).bilty;
  assert.equal(old.lrNumber, "LEGACY-001");
  assert.equal(old.grossWeightKg, null);
  assert.equal(old.inventoryItems, null);
  const details = {
    ...valid, documentDate: "2026-10-13", forwardingNoteNumber: "GFN-1", forwardingNoteDate: "2026-10-13",
    packageType: "Mixed", grossWeightKg: 250, volume: 12, volumeUnit: "CBM", distanceKm: 350,
    expectedDeliveryDate: "2026-10-15", agreedDelayDays: 2, invoiceNumber: "INV-1", invoiceDate: "2026-10-13",
    ewayBillNumber: "123456789012", consignorGstin: "10ABCDE1234F1Z5", consigneeGstin: "20ABCDE1234F1Z5",
    gstPayer: "consignor", gstPayerGstin: "10ABCDE1234F1Z5",
    hazardousGoods: true, insuranceCompany: "Insurer", insurancePolicyNumber: "POL-1", insurancePolicyDate: "2026-10-13", insuredValue: 150000,
    packingCharges: 100, loadingCharges: 50, unloadingCharges: 50, otherCharges: 25, higherRiskCharges: 75, advancePaid: 300,
    inventoryItems: [{ description: "Chair", quantity: 2, packageType: "Loose items", weightKg: 10, volume: 1 }],
  };
  const emptyForm = initialBilty(null, new URLSearchParams());
  for (const key of ["fromCity", "toCity", "truckNumber", "packagesCount", "freightAmount", "declaredValue"]) assert.equal(emptyForm[key], "", key);
  const formPayload = biltyPayload(initialBilty(details, new URLSearchParams()), details.inventoryItems, null);
  assert.equal(biltyBalance(formPayload), 1000);
  response = await request("/bilties", "POST", formPayload);
  assert.equal(response.status, 201, JSON.stringify(await response.clone().json()));
  const created = (await response.json()).bilty;
  for (const [key, value] of Object.entries(details)) assert.deepEqual(created[key], value, key);
  assert.equal(created.freightStatus, "to_pay");
  response = await request(`/bilties/${created.id}`, "PUT", { ...details, advancePaid: 1300, receivedBy: "Receiver", deliveredAt: "2026-10-15T14:00:00+05:30", deliveryRemarks: "One scratched chair", id: 99, lrNumber: "OVERWRITE", createdAt: "2020-01-01" });
  assert.equal(response.status, 200);
  const updated = (await response.json()).bilty;
  assert.equal(updated.lrNumber, created.lrNumber);
  assert.equal(updated.createdAt, created.createdAt);
  assert.equal(updated.freightStatus, "paid");
  assert.equal(updated.deliveryRemarks, "One scratched chair");
  response = await request(`/bilties/${created.id}`);
  assert.deepEqual((await response.json()).bilty, updated);
  for (const invalid of [
    { grossWeightKg: -1 }, { freightAmount: "1000" }, { packagesCount: 1.5 }, { advancePaid: 1301 },
    { gstPayerGstin: "invalid" }, { gstPayerGstin: null }, { ewayBillNumber: "123" },
    { documentDate: "2026-02-30" }, { expectedDeliveryDate: "2026-10-12" },
    { insurancePolicyNumber: null }, { volumeUnit: null }, { riskType: "owner_risk" },
    { deliveredAt: "2026-10-15T10:00:00Z", receivedBy: null },
    { inventoryItems: [{ description: "Chair", quantity: 0 }] }, { jobId: 99999 },
  ]) {
    response = await request("/bilties", "POST", { ...details, ...invalid });
    assert.equal(response.status, 400, JSON.stringify(invalid));
    response = await request(`/bilties/${created.id}`, "PUT", { ...details, ...invalid });
    assert.equal(response.status, 400, JSON.stringify(invalid));
  }
  assert.equal((await request("/bilties/99999", "PUT", details)).status, 404);
  assert.equal((await request("/bilties/invalid", "PUT", details)).status, 400);
  assert.equal((await request("/api/admin/bilties", "POST", details)).status, 401);
  assert.equal((await request(`/api/admin/bilties/${created.id}`, "PUT", details)).status, 401);
  response = await runtime.dispatchFetch("http://localhost/bilties", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{" });
  assert.equal(response.status, 400);
  response = await request("/bilties", "POST", { ...valid, freightStatus: "paid" });
  const legacyCreated = (await response.json()).bilty;
  assert.equal(response.status, 201);
  assert.equal(legacyCreated.advancePaid, 1000);
  assert.equal(legacyCreated.freightStatus, "paid");
  const count = await db.prepare("SELECT COUNT(*) AS count FROM bilties").first();
  assert.equal(count.count, 3, "Invalid requests must not create records");
  console.log("Bilty integration checks passed: migration preserves old records; create/edit/read round trip; totals; protected identifiers; invalid payloads; legacy compatibility.");
} finally {
  await runtime.dispose();
}

