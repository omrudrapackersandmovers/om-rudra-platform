import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  Truck,
  Phone,
  MessageSquare,
  Receipt,
  FileText,
  Calendar,
  MapPin,
  User,
  Users,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  X,
  AlertCircle,
  CreditCard,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  Edit2,
} from "lucide-react";
import {
  useGetJobByIdQuery,
  useUpdateJobMutation,
  useGetJobResourcesQuery,
  useAssignVehiclesToJobMutation,
  useRemoveVehicleFromJobMutation,
  useAssignStaffToJobMutation,
  useRemoveStaffFromJobMutation,
  useUpdateStaffPaymentMutation,
  useAddJobExpenseMutation,
  useDeleteJobExpenseMutation,
  useGetJobProfitQuery,
} from "../../../../store/apiSlices/jobsApiSlice";
import { useGetVehiclesQuery } from "../../../../store/apiSlices/vehiclesApiSlice";
import { useGetStaffQuery } from "../../../../store/apiSlices/staffApiSlice";
import { useGetSettingsQuery } from "../../../../store/apiSlices/settingsApiSlice";
import { FormField } from "../../../../components/FormField";
import { Select } from "../../shared/components/Select";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: job, isLoading: loading } = useGetJobByIdQuery(id);
  const { data: dbSettings } = useGetSettingsQuery();
  const company = dbSettings || {};
  const [updateJob] = useUpdateJobMutation();

  const { data: resources, isLoading: resourcesLoading } = useGetJobResourcesQuery(id);
  const { data: profitSummary } = useGetJobProfitQuery(id);

  const [assignVehicles] = useAssignVehiclesToJobMutation();
  const [removeVehicle] = useRemoveVehicleFromJobMutation();
  const [assignStaff] = useAssignStaffToJobMutation();
  const [removeStaff] = useRemoveStaffFromJobMutation();
  const [updateStaffPayment] = useUpdateStaffPaymentMutation();
  const [addExpense] = useAddJobExpenseMutation();
  const [deleteExpense] = useDeleteJobExpenseMutation();

  // Modals
  const [isAssignVehicleModalOpen, setIsAssignVehicleModalOpen] = useState(false);
  const [isAssignStaffModalOpen, setIsAssignStaffModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isStaffPayModalOpen, setIsStaffPayModalOpen] = useState(null); // staff record
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

  // Assignment states
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [vehicleDriverName, setVehicleDriverName] = useState("");
  const [vehicleDriverPhone, setVehicleDriverPhone] = useState("");

  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [staffRoleOnJob, setStaffRoleOnJob] = useState("");
  const [staffPayType, setStaffPayType] = useState("per_job");
  const [staffRate, setStaffRate] = useState(800);

  // Expense form
  const [expenseCategory, setExpenseCategory] = useState("fuel");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");

  // Staff Payment Modal state
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState("cash");
  const [payDays, setPayDays] = useState(1);
  const [payNotes, setPayNotes] = useState("");

  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    scheduledDate: "",
    scheduledTime: "08:00 AM",
    specialNotes: "",
  });

  // Available resources queries filtered by job date
  const { data: availableVehicles = [] } = useGetVehiclesQuery(
    { date: job?.scheduledDate },
    { skip: !job?.scheduledDate }
  );
  const { data: availableStaff = [] } = useGetStaffQuery(
    { date: job?.scheduledDate },
    { skip: !job?.scheduledDate }
  );
  const { data: allVehicles = [] } = useGetVehiclesQuery({});
  const { data: allStaff = [] } = useGetStaffQuery({});

  const handleOpenEditSchedule = () => {
    setScheduleForm({
      scheduledDate: job?.scheduledDate || "",
      scheduledTime: job?.scheduledTime || "08:00 AM",
      specialNotes: job?.specialNotes || "",
    });
    setIsEditScheduleOpen(true);
  };

  const handleUpdateScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJob({
        id,
        scheduledDate: scheduleForm.scheduledDate,
        scheduledTime: scheduleForm.scheduledTime,
        specialNotes: scheduleForm.specialNotes,
      }).unwrap();
      setIsEditScheduleOpen(false);
    } catch (err) {
      alert("Failed to update schedule: " + (err.data?.error || err.message));
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === "cancelled") {
      setIsCancelConfirmOpen(true);
      return;
    }
    try {
      await updateJob({ id, status: newStatus }).unwrap();
    } catch (err) {
      alert("Failed to update status: " + (err.data?.error || err.message));
    }
  };

  const handleConfirmCancel = async () => {
    try {
      await updateJob({ id, status: "cancelled" }).unwrap();
      setIsCancelConfirmOpen(false);
    } catch (err) {
      alert("Failed to cancel job: " + (err.data?.error || err.message));
    }
  };

  const handleAssignVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedVehicleId) return;
    try {
      await assignVehicles({
        jobId: id,
        vehicles: [
          {
            vehicleId: Number(selectedVehicleId),
            driverName: vehicleDriverName,
            driverPhone: vehicleDriverPhone,
            role: "primary",
          },
        ],
      }).unwrap();
      setIsAssignVehicleModalOpen(false);
      setSelectedVehicleId("");
      setVehicleDriverName("");
      setVehicleDriverPhone("");
    } catch (err) {
      alert("Failed to assign vehicle: " + (err.data?.error || err.message));
    }
  };

  const handleAssignStaffSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    try {
      await assignStaff({
        jobId: id,
        staff: [
          {
            staffId: Number(selectedStaffId),
            roleOnJob: staffRoleOnJob,
            payType: staffPayType,
            rateUsed: Number(staffRate) || 0,
            daysWorked: 1,
          },
        ],
      }).unwrap();
      setIsAssignStaffModalOpen(false);
      setSelectedStaffId("");
      setStaffRoleOnJob("");
    } catch (err) {
      alert("Failed to assign staff: " + (err.data?.error || err.message));
    }
  };

  const handleAddExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expenseAmount || Number(expenseAmount) <= 0) return;
    try {
      await addExpense({
        jobId: id,
        category: expenseCategory,
        amount: Number(expenseAmount),
        description: expenseDesc,
      }).unwrap();
      setIsExpenseModalOpen(false);
      setExpenseAmount("");
      setExpenseDesc("");
    } catch (err) {
      alert("Failed to add expense: " + (err.data?.error || err.message));
    }
  };

  const handleStaffPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!isStaffPayModalOpen) return;
    try {
      await updateStaffPayment({
        jobId: id,
        staffId: isStaffPayModalOpen.staffId,
        daysWorked: Number(payDays) || 1,
        amountPaid: Number(payAmount) || 0,
        paymentMode: payMode,
        paymentNotes: payNotes,
      }).unwrap();
      setIsStaffPayModalOpen(null);
    } catch (err) {
      alert("Failed to record staff pay: " + (err.data?.error || err.message));
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-400 text-sm">Loading job...</div>;
  }

  if (!job) {
    return <div className="text-center py-12 text-rose-500 text-sm">Job not found.</div>;
  }

  const reviewMessage = `*Thank you for moving with ${company.name || "Om Rudra Packers and Movers"}!*
Dear ${job.customerName}, we hope your relocation to ${job.deliveryAddress} went smoothly.
Could you please take 30 seconds to leave us a 5-star review on Google?
👉 ${company.website || "https://omrudrapackersandmovers.com"}`;

  const dispatchMessage = `*Relocation Update from ${company.name || "Om Rudra Packers and Movers"}*
Dear ${job.customerName}, your moving crew and transport has been dispatched!
Vehicle: ${job.vehicleAssigned || "Assigned Transport"}
Driver: ${job.driverName || "Our Staff"} (${job.driverPhone || company.phone || "+91 7033488691"})
Scheduled Date: ${job.scheduledDate} ${job.scheduledTime ? `at ${job.scheduledTime}` : ""}`;

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Bar with Relational Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <button
            onClick={() => navigate("/jobs")}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Jobs</span>
          </button>

          {job.leadId && (
            <Link
              to={`/leads/${job.leadId}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-semibold transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Lead #{job.leadId}</span>
            </Link>
          )}

          {job.quoteId && (
            <Link
              to={`/quotes/${job.quoteId}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Quote #{job.quoteId}</span>
            </Link>
          )}

          <span className="font-mono text-slate-400 font-bold">•</span>
          <span className="font-mono font-bold text-slate-900">{job.jobNumber}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <button
            onClick={() =>
              navigate(
                `/invoices/new?jobId=${job.id}&name=${encodeURIComponent(
                  job.customerName
                )}&phone=${encodeURIComponent(
                  job.customerPhone
                )}&pickup=${encodeURIComponent(
                  job.pickupAddress
                )}&delivery=${encodeURIComponent(job.deliveryAddress)}`
              )
            }
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            <span>Generate Tax Bill</span>
          </button>

          <button
            onClick={() =>
              navigate(
                `/bilties/new?jobId=${job.id}&consignor=${encodeURIComponent(
                  job.customerName
                )}&consignorPhone=${encodeURIComponent(
                  job.customerPhone
                )}&pickup=${encodeURIComponent(
                  job.pickupAddress
                )}&consignee=${encodeURIComponent(
                  job.customerName
                )}&consigneePhone=${encodeURIComponent(
                  job.customerPhone
                )}&delivery=${encodeURIComponent(
                  job.deliveryAddress
                )}&truck=${encodeURIComponent(
                  job.vehicleAssigned || ""
                )}&driver=${encodeURIComponent(
                  job.driverName || ""
                )}&driverPhone=${encodeURIComponent(job.driverPhone || "")}`
              )
            }
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Bilty (LR)</span>
          </button>
        </div>
      </div>

      {/* Main Job Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-mono text-xs font-bold text-blue-600">
              {job.jobNumber}
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-tight">
              {job.customerName}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">+91 {job.customerPhone}</p>
          </div>

          <div className="text-right">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase ${
              job.status === "completed"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : job.status === "in_progress"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : job.status === "cancelled"
                ? "bg-rose-50 text-rose-700 border border-rose-200"
                : "bg-slate-100 text-slate-700"
            }`}>
              {job.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Status Switcher Bar */}
        <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-xs flex-wrap gap-2">
          <span className="font-semibold text-slate-700">Move Lifecycle:</span>
          <div className="flex flex-wrap gap-1.5">
            {["scheduled", "in_progress", "completed", "cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium text-xs transition-colors cursor-pointer ${
                  job.status === st
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Route Details */}
        <div className="border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs bg-slate-50/50">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Route & Addresses
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Pickup:</span> {job.pickupAddress}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900">Delivery:</span> {job.deliveryAddress}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-slate-50 p-3.5 rounded-xl text-xs space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Scheduled Date: <strong className="text-slate-900">{job.scheduledDate}</strong>{" "}
                {job.scheduledTime && <span className="text-slate-500">({job.scheduledTime})</span>}
              </span>
            </div>
            <button
              onClick={handleOpenEditSchedule}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
            >
              <Edit2 className="w-3 h-3 text-blue-600" />
              <span>Edit Schedule</span>
            </button>
          </div>
          {job.specialNotes && (
            <div className="text-amber-800 bg-amber-50 px-3 py-2 rounded-lg text-[11px] font-medium border border-amber-200/80 leading-relaxed">
              <span className="font-bold">Special Note:</span> {job.specialNotes}
            </div>
          )}
        </div>
      </div>

      {/* OPERATIONS & RESOURCE MANAGEMENT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Allocated Vehicles Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 sm:pb-0">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Assigned Fleet Vehicles</span>
            </h3>
            <button
              onClick={() => setIsAssignVehicleModalOpen(true)}
              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Vehicle</span>
            </button>
          </div>

          {resources?.vehicles && resources.vehicles.length > 0 ? (
            <div className="space-y-2">
              {resources.vehicles.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-xl text-xs bg-slate-50/50"
                >
                  <div>
                    <div className="font-bold text-slate-900 font-mono">{v.vehicleNumber}</div>
                    <div className="text-slate-500 text-[11px]">{v.vehicleType}</div>
                    {v.driverName && (
                      <div className="text-slate-600 text-[11px] mt-0.5">
                        Driver: {v.driverName} {v.driverPhone && `(${v.driverPhone})`}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeVehicle({ jobId: id, vehicleId: v.vehicleId })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove vehicle"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              No fleet vehicles assigned yet. Click "Assign Vehicle" to allocate from available fleet.
            </div>
          )}
        </div>

        {/* Assigned Staff & Crew Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 sm:pb-0">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Assigned Crew & Payroll</span>
            </h3>
            <button
              onClick={() => setIsAssignStaffModalOpen(true)}
              className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Staff</span>
            </button>
          </div>

          {resources?.staff && resources.staff.length > 0 ? (
            <div className="space-y-2">
              {resources.staff.map((s) => (
                <div
                  key={s.id}
                  className="flex items-start justify-between p-3 border border-slate-200 rounded-xl text-xs bg-slate-50/50 gap-2"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-slate-900">{s.name}</span>
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium uppercase">
                        {s.roleOnJob || s.role}
                      </span>
                    </div>
                    <div className="text-slate-500 font-mono text-[11px]">
                      Pay: ₹{s.amountPayable} ({s.payType === "per_day" ? `₹${s.rateUsed}/day × ${s.daysWorked}d` : "fixed"})
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          s.paymentStatus === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : s.paymentStatus === "partial"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {s.paymentStatus.toUpperCase()} (Paid: ₹{s.amountPaid})
                      </span>
                      <button
                        onClick={() => {
                          setIsStaffPayModalOpen(s);
                          setPayAmount((s.amountPayable - s.amountPaid).toString());
                          setPayDays(s.daysWorked || 1);
                        }}
                        className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer py-0.5"
                      >
                        Update Pay
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeStaff({ jobId: id, staffId: s.staffId })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                    title="Remove staff"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              No staff assigned yet. Click "Assign Staff" to allocate packers/loaders.
            </div>
          )}
        </div>
      </div>

      {/* JOB EXPENSES & NET PROFIT SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Expenses Panel */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 sm:pb-0">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Job Expenses (Fuel, Toll, Repairs)</span>
            </h3>
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Expense</span>
            </button>
          </div>

          {resources?.expenses && resources.expenses.length > 0 ? (
            <div className="space-y-2">
              {resources.expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50"
                >
                  <div>
                    <span className="font-semibold text-slate-800 capitalize">{exp.category.replace("_", " ")}: </span>
                    <span className="font-mono font-bold text-rose-600">₹{exp.amount}</span>
                    {exp.description && <span className="text-slate-500 text-[11px] block">{exp.description}</span>}
                  </div>
                  <button
                    onClick={() => deleteExpense({ jobId: id, expenseId: exp.id })}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 px-4 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400">
              No operational expenses logged yet.
            </div>
          )}
        </div>

        {/* Net Profit Summary Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Job Profitability Overview</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Calculated net margin for this move</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Billed Revenue (Invoices):</span>
              <span className="font-mono font-bold">₹{(profitSummary?.invoiceTotal || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>− Staff Labor Wages:</span>
              <span className="font-mono">₹{(profitSummary?.staffCost || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>− Highway & Transit Expenses:</span>
              <span className="font-mono">₹{(profitSummary?.expenseCost || 0).toLocaleString("en-IN")}</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Estimated Net Profit:</span>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-400 font-mono">
                  ₹{(profitSummary?.netProfit || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Margin: {profitSummary?.marginPercent || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Tap Customer WhatsApp Communication Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          1-Tap WhatsApp Customer Updates:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <a
            href={`https://wa.me/91${job.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              dispatchMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors text-center"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Send Truck Dispatch Update</span>
          </a>

          <a
            href={`https://wa.me/91${job.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
              reviewMessage
            )}`}
            target="_blank"
            rel="noreferrer"
            className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors text-center"
          >
            <CheckCircle className="w-4 h-4 text-blue-600" />
            <span>Send Completion & Review Request</span>
          </a>
        </div>
      </div>

      {/* MODAL: Assign Vehicle */}
      {isAssignVehicleModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Assign Fleet Vehicle</span>
              </h3>
              <button onClick={() => setIsAssignVehicleModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignVehicleSubmit} className="space-y-3.5 text-xs">
              <FormField label="Select Available Vehicle" required>
                {allVehicles.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    No vehicles found in Fleet directory. Please add vehicles under <strong>Fleet</strong> in the sidebar first.
                  </div>
                ) : (
                  <Select
                    required
                    value={selectedVehicleId}
                    placeholder="-- Choose Vehicle --"
                    onChange={(e) => {
                      setSelectedVehicleId(e.target.value);
                      const v = (availableVehicles.length > 0 ? availableVehicles : allVehicles).find(
                        (item) => item.id.toString() === e.target.value
                      );
                      if (v) {
                        setVehicleDriverName(v.defaultDriverName || "");
                        setVehicleDriverPhone(v.defaultDriverPhone || "");
                      }
                    }}
                    buttonClassName="bg-white border-slate-300"
                  >
                    <option value="">-- Choose Vehicle --</option>
                    {(availableVehicles.length > 0 ? availableVehicles : allVehicles)
                      .filter((v) => v.status !== "retired")
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.vehicleNumber} ({v.vehicleType}) {v.capacityCft ? `- ${v.capacityCft} CFT` : ""} [{v.status}]
                        </option>
                      ))}
                  </Select>
                )}
              </FormField>

              <FormField label="Assigned Driver Name">
                <input
                  type="text"
                  value={vehicleDriverName}
                  onChange={(e) => setVehicleDriverName(e.target.value)}
                  placeholder="Driver full name"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Assigned Driver Phone">
                <input
                  type="tel"
                  maxLength={10}
                  value={vehicleDriverPhone}
                  onChange={(e) => setVehicleDriverPhone(e.target.value)}
                  placeholder="10-digit phone"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl cursor-pointer"
              >
                Allocate Vehicle to Move
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Assign Staff */}
      {isAssignStaffModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span>Assign Staff Member</span>
              </h3>
              <button onClick={() => setIsAssignStaffModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignStaffSubmit} className="space-y-3.5 text-xs">
              <FormField label="Select Team Member" required>
                {allStaff.length === 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                    No crew members found in Team directory. Please add personnel under <strong>Team</strong> in the sidebar first.
                  </div>
                ) : (
                  <Select
                    required
                    value={selectedStaffId}
                    placeholder="-- Choose Member --"
                    onChange={(e) => {
                      setSelectedStaffId(e.target.value);
                      const s = (availableStaff.length > 0 ? availableStaff : allStaff).find(
                        (item) => item.id.toString() === e.target.value
                      );
                      if (s) {
                        setStaffRoleOnJob(s.role);
                        if (s.dailyWage) setStaffRate(s.dailyWage);
                      }
                    }}
                    buttonClassName="bg-white border-slate-300"
                  >
                    <option value="">-- Choose Member --</option>
                    {(availableStaff.length > 0 ? availableStaff : allStaff)
                      .filter((s) => s.status !== "inactive")
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} - {s.role} {s.specialization ? `(${s.specialization})` : ""} [{s.status}]
                        </option>
                      ))}
                  </Select>
                )}
              </FormField>

              <FormField label="Role on This Move">
                <input
                  type="text"
                  value={staffRoleOnJob}
                  onChange={(e) => setStaffRoleOnJob(e.target.value)}
                  placeholder="e.g. Lead Packer, Helper"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Payment Type">
                  <Select
                    value={staffPayType}
                    onChange={(e) => setStaffPayType(e.target.value)}
                    buttonClassName="bg-white border-slate-300"
                  >
                    <option value="per_job">Fixed per Move</option>
                    <option value="per_day">Daily Rate</option>
                  </Select>
                </FormField>

                <FormField label="Rate (₹)">
                  <input
                    type="number"
                    min="0"
                    value={staffRate}
                    onChange={(e) => setStaffRate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl cursor-pointer"
              >
                Assign Staff to Crew
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Expense */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-rose-500" />
                <span>Add Move Operational Expense</span>
              </h3>
              <button onClick={() => setIsExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-3.5 text-xs">
              <FormField label="Expense Category" required>
                <Select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  buttonClassName="bg-white border-slate-300"
                >
                  <option value="fuel">Fuel / Diesel</option>
                  <option value="toll">Highway Toll Taxes</option>
                  <option value="helper_extra">Extra Labor / Daily Help</option>
                  <option value="vehicle_repair">Puncture / Minor Vehicle Maintenance</option>
                  <option value="misc">Miscellaneous</option>
                </Select>
              </FormField>

              <FormField label="Amount (₹)" required>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="e.g. 1200"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Description / Receipt Note">
                <input
                  type="text"
                  value={expenseDesc}
                  onChange={(e) => setExpenseDesc(e.target.value)}
                  placeholder="e.g. Highway toll slip at Ranchi exit"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm rounded-xl cursor-pointer"
              >
                Record Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Update Staff Payment */}
      {isStaffPayModalOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>Record Wages: {isStaffPayModalOpen.name}</span>
              </h3>
              <button onClick={() => setIsStaffPayModalOpen(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStaffPaymentSubmit} className="space-y-3.5 text-xs">
              {isStaffPayModalOpen.payType === "per_day" && (
                <FormField label="Days Worked">
                  <input
                    type="number"
                    min="1"
                    value={payDays}
                    onChange={(e) => {
                      setPayDays(e.target.value);
                      const totalPayable = (isStaffPayModalOpen.rateUsed || 0) * Number(e.target.value);
                      setPayAmount((totalPayable - isStaffPayModalOpen.amountPaid).toString());
                    }}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                  />
                </FormField>
              )}

              <FormField label="Amount to Pay (₹)" required>
                <input
                  type="number"
                  min="0"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Payment Mode">
                <Select
                  value={payMode}
                  onChange={(e) => setPayMode(e.target.value)}
                  buttonClassName="bg-white border-slate-300"
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI / GPay</option>
                  <option value="bank">Bank Transfer</option>
                </Select>
              </FormField>

              <FormField label="Notes">
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Paid in cash at end of move"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl cursor-pointer"
              >
                Record Staff Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Job Schedule */}
      {isEditScheduleOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Update Job Schedule</span>
              </h3>
              <button onClick={() => setIsEditScheduleOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateScheduleSubmit} className="space-y-3.5 text-xs">
              <FormField label="Scheduled Moving Date" required>
                <input
                  type="date"
                  required
                  value={scheduleForm.scheduledDate}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <FormField label="Preferred Time Slot">
                <Select
                  value={scheduleForm.scheduledTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledTime: e.target.value })}
                  buttonClassName="bg-white border-slate-300"
                >
                  {["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </Select>
              </FormField>

              <FormField label="Special Handling Notes">
                <textarea
                  rows={2}
                  value={scheduleForm.specialNotes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, specialNotes: e.target.value })}
                  placeholder="e.g. Fragile glassware, lift not working on 3rd floor"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-500 outline-none"
                />
              </FormField>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditScheduleOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Cancel Move Confirmation */}
      {isCancelConfirmOpen && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl p-4 sm:p-6 space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 bg-rose-50 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Cancel Active Move Job?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to mark this job as <strong>Cancelled</strong>? All assigned fleet vehicles and crew members will be immediately released back to available pool.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCancelConfirmOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                Keep Active
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl cursor-pointer"
              >
                Yes, Cancel Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetail;
