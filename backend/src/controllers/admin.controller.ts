import { Context } from "hono";
import { z } from "zod";
import { verify, sign } from "hono/jwt";
import {
  verifyAdminLogin,
  getAdminCount,
  createAdminUser,
  getAdminById,
  getAdminByUsername,
  getFirstAdmin,
  getAdminByEmailOrUsername,
  updateAdminProfile,
  updateAdminPassword,
  toggleAdmin2FA,
  generateAndStoreOtp,
  verifyAdminOtp,
  getAllLeads,
  updateLeadStatusAndNotes,
  createManualLead,
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotationStatus,
  updateQuotation,
  deleteQuotation,
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoicePayment,
  createBilty,
  getAllBilties,
  getBiltyById,
  getCompanySettings,
  updateCompanySettings,
  getLeadById,
} from "../services/admin.service";
import {
  getAllVehicles,
  getVehicleById,
  getVehicleProfile,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllStaff,
  getStaffById,
  getStaffProfile,
  createStaff,
  updateStaff,
  deleteStaff,
  getJobResources,
  assignVehiclesToJob,
  removeVehicleFromJob,
  assignStaffToJob,
  removeStaffFromJob,
  updateStaffJobPayment,
  addJobExpense,
  deleteJobExpense,
} from "../services/operations.service";
import {
  recordInvoicePayment,
  getInvoicePayments,
  getFinanceSummary,
  getMonthlyRevenue,
  getTopRoutes,
  getPendingPayroll,
  getJobProfitSummary,
  getLeadPipeline,
} from "../services/finance.service";
import { createToken, getJwtSecret } from "../middlewares/auth";
import { verifyPassword } from "../utils/crypto";
import { sendOtpEmail } from "../services/email.service";
import {
  getDataStatus,
  resetOperationalData,
  loadSampleData,
} from "../services/data.service";
import { Bindings, AdminPayload } from "../types";

/** Parse a route :id param to a positive integer. Returns null if invalid. */
const parseId = (raw: string | undefined): number | null => {
  if (!raw) return null;
  const n = parseInt(raw, 10);
  return isNaN(n) || n <= 0 ? null : n;
};

function maskEmail(email?: string | null): string {
  if (!email || !email.includes("@")) return "registered email";
  const [local, domain] = email.split("@");
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}${"*".repeat(Math.max(1, local.length - 2))}${local[local.length - 1]}@${domain}`;
}

// ================= AUTH CONTROLLERS ================= //

export const handleAdminLogin = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    const identifier = (body.username || body.identifier || body.email || "").trim();
    const password = body.password;
    if (!identifier || !password) {
      return c.json({ error: "Username or email and password are required" }, 400);
    }

    const admin = await verifyAdminLogin(c.env, identifier, password);
    if (!admin) {
      return c.json({ error: "Invalid username/email or password" }, 401);
    }

    const secret = getJwtSecret(c.env);

    // If Two-Factor Authentication is enabled AND email is set
    if (admin.twoFactorEnabled && admin.email) {
      const otp = await generateAndStoreOtp(c.env, admin.id, "2FA Login Verification");
      await sendOtpEmail(admin.email, otp, "2FA Login Verification", c.env.BREVO_API_KEY, c.env.BREVO_SENDER_EMAIL);

      // Create short-lived 10-minute challenge token
      const exp = Math.floor(Date.now() / 1000) + 600;
      const challengeToken = await sign(
        { adminId: admin.id, purpose: "2fa_challenge", exp },
        secret
      );

      const masked = maskEmail(admin.email);
      return c.json({
        require2FA: true,
        challengeToken,
        emailMasked: masked,
        message: `Security OTP sent to ${masked}`,
      });
    }

    // Direct Login (2FA Disabled)
    const token = await createToken({ id: admin.id, username: admin.username }, secret);
    return c.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return c.json({ error: "Login failed: " + (err.message || "Unknown error") }, 500);
  }
};

export const handleVerify2FA = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const { challengeToken, otp } = await c.req.json();
    if (!challengeToken || !otp) {
      return c.json({ error: "Challenge token and 6-digit OTP code are required" }, 400);
    }

    const secret = getJwtSecret(c.env);
    let payload: any;
    try {
      payload = await verify(challengeToken, secret, "HS256");
    } catch {
      return c.json({ error: "Verification session expired. Please sign in again." }, 401);
    }

    if (payload.purpose !== "2fa_challenge" || !payload.adminId) {
      return c.json({ error: "Invalid challenge session." }, 401);
    }

    const isValid = await verifyAdminOtp(c.env, payload.adminId, otp, "2FA Login Verification");
    if (!isValid) {
      return c.json({ error: "Invalid or expired OTP code. Please try again." }, 400);
    }

    const admin = await getAdminById(c.env, payload.adminId);
    if (!admin) return c.json({ error: "Admin account not found" }, 404);

    const token = await createToken({ id: admin.id, username: admin.username }, secret);
    return c.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    });
  } catch (err: any) {
    console.error("Verify 2FA error:", err);
    return c.json({ error: "Failed to verify 2FA code" }, 500);
  }
};

export const handleResend2FAOtp = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const { challengeToken } = await c.req.json();
    if (!challengeToken) return c.json({ error: "Challenge token required" }, 400);

    const secret = getJwtSecret(c.env);
    let payload: any;
    try {
      payload = await verify(challengeToken, secret, "HS256");
    } catch {
      return c.json({ error: "Session expired. Please sign in again." }, 401);
    }

    if (payload.purpose !== "2fa_challenge" || !payload.adminId) {
      return c.json({ error: "Invalid challenge session." }, 401);
    }

    const admin = await getAdminById(c.env, payload.adminId);
    if (!admin || !admin.email) {
      return c.json({ error: "Admin email not configured" }, 400);
    }

    const otp = await generateAndStoreOtp(c.env, admin.id, "2FA Login Verification");
    await sendOtpEmail(admin.email, otp, "2FA Login Verification", c.env.BREVO_API_KEY, c.env.BREVO_SENDER_EMAIL);
    return c.json({ success: true, message: `New verification code sent to ${maskEmail(admin.email)}` });
  } catch (err: any) {
    return c.json({ error: "Failed to resend OTP" }, 500);
  }
};

export const handleForgotPasswordRequestOtp = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const { identifier } = await c.req.json();
    if (!identifier) return c.json({ error: "Username or email is required" }, 400);

    const admin = await getAdminByEmailOrUsername(c.env, identifier.trim());
    if (!admin || !admin.email) {
      return c.json(
        {
          error: "No account with a registered email address was found with that username or email.",
        },
        404
      );
    }

    const otp = await generateAndStoreOtp(c.env, admin.id, "Password Reset");
    await sendOtpEmail(admin.email, otp, "Password Reset", c.env.BREVO_API_KEY, c.env.BREVO_SENDER_EMAIL);

    const secret = getJwtSecret(c.env);
    const exp = Math.floor(Date.now() / 1000) + 600;
    const resetToken = await sign({ adminId: admin.id, purpose: "password_reset", exp }, secret);

    return c.json({
      success: true,
      resetToken,
      emailMasked: maskEmail(admin.email),
      message: `Password reset OTP sent to ${maskEmail(admin.email)}`,
    });
  } catch (err: any) {
    return c.json({ error: "Failed to request password reset OTP" }, 500);
  }
};

export const handleForgotPasswordReset = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const { resetToken, otp, newPassword } = await c.req.json();
    if (!resetToken || !otp || !newPassword) {
      return c.json({ error: "Reset token, OTP code, and new password are required" }, 400);
    }

    if (newPassword.length < 6) {
      return c.json({ error: "New password must be at least 6 characters" }, 400);
    }

    const secret = getJwtSecret(c.env);
    let payload: any;
    try {
      payload = await verify(resetToken, secret, "HS256");
    } catch {
      return c.json({ error: "Reset session expired. Please request a new code." }, 401);
    }

    if (payload.purpose !== "password_reset" || !payload.adminId) {
      return c.json({ error: "Invalid reset session" }, 401);
    }

    const isValid = await verifyAdminOtp(c.env, payload.adminId, otp, "Password Reset");
    if (!isValid) {
      return c.json({ error: "Invalid or expired OTP code." }, 400);
    }

    await updateAdminPassword(c.env, payload.adminId, newPassword);
    return c.json({ success: true, message: "Password updated successfully! You can now sign in with your new password." });
  } catch (err: any) {
    return c.json({ error: "Failed to reset password: " + err.message }, 500);
  }
};

const getAuthAdmin = async (
  c: Context<{ Bindings: Bindings }>
): Promise<AdminPayload | null> => {
  const fromContext = c.get("admin" as never) as AdminPayload | undefined;
  if (fromContext && fromContext.id) return fromContext;

  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    const secret = getJwtSecret(c.env);
    try {
      const payload = (await verify(token, secret, "HS256")) as unknown as AdminPayload;
      if (payload && (payload.id || payload.username)) {
        return payload;
      }
    } catch {}
  }
  return null;
};

const resolveAdminAccount = async (
  env: Bindings,
  auth: AdminPayload
) => {
  let admin = auth.id ? await getAdminById(env, auth.id) : null;
  if (!admin && auth.username) {
    admin = await getAdminByUsername(env, auth.username);
  }
  if (!admin) {
    admin = await getFirstAdmin(env);
  }
  return admin;
};

export const handleGetAdminProfile = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const auth = await getAuthAdmin(c);
    if (!auth) return c.json({ error: "Session expired. Please sign in again." }, 401);

    const admin = await resolveAdminAccount(c.env, auth);
    if (!admin) return c.json({ error: "Admin account not found" }, 404);

    return c.json({
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        twoFactorEnabled: admin.twoFactorEnabled,
      },
    });
  } catch (err: any) {
    return c.json({ error: "Failed to fetch profile" }, 500);
  }
};

export const handleUpdateAdminProfile = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const auth = await getAuthAdmin(c);
    if (!auth) return c.json({ error: "Session expired. Please sign in again." }, 401);

    const { username, email } = await c.req.json();
    if (!username || !username.trim()) {
      return c.json({ error: "Username cannot be empty" }, 400);
    }

    const admin = await resolveAdminAccount(c.env, auth);
    if (!admin) return c.json({ error: "Admin account not found" }, 404);

    const updated = await updateAdminProfile(c.env, admin.id, { username, email });

    // Issue refreshed token with the updated credentials
    const secret = getJwtSecret(c.env);
    const token = await createToken({ id: updated.id, username: updated.username }, secret);

    return c.json({
      success: true,
      token,
      admin: {
        id: updated.id,
        username: updated.username,
        email: updated.email,
        twoFactorEnabled: updated.twoFactorEnabled,
      },
      message: "Admin profile updated successfully",
    });
  } catch (err: any) {
    return c.json({ error: "Failed to update profile: " + err.message }, 500);
  }
};

export const handleChangePassword = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const auth = await getAuthAdmin(c);
    if (!auth) return c.json({ error: "Session expired. Please sign in again." }, 401);

    const { currentPassword, newPassword } = await c.req.json();

    if (!currentPassword || !newPassword) {
      return c.json({ error: "Current password and new password are required" }, 400);
    }
    if (newPassword.length < 6) {
      return c.json({ error: "New password must be at least 6 characters" }, 400);
    }

    const admin = await resolveAdminAccount(c.env, auth);
    if (!admin) return c.json({ error: "Admin account not found" }, 404);

    const isValid = await verifyPassword(currentPassword, admin.passwordHash, admin.salt);
    if (!isValid) {
      return c.json({ error: "Incorrect current password" }, 400);
    }

    await updateAdminPassword(c.env, admin.id, newPassword);
    return c.json({ success: true, message: "Password updated successfully" });
  } catch (err: any) {
    return c.json({ error: "Failed to change password: " + err.message }, 500);
  }
};

export const handleToggle2FA = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const auth = await getAuthAdmin(c);
    if (!auth) return c.json({ error: "Session expired. Please sign in again." }, 401);

    const { enabled } = await c.req.json();
    const admin = await resolveAdminAccount(c.env, auth);
    if (!admin) return c.json({ error: "Admin account not found" }, 404);

    if (enabled && !admin.email) {
      return c.json(
        {
          error: "Cannot enable 2FA without a registered email address. Please update your profile email first.",
        },
        400
      );
    }

    const updated = await toggleAdmin2FA(c.env, admin.id, !!enabled);
    return c.json({
      success: true,
      twoFactorEnabled: updated.twoFactorEnabled,
      message: updated.twoFactorEnabled
        ? "Two-Factor Authentication is now enabled. You will receive a verification code on login."
        : "Two-Factor Authentication is now disabled.",
    });
  } catch (err: any) {
    return c.json({ error: "Failed to toggle 2FA" }, 500);
  }
};

export const handleAdminMe = async (c: Context<{ Bindings: Bindings }>) => {
  const auth = await getAuthAdmin(c);
  if (!auth) return c.json({ error: "Unauthorized" }, 401);

  const admin = await resolveAdminAccount(c.env, auth);
  if (!admin) return c.json({ admin: auth });

  return c.json({
    admin: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      twoFactorEnabled: admin.twoFactorEnabled,
    },
  });
};

// ================= LEADS CONTROLLERS ================= //

export const handleGetLeads = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const status = c.req.query("status");
    const leadsList = await getAllLeads(c.env, status);
    return c.json({ leads: leadsList });
  } catch (err) {
    console.error("Get leads error:", err);
    return c.json({ error: "Failed to fetch leads" }, 500);
  }
};

export const handleUpdateLead = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid lead ID" }, 400);

    const body = await c.req.json();
    const updated = await updateLeadStatusAndNotes(c.env, id, body);
    return c.json({ success: true, lead: updated });
  } catch (err) {
    console.error("Update lead error:", err);
    return c.json({ error: "Failed to update lead" }, 500);
  }
};

export const handleCreateManualLead = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (!body.name || !body.phone || !body.movingFrom || !body.movingTo) {
      return c.json({ error: "Name, phone, moving from, and moving to are required." }, 400);
    }
    const created = await createManualLead(c.env, {
      name: body.name,
      phone: body.phone,
      movingFrom: body.movingFrom,
      movingTo: body.movingTo,
      moveType: body.moveType || "Within City",
      service: body.service || "Home Shifting",
      timeline: body.timeline || "Within a week",
      email: body.email,
      notes: body.notes,
    });
    return c.json({ success: true, lead: created }, 201);
  } catch (err) {
    console.error("Create manual lead error:", err);
    return c.json({ error: "Failed to create manual lead" }, 500);
  }
};

// ================= QUOTATIONS CONTROLLERS ================= //

export const handleCreateQuotation = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (!body.customerName || !body.customerPhone || !body.movingFrom || !body.movingTo) {
      return c.json({ error: "Customer details and route are required." }, 400);
    }

    const quote = await createQuotation(c.env, body);
    return c.json({ success: true, quote }, 201);
  } catch (err) {
    console.error("Create quote error:", err);
    return c.json({ error: "Failed to create quotation" }, 500);
  }
};

export const handleGetQuotations = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const list = await getAllQuotations(c.env);
    return c.json({ quotes: list });
  } catch (err) {
    console.error("Get quotations error:", err);
    return c.json({ error: "Failed to fetch quotations" }, 500);
  }
};

export const handleGetQuotationById = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid quotation ID" }, 400);
    const quote = await getQuotationById(c.env, id);
    if (!quote) return c.json({ error: "Quotation not found" }, 404);
    return c.json({ quote });
  } catch (err) {
    return c.json({ error: "Failed to fetch quotation" }, 500);
  }
};

export const handleUpdateQuotationStatus = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid quotation ID" }, 400);
    const { status } = await c.req.json();
    const allowed = ["draft", "sent", "accepted", "rejected"];
    if (!status || !allowed.includes(status)) {
      return c.json({ error: `Invalid status. Must be one of: ${allowed.join(", ")}` }, 400);
    }
    const updated = await updateQuotationStatus(c.env, id, status);
    return c.json({ success: true, quote: updated });
  } catch (err) {
    return c.json({ error: "Failed to update quotation" }, 500);
  }
};

export const handleUpdateQuotation = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid quotation ID" }, 400);
    const body = await c.req.json();
    const updated = await updateQuotation(c.env, id, body);
    if (!updated) return c.json({ error: "Quotation not found" }, 404);
    return c.json({ success: true, quote: updated });
  } catch (err) {
    console.error("Update quotation error:", err);
    return c.json({ error: "Failed to update quotation" }, 500);
  }
};

export const handleDeleteQuotation = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid quotation ID" }, 400);
    // Guard: don't allow deleting a quote that's already accepted (job may exist)
    const existing = await getQuotationById(c.env, id);
    if (!existing) return c.json({ error: "Quotation not found" }, 404);
    if (existing.status === "accepted") {
      return c.json({ error: "Cannot delete an accepted quotation. A job may already be linked to it." }, 409);
    }
    await deleteQuotation(c.env, id);
    return c.json({ success: true });
  } catch (err) {
    console.error("Delete quotation error:", err);
    return c.json({ error: "Failed to delete quotation" }, 500);
  }
};

// ================= JOBS CONTROLLERS ================= //

export const handleCreateJob = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (!body.customerName || !body.customerPhone || !body.scheduledDate) {
      return c.json({ error: "Customer details and scheduled date are required." }, 400);
    }
    const job = await createJob(c.env, body);
    return c.json({ success: true, job }, 201);
  } catch (err) {
    console.error("Create job error:", err);
    return c.json({ error: "Failed to create job" }, 500);
  }
};

export const handleGetJobs = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const list = await getAllJobs(c.env);
    return c.json({ jobs: list });
  } catch (err) {
    return c.json({ error: "Failed to fetch jobs" }, 500);
  }
};

export const handleGetJobById = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid job ID" }, 400);
    const job = await getJobById(c.env, id);
    if (!job) return c.json({ error: "Job not found" }, 404);
    return c.json({ job });
  } catch (err) {
    return c.json({ error: "Failed to fetch job" }, 500);
  }
};

export const handleUpdateJob = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid job ID" }, 400);
    const body = await c.req.json();
    // Whitelist allowed job update fields to prevent mass-assignment
    const allowedFields = [
      "customerName", "customerPhone", "pickupAddress", "deliveryAddress",
      "scheduledDate", "scheduledTime", "vehicleAssigned", "driverName",
      "driverPhone", "crewMembers", "specialNotes", "status",
    ];
    const safeUpdate: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) safeUpdate[key] = body[key];
    }
    const updated = await updateJob(c.env, id, safeUpdate as never);
    return c.json({ success: true, job: updated });
  } catch (err) {
    return c.json({ error: "Failed to update job" }, 500);
  }
};

// ================= INVOICES CONTROLLERS ================= //

export const handleCreateInvoice = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (!body.customerName || !body.customerPhone || body.totalAmount === undefined) {
      return c.json({ error: "Customer details and total amount are required." }, 400);
    }
    if (isNaN(Number(body.totalAmount)) || Number(body.totalAmount) < 0) {
      return c.json({ error: "totalAmount must be a non-negative number" }, 400);
    }
    const invoice = await createInvoice(c.env, body);
    return c.json({ success: true, invoice }, 201);
  } catch (err) {
    console.error("Create invoice error:", err);
    return c.json({ error: "Failed to create invoice" }, 500);
  }
};

export const handleGetInvoices = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const list = await getAllInvoices(c.env);
    return c.json({ invoices: list });
  } catch (err) {
    return c.json({ error: "Failed to fetch invoices" }, 500);
  }
};

export const handleGetInvoiceById = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid invoice ID" }, 400);
    const invoice = await getInvoiceById(c.env, id);
    if (!invoice) return c.json({ error: "Invoice not found" }, 404);
    return c.json({ invoice });
  } catch (err) {
    return c.json({ error: "Failed to fetch invoice" }, 500);
  }
};

export const handleUpdateInvoicePayment = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid invoice ID" }, 400);
    const body = await c.req.json();
    if (body.advancePaid !== undefined && (isNaN(Number(body.advancePaid)) || Number(body.advancePaid) < 0)) {
      return c.json({ error: "advancePaid must be a non-negative number" }, 400);
    }
    const updated = await updateInvoicePayment(c.env, id, body);
    return c.json({ success: true, invoice: updated });
  } catch (err) {
    return c.json({ error: "Failed to update invoice payment" }, 500);
  }
};

// ================= BILTIES CONTROLLERS ================= //

export const handleCreateBilty = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (!body.consignorName || !body.consigneeName || !body.truckNumber) {
      return c.json({ error: "Consignor, consignee, and truck number are required." }, 400);
    }
    const bilty = await createBilty(c.env, body);
    return c.json({ success: true, bilty }, 201);
  } catch (err) {
    console.error("Create bilty error:", err);
    return c.json({ error: "Failed to create bilty" }, 500);
  }
};

export const handleGetBilties = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const list = await getAllBilties(c.env);
    return c.json({ bilties: list });
  } catch (err) {
    return c.json({ error: "Failed to fetch bilties" }, 500);
  }
};

export const handleGetBiltyById = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid bilty ID" }, 400);
    const bilty = await getBiltyById(c.env, id);
    if (!bilty) return c.json({ error: "Bilty not found" }, 404);
    return c.json({ bilty });
  } catch (err) {
    return c.json({ error: "Failed to fetch bilty" }, 500);
  }
};

// ================= SETTINGS CONTROLLERS ================= //

export const handleGetSettings = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const settings = await getCompanySettings(c.env);
    return c.json({ settings });
  } catch (err: any) {
    console.error("Get settings error:", err);
    return c.json({ error: "Unable to retrieve settings. Please try again." }, 500);
  }
};

export const handleUpdateSettings = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return c.json({ error: "Settings must be a valid JSON object" }, 400);
    }
    const updated = await updateCompanySettings(c.env, body);
    return c.json({ success: true, settings: updated });
  } catch (err: any) {
    console.error("Update settings error:", err);
    return c.json({ error: "Failed to save settings. Please try again." }, 500);
  }
};

// ================= LEAD PIPELINE ================= //

export const handleGetLeadById = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid lead ID" }, 400);
    const lead = await getLeadById(c.env, id);
    if (!lead) return c.json({ error: "Lead not found" }, 404);
    return c.json({ lead });
  } catch (err) {
    return c.json({ error: "Failed to fetch lead" }, 500);
  }
};

export const handleGetLeadPipeline = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid lead ID" }, 400);
    const pipeline = await getLeadPipeline(c.env, id);
    if (!pipeline) return c.json({ error: "Lead not found" }, 404);
    return c.json(pipeline);
  } catch (err) {
    return c.json({ error: "Failed to fetch lead pipeline" }, 500);
  }
};

// ================= VEHICLES ================= //

export const handleGetVehicles = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const status = c.req.query("status");
    const date = c.req.query("date");
    const vehiclesList = await getAllVehicles(c.env, { status, date });
    return c.json({ vehicles: vehiclesList });
  } catch (err) {
    return c.json({ error: "Failed to fetch vehicles" }, 500);
  }
};

export const handleGetVehicleById = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid vehicle ID" }, 400);
    const profile = await getVehicleProfile(c.env, id);
    if (!profile) return c.json({ error: "Vehicle not found" }, 404);
    return c.json(profile);
  } catch (err) {
    return c.json({ error: "Failed to fetch vehicle" }, 500);
  }
};

export const handleCreateVehicle = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (!body.vehicleNumber || !body.vehicleType) {
      return c.json({ error: "Vehicle number and type are required" }, 400);
    }
    const vehicle = await createVehicle(c.env, body);
    return c.json({ success: true, vehicle }, 201);
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to create vehicle" }, 500);
  }
};

export const handleUpdateVehicle = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid vehicle ID" }, 400);
    const body = await c.req.json();
    const vehicle = await updateVehicle(c.env, id, body);
    return c.json({ success: true, vehicle });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to update vehicle" }, 500);
  }
};

export const handleDeleteVehicle = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid vehicle ID" }, 400);
    const vehicle = await deleteVehicle(c.env, id);
    return c.json({ success: true, vehicle });
  } catch (err) {
    return c.json({ error: "Failed to retire vehicle" }, 500);
  }
};

// ================= STAFF ================= //

export const handleGetStaff = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const role = c.req.query("role");
    const status = c.req.query("status");
    const date = c.req.query("date");
    const staffList = await getAllStaff(c.env, { role, status, date });
    return c.json({ staff: staffList });
  } catch (err) {
    return c.json({ error: "Failed to fetch staff" }, 500);
  }
};

export const handleGetStaffById = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid staff ID" }, 400);
    const profile = await getStaffProfile(c.env, id);
    if (!profile) return c.json({ error: "Staff member not found" }, 404);
    return c.json(profile);
  } catch (err) {
    return c.json({ error: "Failed to fetch staff member" }, 500);
  }
};

export const handleCreateStaff = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const body = await c.req.json();
    if (!body.name || !body.phone || !body.role) {
      return c.json({ error: "Name, phone, and role are required" }, 400);
    }
    const member = await createStaff(c.env, body);
    return c.json({ success: true, staff: member }, 201);
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to create staff member" }, 500);
  }
};

export const handleUpdateStaff = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid staff ID" }, 400);
    const body = await c.req.json();
    const member = await updateStaff(c.env, id, body);
    return c.json({ success: true, staff: member });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to update staff member" }, 500);
  }
};

export const handleDeleteStaff = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const id = parseId(c.req.param("id"));
    if (!id) return c.json({ error: "Invalid staff ID" }, 400);
    const member = await deleteStaff(c.env, id);
    return c.json({ success: true, staff: member });
  } catch (err) {
    return c.json({ error: "Failed to mark staff inactive" }, 500);
  }
};

// ================= JOB RESOURCES & EXPENSES ================= //

export const handleGetJobResources = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    if (!jobId) return c.json({ error: "Invalid job ID" }, 400);
    const resources = await getJobResources(c.env, jobId);
    return c.json(resources);
  } catch (err) {
    return c.json({ error: "Failed to fetch job resources" }, 500);
  }
};

export const handleAssignVehiclesToJob = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    if (!jobId) return c.json({ error: "Invalid job ID" }, 400);
    const body = await c.req.json();
    const vehiclesList = Array.isArray(body) ? body : body.vehicles || [];
    const resources = await assignVehiclesToJob(c.env, jobId, vehiclesList);
    return c.json({ success: true, ...resources });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to assign vehicles" }, 500);
  }
};

export const handleRemoveVehicleFromJob = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    const vehicleId = parseId(c.req.param("vehicleId"));
    if (!jobId || !vehicleId) return c.json({ error: "Invalid job or vehicle ID" }, 400);
    const resources = await removeVehicleFromJob(c.env, jobId, vehicleId);
    return c.json({ success: true, ...resources });
  } catch (err) {
    return c.json({ error: "Failed to remove vehicle" }, 500);
  }
};

export const handleAssignStaffToJob = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    if (!jobId) return c.json({ error: "Invalid job ID" }, 400);
    const body = await c.req.json();
    const staffList = Array.isArray(body) ? body : body.staff || [];
    const resources = await assignStaffToJob(c.env, jobId, staffList);
    return c.json({ success: true, ...resources });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to assign staff" }, 500);
  }
};

export const handleRemoveStaffFromJob = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    const staffId = parseId(c.req.param("staffId"));
    if (!jobId || !staffId) return c.json({ error: "Invalid job or staff ID" }, 400);
    const resources = await removeStaffFromJob(c.env, jobId, staffId);
    return c.json({ success: true, ...resources });
  } catch (err) {
    return c.json({ error: "Failed to remove staff" }, 500);
  }
};

export const handleUpdateStaffPayment = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    const staffId = parseId(c.req.param("staffId"));
    if (!jobId || !staffId) return c.json({ error: "Invalid job or staff ID" }, 400);
    const body = await c.req.json();
    const updated = await updateStaffJobPayment(c.env, jobId, staffId, body);
    return c.json({ success: true, record: updated });
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to update staff payment" }, 500);
  }
};

export const handleAddJobExpense = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    if (!jobId) return c.json({ error: "Invalid job ID" }, 400);
    const body = await c.req.json();
    if (!body.category || body.amount === undefined) {
      return c.json({ error: "Category and amount are required" }, 400);
    }
    if (isNaN(Number(body.amount)) || Number(body.amount) < 0) {
      return c.json({ error: "Expense amount must be a non-negative number" }, 400);
    }
    const expense = await addJobExpense(c.env, jobId, body);
    return c.json({ success: true, expense }, 201);
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to add expense" }, 500);
  }
};

export const handleDeleteJobExpense = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    const expenseId = parseId(c.req.param("expenseId"));
    if (!jobId || !expenseId) return c.json({ error: "Invalid job or expense ID" }, 400);
    await deleteJobExpense(c.env, jobId, expenseId);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: "Failed to delete expense" }, 500);
  }
};

export const handleGetJobProfitSummary = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const jobId = parseId(c.req.param("id"));
    if (!jobId) return c.json({ error: "Invalid job ID" }, 400);
    const profit = await getJobProfitSummary(c.env, jobId);
    return c.json(profit);
  } catch (err) {
    return c.json({ error: "Failed to calculate job profit" }, 500);
  }
};

// ================= INVOICE PAYMENTS ================= //

export const handleRecordInvoicePayment = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const invoiceId = parseId(c.req.param("id"));
    if (!invoiceId) return c.json({ error: "Invalid invoice ID" }, 400);
    const body = await c.req.json();
    if (!body.amount || !body.paymentMode || !body.paymentDate) {
      return c.json({ error: "Amount, paymentMode, and paymentDate are required" }, 400);
    }
    if (isNaN(Number(body.amount)) || Number(body.amount) <= 0) {
      return c.json({ error: "Payment amount must be a positive number" }, 400);
    }
    const validModes = ["upi", "cash", "neft", "cheque", "other"];
    if (!validModes.includes(body.paymentMode)) {
      return c.json({ error: `paymentMode must be one of: ${validModes.join(", ")}` }, 400);
    }
    const result = await recordInvoicePayment(c.env, invoiceId, body);
    return c.json({ success: true, ...result }, 201);
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to record payment" }, 500);
  }
};

export const handleGetInvoicePayments = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const invoiceId = parseId(c.req.param("id"));
    if (!invoiceId) return c.json({ error: "Invalid invoice ID" }, 400);
    const payments = await getInvoicePayments(c.env, invoiceId);
    return c.json({ payments });
  } catch (err) {
    return c.json({ error: "Failed to fetch invoice payments" }, 500);
  }
};

// ================= FINANCE METRICS & DASHBOARD ================= //

export const handleGetFinanceSummary = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const summary = await getFinanceSummary(c.env);
    return c.json(summary);
  } catch (err) {
    return c.json({ error: "Failed to fetch finance summary" }, 500);
  }
};

export const handleGetMonthlyRevenue = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const monthly = await getMonthlyRevenue(c.env);
    return c.json({ monthly });
  } catch (err) {
    return c.json({ error: "Failed to fetch monthly revenue" }, 500);
  }
};

export const handleGetTopRoutes = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const routes = await getTopRoutes(c.env);
    return c.json({ routes });
  } catch (err) {
    return c.json({ error: "Failed to fetch top routes" }, 500);
  }
};

export const handleGetPendingPayroll = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const payroll = await getPendingPayroll(c.env);
    return c.json({ payroll });
  } catch (err) {
    return c.json({ error: "Failed to fetch pending payroll" }, 500);
  }
};

// ================= DATA MANAGEMENT (STATUS, RESET, LOAD SAMPLE) ================= //

export const handleGetDataStatus = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const status = await getDataStatus(c.env);
    return c.json(status);
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to get data status" }, 500);
  }
};

export const handleResetData = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const result = await resetOperationalData(c.env);
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message || "Failed to reset operational data" }, 500);
  }
};

export const handleLoadSampleData = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const result = await loadSampleData(c.env);
    return c.json(result);
  } catch (err: any) {
    const statusCode = err.message?.includes("no operational data") ? 400 : 500;
    return c.json({ error: err.message || "Failed to load sample data" }, statusCode);
  }
};
