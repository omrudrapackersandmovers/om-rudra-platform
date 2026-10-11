export interface Bindings extends Pick<WorkerBindings, "AI" | "CHAT_RATE_LIMITER" | "LEAD_RATE_LIMITER"> {
  DB: D1Database;
  ENVIRONMENT?: string;
  BREVO_API_KEY?: string;
  CUSTOMER_EMAILS_ENABLED?: string;
  BREVO_SENDER_EMAIL?: string;
  BREVO_SENDER_NAME?: string;
  NOTIFICATION_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
  JWT_SECRET?: string;
}

export type LeadStatus = "new" | "contacted" | "converted" | "lost";

export interface AdminPayload {
  id: number;
  username: string;
}
