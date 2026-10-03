import { eq, desc, and, notInArray, sql } from "drizzle-orm";
import { getDb } from "../db/client";
import {
  vehicles,
  staff,
  jobVehicles,
  jobStaff,
  jobExpenses,
  jobs,
  quotations,
  invoices,
  bilties,
  leads,
  invoicePayments,
} from "../db/schema";
import { Bindings } from "../types";

// ================= VEHICLES ================= //

export const getAllVehicles = async (
  env: Bindings,
  filter?: { status?: string; date?: string }
) => {
  const db = getDb(env.DB);
  let busyVehicleIds: number[] = [];

  if (filter?.date) {
    // Find all vehicles on jobs scheduled for this date that are not cancelled
    const busyJobs = await db
      .select({ vehicleId: jobVehicles.vehicleId })
      .from(jobVehicles)
      .innerJoin(jobs, eq(jobVehicles.jobId, jobs.id))
      .where(and(eq(jobs.scheduledDate, filter.date), sql`${jobs.status} != 'cancelled'`));

    busyVehicleIds = busyJobs.map((j) => j.vehicleId);
  }

  const query = db.select().from(vehicles);
  const results = await query.orderBy(desc(vehicles.createdAt));

  return results.map((v) => {
    const isBusyOnDate = busyVehicleIds.includes(v.id);
    return {
      ...v,
      isAvailableOnDate: filter?.date ? !isBusyOnDate && v.status === "available" : true,
    };
  });
};

export const getVehicleById = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const result = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  return result[0] || null;
};

export const getVehicleProfile = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const vehicleRow = await db.select().from(vehicles).where(eq(vehicles.id, id)).limit(1);
  if (!vehicleRow[0]) return null;

  const vehicle = vehicleRow[0];

  // All jobs this vehicle was assigned to
  const assignments = await db
    .select({
      id: jobVehicles.id,
      jobId: jobVehicles.jobId,
      vehicleId: jobVehicles.vehicleId,
      driverName: jobVehicles.driverName,
      driverPhone: jobVehicles.driverPhone,
      role: jobVehicles.role,
      createdAt: jobVehicles.createdAt,
      jobNumber: jobs.jobNumber,
      customerName: jobs.customerName,
      customerPhone: jobs.customerPhone,
      pickupAddress: jobs.pickupAddress,
      deliveryAddress: jobs.deliveryAddress,
      scheduledDate: jobs.scheduledDate,
      scheduledTime: jobs.scheduledTime,
      jobStatus: jobs.status,
    })
    .from(jobVehicles)
    .innerJoin(jobs, eq(jobVehicles.jobId, jobs.id))
    .where(eq(jobVehicles.vehicleId, id))
    .orderBy(desc(jobs.scheduledDate), desc(jobVehicles.createdAt));

  // All expenses incurred on jobs where this vehicle was used
  const jobIds = [...new Set(assignments.map((a) => a.jobId))];
  let expenseRows: Array<{
    id: number;
    jobId: number;
    jobNumber: string;
    category: string;
    amount: number;
    description: string | null;
    paidBy: string | null;
    receiptNote: string | null;
    createdAt: string;
  }> = [];

  if (jobIds.length > 0) {
    const rawExpenses = await db
      .select({
        id: jobExpenses.id,
        jobId: jobExpenses.jobId,
        category: jobExpenses.category,
        amount: jobExpenses.amount,
        description: jobExpenses.description,
        paidBy: jobExpenses.paidBy,
        receiptNote: jobExpenses.receiptNote,
        createdAt: jobExpenses.createdAt,
        jobNumber: jobs.jobNumber,
      })
      .from(jobExpenses)
      .innerJoin(jobs, eq(jobExpenses.jobId, jobs.id))
      .where(sql`${jobExpenses.jobId} IN (${sql.join(jobIds.map((jid) => sql`${jid}`), sql`, `)})`)
      .orderBy(desc(jobExpenses.createdAt));

    expenseRows = rawExpenses;
  }

  // Aggregate metrics
  const totalMovesCompleted = assignments.filter((a) => a.jobStatus === "completed").length;
  const totalMovesAttended = assignments.length;
  const totalFuelCost = expenseRows
    .filter((e) => e.category === "fuel")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalTollCost = expenseRows
    .filter((e) => e.category === "toll")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalRepairCost = expenseRows
    .filter((e) => e.category === "vehicle_repair")
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalExpenses = expenseRows.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Compliance check
  const now = new Date();
  const daysUntil = (dateStr: string | null | undefined) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const complianceStatus = {
    insurance: {
      expiry: vehicle.insuranceExpiry,
      daysLeft: daysUntil(vehicle.insuranceExpiry),
      status:
        !vehicle.insuranceExpiry
          ? "unknown"
          : (daysUntil(vehicle.insuranceExpiry) ?? 0) <= 0
          ? "expired"
          : (daysUntil(vehicle.insuranceExpiry) ?? 0) <= 30
          ? "critical"
          : (daysUntil(vehicle.insuranceExpiry) ?? 0) <= 90
          ? "warning"
          : "ok",
    },
    fitness: {
      expiry: vehicle.fitnessExpiry,
      daysLeft: daysUntil(vehicle.fitnessExpiry),
      status:
        !vehicle.fitnessExpiry
          ? "unknown"
          : (daysUntil(vehicle.fitnessExpiry) ?? 0) <= 0
          ? "expired"
          : (daysUntil(vehicle.fitnessExpiry) ?? 0) <= 30
          ? "critical"
          : (daysUntil(vehicle.fitnessExpiry) ?? 0) <= 90
          ? "warning"
          : "ok",
    },
    permit: {
      expiry: vehicle.permitExpiry,
      daysLeft: daysUntil(vehicle.permitExpiry),
      status:
        !vehicle.permitExpiry
          ? "unknown"
          : (daysUntil(vehicle.permitExpiry) ?? 0) <= 0
          ? "expired"
          : (daysUntil(vehicle.permitExpiry) ?? 0) <= 30
          ? "critical"
          : (daysUntil(vehicle.permitExpiry) ?? 0) <= 90
          ? "warning"
          : "ok",
    },
  };

  return {
    vehicle,
    metrics: {
      totalMovesAttended,
      totalMovesCompleted,
      totalFuelCost,
      totalTollCost,
      totalRepairCost,
      totalExpenses,
    },
    movesAttended: assignments,
    expenseHistory: expenseRows,
    complianceStatus,
  };
};

export const createVehicle = async (env: Bindings, data: any) => {
  const db = getDb(env.DB);
  const inserted = await db
    .insert(vehicles)
    .values({
      vehicleNumber: data.vehicleNumber.toUpperCase().trim(),
      vehicleType: data.vehicleType,
      capacityTons: data.capacityTons ? Number(data.capacityTons) : null,
      capacityCft: data.capacityCft ? Number(data.capacityCft) : null,
      defaultDriverName: data.defaultDriverName || null,
      defaultDriverPhone: data.defaultDriverPhone || null,
      status: data.status || "available",
      insuranceExpiry: data.insuranceExpiry || null,
      fitnessExpiry: data.fitnessExpiry || null,
      permitExpiry: data.permitExpiry || null,
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    })
    .returning();
  return inserted[0];
};

export const updateVehicle = async (env: Bindings, id: number, data: any) => {
  const db = getDb(env.DB);
  const updated = await db
    .update(vehicles)
    .set({
      ...(data.vehicleNumber ? { vehicleNumber: data.vehicleNumber.toUpperCase().trim() } : {}),
      ...(data.vehicleType ? { vehicleType: data.vehicleType } : {}),
      capacityTons: data.capacityTons !== undefined ? Number(data.capacityTons) : undefined,
      capacityCft: data.capacityCft !== undefined ? Number(data.capacityCft) : undefined,
      defaultDriverName: data.defaultDriverName,
      defaultDriverPhone: data.defaultDriverPhone,
      ...(data.status ? { status: data.status } : {}),
      insuranceExpiry: data.insuranceExpiry,
      fitnessExpiry: data.fitnessExpiry,
      permitExpiry: data.permitExpiry,
      notes: data.notes,
    })
    .where(eq(vehicles.id, id))
    .returning();
  return updated[0] || null;
};

export const deleteVehicle = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  return await updateVehicle(env, id, { status: "retired" });
};

// ================= STAFF ================= //

export const getAllStaff = async (
  env: Bindings,
  filter?: { role?: string; status?: string; date?: string }
) => {
  const db = getDb(env.DB);
  let busyStaffIds: number[] = [];

  if (filter?.date) {
    const busyJobs = await db
      .select({ staffId: jobStaff.staffId })
      .from(jobStaff)
      .innerJoin(jobs, eq(jobStaff.jobId, jobs.id))
      .where(and(eq(jobs.scheduledDate, filter.date), sql`${jobs.status} != 'cancelled'`));

    busyStaffIds = busyJobs.map((j) => j.staffId);
  }

  const results = await db.select().from(staff).orderBy(desc(staff.createdAt));

  return results.map((s) => {
    const isBusyOnDate = busyStaffIds.includes(s.id);
    return {
      ...s,
      isAvailableOnDate: filter?.date ? !isBusyOnDate && s.status === "available" : true,
    };
  });
};

export const getStaffById = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  return result[0] || null;
};

export const getStaffProfile = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  const staffMember = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  if (!staffMember[0]) return null;

  const member = staffMember[0];

  // Query all move jobs this staff was assigned to
  const assignments = await db
    .select({
      id: jobStaff.id,
      jobId: jobStaff.jobId,
      staffId: jobStaff.staffId,
      roleOnJob: jobStaff.roleOnJob,
      payType: jobStaff.payType,
      rateUsed: jobStaff.rateUsed,
      daysWorked: jobStaff.daysWorked,
      amountPayable: jobStaff.amountPayable,
      amountPaid: jobStaff.amountPaid,
      paymentStatus: jobStaff.paymentStatus,
      paymentDate: jobStaff.paymentDate,
      paymentMode: jobStaff.paymentMode,
      paymentNotes: jobStaff.paymentNotes,
      createdAt: jobStaff.createdAt,
      jobNumber: jobs.jobNumber,
      customerName: jobs.customerName,
      customerPhone: jobs.customerPhone,
      pickupAddress: jobs.pickupAddress,
      deliveryAddress: jobs.deliveryAddress,
      scheduledDate: jobs.scheduledDate,
      scheduledTime: jobs.scheduledTime,
      jobStatus: jobs.status,
    })
    .from(jobStaff)
    .innerJoin(jobs, eq(jobStaff.jobId, jobs.id))
    .where(eq(jobStaff.staffId, id))
    .orderBy(desc(jobs.scheduledDate), desc(jobStaff.createdAt));

  let totalEarned = 0;
  let totalPaid = 0;
  let pendingWages = 0;

  const paymentHistory: Array<{
    id: number;
    jobId: number;
    jobNumber: string;
    amount: number;
    paymentStatus: string;
    paymentDate: string | null;
    paymentMode: string | null;
    paymentNotes: string | null;
  }> = [];

  for (const a of assignments) {
    const payable = Number(a.amountPayable) || 0;
    const paid = Number(a.amountPaid) || 0;
    totalEarned += payable;
    totalPaid += paid;
    if (payable > paid) {
      pendingWages += (payable - paid);
    }
    if (paid > 0 || a.paymentDate || a.paymentStatus === "paid" || a.paymentStatus === "partial") {
      paymentHistory.push({
        id: a.id,
        jobId: a.jobId,
        jobNumber: a.jobNumber,
        amount: paid,
        paymentStatus: a.paymentStatus,
        paymentDate: a.paymentDate || a.createdAt,
        paymentMode: a.paymentMode || "cash",
        paymentNotes: a.paymentNotes || null,
      });
    }
  }

  return {
    staff: member,
    metrics: {
      totalMovesAttended: assignments.length,
      totalEarned,
      totalPaid,
      pendingWages,
    },
    movesAttended: assignments,
    paymentHistory,
  };
};

export const createStaff = async (env: Bindings, data: any) => {
  const db = getDb(env.DB);
  const inserted = await db
    .insert(staff)
    .values({
      name: data.name,
      phone: data.phone,
      role: data.role,
      specialization: data.specialization || null,
      status: data.status || "available",
      idType: data.idType || null,
      idNumber: data.idNumber || null,
      address: data.address || null,
      dailyWage: data.dailyWage ? Number(data.dailyWage) : null,
      joiningDate: data.joiningDate || null,
      notes: data.notes || null,
      createdAt: new Date().toISOString(),
    })
    .returning();
  return inserted[0];
};

export const updateStaff = async (env: Bindings, id: number, data: any) => {
  const db = getDb(env.DB);
  const updated = await db
    .update(staff)
    .set({
      ...(data.name ? { name: data.name } : {}),
      ...(data.phone ? { phone: data.phone } : {}),
      ...(data.role ? { role: data.role } : {}),
      specialization: data.specialization,
      ...(data.status ? { status: data.status } : {}),
      idType: data.idType,
      idNumber: data.idNumber,
      address: data.address,
      dailyWage: data.dailyWage !== undefined ? Number(data.dailyWage) : undefined,
      joiningDate: data.joiningDate,
      notes: data.notes,
    })
    .where(eq(staff.id, id))
    .returning();
  return updated[0] || null;
};

export const deleteStaff = async (env: Bindings, id: number) => {
  const db = getDb(env.DB);
  return await updateStaff(env, id, { status: "inactive" });
};

// ================= JOB RESOURCES & EXPENSES ================= //

export const getJobResources = async (env: Bindings, jobId: number) => {
  const db = getDb(env.DB);

  // Assigned vehicles
  const assignedVehicles = await db
    .select({
      id: jobVehicles.id,
      jobId: jobVehicles.jobId,
      vehicleId: jobVehicles.vehicleId,
      driverName: jobVehicles.driverName,
      driverPhone: jobVehicles.driverPhone,
      role: jobVehicles.role,
      vehicleNumber: vehicles.vehicleNumber,
      vehicleType: vehicles.vehicleType,
      capacityTons: vehicles.capacityTons,
      capacityCft: vehicles.capacityCft,
      status: vehicles.status,
    })
    .from(jobVehicles)
    .innerJoin(vehicles, eq(jobVehicles.vehicleId, vehicles.id))
    .where(eq(jobVehicles.jobId, jobId));

  // Assigned staff
  const assignedStaff = await db
    .select({
      id: jobStaff.id,
      jobId: jobStaff.jobId,
      staffId: jobStaff.staffId,
      roleOnJob: jobStaff.roleOnJob,
      payType: jobStaff.payType,
      rateUsed: jobStaff.rateUsed,
      daysWorked: jobStaff.daysWorked,
      amountPayable: jobStaff.amountPayable,
      amountPaid: jobStaff.amountPaid,
      paymentStatus: jobStaff.paymentStatus,
      paymentDate: jobStaff.paymentDate,
      paymentMode: jobStaff.paymentMode,
      paymentNotes: jobStaff.paymentNotes,
      name: staff.name,
      phone: staff.phone,
      role: staff.role,
      specialization: staff.specialization,
    })
    .from(jobStaff)
    .innerJoin(staff, eq(jobStaff.staffId, staff.id))
    .where(eq(jobStaff.jobId, jobId));

  // Expenses
  const expenses = await db
    .select()
    .from(jobExpenses)
    .where(eq(jobExpenses.jobId, jobId))
    .orderBy(desc(jobExpenses.createdAt));

  return {
    vehicles: assignedVehicles,
    staff: assignedStaff,
    expenses,
  };
};

export const assignVehiclesToJob = async (
  env: Bindings,
  jobId: number,
  vehiclesList: Array<{ vehicleId: number; driverName?: string; driverPhone?: string; role?: string }>
) => {
  const db = getDb(env.DB);

  for (const item of vehiclesList) {
    // Check if already assigned
    const existing = await db
      .select()
      .from(jobVehicles)
      .where(and(eq(jobVehicles.jobId, jobId), eq(jobVehicles.vehicleId, item.vehicleId)))
      .limit(1);

    if (!existing[0]) {
      await db.insert(jobVehicles).values({
        jobId,
        vehicleId: item.vehicleId,
        driverName: item.driverName || null,
        driverPhone: item.driverPhone || null,
        role: item.role || "primary",
        createdAt: new Date().toISOString(),
      });
      // Optionally update vehicle status to on_move
      await db.update(vehicles).set({ status: "on_move" }).where(eq(vehicles.id, item.vehicleId));
    }
  }

  return await getJobResources(env, jobId);
};

export const removeVehicleFromJob = async (env: Bindings, jobId: number, vehicleId: number) => {
  const db = getDb(env.DB);
  await db
    .delete(jobVehicles)
    .where(and(eq(jobVehicles.jobId, jobId), eq(jobVehicles.vehicleId, vehicleId)));

  // If vehicle has no other active jobs, set available
  const otherJobs = await db
    .select()
    .from(jobVehicles)
    .innerJoin(jobs, eq(jobVehicles.jobId, jobs.id))
    .where(and(eq(jobVehicles.vehicleId, vehicleId), sql`${jobs.status} IN ('scheduled', 'in_progress')`));

  if (otherJobs.length === 0) {
    await db.update(vehicles).set({ status: "available" }).where(eq(vehicles.id, vehicleId));
  }

  return await getJobResources(env, jobId);
};

export const assignStaffToJob = async (
  env: Bindings,
  jobId: number,
  staffList: Array<{
    staffId: number;
    roleOnJob?: string;
    payType?: "per_job" | "per_day";
    rateUsed?: number;
    daysWorked?: number;
  }>
) => {
  const db = getDb(env.DB);

  for (const item of staffList) {
    const existing = await db
      .select()
      .from(jobStaff)
      .where(and(eq(jobStaff.jobId, jobId), eq(jobStaff.staffId, item.staffId)))
      .limit(1);

    const rate = Number(item.rateUsed) || 0;
    const days = Number(item.daysWorked) || 1;
    const amountPayable = item.payType === "per_day" ? rate * days : rate;

    if (!existing[0]) {
      await db.insert(jobStaff).values({
        jobId,
        staffId: item.staffId,
        roleOnJob: item.roleOnJob || null,
        payType: item.payType || "per_job",
        rateUsed: rate,
        daysWorked: days,
        amountPayable,
        amountPaid: 0,
        paymentStatus: "pending",
        createdAt: new Date().toISOString(),
      });
      // Optionally update staff status to on_move
      await db.update(staff).set({ status: "on_move" }).where(eq(staff.id, item.staffId));
    }
  }

  return await getJobResources(env, jobId);
};

export const removeStaffFromJob = async (env: Bindings, jobId: number, staffId: number) => {
  const db = getDb(env.DB);
  await db
    .delete(jobStaff)
    .where(and(eq(jobStaff.jobId, jobId), eq(jobStaff.staffId, staffId)));

  const otherJobs = await db
    .select()
    .from(jobStaff)
    .innerJoin(jobs, eq(jobStaff.jobId, jobs.id))
    .where(and(eq(jobStaff.staffId, staffId), sql`${jobs.status} IN ('scheduled', 'in_progress')`));

  if (otherJobs.length === 0) {
    await db.update(staff).set({ status: "available" }).where(eq(staff.id, staffId));
  }

  return await getJobResources(env, jobId);
};

export const updateStaffJobPayment = async (
  env: Bindings,
  jobId: number,
  staffId: number,
  data: {
    daysWorked?: number;
    amountPaid?: number;
    paymentMode?: string;
    paymentDate?: string;
    paymentNotes?: string;
  }
) => {
  const db = getDb(env.DB);
  const existing = await db
    .select()
    .from(jobStaff)
    .where(and(eq(jobStaff.jobId, jobId), eq(jobStaff.staffId, staffId)))
    .limit(1);

  if (!existing[0]) throw new Error("Staff assignment record not found for this job");

  const current = existing[0];
  const daysWorked = data.daysWorked !== undefined ? Number(data.daysWorked) : (current.daysWorked || 1);
  const rateUsed = current.rateUsed || 0;
  const amountPayable = current.payType === "per_day" ? rateUsed * daysWorked : rateUsed;
  const amountPaid = data.amountPaid !== undefined ? Number(data.amountPaid) : (current.amountPaid || 0);

  let paymentStatus: "pending" | "partial" | "paid" = "pending";
  if (amountPaid >= amountPayable && amountPayable > 0) {
    paymentStatus = "paid";
  } else if (amountPaid > 0) {
    paymentStatus = "partial";
  }

  const updated = await db
    .update(jobStaff)
    .set({
      daysWorked,
      amountPayable,
      amountPaid,
      paymentStatus,
      paymentMode: data.paymentMode || current.paymentMode,
      paymentDate: data.paymentDate || current.paymentDate || new Date().toISOString().split("T")[0],
      paymentNotes: data.paymentNotes !== undefined ? data.paymentNotes : current.paymentNotes,
    })
    .where(and(eq(jobStaff.jobId, jobId), eq(jobStaff.staffId, staffId)))
    .returning();

  return updated[0];
};

export const addJobExpense = async (env: Bindings, jobId: number, data: any) => {
  const db = getDb(env.DB);
  const inserted = await db
    .insert(jobExpenses)
    .values({
      jobId,
      category: data.category,
      amount: Number(data.amount) || 0,
      description: data.description || null,
      paidBy: data.paidBy || null,
      receiptNote: data.receiptNote || null,
      createdAt: new Date().toISOString(),
    })
    .returning();
  return inserted[0];
};

export const deleteJobExpense = async (env: Bindings, jobId: number, expenseId: number) => {
  const db = getDb(env.DB);
  await db
    .delete(jobExpenses)
    .where(and(eq(jobExpenses.jobId, jobId), eq(jobExpenses.id, expenseId)));
  return { success: true };
};

// Release resources when job completes
export const releaseJobResources = async (env: Bindings, jobId: number) => {
  const db = getDb(env.DB);
  const vList = await db.select({ vehicleId: jobVehicles.vehicleId }).from(jobVehicles).where(eq(jobVehicles.jobId, jobId));
  const sList = await db.select({ staffId: jobStaff.staffId }).from(jobStaff).where(eq(jobStaff.jobId, jobId));

  for (const v of vList) {
    await db.update(vehicles).set({ status: "available" }).where(eq(vehicles.id, v.vehicleId));
  }
  for (const s of sList) {
    await db.update(staff).set({ status: "available" }).where(eq(staff.id, s.staffId));
  }
};
