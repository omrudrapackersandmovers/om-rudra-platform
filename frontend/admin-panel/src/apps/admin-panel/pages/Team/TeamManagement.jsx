import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Users,
  Plus,
  Phone,
  Search,
  RotateCcw,
  Edit2,
  Trash2,
  X,
  AlertCircle,
  Loader2,
  Shield,
  Briefcase,
  UserCheck,
  CheckCircle2,
  Clock,
  UserX,
  ChevronRight,
} from "lucide-react";
import { useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStaffMutation,
  useDeleteStaffMutation,
} from "../../../../store/apiSlices/staffApiSlice";
import { FormField } from "../../../../components/FormField";
import { CardGridSkeleton } from "../../shared/components/Skeleton";
import { Select } from "../../shared/components/Select";

const ROLES = [
  { value: "driver", label: "Driver", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "supervisor", label: "Supervisor", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "packer", label: "Packer (Specialist)", color: "bg-teal-50 text-teal-700 border-teal-200" },
  { value: "loader", label: "Loader", color: "bg-amber-50 text-amber-800 border-amber-200" },
  { value: "helper", label: "Helper", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

const TeamManagement = () => {
  const navigate = useNavigate();
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: staffList = [], isLoading, isFetching, refetch } = useGetStaffQuery({});
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

  const [addStaff, { isLoading: adding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: updating }] = useUpdateStaffMutation();
  const [deleteStaff] = useDeleteStaffMutation();

  const [confirmTarget, setConfirmTarget] = useState(null); // staff member to confirm-delete
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteStaff = (s) => {
    setDeleteError("");
    setConfirmTarget(s);
  };

  const handleConfirmDelete = async () => {
    if (!confirmTarget) return;
    try {
      await deleteStaff(confirmTarget.id).unwrap();
      setConfirmTarget(null);
    } catch (err) {
      setDeleteError(err.data?.error || err.message || "Failed to remove team member");
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
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

  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setForm({
      name: "",
      phone: "",
      role: "loader",
      specialization: "",
      status: "available",
      idType: "Aadhaar",
      idNumber: "",
      address: "",
      dailyWage: 600,
      joiningDate: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s) => {
    setEditingStaff(s);
    setForm({
      name: s.name,
      phone: s.phone,
      role: s.role,
      specialization: s.specialization || "",
      status: s.status || "available",
      idType: s.idType || "Aadhaar",
      idNumber: s.idNumber || "",
      address: s.address || "",
      dailyWage: s.dailyWage || "",
      joiningDate: s.joiningDate || "",
      notes: s.notes || "",
    });
    setFormErrors({});
    setSubmitError("");
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Staff name is required";
    if (!form.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone.trim())) {
      errs.phone = "Enter a 10-digit mobile number";
    }
    if (!form.role) errs.role = "Role is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    try {
      if (editingStaff) {
        await updateStaff({ id: editingStaff.id, ...form }).unwrap();
      } else {
        await addStaff(form).unwrap();
      }
      setIsModalOpen(false);
    } catch (err) {
      setSubmitError(err.data?.error || err.message || "Failed to save team member");
    }
  };

  const filteredStaff = staffList.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      (s.specialization && s.specialization.toLowerCase().includes(q));
    const matchesRole = roleFilter === "all" || s.role === roleFilter;
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalCrew = staffList.length;
  const availableCount = staffList.filter((s) => s.status === "available").length;
  const onMoveCount = staffList.filter((s) => s.status === "on_move").length;
  const onLeaveCount = staffList.filter((s) => s.status === "on_leave").length;

  const driverCount = staffList.filter((s) => s.role === "driver").length;
  const supervisorCount = staffList.filter((s) => s.role === "supervisor").length;
  const packerCount = staffList.filter((s) => s.role === "packer").length;
  const loaderCount = staffList.filter((s) => s.role === "loader").length;
  const helperCount = staffList.filter((s) => s.role === "helper").length;

  return (
    <div className="space-y-6 pb-12">
      {/* Action Row */}
      <div className="flex items-center justify-end gap-2 sm:gap-2.5">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 hover:text-blue-600 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-70"
          title="Refresh & sync staff"
          aria-label="Refresh & sync staff"
        >
          <RotateCcw className={`w-4 h-4 ${isSyncing || isFetching ? "animate-spin text-blue-600" : ""}`} />
        </button>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">Total Crew</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-slate-900 mt-2 font-mono truncate">{totalCrew}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Drivers, packers & staff</p>
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
            {totalCrew > 0 ? `${Math.round((availableCount / totalCrew) * 100)}% Ready` : "Ready for jobs"}
          </p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">On Move Jobs</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-blue-600 mt-2 font-mono truncate">{onMoveCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Deployed on moves</p>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider truncate">On Leave</span>
            <span className="p-1.5 sm:p-2 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <UserX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-black text-amber-600 mt-2 font-mono truncate">{onLeaveCount}</p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate">Excused absence</p>
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
            placeholder="Search by crew member name, phone, or specialization..."
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

        {/* Filter Tabs by Role */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: "all", label: "All Crew", count: totalCrew },
            { id: "driver", label: "Drivers", count: driverCount },
            { id: "supervisor", label: "Supervisors", count: supervisorCount },
            { id: "packer", label: "Packers", count: packerCount },
            { id: "loader", label: "Loaders", count: loaderCount },
            { id: "helper", label: "Helpers", count: helperCount },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                roleFilter === tab.id
                  ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 border-slate-200/70"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                  roleFilter === tab.id
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

      {/* Staff Cards Grid */}
      {isLoading || isFetching || isSyncing ? (
        <CardGridSkeleton count={6} />
      ) : filteredStaff.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-3">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No crew members found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {searchQuery
              ? `No personnel match "${searchQuery}".`
              : "No team members found in this category. Click \"Add Team Member\" to add drivers, packers, and supervisors."}
          </p>
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Member</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((s) => {
            const roleConfig = ROLES.find((r) => r.value === s.role) || {
              label: s.role,
              color: "bg-slate-100 text-slate-700 border-slate-200",
            };

            return (
              <div
                key={s.id}
                onClick={() => navigate(`/team/${s.id}`)}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-3.5 flex flex-col justify-between hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 leading-tight group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                        <span>{s.name}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all opacity-0 group-hover:opacity-100" />
                      </h3>
                      <a
                        href={`tel:${s.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs font-mono text-slate-500 hover:text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>+91 {s.phone}</span>
                      </a>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${roleConfig.color}`}
                    >
                      {roleConfig.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        s.status === "available"
                          ? "bg-emerald-50 text-emerald-700"
                          : s.status === "on_move"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {s.status.replace("_", " ")}
                    </span>
                    {s.dailyWage && (
                      <span className="font-mono text-slate-500 font-medium">
                        ₹{s.dailyWage}/day base rate
                      </span>
                    )}
                  </div>

                  {s.specialization && (
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Specialty: {s.specialization}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-700 flex items-center gap-1">
                    <span>View Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModal(s);
                      }}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium flex items-center gap-1 cursor-pointer transition-colors"
                      title="Edit Member"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStaff(s);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Staff Modal (Full screen on mobile, elegant dialog on desktop) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[70] bg-white sm:bg-slate-900/60 sm:backdrop-blur-xs flex flex-col sm:items-center sm:justify-center sm:p-4 animate-in fade-in">
          <div className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-lg sm:rounded-2xl flex flex-col sm:shadow-2xl sm:border sm:border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0 bg-white">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{editingStaff ? "Edit Team Member" : "Add Team Member"}</span>
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
                <FormField label="Full Name" required error={formErrors.name}>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Raju Yadav"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-600 outline-none"
                  />
                </FormField>

                <FormField label="Phone Number" required error={formErrors.phone}>
                  <input
                    type="tel"
                    maxLength={10}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-600 outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Primary Role" required error={formErrors.role}>
                  <Select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    buttonClassName="bg-white border-slate-300"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Status">
                  <Select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    buttonClassName="bg-white border-slate-300"
                  >
                    <option value="available">Available</option>
                    <option value="on_move">On Move</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Specialization / Skill">
                  <input
                    type="text"
                    value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                    placeholder="e.g. Fragile glassware packing"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-600 outline-none"
                  />
                </FormField>

                <FormField label="Daily Base Wage (₹)">
                  <input
                    type="number"
                    min="0"
                    value={form.dailyWage}
                    onChange={(e) => setForm({ ...form, dailyWage: e.target.value })}
                    placeholder="e.g. 700"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-600 outline-none"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField label="Govt ID Document">
                  <Select
                    value={form.idType}
                    onChange={(e) => setForm({ ...form, idType: e.target.value })}
                    buttonClassName="bg-white border-slate-300"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="Driving License">Driving License</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                  </Select>
                </FormField>

                <FormField label="ID Number">
                  <input
                    type="text"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                    placeholder="e.g. 12-digit Aadhaar / DL #"
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:border-blue-600 outline-none"
                  />
                </FormField>
              </div>

              <FormField label="Residential Address">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="Local address"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-600 outline-none"
                />
              </FormField>

              <FormField label="Notes & Background Check">
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="e.g. Police verification completed, reliable loader, 5+ yrs experience..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:border-blue-600 focus:bg-white outline-none resize-none"
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
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 text-center shadow-xs shadow-blue-500/20 active:scale-98"
              >
                {adding || updating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Team Member...</span>
                  </>
                ) : (
                  <span>{editingStaff ? "Update Member Record" : "Save Team Member"}</span>
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
                <UserX className="w-5 h-5 text-rose-600" />
              </div>
              <h2 className="font-bold text-slate-800 text-base">Remove Team Member?</h2>
            </div>
            <p className="text-slate-600 text-sm mb-1">
              Are you sure you want to mark{" "}
              <span className="font-semibold text-slate-900">{confirmTarget.name}</span> as inactive?
            </p>
            <p className="text-slate-500 text-xs mb-4">They will be removed from active assignments. Their records will be retained.</p>
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
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
