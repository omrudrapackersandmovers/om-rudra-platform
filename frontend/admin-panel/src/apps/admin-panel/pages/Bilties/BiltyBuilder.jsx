import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { ArrowLeft, FileText, Truck, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import { useCreateBiltyMutation } from "../../../../store/apiSlices/biltiesApiSlice";
import { FormField } from "../../../../components/FormField";
import { useUnsavedChanges } from "../../../../hooks/useUnsavedChanges";
import { Select } from "../../shared/components/Select";

const BiltyBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDirty, setIsDirty, confirmNavigation, UnsavedModal } = useUnsavedChanges(navigate);

  const jobId = searchParams.get("jobId") || "";

  // Consignor
  const [consignorName, setConsignorName] = useState(searchParams.get("consignor") || "");
  const [consignorPhone, setConsignorPhone] = useState(searchParams.get("consignorPhone") || "");
  const [consignorAddress, setConsignorAddress] = useState(searchParams.get("pickup") || "");

  // Consignee
  const [consigneeName, setConsigneeName] = useState(searchParams.get("consignee") || "");
  const [consigneePhone, setConsigneePhone] = useState(searchParams.get("consigneePhone") || "");
  const [consigneeAddress, setConsigneeAddress] = useState(searchParams.get("delivery") || "");

  // Route
  const [fromCity, setFromCity] = useState("Ranchi");
  const [toCity, setToCity] = useState("Patna");

  // Vehicle & Driver
  const [truckNumber, setTruckNumber] = useState(searchParams.get("truck") || "JH-01-AB-1234");
  const [driverName, setDriverName] = useState(searchParams.get("driver") || "");
  const [driverPhone, setDriverPhone] = useState(searchParams.get("driverPhone") || "");

  // Cargo & Charges
  const [packagesCount, setPackagesCount] = useState(25);
  const [goodsDescription, setGoodsDescription] = useState(
    "Household Goods, Furniture & Personal Effects (Packed)"
  );
  const [declaredValue, setDeclaredValue] = useState(150000);
  const [freightAmount, setFreightAmount] = useState(18000);
  const [freightStatus, setFreightStatus] = useState("to_pay");
  const [riskType, setRiskType] = useState("owner_risk");

  // Form Errors & Submission State
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [createBilty, { isLoading: saving }] = useCreateBiltyMutation();

  const handleInputChange = (setter) => (e) => {
    setIsDirty(true);
    setter(e.target.value);
  };

  const validate = () => {
    const errs = {};
    if (!consignorName.trim()) errs.consignorName = "Consignor name is required";
    if (!consignorPhone.trim()) {
      errs.consignorPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(consignorPhone.trim())) {
      errs.consignorPhone = "Must be a 10-digit mobile number";
    }
    if (!consignorAddress.trim()) errs.consignorAddress = "Pickup address is required";
    if (!fromCity.trim()) errs.fromCity = "Origin city is required";

    if (!consigneeName.trim()) errs.consigneeName = "Consignee name is required";
    if (!consigneePhone.trim()) {
      errs.consigneePhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(consigneePhone.trim())) {
      errs.consigneePhone = "Must be a 10-digit mobile number";
    }
    if (!consigneeAddress.trim()) errs.consigneeAddress = "Delivery address is required";
    if (!toCity.trim()) errs.toCity = "Destination city is required";

    if (!truckNumber.trim()) errs.truckNumber = "Truck number is required";
    if (!driverName.trim()) errs.driverName = "Driver name is required";
    if (driverPhone.trim() && !/^\d{10}$/.test(driverPhone.trim())) {
      errs.driverPhone = "Driver phone must be 10 digits";
    }
    if (Number(packagesCount) <= 0) errs.packagesCount = "Must be at least 1 package";
    if (Number(freightAmount) < 0) errs.freightAmount = "Freight amount cannot be negative";

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
        consignorName,
        consignorAddress,
        consignorPhone,
        consigneeName,
        consigneeAddress,
        consigneePhone,
        fromCity,
        toCity,
        truckNumber,
        driverName,
        driverPhone,
        packagesCount: Number(packagesCount) || 1,
        goodsDescription,
        declaredValue: Number(declaredValue) || 0,
        freightAmount: Number(freightAmount) || 0,
        freightStatus,
        riskType,
      };

      const res = await createBilty(payload).unwrap();
      setIsDirty(false);
      navigate(`/bilties/${res.bilty.id}`);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || "Failed to generate Bilty");
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <UnsavedModal />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={() => confirmNavigation(jobId ? `/jobs/${jobId}` : "/jobs")}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Generate Consignment Note (Bilty / LR)
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
              Official highway transit documentation under Carriage by Road Act
            </p>
          </div>
        </div>

        {jobId ? (
          <div className="flex items-center gap-2 bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 border border-brand-200/80 dark:border-brand-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <Truck className="w-4 h-4 text-brand-600 dark:text-brand-300 shrink-0" />
            <span>Linked to Job #{jobId}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-300 shrink-0" />
            <span>Standalone Bilty</span>
          </div>
        )}
      </div>

      {/* Submit Error Banner */}
      {submitError && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError("")} className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300 font-bold">×</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Consignor (Sender) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Consignor Details (Sender / Origin)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Consignor Name" required error={errors.consignorName}>
              <input
                type="text"
                value={consignorName}
                onChange={handleInputChange(setConsignorName)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="Phone Number" required error={errors.consignorPhone}>
              <input
                type="tel"
                maxLength={10}
                value={consignorPhone}
                onChange={handleInputChange(setConsignorPhone)}
                placeholder="10-digit mobile"
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm font-mono focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="From City / Terminal" required error={errors.fromCity}>
              <input
                type="text"
                value={fromCity}
                onChange={handleInputChange(setFromCity)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <div className="sm:col-span-3">
              <FormField label="Pickup Address" required error={errors.consignorAddress}>
                <input
                  type="text"
                  value={consignorAddress}
                  onChange={handleInputChange(setConsignorAddress)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Consignee (Receiver) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
            <span>Consignee Details (Receiver / Destination)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Consignee Name" required error={errors.consigneeName}>
              <input
                type="text"
                value={consigneeName}
                onChange={handleInputChange(setConsigneeName)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="Phone Number" required error={errors.consigneePhone}>
              <input
                type="tel"
                maxLength={10}
                value={consigneePhone}
                onChange={handleInputChange(setConsigneePhone)}
                placeholder="10-digit mobile"
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm font-mono focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="To City / Destination" required error={errors.toCity}>
              <input
                type="text"
                value={toCity}
                onChange={handleInputChange(setToCity)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <div className="sm:col-span-3">
              <FormField label="Delivery Address" required error={errors.consigneeAddress}>
                <input
                  type="text"
                  value={consigneeAddress}
                  onChange={handleInputChange(setConsigneeAddress)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* Transport & Truck Details */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-500" />
            <span>Vehicle, Driver & Highway Cargo Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Truck / Vehicle Reg Number" required error={errors.truckNumber}>
              <input
                type="text"
                value={truckNumber}
                onChange={handleInputChange(setTruckNumber)}
                placeholder="e.g. JH-01-AB-1234"
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl font-mono uppercase text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="Driver Name" required error={errors.driverName}>
              <input
                type="text"
                value={driverName}
                onChange={handleInputChange(setDriverName)}
                placeholder="Driver full name"
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="Driver Mobile Phone" error={errors.driverPhone}>
              <input
                type="tel"
                maxLength={10}
                value={driverPhone}
                onChange={handleInputChange(setDriverPhone)}
                placeholder="10-digit mobile"
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl font-mono text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="No. of Packages / Boxes" error={errors.packagesCount}>
              <input
                type="number"
                min="1"
                value={packagesCount}
                onChange={handleInputChange(setPackagesCount)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl font-mono text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="Declared Goods Value (₹)">
              <input
                type="number"
                min="0"
                value={declaredValue}
                onChange={handleInputChange(setDeclaredValue)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl font-mono text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="Freight Charges (₹)" error={errors.freightAmount}>
              <input
                type="number"
                min="0"
                value={freightAmount}
                onChange={handleInputChange(setFreightAmount)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl font-mono text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
              />
            </FormField>

            <FormField label="Freight Payment Status">
              <Select
                value={freightStatus}
                onChange={handleInputChange(setFreightStatus)}
                buttonClassName="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
              >
                <option value="to_pay">To Pay (Pay on Delivery)</option>
                <option value="paid">Paid (Advance Cleared)</option>
              </Select>
            </FormField>

            <FormField label="Risk Type">
              <Select
                value={riskType}
                onChange={handleInputChange(setRiskType)}
                buttonClassName="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600"
              >
                <option value="owner_risk">Owner's Risk (Standard)</option>
                <option value="carrier_risk">Carrier's Risk (Insured)</option>
              </Select>
            </FormField>

            <div className="sm:col-span-3">
              <FormField label="Description of Goods Contained">
                <input
                  type="text"
                  value={goodsDescription}
                  onChange={handleInputChange(setGoodsDescription)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-600 rounded-xl text-xs sm:text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"
                />
              </FormField>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Bilty...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Generate Official Highway Bilty (LR)</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BiltyBuilder;
