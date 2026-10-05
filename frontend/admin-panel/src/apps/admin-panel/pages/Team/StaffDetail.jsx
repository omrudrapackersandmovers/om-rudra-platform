import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Phone,
  MessageSquare,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit2,
  Briefcase,
  Shield,
  ExternalLink,
  X,
  ChevronRight,
  TrendingUp,
  Receipt,
  FileSpreadsheet,
  Check,
  RotateCcw,
} from "lucide-react";
import {
  useGetStaffByIdQuery,
  useUpdateStaffMutation,
} from "../../../../store/apiSlices/staffApiSlice";
import { useUpdateStaffPaymentMutation } from "../../../../store/apiSlices/jobsApiSlice";
import { FormField } from "../../../../components/FormField";
import { Select } from "../../shared/components/Select";

const ROLES = [
  { value: "driver", label: "Driver", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "supervisor", label: "Supervisor", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "packer", label: "Packer (Specialist)", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { value: "loader", label: "Loader", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "helper", label: "Helper", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: profileData, isLoading, isFetching, refetch } = useGetStaffByIdQuery(id);
  const [updateStaff, { isLoading: updatingStaff }] = useUpdateStaffMutation();
  const [updateStaffPayment, { isLoading: payingWage }] = useUpdateStaffPaymentMutation();

  const staff = profileData?.staff;
  const metrics = profileData?.metrics || {
    totalMovesAttended: 0,
    totalEarned: 0,
    totalPaid: 0,
    pendingWages: 0,
  };
  const movesAttended = profileData?.movesAttended || [];
  const paymentHistory = profileData?.paymentHistory || [];

  // Pay Modal State
  const [selectedMoveForPay, setSelectedMoveForPay] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [payNotes, setPayNotes] = useState("");
  const [payError, setPayError] = useState("");

  // Edit Staff Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    role: "loader",
    specialization: "",
    status: "available",
    idType: "Aadhaar",
    idNumber: "",
    address: "",
    dailyWage: 600,
    joiningDate: "",
    notes: "",
  });
  const [editErrors, setEditErrors] = useState({});

  const handleOpenEditModal = () => {
    if (!staff) return;
    setEditForm({
      name: staff.name || "",
      phone: staff.phone || "",
      role: staff.role || "loader",
      specialization: staff.specialization || "",
      status: staff.status || "available",
      idType: staff.idType || "Aadhaar",
      idNumber: staff.idNumber || "",
      address: staff.address || "",
      dailyWage: staff.dailyWage || 600,
      joiningDate: staff.joiningDate || "",
      notes: staff.notes || "",
    });
    setEditErrors({});
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      setEditErrors({ name: "Name is required" });
      return;
    }
    try {
      await updateStaff({
        id: staff.id,
        ...editForm,
        dailyWage: Number(editForm.dailyWage) || 0,
      }).unwrap();
      setIsEditModalOpen(false);
      refetch();
    } catch (err) {
      alert("Failed to update staff member: " + (err.data?.error || err.message));
    }
  };

  const handleOpenPayModal = (move) => {
    setSelectedMoveForPay(move);
    const balance = Math.max(0, (Number(move.amountPayable) || 0) - (Number(move.amountPaid) || 0));
    setPayAmount(balance.toString());
    setPayMode("cash");
    setPayNotes(`Cleared wages for move ${move.jobNumber}`);
    setPayError("");
  };

  const handleRecordPaySubmit = async (e) => {
    e.preventDefault();
    if (!selectedMoveForPay) return;
    const amount = Number(payAmount);
    if (isNaN(amount) || amount <= 0) {
      setPayError("Enter a valid payment amount greater than 0");
      return;
    }

    try {
      await updateStaffPayment({
        jobId: selectedMoveForPay.jobId,
        staffId: staff.id,
        amountPaid: (Number(selectedMoveForPay.amountPaid) || 0) + amount,
        paymentMode: payMode,
        paymentNotes: payNotes || "Cleared from Staff Profile Ledger",
      }).unwrap();
      setSelectedMoveForPay(null);
      refetch();
    } catch (err) {
      setPayError(err.data?.error || err.message || "Failed to record payment");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "CURRENT_TIMESTAMP" || dateStr === "null") return "-";
    try {
      const s = dateStr.includes("T") ? dateStr : dateStr.replace(" ", "T") + "Z";
      const d = new Date(s);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading team member profile...</p>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3 max-w-lg mx-auto mt-10">
        <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Staff Member Not Found</h3>
        <p className="text-xs text-slate-500">The team member profile you requested does not exist or has been removed.</p>
        <button
          onClick={() => navigate("/team")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Team Roster</span>
        </button>
      </div>
    );
  }

  const roleConfig = ROLES.find((r) => r.value === staff.role) || {
    label: staff.role,
    color: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-28 sm:pb-16 max-w-6xl mx-auto px-1 sm:px-0">
      {/* Top Action Row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        {/* Row 1 (mobile) / Left side (desktop): Back button */}
        <button
          onClick={() => navigate("/team")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 sm:px-2.5 py-1.5 rounded-xl hover:bg-white hover:border-slate-200 border border-transparent transition-all cursor-pointer self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Team Roster</span>
        </button>

        {/* Row 2 (mobile) / Right side (desktop): Action buttons */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-2">
          <a
            href={`tel:${staff.phone}`}
            className="flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2.5 sm:px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-semibold shadow-2xs transition-colors active:scale-98"
          >
            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span>Call</span>
          </a>

          <a
            href={`https://wa.me/91${staff.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              `Hello ${staff.name}, this is from Om Rudra Packers and Movers Operations Desk.`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2.5 sm:px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200/80 rounded-xl text-xs font-semibold shadow-2xs transition-colors active:scale-98"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>WhatsApp</span>
          </a>

          <button
            onClick={handleOpenEditModal}
            className="flex items-center justify-center gap-1.5 py-2 sm:py-1.5 px-2.5 sm:px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
          >
            <Edit2 className="w-3.5 h-3.5 shrink-0" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Main Staff Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-lg sm:text-2xl shadow-sm shrink-0">
              {staff.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {staff.name}
                </h1>
                <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase border shrink-0 ${roleConfig.color}`}>
                  {roleConfig.label}
                </span>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase shrink-0 ${
                    staff.status === "available"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : staff.status === "on_move"
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {staff.status.replace("_", " ")}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-mono flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>+91 {staff.phone}</span>
              </p>
              {staff.specialization && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 pt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">Specialty: <strong className="text-slate-700 font-semibold">{staff.specialization}</strong></span>
                </p>
              )}
            </div>
          </div>

          {/* Wage Rate & Joined Container (Clean split on mobile, stacked on desktop) */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block sm:text-right">
                Base Wage Rate
              </span>
              <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono sm:text-right">
                ₹{staff.dailyWage || 0}<span className="text-xs font-medium text-slate-500">/day</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 sm:mt-1 text-right">
              Joined: <strong className="text-slate-800 block sm:inline">{formatDate(staff.joiningDate || staff.createdAt)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Performance & Payroll Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Moves Attended</span>
            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.totalMovesAttended}
          </div>
          <p className="text-[10px] text-slate-400 truncate">Relocation shifts</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider truncate">Lifetime Earned</span>
            <DollarSign className="w-4 h-4 text-purple-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
            ₹{metrics.totalEarned.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-400 truncate">Total wage accrued</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 truncate">Total Cleared</span>
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-emerald-600 font-mono">
            ₹{metrics.totalPaid.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-emerald-600 font-medium truncate">Disbursed cash & UPI</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-rose-700 truncate">Balance Owed</span>
            <Clock className="w-4 h-4 text-rose-500 shrink-0" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-rose-600 font-mono">
            ₹{metrics.pendingWages.toLocaleString("en-IN")}
          </div>
          <p className="text-[10px] text-slate-400 truncate">Pending disbursement</p>
        </div>
      </div>

      {/* Grid: Profile & Identity Details + Moves History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Left Column: Personnel Information & Credentials */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Personnel & KYC Records</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Joined Organization</span>
              <p className="font-semibold text-slate-800">
                {formatDate(staff.joiningDate || staff.createdAt)}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Government ID Verification</span>
              <div className="flex items-center gap-2 text-slate-800 font-medium">
                <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>
                  {staff.idType || "Aadhaar"}: <strong className="font-mono text-slate-900">{staff.idNumber || "Verified on File"}</strong>
                </span>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Residential Address</span>
              <p className="text-slate-700 leading-relaxed break-words">
                {staff.address || "Local Station Residence, Patna, Bihar"}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Specialization & Skills</span>
              <p className="text-slate-700">
                {staff.specialization || "Standard Relocation Handling"}
              </p>
            </div>

            {staff.notes && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Internal Remarks</span>
                <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 break-words">
                  {staff.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Columns: Relocation Moves Attended History */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Relocation Moves Attended ({movesAttended.length})</span>
              </h3>
              <p className="text-xs text-slate-400">Shift assignments and wage status per relocation job</p>
            </div>
          </div>

          {movesAttended.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs space-y-2">
              <Truck className="w-8 h-8 mx-auto text-slate-300" />
              <p>No move jobs assigned yet.</p>
              <p className="text-[11px] text-slate-400">Allocate this member to active jobs under the "Jobs" dashboard.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {movesAttended.map((move) => {
                const balanceDue = Math.max(0, (Number(move.amountPayable) || 0) - (Number(move.amountPaid) || 0));

                return (
                  <div
                    key={move.id}
                    className="p-3.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 rounded-xl space-y-2.5 transition-all text-xs"
                  >
                    {/* Header Row: Job # and Move Date */}
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

                    {/* Role on move & Job status badges (New row approach!) */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[10px] font-bold uppercase border border-purple-200/60">
                        {move.roleOnJob || staff.role}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          move.jobStatus === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {move.jobStatus?.replace("_", " ")}
                      </span>
                    </div>

                    {/* Customer & Route Pathway (New row approach for unclipped mobile display!) */}
                    <div className="bg-white p-2.5 sm:p-3 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="text-[11px] text-slate-600 font-medium">
                        Customer: <strong className="text-slate-900">{move.customerName}</strong>
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0 ring-2 ring-emerald-100" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">Pickup</span>
                            <span className="text-slate-700 leading-snug break-words">{move.pickupAddress || "Pickup location not specified"}</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500 mt-1 shrink-0 ring-2 ring-blue-100" />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none mb-0.5">Delivery</span>
                            <span className="text-slate-900 font-medium leading-snug break-words">{move.deliveryAddress || "Delivery location not specified"}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Wage Breakdown & Action Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 border-t border-slate-200/60 gap-2">
                      <div className="text-slate-600 text-[11px] flex items-center flex-wrap gap-x-2 gap-y-0.5">
                        <span>
                          Pay: <strong className="text-slate-900 font-mono">₹{move.amountPayable}</strong>
                          <span className="text-slate-400"> ({move.payType === "per_day" ? `₹${move.rateUsed}/d × ${move.daysWorked}d` : "fixed"})</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          Paid: <strong className="text-emerald-700 font-mono">₹{move.amountPaid}</strong>
                        </span>
                        {balanceDue > 0 && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-rose-600 font-semibold">
                              Due: <strong className="font-mono">₹{balanceDue}</strong>
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                            move.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : move.paymentStatus === "partial"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          {move.paymentStatus}
                        </span>

                        {balanceDue > 0 && (
                          <button
                            onClick={() => handleOpenPayModal(move)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer active:scale-95 shadow-xs"
                          >
                            Settle ₹{balanceDue}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Payment History / Disbursement Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-3 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Wage Payment & Disbursement History</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Audit log of all funds disbursed to this team member</p>
          </div>
          <div className="self-start sm:self-auto">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
              Total Disbursed: ₹{metrics.totalPaid.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No wage payments logged yet for this member.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paymentHistory.map((item, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-3 text-xs">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-slate-900 truncate">
                      Payment for {item.jobNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold uppercase">
                      {item.paymentMode || "Cash"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Disbursed on {formatDate(item.paymentDate)}
                    {item.paymentNotes && <span className="text-slate-400"> • {item.paymentNotes}</span>}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-black text-sm text-emerald-600 block">
                    ₹{item.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {item.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Record Wage Payment Modal */}
      {selectedMoveForPay && (
        <div className="fixed inset-0 z-[80] bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 animate-in fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md sm:rounded-2xl sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Disburse Wages: {staff.name}</span>
              </h3>
              <button
                onClick={() => setSelectedMoveForPay(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaySubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
              {payError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {payError}
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="text-slate-500">
                  Move Reference: <strong className="text-slate-900">{selectedMoveForPay.jobNumber}</strong>
                </p>
                <p className="text-slate-500">
                  Allocated Wage: <strong className="text-slate-900 font-mono">₹{selectedMoveForPay.amountPayable}</strong> | Already Paid: <strong className="text-emerald-700 font-mono">₹{selectedMoveForPay.amountPaid}</strong>
                </p>
              </div>

              <FormField label="Disbursement Amount (₹)" required>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="Enter amount to pay"
                  min="1"
                  required
                />
              </FormField>

              <FormField label="Disbursement Mode">
                <Select
                  value={payMode}
                  onChange={(val) => setPayMode(val)}
                  options={[
                    { value: "cash", label: "Cash In Hand" },
                    { value: "upi", label: "UPI Direct Transfer" },
                    { value: "bank_transfer", label: "NEFT / Bank Transfer" },
                  ]}
                />
              </FormField>

              <FormField label="Payment Notes / Voucher Ref">
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  placeholder="e.g. Paid weekly batch settlement"
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMoveForPay(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payingWage}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {payingWage ? "Recording..." : "Confirm & Settle Wage"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[80] bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 animate-in fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <span>Edit Profile: {staff.name}</span>
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
              <FormField label="Full Name" required error={editErrors.name}>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Phone Number" required>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    required
                  />
                </FormField>

                <FormField label="Staff Role">
                  <Select
                    value={editForm.role}
                    onChange={(val) => setEditForm({ ...editForm, role: val })}
                    options={ROLES.map((r) => ({ value: r.value, label: r.label }))}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="Base Daily Rate (₹)">
                  <input
                    type="number"
                    value={editForm.dailyWage}
                    onChange={(e) => setEditForm({ ...editForm, dailyWage: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>

                <FormField label="Joined Date">
                  <input
                    type="date"
                    value={editForm.joiningDate}
                    onChange={(e) => setEditForm({ ...editForm, joiningDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Specialization / Key Skill">
                <input
                  type="text"
                  value={editForm.specialization}
                  onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  placeholder="e.g. Fragile Glassware & Furniture Wrapping"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField label="ID Type">
                  <Select
                    value={editForm.idType}
                    onChange={(val) => setEditForm({ ...editForm, idType: val })}
                    options={[
                      { value: "Aadhaar", label: "Aadhaar Card" },
                      { value: "Driving License", label: "Driving License" },
                      { value: "Voter ID", label: "Voter ID" },
                    ]}
                  />
                </FormField>

                <FormField label="ID Number">
                  <input
                    type="text"
                    value={editForm.idNumber}
                    onChange={(e) => setEditForm({ ...editForm, idNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Residential Address">
                <textarea
                  rows={2}
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </FormField>

              <FormField label="Status">
                <Select
                  value={editForm.status}
                  onChange={(val) => setEditForm({ ...editForm, status: val })}
                  options={[
                    { value: "available", label: "Available" },
                    { value: "on_move", label: "On Move" },
                    { value: "on_leave", label: "On Leave" },
                    { value: "inactive", label: "Inactive" },
                  ]}
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingStaff}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {updatingStaff ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDetail;
