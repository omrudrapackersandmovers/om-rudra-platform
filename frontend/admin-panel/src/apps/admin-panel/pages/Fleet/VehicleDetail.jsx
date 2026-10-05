import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Truck,
  Phone,
  Wrench,
  Calendar,
  MapPin,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit2,
  Shield,
  FileText,
  X,
  ExternalLink,
  ChevronRight,
  Fuel,
  Receipt,
  Activity,
  Package,
} from "lucide-react";
import {
  useGetVehicleByIdQuery,
  useUpdateVehicleMutation,
} from "../../../../store/apiSlices/vehiclesApiSlice";
import { FormField } from "../../../../components/FormField";
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

const EXPENSE_LABELS = {
  fuel: "Fuel",
  toll: "Toll",
  helper_extra: "Helper Extra",
  vehicle_repair: "Vehicle Repair",
  misc: "Miscellaneous",
};

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profileData, isLoading, refetch } = useGetVehicleByIdQuery(id);
  const [updateVehicle, { isLoading: updating }] = useUpdateVehicleMutation();

  const vehicle = profileData?.vehicle;
  const metrics = profileData?.metrics || {
    totalMovesAttended: 0,
    totalMovesCompleted: 0,
    totalFuelCost: 0,
    totalTollCost: 0,
    totalRepairCost: 0,
    totalExpenses: 0,
  };
  const movesAttended = profileData?.movesAttended || [];
  const expenseHistory = profileData?.expenseHistory || [];
  const complianceStatus = profileData?.complianceStatus || {};

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});

  const handleOpenEditModal = () => {
    if (!vehicle) return;
    setEditForm({
      vehicleNumber: vehicle.vehicleNumber || "",
      vehicleType: vehicle.vehicleType || VEHICLE_TYPES[0],
      capacityTons: vehicle.capacityTons || "",
      capacityCft: vehicle.capacityCft || "",
      defaultDriverName: vehicle.defaultDriverName || "",
      defaultDriverPhone: vehicle.defaultDriverPhone || "",
      status: vehicle.status || "available",
      insuranceExpiry: vehicle.insuranceExpiry || "",
      fitnessExpiry: vehicle.fitnessExpiry || "",
      permitExpiry: vehicle.permitExpiry || "",
      notes: vehicle.notes || "",
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    if (!editForm.vehicleNumber?.trim()) {
      setEditErrors({ vehicleNumber: "Vehicle number is required" });
      return;
    }
    try {
      await updateVehicle({ id: vehicle.id, ...editForm }).unwrap();
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      alert("Failed to update vehicle: " + (err.data?.error || err.message));
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null") return "-";
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime())
        ? dateStr
        : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case "expired": return "bg-rose-100 text-rose-800 border-rose-300";
      case "critical": return "bg-rose-50 text-rose-700 border-rose-200";
      case "warning": return "bg-amber-50 text-amber-700 border-amber-200";
      case "ok": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100 text-slate-500 border-slate-200";
    }
  };

  const getComplianceIcon = (status) => {
    switch (status) {
      case "expired": return <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
      case "critical": return <AlertCircle className="w-3.5 h-3.5 text-rose-500" />;
      case "warning": return <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
      case "ok": return <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />;
      default: return <Shield className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const ComplianceBadge = ({ label, data }) => {
    if (!data) return null;
    const days = getDaysUntil(data.expiry);
    return (
      <div className={`p-3 rounded-xl border space-y-1.5 ${getComplianceColor(data.status)}`}>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{label}</span>
          {getComplianceIcon(data.status)}
        </div>
        <div className="text-xs font-bold">
          {data.expiry ? formatDate(data.expiry) : "Not Set"}
        </div>
        <div className="text-[10px] font-medium">
          {!data.expiry
            ? "No expiry date recorded"
            : data.status === "expired"
            ? `Expired ${Math.abs(days ?? 0)}d ago`
            : data.status === "ok"
            ? `${days}d remaining`
            : `${days}d left - Renew soon`}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading vehicle profile...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 max-w-lg mx-auto mt-10">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Vehicle Not Found</h3>
        <p className="text-xs text-slate-500">This vehicle does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/fleet")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Fleet
        </button>
      </div>
    );
  }

  const statusConfig = {
    available: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    on_move: "bg-blue-50 text-blue-700 border border-blue-200",
    maintenance: "bg-amber-50 text-amber-700 border border-amber-200",
    retired: "bg-slate-100 text-slate-500 border border-slate-200",
  };

  const hasComplianceAlert = Object.values(complianceStatus).some(
    (c) => c?.status === "expired" || c?.status === "critical"
  );

  return (
    <div className="space-y-4 sm:space-y-5 pb-28 sm:pb-16 max-w-6xl mx-auto px-1 sm:px-0">

      {/* Top Action Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <button
          onClick={() => navigate("/fleet")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 sm:px-2.5 py-1.5 rounded-xl hover:bg-white hover:border-slate-200 border border-transparent transition-all cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Fleet Registry</span>
        </button>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
          {vehicle.defaultDriverPhone && (
            <a
              href={`tel:${vehicle.defaultDriverPhone}`}
              className="flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2.5 sm:px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold shadow-2xs transition-colors active:scale-98"
            >
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Call Driver</span>
            </a>
          )}
          <button
            onClick={handleOpenEditModal}
            className="flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2.5 sm:px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-98 col-span-1"
          >
            <Edit2 className="w-3.5 h-3.5 shrink-0" />
            <span>Edit Vehicle</span>
          </button>
        </div>
      </div>

      {/* Compliance Alert Banner */}
      {hasComplianceAlert && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Compliance Alert: </strong>
            <span>
              {vehicle.vehicleNumber} has expired or critically expiring documents.
              Renew immediately to avoid operational disruption.
            </span>
          </div>
        </div>
      )}

      {/* Vehicle Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            {/* Vehicle Icon */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center shadow-sm shrink-0">
              <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {vehicle.vehicleNumber}
                </h1>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shrink-0 ${statusConfig[vehicle.status] || statusConfig.available}`}>
                  {vehicle.status?.replace("_", " ")}
                </span>
              </div>
              <p className="text-sm text-slate-600 font-medium">{vehicle.vehicleType}</p>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {vehicle.capacityTons && (
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 font-medium">
                    {vehicle.capacityTons} Tons
                  </span>
                )}
                {vehicle.capacityCft && (
                  <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 font-medium">
                    {vehicle.capacityCft} CFT
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Driver info */}
          {vehicle.defaultDriverName && (
            <div className="flex flex-row sm:flex-col sm:items-end justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block sm:text-right">Default Driver</span>
                <div className="text-sm font-bold text-slate-900 sm:text-right">{vehicle.defaultDriverName}</div>
              </div>
              {vehicle.defaultDriverPhone && (
                <a
                  href={`tel:${vehicle.defaultDriverPhone}`}
                  className="text-xs font-mono text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3 h-3" />
                  {vehicle.defaultDriverPhone}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Moves Attended</span>
            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">{metrics.totalMovesAttended}</div>
          <p className="text-[10px] text-slate-400 truncate">{metrics.totalMovesCompleted} completed</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Fuel Cost</span>
            <Fuel className="w-4 h-4 text-orange-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">₹{metrics.totalFuelCost.toLocaleString("en-IN")}</div>
          <p className="text-[10px] text-slate-400 truncate">Total fuel spend</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Repair Cost</span>
            <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-amber-600 font-mono">₹{metrics.totalRepairCost.toLocaleString("en-IN")}</div>
          <p className="text-[10px] text-slate-400 truncate">Maintenance spend</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Total Expenses</span>
            <Receipt className="w-4 h-4 text-rose-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-rose-600 font-mono">₹{metrics.totalExpenses.toLocaleString("en-IN")}</div>
          <p className="text-[10px] text-slate-400 truncate">All operational costs</p>
        </div>
      </div>

      {/* Compliance & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        {/* Left: Compliance Documents */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Compliance & Documents</span>
          </h3>

          <div className="space-y-2.5">
            <ComplianceBadge label="Insurance" data={complianceStatus.insurance} />
            <ComplianceBadge label="Fitness Certificate" data={complianceStatus.fitness} />
            <ComplianceBadge label="Route Permit" data={complianceStatus.permit} />
          </div>

          {vehicle.notes && (
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Vehicle Notes</span>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed break-words">
                {vehicle.notes}
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Fleet Registry Info</span>
            <div className="text-slate-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Added to Fleet</span>
                <span className="font-semibold">{formatDate(vehicle.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Toll Costs</span>
                <span className="font-mono font-semibold">₹{metrics.totalTollCost.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Moves History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Relocation Jobs ({movesAttended.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">All jobs this vehicle has been dispatched on</p>
          </div>

          {movesAttended.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Truck className="w-8 h-8 mx-auto text-slate-300" />
              <p>No jobs dispatched yet.</p>
              <p className="text-[11px]">Assign this vehicle to an active job from the Jobs dashboard.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movesAttended.map((move) => (
                <div
                  key={move.id}
                  className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-xl space-y-2.5 text-xs transition-all"
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      to={`/jobs/${move.jobId}`}
                      className="font-mono font-bold text-xs sm:text-sm text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                    >
                      <span>{move.jobNumber}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(move.scheduledDate)}</span>
                    </div>
                  </div>

                  {/* Role & Status badges */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {move.role && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[10px] font-bold uppercase border border-blue-200/60">
                        {move.role} vehicle
                      </span>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      move.jobStatus === "completed"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : move.jobStatus === "in_progress"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : move.jobStatus === "cancelled"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {move.jobStatus?.replace("_", " ")}
                    </span>
                  </div>

                  {/* Customer & Route */}
                  <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="text-[11px] text-slate-600 font-medium">
                      Customer: <strong className="text-slate-900">{move.customerName}</strong>
                      {move.customerPhone && (
                        <a href={`tel:${move.customerPhone}`} className="ml-1.5 text-blue-600 font-mono hover:underline">
                          {move.customerPhone}
                        </a>
                      )}
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex items-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 ring-2 ring-emerald-100" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">Pickup</span>
                          <span className="text-slate-700 leading-snug break-words">{move.pickupAddress}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0 ring-2 ring-blue-100" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">Delivery</span>
                          <span className="text-slate-900 font-medium leading-snug break-words">{move.deliveryAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Driver on this move */}
                  {(move.driverName || move.driverPhone) && (
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">Driver:</span>
                      <span className="font-semibold text-slate-800">{move.driverName || "-"}</span>
                      {move.driverPhone && (
                        <a href={`tel:${move.driverPhone}`} className="font-mono text-blue-600 hover:underline ml-auto">{move.driverPhone}</a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expense Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-orange-500 shrink-0" />
              <span>Operational Expense History</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Fuel, toll, repair and all other costs across all moves</p>
          </div>
          <div className="self-start sm:self-auto">
            <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 inline-block">
              Total: ₹{metrics.totalExpenses.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {expenseHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No expenses logged for this vehicle yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {expenseHistory.map((item, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      item.category === "fuel"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : item.category === "vehicle_repair"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : item.category === "toll"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}>
                      {EXPENSE_LABELS[item.category] || item.category}
                    </span>
                    <Link to={`/jobs/${item.jobId}`} className="font-mono text-blue-600 hover:underline text-[11px] flex items-center gap-0.5">
                      {item.jobNumber}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                  {item.description && (
                    <p className="text-[11px] text-slate-600">{item.description}</p>
                  )}
                  <p className="text-[11px] text-slate-400">
                    {formatDate(item.createdAt)}
                    {item.paidBy && <span> • Paid by: <span className="font-medium text-slate-600">{item.paidBy}</span></span>}
                    {item.receiptNote && <span> • {item.receiptNote}</span>}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-sm text-slate-900 block">
                    ₹{Number(item.amount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Vehicle Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[80] bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 animate-in fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span>Edit Vehicle: {vehicle.vehicleNumber}</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <div className="grid grid-cols-2 gap-3">
                <FormField label="Vehicle Number" required error={editErrors.vehicleNumber}>
                  <input
                    type="text"
                    value={editForm.vehicleNumber || ""}
                    onChange={(e) => setEditForm({ ...editForm, vehicleNumber: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="e.g. JH01AB1234"
                  />
                </FormField>

                <FormField label="Status">
                  <Select
                    value={editForm.status || "available"}
                    onChange={(val) => setEditForm({ ...editForm, status: val })}
                    options={[
                      { value: "available", label: "Available" },
                      { value: "on_move", label: "On Move" },
                      { value: "maintenance", label: "Maintenance" },
                      { value: "retired", label: "Retired" },
                    ]}
                  />
                </FormField>
              </div>

              <FormField label="Vehicle Type">
                <Select
                  value={editForm.vehicleType || VEHICLE_TYPES[0]}
                  onChange={(val) => setEditForm({ ...editForm, vehicleType: val })}
                  options={VEHICLE_TYPES.map((t) => ({ value: t, label: t }))}
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Capacity (Tons)">
                  <input
                    type="number"
                    value={editForm.capacityTons || ""}
                    onChange={(e) => setEditForm({ ...editForm, capacityTons: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="e.g. 2.5"
                    step="0.1"
                  />
                </FormField>
                <FormField label="Capacity (CFT)">
                  <input
                    type="number"
                    value={editForm.capacityCft || ""}
                    onChange={(e) => setEditForm({ ...editForm, capacityCft: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    placeholder="e.g. 450"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Default Driver Name">
                  <input
                    type="text"
                    value={editForm.defaultDriverName || ""}
                    onChange={(e) => setEditForm({ ...editForm, defaultDriverName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>
                <FormField label="Driver Phone">
                  <input
                    type="tel"
                    value={editForm.defaultDriverPhone || ""}
                    onChange={(e) => setEditForm({ ...editForm, defaultDriverPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Insurance Expiry">
                  <input
                    type="date"
                    value={editForm.insuranceExpiry || ""}
                    onChange={(e) => setEditForm({ ...editForm, insuranceExpiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>
                <FormField label="Fitness Expiry">
                  <input
                    type="date"
                    value={editForm.fitnessExpiry || ""}
                    onChange={(e) => setEditForm({ ...editForm, fitnessExpiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>
                <FormField label="Permit Expiry">
                  <input
                    type="date"
                    value={editForm.permitExpiry || ""}
                    onChange={(e) => setEditForm({ ...editForm, permitExpiry: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Notes">
                <textarea
                  rows={2}
                  value={editForm.notes || ""}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="Any remarks about this vehicle..."
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer text-xs"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
