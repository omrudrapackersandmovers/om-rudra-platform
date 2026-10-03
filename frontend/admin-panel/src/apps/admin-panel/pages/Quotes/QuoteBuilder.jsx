import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calculator,
  Shield,
  Percent,
  CheckCircle,
  Truck,
  Box,
  AlertCircle,
  UserCheck,
  Loader2,
  Calendar,
  Edit3,
} from "lucide-react";
import {
  useCreateQuoteMutation,
  useUpdateQuoteMutation,
  useGetQuoteByIdQuery,
} from "../../../../store/apiSlices/quotesApiSlice";
import {
  useGetLeadsQuery,
  useUpdateLeadMutation,
} from "../../../../store/apiSlices/leadsApiSlice";
import { FormField } from "../../../../components/FormField";
import { useUnsavedChanges } from "../../../../hooks/useUnsavedChanges";
import { Select } from "../../shared/components/Select";

const COMMON_ITEMS = [
  { name: "Double Bed with Mattress", category: "Bedroom", cft: 35 },
  { name: "Single Bed", category: "Bedroom", cft: 20 },
  { name: "Almirah / Wardrobe (Steel/Wood)", category: "Bedroom", cft: 40 },
  { name: "Dressing Table", category: "Bedroom", cft: 15 },
  { name: "Sofa Set (3+1+1)", category: "Living Room", cft: 50 },
  { name: "Center Table / Glass Table", category: "Living Room", cft: 10 },
  { name: "TV (43\" - 65\") Packed", category: "Living Room", cft: 10 },
  { name: "TV Unit / Showcase", category: "Living Room", cft: 25 },
  { name: "Refrigerator (Single/Double Door)", category: "Kitchen", cft: 25 },
  { name: "Washing Machine", category: "Kitchen", cft: 18 },
  { name: "Dining Table with Chairs", category: "Kitchen", cft: 30 },
  { name: "Microwave Oven / RO Filter", category: "Kitchen", cft: 8 },
  { name: "Standard Carton Box (Packed Goods)", category: "Boxes", cft: 4 },
  { name: "Two-Wheeler (Bike / Scooty)", category: "Vehicle", cft: 45 },
  { name: "Split AC (Indoor + Outdoor Unit)", category: "Appliances", cft: 15 },
];

const QuoteBuilder = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isDirty, setIsDirty, confirmNavigation, UnsavedModal } = useUnsavedChanges(navigate);

  const { data: existingQuote, isLoading: loadingExisting } = useGetQuoteByIdQuery(id, { skip: !id });
  const { data: leads = [] } = useGetLeadsQuery();

  const [leadId, setLeadId] = useState(searchParams.get("leadId") || "");
  const [customerName, setCustomerName] = useState(searchParams.get("name") || "");
  const [customerPhone, setCustomerPhone] = useState(searchParams.get("phone") || "");
  const [movingFrom, setMovingFrom] = useState(searchParams.get("from") || "");
  const [movingTo, setMovingTo] = useState(searchParams.get("to") || "");
  const [moveDate, setMoveDate] = useState("");

  // Lead context info (read-only, from lead)
  const [leadService, setLeadService] = useState(searchParams.get("service") || "");
  const [leadMoveType, setLeadMoveType] = useState(searchParams.get("moveType") || "");
  const [leadTimeline, setLeadTimeline] = useState(searchParams.get("timeline") || "");

  // Inventory
  const [selectedItems, setSelectedItems] = useState([]);
  const [customItemName, setCustomItemName] = useState("");

  // Pricing Charges
  const [packagingCharges, setPackagingCharges] = useState(3500);
  const [transportCharges, setTransportCharges] = useState(8500);
  const [loadingCharges, setLoadingCharges] = useState(1500);
  const [unloadingCharges, setUnloadingCharges] = useState(1500);

  // Insurance
  const [insuranceDeclaredValue, setInsuranceDeclaredValue] = useState(0);
  const [insuranceRatePercent, setInsuranceRatePercent] = useState(3);

  // Other & Discounts
  const [otherCharges, setOtherCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [gstRate, setGstRate] = useState(18); // 0, 5, 18

  // Validation & Error States
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [createQuote, { isLoading: saving }] = useCreateQuoteMutation();
  const [updateQuote, { isLoading: updating }] = useUpdateQuoteMutation();
  const [updateLead] = useUpdateLeadMutation();

  // Populate data when in edit mode
  useEffect(() => {
    if (existingQuote) {
      setLeadId(existingQuote.leadId || "");
      setCustomerName(existingQuote.customerName || "");
      setCustomerPhone(existingQuote.customerPhone || "");
      setMovingFrom(existingQuote.movingFrom || "");
      setMovingTo(existingQuote.movingTo || "");
      setMoveDate(existingQuote.moveDate || "");
      setPackagingCharges(existingQuote.packagingCharges || 0);
      setTransportCharges(existingQuote.transportCharges || 0);
      setLoadingCharges(existingQuote.loadingCharges || 0);
      setUnloadingCharges(existingQuote.unloadingCharges || 0);
      setInsuranceDeclaredValue(existingQuote.insuranceDeclaredValue || 0);
      setInsuranceRatePercent(existingQuote.insuranceRatePercent || 0);
      setOtherCharges(existingQuote.otherCharges || 0);
      setDiscount(existingQuote.discount || 0);
      setGstRate(existingQuote.gstRate || 0);

      if (existingQuote.inventoryData) {
        try {
          const parsed = JSON.parse(existingQuote.inventoryData);
          if (Array.isArray(parsed)) setSelectedItems(parsed);
        } catch (e) {
          console.error("Error parsing existing quote inventory:", e);
        }
      }

      if (existingQuote.lead) {
        setLeadService(existingQuote.lead.service || "");
        setLeadMoveType(existingQuote.lead.moveType || "");
        setLeadTimeline(existingQuote.lead.timeline || "");
      }
    }
  }, [existingQuote]);

  const handleSelectLead = (selectedId) => {
    setIsDirty(true);
    if (!selectedId) {
      setLeadId("");
      return;
    }
    const found = leads.find((l) => l.id === Number(selectedId));
    if (found) {
      setLeadId(found.id);
      setCustomerName(found.name || "");
      setCustomerPhone(found.phone || "");
      setMovingFrom(found.movingFrom || "");
      setMovingTo(found.movingTo || "");
      setLeadService(found.service || "");
      setLeadMoveType(found.moveType || "");
      setLeadTimeline(found.timeline || "");
      if (found.timeline && !moveDate) {
        setMoveDate(found.timeline);
      }
    }
  };

  const handleFieldChange = (setter) => (e) => {
    setIsDirty(true);
    setter(e.target.value);
  };

  // Calculations
  const insuranceCharges = Math.round(
    ((Number(insuranceDeclaredValue) || 0) * (Number(insuranceRatePercent) || 0)) / 100
  );

  const subtotal =
    (Number(packagingCharges) || 0) +
    (Number(transportCharges) || 0) +
    (Number(loadingCharges) || 0) +
    (Number(unloadingCharges) || 0) +
    insuranceCharges +
    (Number(otherCharges) || 0) -
    (Number(discount) || 0);

  const gstAmount = Math.round(((Math.max(0, subtotal)) * (Number(gstRate) || 0)) / 100);
  const totalAmount = Math.max(0, subtotal + gstAmount);
  const totalCFT = selectedItems.reduce((acc, item) => acc + item.cft * item.qty, 0);

  const handleAddItem = (preset) => {
    setIsDirty(true);
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.name === preset.name);
      if (existing) {
        return prev.map((i) =>
          i.name === preset.name ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { name: preset.name, qty: 1, cft: preset.cft || 5 }];
    });
  };

  const handleAddCustomItem = () => {
    if (!customItemName.trim()) return;
    setIsDirty(true);
    setSelectedItems((prev) => [
      ...prev,
      { name: customItemName.trim(), qty: 1, cft: 10 },
    ]);
    setCustomItemName("");
  };

  const handleRemoveItem = (index) => {
    setIsDirty(true);
    setSelectedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleQtyChange = (index, delta) => {
    setIsDirty(true);
    setSelectedItems((prev) =>
      prev
        .map((item, i) => {
          if (i === index) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const validate = () => {
    const errs = {};
    if (!customerName.trim()) errs.customerName = "Customer name is required";
    if (!customerPhone.trim()) {
      errs.customerPhone = "Phone number is required";
    } else if (!/^\d{10}$/.test(customerPhone.trim())) {
      errs.customerPhone = "Enter a valid 10-digit phone number";
    }
    if (!movingFrom.trim()) errs.movingFrom = "Pickup location is required";
    if (!movingTo.trim()) errs.movingTo = "Delivery location is required";
    if (!moveDate) errs.moveDate = "Moving date is required";
    if (Number(transportCharges) <= 0) {
      errs.transportCharges = "Transport charges must be greater than 0";
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
        leadId: leadId ? Number(leadId) : undefined,
        customerName,
        customerPhone,
        movingFrom,
        movingTo,
        moveDate: moveDate || undefined,
        inventoryData: JSON.stringify(selectedItems),
        packagingCharges: Number(packagingCharges) || 0,
        transportCharges: Number(transportCharges) || 0,
        loadingCharges: Number(loadingCharges) || 0,
        unloadingCharges: Number(unloadingCharges) || 0,
        insuranceDeclaredValue: Number(insuranceDeclaredValue) || 0,
        insuranceRatePercent: Number(insuranceRatePercent) || 0,
        insuranceCharges,
        otherCharges: Number(otherCharges) || 0,
        discount: Number(discount) || 0,
        gstRate: Number(gstRate) || 0,
        gstAmount,
        totalAmount,
      };

      let resQuoteId;
      if (isEditMode) {
        await updateQuote({ id: Number(id), ...payload }).unwrap();
        resQuoteId = id;
      } else {
        const res = await createQuote(payload).unwrap();
        resQuoteId = res.quote.id;

        // Automatically update lead status to converted if leadId was provided
        if (leadId) {
          try {
            await updateLead({ id: Number(leadId), status: "converted" }).unwrap();
          } catch (e) {
            console.error("Failed to auto-update lead status:", e);
          }
        }
      }

      setIsDirty(false);
      navigate(`/quotes/${resQuoteId}`);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || (isEditMode ? "Failed to update quotation" : "Failed to create quotation"));
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
            onClick={() => confirmNavigation(isEditMode ? `/quotes/${id}` : (leadId ? `/leads/${leadId}` : "/quotes"))}
            className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {isEditMode ? `Edit Quotation #${existingQuote?.quoteNumber || id}` : "Create Quotation"}
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              {isEditMode
                ? "Modify inventory items, prices, route, and target moving schedule"
                : "Estimate builder with inventory calculation & GST breakdown"}
            </p>
          </div>
        </div>

        {leadId ? (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 border border-blue-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Linked to Lead #{leadId}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Standalone Quote (No Lead Attached)</span>
          </div>
        )}
      </div>

      {/* Error alert banner */}
      {submitError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{submitError}</span>
          </div>
          <button onClick={() => setSubmitError("")} className="text-rose-500 hover:text-rose-700 font-bold">×</button>
        </div>
      )}

      {/* Lead Selector Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Customer Lead Linkage</span>
            <p className="text-[11px] text-slate-500">Attach an inquiry lead or select from recent customers</p>
          </div>
        </div>
        <Select
          value={leadId || ""}
          onChange={(e) => handleSelectLead(e.target.value)}
          className="max-w-md w-full"
          buttonClassName="bg-slate-50 border-slate-300"
        >
          <option value="">-- Standalone Quote (No Lead Attached) --</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>
              Lead #{l.id}: {l.name} ({l.phone}) • {l.movingFrom} ➔ {l.movingTo} [{l.status}]
            </option>
          ))}
        </Select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Customer & Route Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-blue-600" />
            <span>Customer & Move Route</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Customer Name" required error={errors.customerName}>
              <input
                type="text"
                value={customerName}
                onChange={handleFieldChange(setCustomerName)}
                placeholder="Customer full name"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Customer Phone" required error={errors.customerPhone}>
              <input
                type="tel"
                maxLength={10}
                value={customerPhone}
                onChange={handleFieldChange(setCustomerPhone)}
                placeholder="10-digit mobile number"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Moving From (Pickup City / Address)" required error={errors.movingFrom}>
              <input
                type="text"
                value={movingFrom}
                onChange={handleFieldChange(setMovingFrom)}
                placeholder="e.g. Ranchi, Jharkhand"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Moving To (Drop City / Address)" required error={errors.movingTo}>
              <input
                type="text"
                value={movingTo}
                onChange={handleFieldChange(setMovingTo)}
                placeholder="e.g. Patna, Bihar"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField
              label="Expected Moving Date / Target Schedule"
              required
              error={errors.moveDate}
              helperText="Calendar date or flexible timeline given by customer"
            >
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={moveDate}
                    onChange={handleFieldChange(setMoveDate)}
                    placeholder="e.g. 2026-10-15 or Urgent (within 2-3 days)"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <input
                    type="date"
                    onChange={(e) => {
                      if (e.target.value) {
                        setIsDirty(true);
                        setMoveDate(e.target.value);
                      }
                    }}
                    className="px-2.5 py-2 border border-slate-300 rounded-xl text-xs bg-slate-50 hover:bg-slate-100 cursor-pointer text-slate-600"
                    title="Select date from calendar"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  {["Urgent (within 2 to 3 days)", "Within this week", "Next week", "End of this month"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setIsDirty(true);
                        setMoveDate(preset);
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </FormField>
          </div>

          {/* Lead Service Context (read-only) */}
          {(leadService || leadMoveType || leadTimeline) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs">
              {leadService && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 block mb-0.5">Service Type</span>
                  <span className="font-semibold text-blue-900">{leadService}</span>
                </div>
              )}
              {leadMoveType && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 block mb-0.5">Move Type</span>
                  <span className="font-semibold text-blue-900">{leadMoveType}</span>
                </div>
              )}
              {leadTimeline && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-400 block mb-0.5">Timeline</span>
                  <span className="font-semibold text-blue-900">{leadTimeline}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Inventory Selection Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Box className="w-4 h-4 text-emerald-600" />
              <span>Goods Inventory / Articles List</span>
            </h3>
            <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-mono font-semibold">
              Total Volume: {totalCFT} CFT
            </span>
          </div>

          {/* Quick presets */}
          <div>
            <p className="text-xs text-slate-500 mb-2 font-medium">Click to add common items:</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_ITEMS.map((item, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleAddItem(item)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom item */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customItemName}
              onChange={(e) => setCustomItemName(e.target.value)}
              placeholder="Or type custom item name..."
              className="flex-1 px-3.5 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomItem();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddCustomItem}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Selected Inventory List */}
          {selectedItems.length > 0 ? (
            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
              {selectedItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2.5 text-xs bg-white hover:bg-slate-50">
                  <span className="font-medium text-slate-800">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(index, -1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono font-bold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(index, 1)}
                        className="px-2 py-0.5 text-slate-600 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 px-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              No inventory items added yet. Click presets above or type custom items.
            </div>
          )}
        </div>

        {/* Pricing Charges Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-purple-600" />
            <span>Pricing Breakdown & GST Options</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <FormField label="Packaging Charges (₹)">
              <input
                type="number"
                min="0"
                value={packagingCharges}
                onChange={handleFieldChange(setPackagingCharges)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Transport Freight (₹)" required error={errors.transportCharges}>
              <input
                type="number"
                min="0"
                value={transportCharges}
                onChange={handleFieldChange(setTransportCharges)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Loading Charges (₹)">
              <input
                type="number"
                min="0"
                value={loadingCharges}
                onChange={handleFieldChange(setLoadingCharges)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Unloading & Placement (₹)">
              <input
                type="number"
                min="0"
                value={unloadingCharges}
                onChange={handleFieldChange(setUnloadingCharges)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField
              label="Declared Goods Value for Insurance (₹)"
              helperText={`Premium: ${insuranceRatePercent}% = ₹${insuranceCharges}`}
            >
              <input
                type="number"
                min="0"
                value={insuranceDeclaredValue}
                onChange={handleFieldChange(setInsuranceDeclaredValue)}
                placeholder="e.g. 100000"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>

            <FormField label="Discount (₹)">
              <input
                type="number"
                min="0"
                value={discount}
                onChange={handleFieldChange(setDiscount)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs sm:text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </FormField>
          </div>

          {/* GST Selection */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-700">GST Rate Applicable:</span>
            <div className="flex gap-2">
              {[0, 5, 18].map((rate) => (
                <button
                  type="button"
                  key={rate}
                  onClick={() => {
                    setIsDirty(true);
                    setGstRate(rate);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    gstRate === rate
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {rate}% {rate === 18 ? "(Composite)" : rate === 5 ? "(GTA)" : "(Exempt)"}
                </button>
              ))}
            </div>
          </div>

          {/* Total Calculation Display */}
          <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal (All Charges):</span>
              <span className="font-mono font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            {gstRate > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>GST ({gstRate}%):</span>
                <span className="font-mono font-medium">₹{gstAmount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-amber-400 pt-2 border-t border-slate-800">
              <span>Estimated Total Quote:</span>
              <span className="font-mono">₹{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving || updating}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
        >
          {saving || updating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isEditMode ? "Updating Quotation..." : "Generating Quotation..."}</span>
            </>
          ) : (
            <>
              {isEditMode ? <Edit3 className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
              <span>{isEditMode ? "Save Changes to Quotation" : "Generate & Preview Formal Quote"}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default QuoteBuilder;
