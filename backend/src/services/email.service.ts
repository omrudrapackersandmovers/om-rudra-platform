import { NewLead } from "../db/schema/leads";
import { leadEmail, securityEmail } from "./email-templates";
import { company } from "../../../frontend/website/src/data/company.js";

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
    ...leadEmail(lead),
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
  const safeOtp = sanitizeHeader(otpCode);

  const subject = `[Om Rudra P&M Security] ${safeOtp} is your ${safePurposeHeader} code`;

  const payload = {
    sender: { name: fromName, email: fromEmail },
    to: [{ email: recipientEmail }],
    subject,
    ...securityEmail(safeOtp, purpose),
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
