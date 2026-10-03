import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  QrCode,
  Building2,
  CheckCircle,
  Truck,
  DollarSign,
  X,
  CreditCard,
  Plus,
  Calendar,
  AlertCircle,
  Loader2,
  Download,
  MapPin,
  Phone,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  useGetInvoiceByIdQuery,
  useGetInvoicePaymentsQuery,
  useRecordInvoicePaymentMutation,
} from "../../../../store/apiSlices/invoicesApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { companyConfig } from "../../../../configs/company.config";
import { FormField } from "../../../../components/FormField";
import { Select } from "../../shared/components/Select";

const InvoiceView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: invoice, isLoading: loading } = useGetInvoiceByIdQuery(id);
  const { data: dbSettings } = useGetSettingsQuery();
  const company = {
    ...companyConfig,
    ...(dbSettings || {}),
    headOffice: {
      ...companyConfig.headOffice,
      ...(dbSettings?.headOffice || {}),
    },
    bankDetails: {
      ...companyConfig.bankDetails,
      ...(dbSettings?.bankDetails || {}),
    },
  };

  const isRealGstin = company.gstin && !company.gstin.includes("XXXXX");
  const isRealPan = company.pan && !company.pan.includes("XXXXX");
  const isRealAccount =
    company.bankDetails?.accountNumber &&
    company.bankDetails?.accountNumber !== "000000000000" &&
    !company.bankDetails?.accountNumber.includes("00000");

  const { data: payments = [], isLoading: paymentsLoading } = useGetInvoicePaymentsQuery(id);
  const [recordPayment, { isLoading: recordingPayment }] = useRecordInvoicePaymentMutation();

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "—";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime()) ? (dateStr.length > 20 ? "—" : dateStr) : d.toLocaleDateString("en-IN");
    } catch {
      return "—";
    }
  };

  const handleDownloadPdf = () => {
    const prevTitle = document.title;
    document.title = `Invoice-${invoice?.invoiceNumber || "Invoice"}-${(invoice?.customerName || "Customer").replace(/[^a-zA-Z0-9]/g, "-")}`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1000);
  };

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("upi");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const handleOpenPaymentModal = () => {
    if (invoice) {
      setPaymentAmount(invoice.balanceDue > 0 ? invoice.balanceDue.toString() : "");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setTransactionRef("");
      setPaymentNotes("");
      setPaymentError("");
    }
    setIsPaymentModalOpen(true);
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentError("");
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      setPaymentError("Payment amount must be greater than 0");
      return;
    }

    try {
      await recordPayment({
        invoiceId: id,
        amount: Number(paymentAmount),
        paymentMode,
        paymentDate,
        transactionRef,
        notes: paymentNotes,
      }).unwrap();
      setIsPaymentModalOpen(false);
    } catch (err) {
      setPaymentError(err.data?.error || err.message || "Failed to record payment");
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center py-12 text-rose-500 text-sm">Invoice not found.</div>;
  }

  // Dynamic UPI Payment Intent String
  const upiId = company.upi?.id || company.bankDetails?.upiId || "";
  const payeeName = company.upi?.payeeName || company.name || "Om Rudra Packers and Movers";
  const upiPayload = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
    payeeName
  )}&am=${invoice.balanceDue > 0 ? invoice.balanceDue : invoice.totalAmount}&cu=INR&tn=${encodeURIComponent(
    invoice.invoiceNumber
  )}`;

  const whatsAppMessage = `*Tax Invoice from ${company.name || "Om Rudra Packers and Movers"}*
Invoice No: ${invoice.invoiceNumber}
Customer: ${invoice.customerName}
-----------------------------
Total Amount: ₹${invoice.totalAmount.toLocaleString("en-IN")}
Advance Paid: ₹${invoice.advancePaid.toLocaleString("en-IN")}
*Balance Due: ₹${invoice.balanceDue.toLocaleString("en-IN")}*
Status: ${invoice.paymentStatus.toUpperCase()}
-----------------------------
${upiId ? `You can pay via UPI to: ${upiId}\n` : ""}Bank: ${company.bankDetails?.bankName || "State Bank of India"} | A/C: ${company.bankDetails?.accountNumber || "N/A"} | IFSC: ${company.bankDetails?.ifsc || "N/A"}
-----------------------------
Thank you for choosing ${company.name || "Om Rudra Packers and Movers"}!`;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Print CSS Configuration */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 12mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-avoid-break {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Top Bar (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs print:hidden">
        {/* Row 1 on Mobile / Left on Desktop: Navigation & Status Badge */}
        <div className="flex items-center justify-between gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => navigate("/invoices")}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Invoices</span>
            </button>

            {invoice.jobId && (
              <Link
                to={`/jobs/${invoice.jobId}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 rounded-xl text-xs font-semibold transition-colors truncate"
              >
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Job #{invoice.jobId}</span>
              </Link>
            )}
          </div>

          <div className="shrink-0">
            {invoice.paymentStatus === "paid" && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Paid in Full
              </span>
            )}
            {invoice.paymentStatus === "partial" && (
              <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Partial Paid
              </span>
            )}
            {invoice.paymentStatus === "unpaid" && (
              <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200/80 text-xs font-bold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                Unpaid
              </span>
            )}
          </div>
        </div>

        {/* Row 2 on Mobile / Right on Desktop: Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {Number(invoice.balanceDue || 0) > 0 && (
            <button
              onClick={handleOpenPaymentModal}
              className="flex items-center justify-center gap-1.5 py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          )}

          <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Download Invoice as PDF"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download PDF</span>
            </button>

            <a
              href={`https://wa.me/91${invoice.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                whatsAppMessage
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-semibold text-xs rounded-xl transition-colors text-center"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Invoice Document Paper Sheet */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3.5 sm:p-8 shadow-sm space-y-5 print:border-none print:shadow-none print:p-0">
        {/* Centered Brand Logo at Top */}
        <div className="flex justify-center items-center pb-2">
          <img
            src={company.logo?.primary || "/images/primary-logo.webp"}
            alt={company.name || "Company Logo"}
            className="h-16 sm:h-20 w-auto object-contain max-w-64 drop-shadow-xs"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* Company & Invoice Details Row (Data on Both Sides) */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-5">
          {/* Left Side: Company Contact & Credentials */}
          <div className="space-y-1 text-left max-w-md">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {company.name || "Om Rudra Packers and Movers"}
            </h1>
            <p className="text-xs text-blue-600 font-semibold">{company.tagline || "Safer Moves, Brighter Tomorrows"}</p>
            <p className="text-[11px] text-slate-600 mt-1 leading-snug">
              {company.headOffice?.address
                ? `${company.headOffice.address}, ${company.headOffice.city}, ${company.headOffice.state} - ${company.headOffice.pincode}`
                : "Ram Krishna Nagar, Soranpur, Goraiya Asthan, Patna, Bihar - 800027"}
            </p>
            <div className="pt-1 space-y-0.5 text-[11px] text-slate-600">
              <p>Phone: <strong className="text-slate-900">{company.phone || "+91 7033488691"}</strong></p>
              <p>Email: <strong className="text-slate-900">{company.email || "hello@1stompackersandmovers.com"}</strong></p>
              <p>Web: <strong className="text-slate-900">{company.website?.replace(/^https?:\/\//, "") || "1stompackersandmovers.com"}</strong></p>
            </div>
            <p className="text-[10px] text-slate-500 font-mono pt-0.5">
              {isRealGstin
                ? `GSTIN: ${company.gstin} ${isRealPan ? `| PAN: ${company.pan}` : ""} | SAC: ${invoice.sacCode || company.sacCode || "9965"}`
                : `SAC Code: ${invoice.sacCode || company.sacCode || "9965"} (Goods Transport Agency) • IBA Approved`}
            </p>
          </div>

          {/* Right Side: Invoice Metadata */}
          <div className="text-left sm:text-right space-y-1 shrink-0">
            <span
              className={`inline-block px-3 py-1 font-black text-xs rounded-lg uppercase tracking-wider mb-1 font-mono border ${
                invoice.paymentStatus === "paid"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : invoice.paymentStatus === "partial"
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-rose-50 text-rose-800 border-rose-200"
              }`}
            >
              Tax Invoice • {invoice.paymentStatus}
            </span>
            <div className="text-base font-mono font-bold text-slate-900">{invoice.invoiceNumber}</div>
            <div className="text-xs text-slate-600">
              Date: <strong className="text-slate-800">{formatDate(invoice.createdAt)}</strong>
            </div>
            {invoice.jobId && (
              <div className="text-[11px] text-slate-500">
                Job Ref: <strong>#{invoice.jobId}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Billed To & Relocation Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Billed To Customer
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{invoice.customerName}</div>
            <div className="text-slate-600 font-mono mt-0.5 flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+91 {invoice.customerPhone}</span>
            </div>
            {invoice.customerGstin && (
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                GSTIN: <strong>{invoice.customerGstin}</strong>
              </div>
            )}
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Relocation Route & Addresses
            </span>
            <div className="text-xs font-medium text-slate-700 mt-1 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
              <span><strong>Pickup:</strong> {invoice.pickupAddress}</span>
            </div>
            <div className="text-xs font-medium text-slate-700 mt-1 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Delivery:</strong> {invoice.deliveryAddress}</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-xl overflow-x-auto text-xs">
          <table className="w-full min-w-[480px]">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4 text-left">Service Description</th>
                <th className="py-2.5 px-4 text-center w-24">SAC Code</th>
                <th className="py-2.5 px-4 text-right w-32">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800">
                    Comprehensive Packers & Movers Service
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Safe packing, loading, highway container transit, unloading, unpacking & domestic relocation
                  </div>
                </td>
                <td className="py-3 px-4 text-center font-mono text-slate-600">{invoice.sacCode || "9965"}</td>
                <td className="py-3 px-4 text-right font-mono font-semibold text-slate-800">
                  ₹{Number(invoice.subtotal || 0).toLocaleString("en-IN")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pricing & Balance Calculation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* UPI QR Payment Block OR Verified Settlement Box */}
          {Number(invoice.balanceDue || 0) > 0 ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-4">
              <div className="bg-white p-2 rounded-xl border border-slate-200 shrink-0">
                <QRCodeSVG value={upiPayload} size={90} />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <QrCode className="w-4 h-4 text-blue-600" />
                  <span>Instant UPI Payment</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Scan with GPay, PhonePe, or Paytm to settle balance directly
                </p>
                {upiId && (
                  <div className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
                    {upiId}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-emerald-900 text-sm flex items-center gap-1">
                  <span>Payment Received in Full</span>
                </div>
                <p className="text-emerald-700 text-[11px]">
                  All dues for this invoice have been settled. Zero pending balance.
                </p>
                <span className="inline-block px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-bold uppercase tracking-wider font-mono">
                  Status: Fully Paid
                </span>
              </div>
            </div>
          )}

          {/* Amount Summary */}
          {(() => {
            const totalAmount = Number(invoice.totalAmount || 0);
            const balanceDue = Number(invoice.balanceDue || 0);
            const paidAmount = Number(
              invoice.paidAmount !== undefined
                ? invoice.paidAmount
                : Math.max(0, totalAmount - balanceDue)
            );
            return (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                <div className="flex justify-between py-2 px-3 bg-slate-50 font-medium">
                  <span className="text-slate-600">Taxable Shifting Charges</span>
                  <span className="font-mono">₹{Number(invoice.subtotal || 0).toLocaleString("en-IN")}</span>
                </div>
                {invoice.gstRate > 0 && (
                  <div className="flex justify-between py-2 px-3">
                    <span className="text-slate-600">GST ({invoice.gstRate}%)</span>
                    <span className="font-mono">₹{Number(invoice.gstAmount || 0).toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between py-2.5 px-3 font-bold text-slate-900 bg-slate-50">
                  <span>Total Invoice Amount</span>
                  <span className="font-mono">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-2 px-3 text-emerald-700 bg-emerald-50/50 font-medium">
                  <span>Total Amount Paid</span>
                  <span className="font-mono font-bold">₹{paidAmount.toLocaleString("en-IN")}</span>
                </div>
                <div
                  className={`flex justify-between py-2.5 px-3 font-black text-sm border-t-2 ${
                    balanceDue > 0
                      ? "bg-rose-50/80 text-rose-900 border-rose-200"
                      : "bg-emerald-50/80 text-emerald-900 border-emerald-200"
                  }`}
                >
                  <span>Balance Due</span>
                  <span
                    className={`font-mono text-base ${
                      balanceDue > 0 ? "text-rose-700" : "text-emerald-700"
                    }`}
                  >
                    ₹{balanceDue.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Customer Payment History Table (Visible on Screen & Print) */}
        {payments.length > 0 && (
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Recorded Payment Receipts</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 text-left">Date</th>
                    <th className="py-2 px-3 text-left">Mode</th>
                    <th className="py-2 px-3 text-left">Reference / Notes</th>
                    <th className="py-2 px-3 text-right">Amount Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono">{p.paymentDate}</td>
                      <td className="py-2 px-3 uppercase font-medium">{p.paymentMode}</td>
                      <td className="py-2 px-3 text-slate-500">{p.transactionRef || p.notes || "—"}</td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">
                        ₹{Number(p.amount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bank Details & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-[11px] text-slate-600 print-avoid-break">
          <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/70 space-y-1">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
              Bank Account for Direct NEFT / RTGS
            </h5>
            <p>Bank: <strong>{company.bankDetails?.bankName || "State Bank of India"}</strong></p>
            <p>Official UPI ID: <strong>{company.upi?.id || company.bankDetails?.upiId || "1stompackers@sbi"}</strong></p>
            {isRealAccount ? (
              <>
                <p>Account: <strong>{company.bankDetails.accountNumber}</strong></p>
                <p>IFSC: <strong>{company.bankDetails.ifsc}</strong></p>
              </>
            ) : (
              <p className="text-slate-500 italic">
                Direct NEFT / RTGS account details available upon verified dispatch.
              </p>
            )}
          </div>
          <div className="bg-slate-50/60 p-3 rounded-xl border border-slate-200/70 space-y-1">
            <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
              Notice & Terms
            </h5>
            <p className="text-slate-600">
              Please make all cheques or digital payments payable to <strong>{company.name || "Om Rudra Packers and Movers"}</strong>.
              Payment is due upon successful unloading & verification at destination.
            </p>
          </div>
        </div>

        {/* Computer-Generated Document Notice (No signature needed) */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1 print-avoid-break">
          <p className="font-semibold text-slate-800 text-xs sm:text-sm">
            This is a computer-generated invoice and does not require any signature or seal.
          </p>
          <p className="text-[11px] text-slate-400">
            Om Rudra Packers and Movers • Patna, Bihar • Helpline: +91 7033488691 • Email: hello@1stompackersandmovers.com
          </p>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Record Customer Payment
                </h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-3.5 text-xs">
              <FormField label="Payment Amount (₹)" required>
                <input
                  type="number"
                  min="1"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:border-blue-500 outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Current Balance Due: <strong>₹{invoice.balanceDue.toLocaleString("en-IN")}</strong>
                </span>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Payment Mode" required>
                  <Select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    buttonClassName="bg-white border-slate-300"
                  >
                    <option value="upi">UPI</option>
                    <option value="cash">Cash</option>
                    <option value="neft">Bank / NEFT</option>
                    <option value="cheque">Cheque</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                <FormField label="Payment Date" required>
                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              <FormField label="UTR / Transaction Reference (Optional)">
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UPI Ref / Bank Txn ID"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Notes / Remarks">
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Paid balance upon delivery"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                disabled={recordingPayment}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {recordingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Payment...</span>
                  </>
                ) : (
                  <span>Save Payment & Update Balance</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceView;
