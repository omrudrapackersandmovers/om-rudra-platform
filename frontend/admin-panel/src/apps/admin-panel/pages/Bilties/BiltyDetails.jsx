import { biltyTotal, biltyBalance, paymentReceived } from "./biltyFields";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
const date = (value) =>
  value
    ? /^\d{4}-\d{2}-\d{2}$/.test(value)
      ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN")
      : new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
    : "—";
const payerLabels = {
  consignor: "Sender",
  consignee: "Receiver",
  transporter: "Transporter",
  not_applicable: "Not applicable",
};

function Details({ title, rows }) {
  const visible = rows.filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );
  if (!visible.length) return null;
  return (
    <section className="space-y-2">
      <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {title}
      </h4>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
        {visible.map(([label, value]) => (
          <div key={label} className="print-avoid-break">
            <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
            <dd className="font-semibold whitespace-pre-wrap">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function BiltyDetails({ bilty }) {
  const inventory = Array.isArray(bilty.inventoryItems)
    ? bilty.inventoryItems
    : [];
  return (
    <>
      <Details
        title="References and transport schedule"
        rows={[
          ["Goods forwarding note", bilty.forwardingNoteNumber],
          [
            "Forwarding note date",
            bilty.forwardingNoteDate && date(bilty.forwardingNoteDate),
          ],
          ["Goods invoice / challan", bilty.invoiceNumber],
          [
            "Invoice / challan date",
            bilty.invoiceDate && date(bilty.invoiceDate),
          ],
          ["E-way bill", bilty.ewayBillNumber],
          [
            "Distance",
            bilty.distanceKm != null ? `${bilty.distanceKm} km` : null,
          ],
          [
            "Expected delivery",
            bilty.expectedDeliveryDate && date(bilty.expectedDeliveryDate),
          ],
          [
            "Agreed delay allowance",
            bilty.agreedDelayDays != null
              ? `${bilty.agreedDelayDays} days`
              : null,
          ],
          [
            "Gross weight",
            bilty.grossWeightKg != null ? `${bilty.grossWeightKg} kg` : null,
          ],
          [
            "Volume",
            bilty.volume != null
              ? `${bilty.volume} ${bilty.volumeUnit || ""}`
              : null,
          ],
        ]}
      />
      {inventory.length > 0 && (
        <section className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
            Inventory / goods particulars
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-950">
                <tr>
                  {[
                    "#",
                    "Description",
                    "Quantity",
                    "Packing",
                    "Weight (kg)",
                    `Volume (${bilty.volumeUnit || "CFT"})`,
                  ].map((label) => (
                    <th key={label} className="p-2">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-200 dark:border-slate-700"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.description}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">{item.packageType || "—"}</td>
                    <td className="p-2">{item.weightKg ?? "—"}</td>
                    <td className="p-2">{item.volume ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <Details
        title="Tax responsibility"
        rows={[
          ["Sender GSTIN", bilty.consignorGstin],
          ["Receiver GSTIN", bilty.consigneeGstin],
          ["Person liable to pay GST", payerLabels[bilty.gstPayer]],
          ["GST payer GSTIN", bilty.gstPayerGstin],
        ]}
      />
      <Details
        title="Carrier liability and insurance"
        rows={[
          [
            "Booking basis",
            bilty.riskType === "carrier_risk"
              ? "Section 11 — higher carrier risk"
              : "Section 10 — standard liability / owner's risk",
          ],
          [
            "Dangerous / hazardous goods",
            bilty.hazardousGoods == null
              ? null
              : bilty.hazardousGoods
                ? "Yes"
                : "No",
          ],
          ["Insurance company", bilty.insuranceCompany],
          ["Policy / cover number", bilty.insurancePolicyNumber],
          [
            "Policy date",
            bilty.insurancePolicyDate && date(bilty.insurancePolicyDate),
          ],
          [
            "Insured value",
            bilty.insuredValue != null ? money(bilty.insuredValue) : null,
          ],
        ]}
      />
      <section className="print-avoid-break space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Freight and payment summary
        </h4>
        <dl className="text-xs space-y-1.5">
          {[
            ["Transport freight", bilty.freightAmount],
            ["Packing", bilty.packingCharges],
            ["Loading", bilty.loadingCharges],
            ["Unloading", bilty.unloadingCharges],
            ["Other charges", bilty.otherCharges],
            ["Higher carrier risk charge", bilty.higherRiskCharges],
          ]
            .filter(([, value]) => value != null)
            .map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt>{label}</dt>
                <dd className="font-mono">{money(value)}</dd>
              </div>
            ))}
          <div className="flex justify-between gap-4 border-t border-slate-200 pt-2 font-bold">
            <dt>Total charges</dt>
            <dd>{money(biltyTotal(bilty))}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt>Payment received</dt>
            <dd>{money(paymentReceived(bilty))}</dd>
          </div>
          <div className="flex justify-between gap-4 font-bold">
            <dt>Balance due</dt>
            <dd>{money(biltyBalance(bilty))}</dd>
          </div>
        </dl>
        <p className="text-[10px] text-slate-500">
          GST, where applicable, is documented separately on the tax invoice.
        </p>
      </section>
      <section className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wide text-slate-600 dark:text-slate-300">
          Delivery acknowledgement
        </h4>
        <dl className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="text-slate-500">Received by</dt>
            <dd>{bilty.receivedBy || "________________________"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Delivery date / time (IST)</dt>
            <dd>
              {bilty.deliveredAt
                ? date(bilty.deliveredAt)
                : "________________________"}
            </dd>
          </div>
        </dl>
        <p className="text-xs whitespace-pre-wrap">
          Condition / shortage / damage:{" "}
          {bilty.deliveryRemarks || "________________________________________"}
        </p>
      </section>
    </>
  );
}
