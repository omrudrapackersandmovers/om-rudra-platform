const field = (key, label, type = "text", options = {}) => ({
  key,
  label,
  type,
  ...options,
});

export const biltySections = [
  {
    title: "Sender and pickup",
    fields: [
      field("consignorName", "Sender name", "text", { required: true }),
      field("consignorPhone", "Sender mobile", "tel", { required: true }),
      field("fromCity", "Origin city / terminal", "text", { required: true }),
      field("consignorGstin", "Sender GSTIN (if registered)"),
      field("consignorAddress", "Pickup Address", "text", {
        required: true,
        fullWidth: true,
      }),
    ],
  },
  {
    title: "Receiver and destination",
    fields: [
      field("consigneeName", "Receiver name", "text", { required: true }),
      field("consigneePhone", "Receiver mobile", "tel", { required: true }),
      field("toCity", "Destination city / terminal", "text", {
        required: true,
      }),
      field("consigneeGstin", "Receiver GSTIN (if registered)"),
      field("consigneeAddress", "Delivery Address", "text", {
        required: true,
        fullWidth: true,
      }),
    ],
  },
  {
    title: "Documents and schedule",
    fields: [
      field("documentDate", "Bilty issue date", "date", { required: true }),
      field("forwardingNoteNumber", "Goods forwarding note number"),
      field("forwardingNoteDate", "Goods forwarding note date", "date"),
      field("invoiceNumber", "Goods invoice / challan number"),
      field("invoiceDate", "Goods invoice / challan date", "date"),
      field("ewayBillNumber", "E-way bill number (if applicable)"),
      field("distanceKm", "Distance (km)", "number"),
      field("expectedDeliveryDate", "Expected delivery date", "date"),
      field("agreedDelayDays", "Agreed delay allowance (days)", "number", {
        integer: true,
      }),
    ],
  },
  {
    title: "Vehicle and cargo",
    fields: [
      field("truckNumber", "Vehicle registration number", "text", {
        required: true,
      }),
      field("driverName", "Driver name", "text", { required: true }),
      field("driverPhone", "Driver mobile", "tel"),
      field("packagesCount", "Number of packages", "number", {
        required: true,
        integer: true,
        min: 1,
      }),
      field("packageType", "Package type", "select", {
        choices: [
          "Packages",
          "Boxes",
          "Crates",
          "Bags",
          "Bundles",
          "Loose items",
          "Mixed",
        ],
      }),
      field("goodsDescription", "Description of goods", "textarea", {
        required: true,
      }),
      field("grossWeightKg", "Gross weight (kg)", "number"),
      field("volume", "Volume", "number"),
      field("volumeUnit", "Volume unit", "select", { choices: ["CFT", "CBM"] }),
      field("declaredValue", "Declared goods value (₹)", "number", {
        required: true,
      }),
    ],
  },
  {
    title: "Risk and insurance",
    fields: [
      field("riskType", "Carrier liability booking", "select", {
        choices: [
          ["owner_risk", "Section 10 — standard liability / owner's risk"],
          ["carrier_risk", "Section 11 — higher carrier risk"],
        ],
      }),
      field("hazardousGoods", "Dangerous / hazardous goods", "select", {
        choices: [
          ["false", "No"],
          ["true", "Yes"],
        ],
      }),
      field("insuranceCompany", "Insurance company"),
      field("insurancePolicyNumber", "Insurance policy / cover number"),
      field("insurancePolicyDate", "Insurance policy date", "date"),
      field("insuredValue", "Insured value (₹)", "number"),
    ],
  },
  {
    title: "Freight and payment",
    fields: [
      field("freightAmount", "Transport freight (₹)", "number", {
        required: true,
      }),
      field("packingCharges", "Packing charges (₹)", "number"),
      field("loadingCharges", "Loading charges (₹)", "number"),
      field("unloadingCharges", "Unloading charges (₹)", "number"),
      field("otherCharges", "Other charges (₹)", "number"),
      field("higherRiskCharges", "Additional higher risk charge (₹)", "number"),
      field("advancePaid", "Total payment received (₹)", "number", {
        required: true,
      }),
      field("gstPayer", "Person liable to pay GST", "select", {
        choices: [
          ["", "Select if applicable"],
          ["not_applicable", "Not applicable"],
          ["consignor", "Sender"],
          ["consignee", "Receiver"],
          ["transporter", "Transporter"],
        ],
      }),
      field("gstPayerGstin", "GST payer GSTIN"),
    ],
  },
  {
    title: "Delivery acknowledgement",
    fields: [
      field("receivedBy", "Received by (name)"),
      field("deliveredAt", "Actual delivery date and time", "datetime-local"),
      field(
        "deliveryRemarks",
        "Delivery condition / shortage / damage remarks",
        "textarea",
      ),
    ],
  },
];

export const biltyPlaceholders = {
  consignorName: "Sender / company name",
  consignorPhone: "10-digit mobile",
  consignorAddress: "House / building, street, area, city, state and PIN code",
  fromCity: "Enter origin city / terminal",
  consignorGstin: "e.g. 10AAAAA0000A1Z5",
  consigneeName: "Receiver / company name",
  consigneePhone: "10-digit mobile",
  consigneeAddress: "House / building, street, area, city, state and PIN code",
  toCity: "Enter destination city / terminal",
  consigneeGstin: "e.g. 20AAAAA0000A1Z5",
  forwardingNoteNumber: "Enter goods forwarding note number",
  invoiceNumber: "Enter goods invoice / challan number",
  ewayBillNumber: "12-digit e-way bill number",
  distanceKm: "Distance in kilometres",
  agreedDelayDays: "e.g. 2",
  truckNumber: "e.g. BR-01-AB-1234",
  driverName: "Enter driver's full name",
  driverPhone: "10-digit mobile",
  packagesCount: "Enter actual package count",
  goodsDescription: "Describe the goods being transported",
  grossWeightKg: "Measured gross weight in kg",
  volume: "Enter measured volume",
  declaredValue: "Enter declared goods value",
  insuranceCompany: "Enter insurer's name",
  insurancePolicyNumber: "Enter policy / cover number",
  insuredValue: "Enter insured goods value",
  freightAmount: "Enter transport freight",
  packingCharges: "0 if not applicable",
  loadingCharges: "0 if not applicable",
  unloadingCharges: "0 if not applicable",
  otherCharges: "0 if not applicable",
  higherRiskCharges: "0 if not applicable",
  advancePaid: "0 if no payment received",
  gstPayerGstin: "GSTIN of the person liable to pay GST",
  receivedBy: "Enter receiver's name after delivery",
  deliveryRemarks: "Record delivery condition, shortages or damage, if any",
};

export const chargeFields = [
  "freightAmount",
  "packingCharges",
  "loadingCharges",
  "unloadingCharges",
  "otherCharges",
  "higherRiskCharges",
];
export const biltyTotal = (data) =>
  Math.round(
    chargeFields.reduce((sum, key) => sum + Number(data[key] || 0), 0) * 100,
  ) / 100;
export const paymentReceived = (data) =>
  data.advancePaid ?? (data.freightStatus === "paid" ? biltyTotal(data) : 0);
export const biltyBalance = (data) =>
  Math.max(
    0,
    Math.round((biltyTotal(data) - paymentReceived(data)) * 100) / 100,
  );
export const localDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};

export function initialBilty(existing, params) {
  const defaults = {
    documentDate: localDate(),
    packageType: "Packages",
    volumeUnit: "CFT",
    riskType: "owner_risk",
    hazardousGoods: "false",
    advancePaid: 0,
  };
  const queryFields = {
    consignorName: "consignor",
    consignorPhone: "consignorPhone",
    consignorAddress: "pickup",
    consigneeName: "consignee",
    consigneePhone: "consigneePhone",
    consigneeAddress: "delivery",
    truckNumber: "truck",
    driverName: "driver",
    driverPhone: "driverPhone",
    fromCity: "fromCity",
    toCity: "toCity",
  };
  const data = Object.fromEntries(
    biltySections
      .flatMap((section) => section.fields)
      .map(({ key }) => [
        key,
        existing?.[key] ??
          defaults[key] ??
          params.get(queryFields[key] || key) ??
          "",
      ]),
  );
  if (existing) {
    data.documentDate =
      existing.documentDate || existing.createdAt?.slice(0, 10) || localDate();
    data.advancePaid = paymentReceived(existing);
    data.hazardousGoods = String(Boolean(existing.hazardousGoods));
    if (existing.deliveredAt) {
      const time = new Date(existing.deliveredAt);
      data.deliveredAt = new Date(
        time.getTime() - time.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16);
    }
  }
  return data;
}

export function biltyPayload(form, items, jobId) {
  const data = { jobId: jobId ? Number(jobId) : null };
  for (const { key, type } of biltySections.flatMap(
    (section) => section.fields,
  )) {
    const value = form[key];
    data[key] =
      type === "number"
        ? value === ""
          ? null
          : Number(value)
        : String(value ?? "").trim() || null;
  }
  data.driverPhone ||= "";
  data.hazardousGoods = form.hazardousGoods === "true";
  for (const key of ["consignorGstin", "consigneeGstin", "gstPayerGstin"])
    data[key] = data[key]?.toUpperCase() || null;
  data.deliveredAt = form.deliveredAt
    ? new Date(form.deliveredAt).toISOString()
    : null;
  data.freightStatus =
    Number(form.advancePaid || 0) >= biltyTotal(form) ? "paid" : "to_pay";
  data.inventoryItems = items.map((item) => ({
    description: item.description.trim(),
    quantity: Number(item.quantity),
    packageType: item.packageType?.trim() || undefined,
    ...(item.weightKg !== "" && item.weightKg != null
      ? { weightKg: Number(item.weightKg) }
      : {}),
    ...(item.volume !== "" && item.volume != null
      ? { volume: Number(item.volume) }
      : {}),
  }));
  return data;
}
