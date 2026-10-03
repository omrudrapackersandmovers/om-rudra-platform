import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { ArrowLeft, Receipt, Building2, Calculator, ShieldCheck, AlertCircle, Loader2, Truck } from "lucide-react";
import { useCreateInvoiceMutation } from "../../../../store/apiSlices/invoicesApiSlice";
import { useGetJobByIdQuery } from "../../../../store/apiSlices/jobsApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { FormField } from "../../../../components/FormField";
import { useUnsavedChanges } from "../../../../hooks/useUnsavedChanges";
import { Select } from "../../shared/components/Select";

const InvoiceBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDirty, setIsDirty, confirmNavigation, UnsavedModal } = useUnsavedChanges(navigate);

  const jobId = searchParams.get("jobId") || "";
  const { data: job } = useGetJobByIdQuery(jobId, { skip: !jobId });
  const { data: dbSettings } = useGetSettingsQuery();

  const [customerName, setCustomerName] = useState(searchParams.get("name") || "");
  const [customerPhone, setCustomerPhone] = useState(searchParams.get("phone") || "");
  const [customerGstin, setCustomerGstin] = useState("");
  const [pickupAddress, setPickupAddress] = useState(searchParams.get("pickup") || "");
  const [deliveryAddress, setDeliveryAddress] = useState(searchParams.get("delivery") || "");
  const [sacCode, setSacCode] = useState("9965");

  useEffect(() => {
    if (dbSettings?.sacCode) {
      setSacCode(dbSettings.sacCode);
    }
  }, [dbSettings]);

  const [subtotal, setSubtotal] = useState(15000);
  const [gstRate, setGstRate] = useState(18); // 0, 5, 18
  const [advancePaid, setAdvancePaid] = useState(5000);
  const [paymentMode, setPaymentMode] = useState("UPI");

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [createInvoice, { isLoading: saving }] = useCreateInvoiceMutation();

  const handleFieldChange = (setter) => (e) => {
    setIsDirty(true);
    setter(e.target.value);
  };

  // Calculations
  const gstAmount = Math.round(((Number(subtotal) || 0) * (Number(gstRate) || 0)) / 100);
  const totalAmount = (Number(subtotal) || 0) + gstAmount;
  const balanceDue = Math.max(0, totalAmount - (Number(advancePaid) || 0));

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = "Customer name is required";
    if (!customerPhone.trim()) {
      errs.customerPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customerPhone.trim())) {
      errs.customerPhone = "Must be a 10-digit mobile number";
    }
    if (!pickupAddress.trim()) errs.pickupAddress = "Pickup address is required";
    if (!deliveryAddress.trim()) errs.deliveryAddress = "Delivery address is required";
    if (Number(subtotal) <= 0) errs.subtotal = "Subtotal must be greater than 0";
    if (customerGstin.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(customerGstin.trim())) {
      errs.customerGstin = "Invalid GSTIN format (e.g. 20AAAAA0000A1Z5)";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    try {
      const payload = {
        jobId: jobId ? Number(jobId) : undefined,
        quoteId: job?.quoteId ? Number(job.quoteId) : undefined,
        customerName,
        customerPhone,
        customerGstin: customerGstin || undefined,
        pickupAddress,
        deliveryAddress,
        sacCode,
        subtotal: Number(subtotal) || 0,
        gstRate: Number(gstRate) || 0,
        gstAmount,
        totalAmount,
        advancePaid: Number(advancePaid) || 0,
        balanceDue,
        paymentMode,
      };

      const res = await createInvoice(payload).unwrap();
      setIsDirty(false);
      navigate(`/invoices/${res.invoice.id}`);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || "Failed to generate invoice");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <UnsavedModal />

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => confirmNavigation(jobId ? `/jobs/${jobId}` : "/invoices")}
            className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Create GST Tax Invoice</h2>
            <p className="text-[11px] sm:text-xs text-slate-500">Official moving invoice with HSN/SAC code & UPI QR code</p>
          </div>
        </div>

        {jobId ? (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Linked to Job #{jobId}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Standalone Invoice</span>
          </div>
        )}
      </div>

      {/* Submit Error Banner */}
      {submitError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError("")} className="text-rose-500 hover:text-rose-700 font-bold">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer & Route */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Bill To & Relocation Addresses</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField label="Customer / Company Name" required error={errors.customerName}>
              <input
                type="text"
                value={customerName}
                onChange={handleFieldChange(setCustomerName)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Phone Number" required error={errors.customerPhone}>
              <input
                type="tel"
                maxLength={10}
                value={customerPhone}
                onChange={handleFieldChange(setCustomerPhone)}
                placeholder="10-digit mobile"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Customer GSTIN (Optional - Corporate Claims)" error={errors.customerGstin}>
              <input
                type="text"
                value={customerGstin}
                onChange={handleFieldChange(setCustomerGstin)}
                placeholder="e.g. 20AAAAA0000A1Z5"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono uppercase focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="HSN / SAC Code">
              <input
                type="text"
                value={sacCode}
                onChange={handleFieldChange(setSacCode)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Pickup Address" required error={errors.pickupAddress}>
              <input
                type="text"
                value={pickupAddress}
                onChange={handleFieldChange(setPickupAddress)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Delivery Address" required error={errors.deliveryAddress}>
              <input
                type="text"
                value={deliveryAddress}
                onChange={handleFieldChange(setDeliveryAddress)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>
          </div>
        </div>

        {/* Amount & Payments */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Charges & Payment Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <FormField label="Total Shifting Charges (Subtotal ₹)" required error={errors.subtotal}>
              <input
                type="number"
                min="1"
                value={subtotal}
                onChange={handleFieldChange(setSubtotal)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="GST Tax Rate Applicable">
              <div className="flex gap-2">
                {[0, 5, 18].map((rate) => (
                  <button
                    type="button"
                    key={rate}
                    onClick={() => {
                      setIsDirty(true);
                      setGstRate(rate);
                    }}
                    className={`flex-1 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                      gstRate === rate
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Advance Paid Amount (₹)">
              <input
                type="number"
                min="0"
                value={advancePaid}
                onChange={handleFieldChange(setAdvancePaid)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Advance Payment Mode">
              <Select
                value={paymentMode}
                onChange={handleFieldChange(setPaymentMode)}
                buttonClassName="bg-white border-slate-300"
              >
                <option value="UPI">UPI</option>
                <option value="Bank Transfer / NEFT">Bank Transfer / NEFT</option>
                <option value="Cash">Cash</option>
                <option value="Cheque">Cheque</option>
              </Select>
            </FormField>
          </div>

          {/* Real-time Summary Box */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">₹{Number(subtotal).toLocaleString("en-IN")}</span>
            </div>
            {gstRate > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>GST ({gstRate}%):</span>
                <span className="font-mono font-medium">₹{gstAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Invoice Amount:</span>
              <span className="font-mono">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-xs text-emerald-400">
              <span>Advance Paid:</span>
              <span className="font-mono">₹{Number(advancePaid).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-amber-400 pt-2 border-t border-slate-800">
              <span>Balance Due on Delivery:</span>
              <span className="font-mono">₹{balanceDue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Tax Invoice...</span>
            </>
          ) : (
            <>
              <Receipt className="w-4 h-4" />
              <span>Generate Official Tax Invoice</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InvoiceBuilder;
