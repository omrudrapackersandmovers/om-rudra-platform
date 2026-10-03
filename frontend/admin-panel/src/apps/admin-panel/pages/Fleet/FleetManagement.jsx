import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Truck,
  Plus,
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  Clock,
  Wrench,
  Calendar,
  Phone,
  Shield,
  FileText,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  useGetVehiclesQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from "../../../../store/apiSlices/vehiclesApiSlice";
import { FormField } from "../../../../components/FormField";
import { CardGridSkeleton } from "../../shared/components/Skeleton";
import { Select } from "../../shared/components/Select";

const VEHICLE_TYPES = [
  "Tata 407 (Closed Container)",
  "Tata 407 (Open Body)",
  "Tata Ace / Chhota Hathi",
  "Mahindra Bolero Pickup",
  "14ft Container Truck",
  "17ft Container Truck",
  "19ft Container Truck",
  "22ft Multi-Axle Container",
  "32ft High-Capacity Container",
];

const FleetManagement = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: vehicles = [], isLoading, isFetching, refetch } = useGetVehiclesQuery({});
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        refetch(),
        new Promise((resolve) => setTimeout(resolve, 750)),
      ]);
    } finally {
      setIsSyncing(false);
    }
  };

  const [addVehicle, { isLoading: adding }] = useAddVehicleMutation();
  const [updateVehicle, { isLoading: updating }] = useUpdateVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();

  const [confirmTarget, setConfirmTarget] = useState(null); // vehicle to confirm-delete
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteVehicle = (v) => {
    setDeleteError("");
    setConfirmTarget(v);
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    try {
      await deleteVehicle(confirmTarget.id).unwrap();
      setConfirmTarget(null);
    } catch (err) {
      setDeleteError(err.data?.error || err.message || "Failed to retire vehicle");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: VEHICLE_TYPES[0],
    capacityTons: 2.5,
    capacityCft: 450,
    defaultDriverName: "",
    defaultDriverPhone: "",
    status: "available",
    insuranceExpiry: "",
    fitnessExpiry: "",
    permitExpiry: "",
    notes: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setForm({
      vehicleNumber: "",
      vehicleType: VEHICLE_TYPES[0],
      capacityTons: 2.5,
      capacityCft: 450,
      defaultDriverName: "",
      defaultDriverPhone: "",
      status: "available",
      insuranceExpiry: "",
      fitnessExpiry: "",
      permitExpiry: "",
      notes: "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (v) => {
    setEditingVehicle(v);
    setForm({
      vehicleNumber: v.vehicleNumber,
      vehicleType: v.vehicleType,
      capacityTons: v.capacityTons || "",
      capacityCft: v.capacityCft || "",
      defaultDriverName: v.defaultDriverName || "",
      defaultDriverPhone: v.defaultDriverPhone || "",
      status: v.status || "available",
      insuranceExpiry: v.insuranceExpiry || "",
      fitnessExpiry: v.fitnessExpiry || "",
      permitExpiry: v.permitExpiry || "",
      notes: v.notes || "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.vehicleNumber.trim()) errs.vehicleNumber = "Vehicle number is required";
    if (!form.vehicleType) errs.vehicleType = "Vehicle type is required";
    if (form.defaultDriverPhone && !/^\d{10}$/.test(form.defaultDriverPhone.trim())) {
      errs.defaultDriverPhone = "Driver phone must be 10 digits";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    try {
      if (editingVehicle) {
        await updateVehicle({ id: editingVehicle.id, ...form }).unwrap();
      } else {
        await addVehicle(form).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || "Failed to save vehicle");
    }
  };

  // Expiry check helpers
  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const now = new Date();
    const target = new Date(dateStr);
    const diffMs = target.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const renderExpiryBadge = (label, dateStr) => {
    if (!dateStr) return null;
    const days = getDaysUntil(dateStr);
    let colorClass = "bg-slate-100 text-slate-700 border-slate-200";
    let icon = null;

    if (days <= 0) {
      colorClass = "bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse";
      icon = <AlertTriangle className="w-3 h-3 text-rose-600" />;
    } else if (days <= 30) {
      colorClass = "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
      icon = <AlertCircle className="w-3 h-3 text-rose-500" />;
    } else if (days <= 90) {
      colorClass = "bg-amber-50 text-amber-800 border-amber-200";
      icon = <AlertCircle className="w-3 h-3 text-amber-500" />;
    }

    return (
      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md border ${colorClass}`}>
        {icon}
        <span>{label}: {days <= 0 ? "Expired!" : `${days}d left`}</span>
      </span>
    );
  };

  // Find critical document expiries across all vehicles for top banner
  const criticalExpiries = vehicles.filter((v) => {
    const d1 = getDaysUntil(v.insuranceExpiry);
    const d2 = getDaysUntil(v.fitnessExpiry);
    const d3 = getDaysUntil(v.permitExpiry);
    return (d1 !== null && d1 <= 30) || (d2 !== null && d2 <= 30) || (d3 !== null && d3 <= 30);
  });

  const filteredVehicles = vehicles.filter((v) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(q) ||
      v.vehicleType.toLowerCase().includes(q) ||
      (v.defaultDriverName && v.defaultDriverName.toLowerCase().includes(q));
    const matchesStatus = statusFilter === "all" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalFleet = vehicles.length;
  const availableCount = vehicles.filter((v) => v.status === "available").length;
  const onMoveCount = vehicles.filter((v) => v.status === "on_move").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "maintenance").length;
  const retiredCount = vehicles.filter((v) => v.status === "retired").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Action Row */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync fleet"
          aria-label="Refresh & sync fleet"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-blue-600" : ""}`} />
        </button>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Vehicle</span>
        </button>
      </div>

      {/* Critical Expiry Warning Sticky Banner */}
      {criticalExpiries.length > 0 && (
        <div className="p-3.5 sm:p-4 bg-rose-50 border-l-4 border-rose-500 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-rose-800 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <strong className="font-bold">Compliance Alert: </strong>
              <span>
                {criticalExpiries.length} vehicle(s) have insurance, fitness, or road permits expiring within 30 days! Please renew to avoid transport fines on highways.
              </span>
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {criticalExpiries.map((v) => (
              <span key={v.id} className="font-mono bg-white text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-bold text-[11px]">
                {v.vehicleNumber}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Total Fleet</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 mt-2 font-mono truncate">{totalFleet}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">All registered transport</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Available</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-emerald-600 mt-2 font-mono truncate">{availableCount}</p>
          <p className="text-[10px] sm:text-[11px] text-emerald-600 font-medium mt-0.5 truncate">
            {totalFleet > 0 ? `${Math.round((availableCount / totalFleet) * 100)}% Ready` : "Ready for moves"}
          </p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">On Move</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-blue-600 mt-2 font-mono truncate">{onMoveCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Active on routes</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Maintenance</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-amber-600 mt-2 font-mono truncate">{maintenanceCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Under repair</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by truck #, vehicle type, or driver..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: "All Fleet", count: totalFleet },
            { id: "available", label: "Available", count: availableCount },
            { id: "on_move", label: "On Highway Move", count: onMoveCount },
            { id: "maintenance", label: "In Maintenance", count: maintenanceCount },
            { id: "retired", label: "Retired", count: retiredCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 border-slate-200/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                  statusFilter === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/70 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No vehicles found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No transport assets match "${searchQuery}".`
              : "No vehicles registered in this category. Click \"Add Vehicle\" to add trucks and containers to your fleet."}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Vehicle</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => navigate(`/fleet/${v.id}`)}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-mono font-black text-base text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      <span>{v.vehicleNumber}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">{v.vehicleType}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                      v.status === "available"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : v.status === "on_move"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : v.status === "maintenance"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {v.status.replace("_", " ")}
                  </span>
                </div>

                {/* Capacities */}
                <div className="flex items-center gap-2 text-xs">
                  {v.capacityTons && (
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 font-medium text-slate-600">
                      {v.capacityTons} Tons
                    </span>
                  )}
                  {v.capacityCft && (
                    <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 font-medium text-slate-600">
                      {v.capacityCft} CFT Volume
                    </span>
                  )}
                </div>

                {/* Driver */}
                {v.defaultDriverName && (
                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                    <span className="text-slate-400">Driver:</span>
                    <div className="font-medium text-slate-800">
                      <span>{v.defaultDriverName}</span>{" "}
                      {v.defaultDriverPhone && (
                        <a
                          href={`tel:${v.defaultDriverPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="font-mono text-blue-600 hover:underline"
                        >
                          ({v.defaultDriverPhone})
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Expiry badges */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {renderExpiryBadge("Insurance", v.insuranceExpiry)}
                  {renderExpiryBadge("Fitness", v.fitnessExpiry)}
                  {renderExpiryBadge("Permit", v.permitExpiry)}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEditModal(v);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteVehicle(v);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                    title="Retire / Delete Vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Vehicle Modal (Full screen on mobile, elegant dialog on desktop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 animate-in fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl flex flex-col sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>{editingVehicle ? "Edit Fleet Vehicle" : "Add Vehicle to Fleet"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 text-xs">
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Vehicle Number" required error={formErrors.vehicleNumber}>
                  <input
                    type="text"
                    value={form.vehicleNumber}
                    onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g. JH-01-AB-1234"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono uppercase text-xs sm:text-sm focus:border-blue-500 outline-none"
                  />
                </FormField>

                <FormField label="Vehicle Status">
                  <Select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    buttonClassName="bg-white border-slate-300"
                  >
                    <option value="available">Available</option>
                    <option value="on_move">On Move</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="retired">Retired</option>
                  </Select>
                </FormField>
              </div>

              <FormField label="Vehicle Type / Container Model" required error={formErrors.vehicleType}>
                <Select
                  value={form.vehicleType}
                  onChange={(e) => setForm({ ...form, vehicleType: e.target.value })}
                  buttonClassName="bg-white border-slate-300"
                >
                  {VEHICLE_TYPES.map((t, idx) => (
                    <option key={idx} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Payload Capacity (Tons)">
                  <input
                    type="number"
                    step="0.1"
                    value={form.capacityTons}
                    onChange={(e) => setForm({ ...form, capacityTons: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>

                <FormField label="Volume Capacity (CFT)">
                  <input
                    type="number"
                    value={form.capacityCft}
                    onChange={(e) => setForm({ ...form, capacityCft: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Default Assigned Driver">
                  <input
                    type="text"
                    value={form.defaultDriverName}
                    onChange={(e) => setForm({ ...form, defaultDriverName: e.target.value })}
                    placeholder="Driver full name"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                  />
                </FormField>

                <FormField label="Driver Phone Number" error={formErrors.defaultDriverPhone}>
                  <input
                    type="tel"
                    maxLength={10}
                    value={form.defaultDriverPhone}
                    onChange={(e) => setForm({ ...form, defaultDriverPhone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              {/* Compliance & Document Dates */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Legal Transit & Compliance Expiry Dates:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <FormField label="Insurance Expiry">
                    <input
                      type="date"
                      value={form.insuranceExpiry}
                      onChange={(e) => setForm({ ...form, insuranceExpiry: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs focus:border-blue-500 outline-none"
                    />
                  </FormField>

                  <FormField label="Fitness Cert Expiry">
                    <input
                      type="date"
                      value={form.fitnessExpiry}
                      onChange={(e) => setForm({ ...form, fitnessExpiry: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs focus:border-blue-500 outline-none"
                    />
                  </FormField>

                  <FormField label="Road Permit Expiry">
                    <input
                      type="date"
                      value={form.permitExpiry}
                      onChange={(e) => setForm({ ...form, permitExpiry: e.target.value })}
                      className="w-full px-2 py-2 border border-slate-300 rounded-xl text-xs focus:border-blue-500 outline-none"
                    />
                  </FormField>
                </div>
              </div>

                <FormField label="Notes & Vehicle Remarks">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="e.g. GPS tracked, FASTag installed, serviced in Ranchi terminal..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 focus:bg-white outline-none resize-none"
                  />
                </FormField>
              </div>

              <div className="p-3.5 sm:p-4 border-t border-slate-100 bg-white sm:bg-slate-50/60 flex items-center justify-end gap-2.5 shrink-0 pb-[max(env(safe-area-inset-bottom),0.875rem)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm text-center cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding || updating}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 text-center shadow-xs"
                >
                  {adding || updating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Vehicle...</span>
                    </>
                  ) : (
                    <span>{editingVehicle ? "Update Vehicle Record" : "Save Vehicle to Fleet"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Delete Modal */}
      {confirmTarget && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-100 rounded-xl">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="font-bold text-slate-800 text-base">Retire Vehicle?</h2>
            </div>
            <p className="text-slate-600 text-sm mb-1">
              Are you sure you want to retire{" "}
              <span className="font-semibold text-slate-900">{confirmTarget.vehicleNumber}</span>?
            </p>
            <p className="text-slate-500 text-xs mb-4">This will remove it from active fleet. This action cannot be undone.</p>
            {deleteError && (
              <p className="text-rose-600 text-xs bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 mb-4">{deleteError}</p>
            )}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setConfirmTarget(null); setDeleteError(""); }}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors cursor-pointer"
              >
                Retire Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetManagement;
