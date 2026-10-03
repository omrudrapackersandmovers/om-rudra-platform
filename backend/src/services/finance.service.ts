import { eq, desc, and, ne, sql } from "drizzle-orm";
import { getDb } from "../db/client";
import {
  invoices,
  invoicePayments,
  jobs,
  quotations,
  staff,
  jobStaff,
  jobExpenses,
  leads,
  bilties,
} from "../db/schema";
import { Bindings } from "../types";

// ================= INVOICE PAYMENTS ================= //

export const recordInvoicePayment = async (
  env: Bindings,
  invoiceId: number,
  data: {
    amount: number;
    paymentMode: "upi" | "cash" | "neft" | "cheque" | "other";
    paymentDate: string;
    transactionRef?: string;
    notes?: string;
  }
) => {
  const db = getDb(env.DB);

  // 1. Insert payment
  const payment = await db
    .insert(invoicePayments)
    .values({
      invoiceId,
      amount: Number(data.amount),
      paymentMode: data.paymentMode,
      paymentDate: data.paymentDate,
      transactionRef: data.transactionRef || null,
      notes: data.notes || null,
    })
    .returning();

  // 2. Fetch all payments for this invoice
  const allPayments = await db
    .select({ amount: invoicePayments.amount })
    .from(invoicePayments)
    .where(eq(invoicePayments.invoiceId, invoiceId));

  const totalRecordedPayments = allPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  // 3. Fetch invoice to recalculate
  const invRes = await db.select().from(invoices).where(eq(invoices.id, invoiceId)).limit(1);
  if (!invRes[0]) throw new Error("Invoice not found");

  const inv = invRes[0];
  const advance = Number(inv.advancePaid) || 0;
  const totalPaid = advance + totalRecordedPayments;
  const totalAmount = Number(inv.totalAmount) || 0;
  const balanceDue = Math.max(0, totalAmount - totalPaid);

  let paymentStatus: "unpaid" | "partial" | "paid" = "unpaid";
  if (balanceDue <= 0 && totalAmount > 0) {
    paymentStatus = "paid";
  } else if (totalPaid > 0) {
    paymentStatus = "partial";
  }

  const updatedInv = await db
    .update(invoices)
    .set({
      advancePaid: totalPaid, // Keep advancePaid in sync so updateInvoicePayment reads correct total
      balanceDue,
      paymentStatus,
    })
    .where(eq(invoices.id, invoiceId))
    .returning();

  return {
    payment: payment[0],
    invoice: {
      ...updatedInv[0],
      paidAmount: totalPaid,
    },
  };
};

export const getInvoicePayments = async (env: Bindings, invoiceId: number) => {
  const db = getDb(env.DB);
  return await db
    .select()
    .from(invoicePayments)
    .where(eq(invoicePayments.invoiceId, invoiceId))
    .orderBy(desc(invoicePayments.paymentDate));
};

// ================= FINANCE METRICS & DASHBOARD ================= //

export const getFinanceSummary = async (env: Bindings) => {
  const db = getDb(env.DB);

  const allInvoices = await db.select().from(invoices);
  const totalRevenue = allInvoices.reduce((acc, i) => acc + (Number(i.totalAmount) || 0), 0);
  const totalOutstanding = allInvoices.reduce((acc, i) => acc + (Number(i.balanceDue) || 0), 0);
  const totalCollected = Math.max(0, totalRevenue - totalOutstanding);

  // This month revenue
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthInvoices = allInvoices.filter((i) => (i.createdAt || "").startsWith(currentYearMonth));
  const thisMonthRevenue = thisMonthInvoices.reduce((acc, i) => acc + (Number(i.totalAmount) || 0), 0);

  // Pending staff payroll
  const staffAssignments = await db.select().from(jobStaff);
  const totalStaffPayable = staffAssignments.reduce((acc, s) => acc + (Number(s.amountPayable) || 0), 0);
  const totalStaffPaid = staffAssignments.reduce((acc, s) => acc + (Number(s.amountPaid) || 0), 0);
  const pendingStaffWages = Math.max(0, totalStaffPayable - totalStaffPaid);

  return {
    totalRevenue,
    totalCollected,
    totalOutstanding,
    thisMonthRevenue,
    totalInvoicesCount: allInvoices.length,
    pendingStaffWages,
    totalStaffPaid,
  };
};

export const getMonthlyRevenue = async (env: Bindings) => {
  const db = getDb(env.DB);
  const allInvoices = await db.select().from(invoices).orderBy(invoices.createdAt);

  const monthMap: Record<string, { month: string; billed: number; collected: number; count: number }> = {};

  for (const inv of allInvoices) {
    const dateStr = inv.createdAt || "";
    const key = dateStr.slice(0, 7); // "YYYY-MM"
    if (!key || key.length < 7) continue;

    if (!monthMap[key]) {
      monthMap[key] = { month: key, billed: 0, collected: 0, count: 0 };
    }
    const total = Number(inv.totalAmount) || 0;
    const balance = Number(inv.balanceDue) || 0;
    const paid = Math.max(0, total - balance);

    monthMap[key].billed += total;
    monthMap[key].collected += paid;
    monthMap[key].count += 1;
  }

  // Return last 6 to 12 months sorted
  return Object.values(monthMap).sort((a, b) => a.month.localeCompare(b.month));
};

export const getTopRoutes = async (env: Bindings) => {
  const db = getDb(env.DB);
  const quotesList = await db.select().from(quotations);

  const routeMap: Record<string, { route: string; movingFrom: string; movingTo: string; count: number; totalRevenue: number }> = {};

  for (const q of quotesList) {
    const from = (q.movingFrom || "").trim();
    const to = (q.movingTo || "").trim();
    if (!from || !to) continue;

    const key = `${from} → ${to}`;
    if (!routeMap[key]) {
      routeMap[key] = { route: key, movingFrom: from, movingTo: to, count: 0, totalRevenue: 0 };
    }
    routeMap[key].count += 1;
    routeMap[key].totalRevenue += Number(q.totalAmount) || 0;
  }

  return Object.values(routeMap)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);
};

export const getPendingPayroll = async (env: Bindings) => {
  const db = getDb(env.DB);

  const pendingList = await db
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
      staffName: staff.name,
      staffPhone: staff.phone,
      staffRole: staff.role,
      jobNumber: jobs.jobNumber,
      customerName: jobs.customerName,
      scheduledDate: jobs.scheduledDate,
      jobStatus: jobs.status,
    })
    .from(jobStaff)
    .innerJoin(staff, eq(jobStaff.staffId, staff.id))
    .innerJoin(jobs, eq(jobStaff.jobId, jobs.id))
    .where(ne(jobStaff.paymentStatus, "paid"))
    .orderBy(desc(jobs.scheduledDate));

  return pendingList.map((p) => ({
    ...p,
    balanceOwed: Math.max(0, (Number(p.amountPayable) || 0) - (Number(p.amountPaid) || 0)),
  }));
};

export const getJobProfitSummary = async (env: Bindings, jobId: number) => {
  const db = getDb(env.DB);

  // Invoices for this job
  const invList = await db.select().from(invoices).where(eq(invoices.jobId, jobId));
  const invoiceTotal = invList.reduce((acc, i) => acc + (Number(i.totalAmount) || 0), 0);

  // Staff costs
  const staffList = await db.select().from(jobStaff).where(eq(jobStaff.jobId, jobId));
  const staffCost = staffList.reduce((acc, s) => acc + (Number(s.amountPayable) || 0), 0);

  // Expenses
  const expList = await db.select().from(jobExpenses).where(eq(jobExpenses.jobId, jobId));
  const expenseCost = expList.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  const netProfit = invoiceTotal - staffCost - expenseCost;
  const marginPercent = invoiceTotal > 0 ? Math.round((netProfit / invoiceTotal) * 100) : 0;

  return {
    jobId,
    invoiceTotal,
    staffCost,
    expenseCost,
    netProfit,
    marginPercent,
  };
};

// ================= LEAD PIPELINE ================= //

export const getLeadPipeline = async (env: Bindings, leadId: number) => {
  const db = getDb(env.DB);

  const leadRes = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!leadRes[0]) return null;

  const quotesList = await db
    .select()
    .from(quotations)
    .where(eq(quotations.leadId, leadId))
    .orderBy(desc(quotations.createdAt));

  const quotesWithChildren = await Promise.all(
    quotesList.map(async (q) => {
      // Find jobs linked to this quote or lead
      const jobsList = await db
        .select()
        .from(jobs)
        .where(eq(jobs.quoteId, q.id))
        .orderBy(desc(jobs.createdAt));

      const jobsWithChildren = await Promise.all(
        jobsList.map(async (j) => {
          const invList = await db
            .select()
            .from(invoices)
            .where(eq(invoices.jobId, j.id))
            .orderBy(desc(invoices.createdAt));

          const biltyList = await db
            .select()
            .from(bilties)
            .where(eq(bilties.jobId, j.id))
            .orderBy(desc(bilties.createdAt));

          return {
            ...j,
            invoices: invList,
            bilties: biltyList,
          };
        })
      );

      return {
        ...q,
        jobs: jobsWithChildren,
      };
    })
  );

  return {
    lead: leadRes[0],
    quotes: quotesWithChildren,
  };
};
