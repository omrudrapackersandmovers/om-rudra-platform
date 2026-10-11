import { NewLead } from "../db/schema/leads";
import { company } from "../../../frontend/website/src/data/company.js";

const logo = "https://res.cloudinary.com/dqdwk0nk/image/upload/b_white,c_pad,w_600,h_220/f_png/v1791709380/lockup-red-1080.png";
const symbol = "https://res.cloudinary.com/dqdwk0nk/image/upload/v1791709388/symbol-red-512.png";
const adminUrl = "https://admin.omrudrapackersandmovers.com";

export const html = (value?: string | null) => String(value ?? "")
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

function button(label: string, url: string) {
  return `<table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="#b7193b" style="border-radius:8px;background-color:#b7193b;text-align:center;"><a href="${html(url)}" style="display:inline-block;padding:14px 24px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">${html(label)}</a></td></tr></table>`;
}

function shell(preheader: string, category: string, content: string, footer: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light dark"><style>
    @media(max-width:480px){.email-content{padding:28px 20px!important}.email-title{font-size:26px!important}.email-outer{padding:12px 0!important}}
    @media(prefers-color-scheme:dark){.email-body,.email-outer{background-color:#12151c!important}.email-card{background-color:#1c222d!important;color:#f1f5f9!important}.email-title,.email-value{color:#f1f5f9!important}.email-muted{color:#b3bfd0!important}.email-panel{background-color:#252d3a!important}.email-rule{border-color:#394353!important}.email-link{color:#ff8fa8!important}}
  </style></head><body class="email-body" style="margin:0;background-color:#f3f5f8;font-family:Arial,Helvetica,sans-serif;color:#172033;">
  <div style="display:none;font-size:1px;color:#f3f5f8;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${html(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-outer" bgcolor="#f3f5f8" style="padding:32px 12px;background-color:#f3f5f8;"><tr><td align="center">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-card" bgcolor="#ffffff" style="max-width:600px;background-color:#ffffff;border:1px solid #e3e8ef;border-radius:12px;overflow:hidden;">
  <tr><td bgcolor="#b7193b" height="4" style="height:4px;line-height:4px;font-size:1px;">&nbsp;</td></tr>
  <tr><td class="email-content" style="padding:32px 36px;">
    <img src="${logo}" width="216" height="79" alt="Om Rudra Packers and Movers" style="display:block;width:216px;max-width:100%;height:auto;border:0;border-radius:6px;">
    <p class="email-muted" style="margin:24px 0 10px;color:#68758a;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">${html(category)}</p>
    ${content}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-rule" style="margin-top:28px;border-top:1px solid #e3e8ef;"><tr><td style="padding-top:20px;"><p class="email-muted" style="margin:0;color:#68758a;font-size:12px;line-height:1.7;">${footer}</p></td></tr></table>
  </td></tr></table>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;"><tr><td align="center" style="padding:20px 20px 0;">
    <img src="${symbol}" width="24" height="24" alt="" style="display:block;border:0;margin:0 auto 8px;">
    <p class="email-muted" style="margin:0;color:#68758a;font-size:11px;line-height:1.7;">${html(company.legalName)}<br>Automated account and enquiry notifications</p>
  </td></tr></table></td></tr></table></body></html>`;
}

const title = (value: string) => `<h1 class="email-title" style="margin:0 0 12px;color:#172033;font-size:30px;line-height:1.2;letter-spacing:-0.6px;">${html(value)}</h1>`;
const paragraph = (value: string) => `<p class="email-muted" style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#68758a;">${value}</p>`;

export function leadEmail(lead: NewLead) {
  const contact = lead.moveType === "Contact enquiry";
  const heading = contact ? "A new customer message." : "A new move to plan.";
  const service = lead.service === "Other" && lead.subjectOther ? lead.subjectOther : lead.service;
  const fields: [string, string | null | undefined][] = [
    ["Customer", lead.name], ["Phone", lead.phone], ["Email", lead.email],
    [contact ? "Subject" : "Service", service],
    ...(!contact ? [["Moving from", lead.movingFrom], ["Moving to", lead.movingTo], ["Move type", lead.moveType], ["Timeline", lead.timeline]] as [string, string][] : []),
    ["Booking reference", lead.bookingReference],
  ];
  const rows = fields.filter(([, value]) => value?.trim()).map(([label, value]) => `<tr><td class="email-rule" style="padding:12px 0;border-bottom:1px solid #e3e8ef;"><div class="email-muted" style="font-size:11px;color:#68758a;margin-bottom:5px;">${html(label)}</div><div class="email-value" style="font-size:15px;font-weight:bold;line-height:1.5;color:#172033;overflow-wrap:anywhere;">${label === "Phone" ? `<a class="email-link" href="tel:${encodeURIComponent(value!)}" style="color:#b7193b;">${html(value)}</a>` : label === "Email" ? `<a class="email-link" href="mailto:${encodeURIComponent(value!)}" style="color:#b7193b;">${html(value)}</a>` : html(value)}</div></td></tr>`).join("");
  const notes = lead.notes ? `<div class="email-panel" style="margin:24px 0;padding:20px;background-color:#f3f5f8;border-radius:8px;"><p class="email-muted" style="margin:0 0 8px;font-size:11px;font-weight:bold;color:#68758a;">${contact ? "CUSTOMER MESSAGE" : "MOVING DETAILS"}</p><p class="email-value" style="margin:0;font-size:14px;line-height:1.7;color:#172033;overflow-wrap:anywhere;">${html(lead.notes).replace(/\r?\n/g, "<br>")}</p></div>` : "";
  return {
    htmlContent: shell(`${contact ? "New contact enquiry" : "New moving enquiry"} from ${lead.name}.`, contact ? "Customer enquiry" : "Moving enquiry", `${title(heading)}${paragraph("Review the details below and contact the customer to discuss their request.")}<table role="presentation" width="100%" cellspacing="0" cellpadding="0">${rows}</table>${notes}<div style="margin-top:24px;">${button("Open enquiries", `${adminUrl}/leads`)}</div>`, "This enquiry is saved in your admin panel. Sign in to review it and record your follow-up."),
    textContent: `${contact ? "New contact enquiry" : "New moving enquiry"}\n\n${fields.filter(([,v])=>v?.trim()).map(([k,v])=>`${k}: ${v}`).join("\n")}\n${lead.notes ? `\nMessage: ${lead.notes}\n` : ""}\nOpen enquiries: ${adminUrl}/leads\n\n${company.legalName}`,
  };
}

export function securityEmail(code: string, purpose: string) {
  const reset = purpose === "Password Reset";
  const heading = reset ? "Reset your password." : purpose === "2FA Login Verification" ? "Verify your sign-in." : "Verify your account.";
  const explanation = reset ? "Enter this code on the password reset screen to choose a new password." : "Enter this code on the verification screen to continue securely.";
  return {
    htmlContent: shell("Your verification code expires in 10 minutes.", "Account security", `${title(heading)}${paragraph(explanation)}<table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-panel" bgcolor="#f3f5f8" style="background-color:#f3f5f8;border-radius:8px;"><tr><td align="center" style="padding:26px 12px;"><p class="email-muted" style="margin:0 0 12px;color:#68758a;font-size:11px;font-weight:bold;letter-spacing:1px;">VERIFICATION CODE</p><p class="email-value" style="margin:0;color:#172033;font-family:Consolas,'Courier New',monospace;font-size:36px;font-weight:bold;letter-spacing:6px;">${html(code)}</p><p class="email-muted" style="margin:14px 0 0;color:#68758a;font-size:12px;">Valid for 10 minutes</p></td></tr></table><p class="email-muted" style="margin:20px 0 0;color:#68758a;font-size:13px;line-height:1.7;">Keep this code private. Our team will never ask you to share it.</p>`, "If you did not request this code, do not use or share it. Review your account security if you notice unexpected activity."),
    textContent: `${heading}\n\n${explanation}\n\nVerification code: ${code}\nValid for 10 minutes. Keep this code private.\n\nIf you did not request this code, do not use or share it.\n\n${company.legalName}`,
  };
}
