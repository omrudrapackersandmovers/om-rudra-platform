import { NewLead } from "../db/schema/leads";
import { company } from "../../../frontend/website/src/data/company.js";

// Flatten the transparent lockup onto white inside the PNG itself. Email clients
// can change HTML background colors in dark mode, but the image stays readable.
const emailLogoUrl = "https://res.cloudinary.com/dqdwk0nk/image/upload/b_white,c_pad,w_600,h_220/f_png/v1791709380/lockup-red-1080.png";
const emailSymbolUrl = "https://res.cloudinary.com/dqdwk0nk/image/upload/v1791709388/symbol-red-512.png";

const emailBrandHeader = () => `
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding: 0 0 20px;">
    <img src="${emailLogoUrl}" width="260" alt="Om Rudra Packers and Movers" style="display: block; width: 260px; max-width: 100%; height: auto; border: 0; background-color: #ffffff; border-radius: 8px;" />
    <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">${escapeHtml(company.legalName)}</p>
  </td></tr></table>`;

const emailBrandFooter = () => `
  <table role="presentation" cellspacing="0" cellpadding="0" style="margin-top: 16px;"><tr>
    <td width="32" style="vertical-align: middle;"><img src="${emailSymbolUrl}" width="24" height="24" alt="" style="display: block; border: 0;" /></td>
    <td style="font-size: 11px; line-height: 1.5; color: #64748b;">${escapeHtml(company.legalName)}</td>
  </tr></table>`;

function escapeHtml(str?: string | null): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeHeader(str?: string | null): string {
  if (!str) return "";
  return String(str).replace(/[\r\n]+/g, " ").trim();
}

export const sendLeadNotificationEmail = async (
  lead: NewLead,
  apiKey?: string,
  recipientEmail?: string
): Promise<boolean> => {
  if (!apiKey || !recipientEmail) {
    console.warn("Brevo API key or notification recipient email not set. Skipping email dispatch.");
    return false;
  }

  const safeName = sanitizeHeader(lead.name);
  const safeFrom = sanitizeHeader(lead.movingFrom);
  const safeTo = sanitizeHeader(lead.movingTo);

  const payload = {
    sender: { name: "Om Rudra Packers and Movers System", email: "alerts@omrudrapackersandmovers.com" },
    to: [{ email: recipientEmail }],
    subject: lead.moveType === "Contact enquiry" ? `New Contact Enquiry: ${safeName} - ${sanitizeHeader(lead.service)}` : `New Moving Inquiry: ${safeName} (${safeFrom} to ${safeTo})`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background-color: #ffffff; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 16px;">
      ${emailBrandHeader()}
      <h2>${lead.moveType === "Contact enquiry" ? "New Contact Enquiry" : "New Relocation Request Received"}</h2>
      <p><strong>Customer Name:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Phone:</strong> <a href="tel:${encodeURIComponent(lead.phone)}">${escapeHtml(lead.phone)}</a></p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email || "Not provided")}</p>
      <hr/>
      <p><strong>Moving From:</strong> ${escapeHtml(lead.movingFrom)}</p>
      <p><strong>Moving To:</strong> ${escapeHtml(lead.movingTo)}</p>
      <p><strong>Move Type:</strong> ${escapeHtml(lead.moveType)}</p>
      <p><strong>Service Requested:</strong> ${escapeHtml(lead.service)}</p>
      <p><strong>Preferred Timeline:</strong> ${escapeHtml(lead.timeline)}</p>
      ${lead.notes ? `<p><strong>Message / Moving Details:</strong> ${escapeHtml(lead.notes)}</p>` : ""}
      ${emailBrandFooter()}
      </div>
    `,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to send Brevo alert email:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("Network error while calling Brevo API:", err);
    return false;
  }
};

export const sendOtpEmail = async (
  recipientEmail: string,
  otpCode: string,
  purpose: "2FA Login Verification" | "Password Reset" | "Account Verification" | string,
  apiKey?: string,
  senderEmail?: string,
  senderName?: string
): Promise<boolean> => {
  // NOTE: OTP is intentionally NOT logged to prevent exposure in production logs.
  // In local dev without BREVO_API_KEY, the email is skipped but the OTP is still
  // stored in the DB; use the /auth/verify-2fa endpoint to verify it.
  if (!apiKey) {
    console.warn(
      "⚠️ BREVO_API_KEY is not set. OTP email skipped. To enable real Brevo delivery, add BREVO_API_KEY to backend/.dev.vars"
    );
    return true; // Return true so flow continues seamlessly in local development
  }

  const fromEmail = senderEmail || company.email.general;
  const fromName = senderName || company.legalName;

  const safePurposeHeader = sanitizeHeader(purpose);
  const safePurposeHtml = escapeHtml(purpose);
  const safeOtp = sanitizeHeader(otpCode);

  const subject = `[Om Rudra P&M Security] ${safeOtp} is your ${safePurposeHeader} code`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        ${emailBrandHeader()}
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Account Security Verification</p>
      </div>

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <p style="color: #475569; font-size: 14px; margin: 0 0 12px 0;">Use the following one-time code for <strong>${safePurposeHtml}</strong>:</p>
        <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2563eb; padding: 12px 16px; background: #ffffff; border: 2px dashed #93c5fd; border-radius: 8px; display: inline-block; margin: 8px 0;">
          ${escapeHtml(safeOtp)}
        </div>
        <p style="color: #94a3b8; font-size: 12px; margin: 12px 0 0 0;">This code is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>

      <div style="color: #64748b; font-size: 12px; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 16px;">
        <p style="margin: 0;">If you did not initiate this request, someone may be attempting to access your Om Rudra account. Please immediately review your account credentials.</p>
        ${emailBrandFooter()}
      </div>
    </div>
  `;

  const payload = {
    sender: { name: fromName, email: fromEmail },
    to: [{ email: recipientEmail }],
    subject,
    htmlContent,
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ Failed to send Brevo OTP email:", errText);
      console.error(
        "💡 Note: Brevo requires that the sender email ('" +
          fromEmail +
          "') be an authorized/verified sender in your Brevo dashboard under Senders & Domains."
      );
      return false;
    }
    console.log(`✅ Brevo OTP email dispatched successfully to ${recipientEmail}`);
    return true;
  } catch (err) {
    console.error("❌ Network error while calling Brevo API for OTP:", err);
    return false;
  }
};
