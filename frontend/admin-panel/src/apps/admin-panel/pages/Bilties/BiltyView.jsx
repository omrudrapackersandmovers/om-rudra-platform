import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  Truck,
  ShieldCheck,
  Building2,
  FileText,
  Download,
} from "lucide-react";
import { useGetBiltyByIdQuery } from "../../../../store/apiSlices/biltiesApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { companyConfig } from "../../../../configs/company.config";

const BiltyView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: bilty, isLoading: loading } = useGetBiltyByIdQuery(id);
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

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null" || dateStr === "undefined") {
      return "—";
    }
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime())
        ? (dateStr.length > 20 ? "—" : dateStr)
        : d.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
    } catch {
      return "—";
    }
  };

  const handleDownloadPdf = () => {
    const prevTitle = document.title;
    document.title = `Bilty-${bilty?.lrNumber || "LR"}-${(bilty?.consignorName || "Consignor").replace(/[^a-zA-Z0-9]/g, "-")}`;
    window.print();
    setTimeout(() => {
      document.title = prevTitle;
    }, 1000);
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading consignment note...</div>;
  }

  if (!bilty) {
    return <div className="text-center py-12 text-rose-500 text-sm">Bilty not found.</div>;
  }

  const whatsAppMessage = `*Official Consignment Note (LR/Bilty) from ${company.name || "Om Rudra Packers and Movers"}*
LR No: ${bilty.lrNumber}
Truck No: ${bilty.truckNumber}
Driver: ${bilty.driverName} (${bilty.driverPhone || "N/A"})
From: ${bilty.fromCity} ➔ To: ${bilty.toCity}
Packages: ${bilty.packagesCount} units
Freight: ₹${bilty.freightAmount.toLocaleString("en-IN")} (${bilty.freightStatus.toUpperCase()})
Risk: ${bilty.riskType.toUpperCase().replace("_", " ")}
-----------------------------
Emergency Transport Helpline: ${company.phone || "+91 7033488691"}`;

  return (
    <div className="space-y-6 pb-10 max-w-5xl mx-auto">
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 print:hidden bg-white sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/80 shadow-2xs sm:shadow-none">
        <button
          onClick={() => navigate("/bilties")}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs cursor-pointer transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bilties List</span>
        </button>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            title="Download Bilty as PDF"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Download PDF</span>
          </button>

          <a
            href={`https://wa.me/91${bilty.consignorPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
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

      {/* Official Lorry Receipt / Bilty Printable Sheet */}
      <div className="bg-white rounded-2xl border-2 border-slate-800 p-3.5 sm:p-8 shadow-sm space-y-5 print:border-2 print:border-black print:shadow-none print:p-4">
        {/* Centered Brand Logo at Top */}
        <div className="flex justify-center items-center pb-2">
          <img
            src={company.logo?.primary || "/images/primary-logo.webp"}
            alt={company.name || "Company Logo"}
            className="h-14 sm:h-16 w-auto object-contain max-w-60 drop-shadow-xs"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>

        {/* LR Top Header Row (Data on Both Sides) */}
        <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1 text-left max-w-md">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight leading-tight">
              {company.name || "Om Rudra Packers and Movers"}
            </h1>
            <p className="text-[11px] font-semibold text-blue-800">
              GOVT. REGD. PACKERS & HIGHWAY TRANSPORT CONTRACTORS (IBA APPROVED)
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              {company.headOffice?.address
                ? `${company.headOffice.address}, ${company.headOffice.city}, ${company.headOffice.state} - ${company.headOffice.pincode}`
                : "Ram Krishna Nagar, Soranpur, Goraiya Asthan, Patna, Bihar - 800027"}
            </p>
            <div className="pt-1 space-y-0.5 text-[11px] text-slate-600">
              <p>Phone: <strong className="text-slate-900">{company.phone || "+91 7033488691"}</strong></p>
              <p>Email: <strong className="text-slate-900">{company.email || "hello@1stompackersandmovers.com"}</strong></p>
              <p>Web: <strong className="text-slate-900">{company.website?.replace(/^https?:\/\//, "") || "1stompackersandmovers.com"}</strong></p>
            </div>
            <p className="text-xs font-semibold text-slate-800 pt-0.5 font-mono">
              {isRealGstin ? `GSTIN: ${company.gstin} ${isRealPan ? `| PAN: ${company.pan}` : ""}` : "Govt Approved Transport Carrier"}
            </p>
          </div>

          <div className="sm:text-right border-2 border-slate-900 p-2 rounded-xl bg-slate-50 min-w-44 shrink-0">
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-500">
              CONSIGNMENT NOTE (LR)
            </span>
            <p className="text-base font-black font-mono text-blue-900">{bilty.lrNumber}</p>
            <p className="text-xs text-slate-700 font-semibold">
              Date: {formatDate(bilty.createdAt)}
            </p>
          </div>
        </div>

        {/* Consignor & Consignee Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-slate-300 rounded-xl p-3 text-xs">
          <div className="border-b sm:border-b-0 sm:border-r border-slate-200 pb-3 sm:pb-0 sm:pr-3 space-y-1">
            <span className="bg-slate-800 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
              CONSIGNOR (SENDER)
            </span>
            <p className="text-sm font-bold text-slate-900 pt-1">{bilty.consignorName}</p>
            <p className="text-slate-600">Phone: <span className="font-mono">{bilty.consignorPhone}</span></p>
            <p className="text-slate-700">From City: <span className="font-bold">{bilty.fromCity}</span></p>
            <p className="text-slate-600">Pickup Address: {bilty.consignorAddress}</p>
          </div>

          <div className="space-y-1 sm:pl-2">
            <span className="bg-slate-800 text-white font-bold text-[10px] px-2 py-0.5 rounded uppercase">
              CONSIGNEE (RECEIVER)
            </span>
            <p className="text-sm font-bold text-slate-900 pt-1">{bilty.consigneeName}</p>
            <p className="text-slate-600">Phone: <span className="font-mono">{bilty.consigneePhone}</span></p>
            <p className="text-slate-700">To City: <span className="font-bold">{bilty.toCity}</span></p>
            <p className="text-slate-600">Delivery Address: {bilty.consigneeAddress}</p>
          </div>
        </div>

        {/* Vehicle & Highway Details Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 border border-slate-300 rounded-xl p-3 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Vehicle Reg No.</span>
            <span className="font-black font-mono text-sm text-slate-900">{bilty.truckNumber}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Driver Name</span>
            <span className="font-bold text-slate-900">{bilty.driverName}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Driver Mobile</span>
            <span className="font-mono font-bold text-slate-900">{bilty.driverPhone || "N/A"}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Risk Coverage</span>
            <span className="font-bold text-amber-700 uppercase">{bilty.riskType.replace("_", " ")}</span>
          </div>
        </div>

        {/* Goods Description & Packages */}
        <div className="border border-slate-300 rounded-xl overflow-x-auto text-xs print-avoid-break">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-slate-800 text-white font-semibold">
              <tr>
                <th className="py-2 px-3">No. of Pkgs</th>
                <th className="py-2 px-3">Description of Goods (Said to Contain)</th>
                <th className="py-2 px-3 text-right">Declared Value (₹)</th>
                <th className="py-2 px-3 text-right">Freight Charges</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              <tr>
                <td className="py-3 px-3 font-mono font-bold text-sm">{bilty.packagesCount} Boxes</td>
                <td className="py-3 px-3">
                  <p className="font-semibold">{bilty.goodsDescription}</p>
                  <p className="text-[10px] text-slate-500">Carefully packed in corrugated boxes & bubble wrap.</p>
                </td>
                <td className="py-3 px-3 text-right font-mono font-bold">
                  ₹{bilty.declaredValue.toLocaleString("en-IN")}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  <span className="block font-black text-sm text-slate-900">
                    ₹{bilty.freightAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-blue-700">
                    [{bilty.freightStatus.replace("_", " ")}]
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legal Terms & Signatures */}
        <div className="space-y-4 pt-2 print-avoid-break">
          <div className="text-[10px] text-slate-500 space-y-0.5 border-t border-slate-200 pt-2">
            <p className="font-bold text-slate-700">NOTICE & CONDITIONS:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              {(company.terms?.bilty || [
                "Consignment is carried strictly under Carrier by Road Act.",
                "Goods carried at Owner's risk unless Transit Insurance receipt is attached.",
                "Consignee must inspect all packages at delivery before signing receipt.",
                "No claims entertained after delivery verification is signed."
              ]).map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 text-center text-[11px] font-bold text-slate-700">
            <div className="border-t border-slate-400 pt-1">
              Consignor / Sender Signature
            </div>
            <div className="border-t border-slate-400 pt-1">
              Driver Signature
            </div>
            <div className="border-t border-slate-400 pt-1">
              For {company.name || "Om Rudra Packers and Movers"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiltyView;
