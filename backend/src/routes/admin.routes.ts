import { handleGetCustomers, handleGetCustomer, handleUpdateCustomer, handleDeleteLead, handleRestoreLead } from "../controllers/customers.controller";
import { Hono } from "hono";
import { handleGetSupport, handleUpdateSupport, handleCreateComplaint, handleSearchSupportReferences } from "../controllers/support.controller";
import {
  handleAdminLogin,
  handleAdminMe,
  handleGetLeads,
  handleUpdateLead,
  handleCreateManualLead,
  handleGetLeadById,
  handleGetLeadPipeline,
  handleCreateQuotation,
  handleGetQuotations,
  handleGetQuotationById,
  handleUpdateQuotationStatus,
  handleUpdateQuotation,
  handleDeleteQuotation,
  handleCreateJob,
  handleGetJobs,
  handleGetJobById,
  handleUpdateJob,
  handleGetJobResources,
  handleAssignVehiclesToJob,
  handleRemoveVehicleFromJob,
  handleAssignStaffToJob,
  handleRemoveStaffFromJob,
  handleUpdateStaffPayment,
  handleAddJobExpense,
  handleDeleteJobExpense,
  handleGetJobProfitSummary,
  handleCreateInvoice,
  handleGetInvoices,
  handleGetInvoiceById,
  handleUpdateInvoicePayment,
  handleRecordInvoicePayment,
  handleGetInvoicePayments,
  handleCreateBilty,
  handleUpdateBilty,
  handleGetBilties,
  handleGetBiltyById,
  handleGetSettings,
  handleUpdateSettings,
  handleVerify2FA,
  handleResend2FAOtp,
  handleForgotPasswordRequestOtp,
  handleForgotPasswordReset,
  handleGetAdminProfile,
  handleUpdateAdminProfile,
  handleChangePassword,
  handleToggle2FA,
  handleGetVehicles,
  handleGetVehicleById,
  handleCreateVehicle,
  handleUpdateVehicle,
  handleDeleteVehicle,
  handleGetStaff,
  handleGetStaffById,
  handleCreateStaff,
  handleUpdateStaff,
  handleDeleteStaff,
  handleGetFinanceSummary,
  handleGetMonthlyRevenue,
  handleGetTopRoutes,
  handleGetPendingPayroll,
  handleGetDataStatus,
  handleResetData,
  handleLoadSampleData,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middlewares/auth";
import { Bindings } from "../types";

export const adminRouter = new Hono<{ Bindings: Bindings }>();

// Public Auth & Brand settings routes
adminRouter.post("/auth/login", handleAdminLogin);
adminRouter.post("/auth/verify-2fa", handleVerify2FA);
adminRouter.post("/auth/resend-2fa-otp", handleResend2FAOtp);
adminRouter.post("/auth/forgot-password/request-otp", handleForgotPasswordRequestOtp);
adminRouter.post("/auth/forgot-password/reset", handleForgotPasswordReset);
adminRouter.get("/settings", handleGetSettings);

// Protected routes (require Bearer JWT)
adminRouter.use("*", authMiddleware);

adminRouter.get("/emails", async c => {
  const result = await c.env.DB.prepare(`SELECT id,kind,entity_id,recipient,status,attempts,last_error,provider_id,created_at,accepted_at,(status='failed' AND uncertain_since IS NULL) AS can_retry
    FROM email_outbox ORDER BY id DESC LIMIT 100`).all();
  const counts = await c.env.DB.prepare("SELECT status,COUNT(*) AS count FROM email_outbox GROUP BY status").all();
  return c.json({ emails: result.results, counts: counts.results, enabled: c.env.CUSTOMER_EMAILS_ENABLED !== "false", providerConfigured: Boolean(c.env.BREVO_API_KEY) });
});

adminRouter.post("/emails/:id/retry", async c => {
  const id = Number(c.req.param("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return c.json({ error: "Invalid email ID" }, 400);
  const result = await c.env.DB.prepare(`UPDATE email_outbox SET status='queued',attempts=0,next_attempt=unixepoch(),first_attempt=NULL,last_error=NULL
    WHERE id=? AND status='failed' AND uncertain_since IS NULL RETURNING id`).bind(id).first();
  if (!result) return c.json({ error: "Only definite failures can be retried. Check uncertain sends in Brevo before taking further action." }, 409);
  return c.json({ success: true });
});

adminRouter.get("/auth/me", handleAdminMe);
adminRouter.get("/support", handleGetSupport);
adminRouter.get("/support/references", handleSearchSupportReferences);
adminRouter.post("/support", handleCreateComplaint);
adminRouter.patch("/support/:id", handleUpdateSupport);

// Admin Profile & Security
adminRouter.get("/profile", handleGetAdminProfile);
adminRouter.patch("/profile", handleUpdateAdminProfile);
adminRouter.patch("/change-password", handleChangePassword);
adminRouter.patch("/toggle-2fa", handleToggle2FA);

adminRouter.get("/customers", handleGetCustomers);
adminRouter.get("/customers/:id", handleGetCustomer);
adminRouter.patch("/customers/:id", handleUpdateCustomer);
adminRouter.delete("/leads/:id", handleDeleteLead);
adminRouter.post("/leads/:id/restore", handleRestoreLead);
// Leads & Pipeline
adminRouter.get("/leads", handleGetLeads);
adminRouter.post("/leads/manual", handleCreateManualLead);
adminRouter.get("/leads/:id", handleGetLeadById);
adminRouter.get("/leads/:id/pipeline", handleGetLeadPipeline);
adminRouter.patch("/leads/:id", handleUpdateLead);

// Quotations
adminRouter.get("/quotes", handleGetQuotations);
adminRouter.post("/quotes", handleCreateQuotation);
adminRouter.get("/quotes/:id", handleGetQuotationById);
adminRouter.put("/quotes/:id", handleUpdateQuotation);
adminRouter.patch("/quotes/:id/status", handleUpdateQuotationStatus);
adminRouter.delete("/quotes/:id", handleDeleteQuotation);

// Jobs & Operations
adminRouter.get("/jobs", handleGetJobs);
adminRouter.post("/jobs", handleCreateJob);
adminRouter.get("/jobs/:id", handleGetJobById);
adminRouter.patch("/jobs/:id", handleUpdateJob);
adminRouter.get("/jobs/:id/resources", handleGetJobResources);
adminRouter.post("/jobs/:id/assign-vehicles", handleAssignVehiclesToJob);
adminRouter.delete("/jobs/:id/vehicles/:vehicleId", handleRemoveVehicleFromJob);
adminRouter.post("/jobs/:id/assign-staff", handleAssignStaffToJob);
adminRouter.delete("/jobs/:id/staff/:staffId", handleRemoveStaffFromJob);
adminRouter.patch("/jobs/:id/staff/:staffId/payment", handleUpdateStaffPayment);
adminRouter.post("/jobs/:id/expenses", handleAddJobExpense);
adminRouter.delete("/jobs/:id/expenses/:expenseId", handleDeleteJobExpense);
adminRouter.get("/jobs/:id/profit", handleGetJobProfitSummary);

// Fleet Management
adminRouter.get("/vehicles", handleGetVehicles);
adminRouter.post("/vehicles", handleCreateVehicle);
adminRouter.get("/vehicles/:id", handleGetVehicleById);
adminRouter.patch("/vehicles/:id", handleUpdateVehicle);
adminRouter.delete("/vehicles/:id", handleDeleteVehicle);

// Team / Staff Management
adminRouter.get("/staff", handleGetStaff);
adminRouter.post("/staff", handleCreateStaff);
adminRouter.get("/staff/:id", handleGetStaffById);
adminRouter.patch("/staff/:id", handleUpdateStaff);
adminRouter.delete("/staff/:id", handleDeleteStaff);

// Invoices & Customer Payments
adminRouter.get("/invoices", handleGetInvoices);
adminRouter.post("/invoices", handleCreateInvoice);
adminRouter.get("/invoices/:id", handleGetInvoiceById);
adminRouter.patch("/invoices/:id/payment", handleUpdateInvoicePayment);
adminRouter.post("/invoices/:id/payments", handleRecordInvoicePayment);
adminRouter.get("/invoices/:id/payments", handleGetInvoicePayments);

// Bilties
adminRouter.get("/bilties", handleGetBilties);
adminRouter.post("/bilties", handleCreateBilty);
adminRouter.put("/bilties/:id", handleUpdateBilty);
adminRouter.get("/bilties/:id", handleGetBiltyById);

// Finance & Analytics
adminRouter.get("/finance/summary", handleGetFinanceSummary);
adminRouter.get("/finance/monthly", handleGetMonthlyRevenue);
adminRouter.get("/finance/top-routes", handleGetTopRoutes);
adminRouter.get("/finance/pending-payroll", handleGetPendingPayroll);

// Settings (Protected)
adminRouter.put("/settings", handleUpdateSettings);

// Data Management (Protected)
adminRouter.get("/data/status", handleGetDataStatus);
adminRouter.post("/data/reset", handleResetData);
adminRouter.post("/data/load-sample", handleLoadSampleData);
