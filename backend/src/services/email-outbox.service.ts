import { Bindings } from "../types";
import { company } from "../../../frontend/website/src/data/company.js";
import { customerEmail, CustomerEvent, EventDetails, leadEmail } from "./email-templates";

type OutboxRow = { id: number; event_key: string; kind: string; entity_id: number; recipient: string | null; payload: string; attempts: number; first_attempt: number | null; uncertain_since: number | null };
const validEmail = (email: string) => email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !/\.(example|invalid|test|localhost)$/i.test(email);

export function renderOutboxEmail(row: OutboxRow) {
  const data = JSON.parse(row.payload) as EventDetails;
  if (row.kind === "staff_enquiry") {
    return {
      subject: `New ${data.move_type === "Contact enquiry" ? "contact" : "moving"} enquiry · ENQ-${row.entity_id}`,
      ...leadEmail({ name: String(data.name), phone: String(data.phone), email: data.email as string | null, movingFrom: String(data.moving_from || ""), movingTo: String(data.moving_to || ""), moveType: String(data.move_type), service: String(data.service), timeline: String(data.timeline), notes: data.notes as string | null, subjectOther: data.subject_other as string | null, bookingReference: data.booking_reference as string | null }),
    };
  }
  return customerEmail(row.kind as CustomerEvent, data, row.entity_id);
}

// Claims are conditional SQL updates, so request and cron workers cannot send
// the same row concurrently. A lease makes interrupted work recoverable.
export async function drainEmailOutbox(env: Bindings, limit = 6) {
  if (!env.BREVO_API_KEY || env.CUSTOMER_EMAILS_ENABLED === "false") return;
  const now = Math.floor(Date.now() / 1000);
  const rows = await env.DB.prepare(`SELECT id,event_key,kind,entity_id,recipient,payload,attempts,first_attempt,uncertain_since
    FROM email_outbox o WHERE ((status='queued' AND next_attempt<=?) OR (status='sending' AND lease_until<?))
    AND NOT EXISTS(SELECT 1 FROM email_outbox prior WHERE prior.id<o.id AND lower(prior.recipient) IS lower(o.recipient) AND prior.status IN ('queued','sending'))
    ORDER BY id LIMIT ?`).bind(now, now, Math.min(20, limit)).all<OutboxRow>();
  for (let offset = 0; offset < rows.results.length; offset += 3) {
    await Promise.all(rows.results.slice(offset, offset + 3).map(async row => {
      const token = crypto.randomUUID();
      const claim = await env.DB.prepare(`UPDATE email_outbox SET status='sending',lease_token=?,lease_until=?,attempts=attempts+1,
        first_attempt=COALESCE(first_attempt,?),uncertain_since=CASE WHEN status='sending' THEN COALESCE(uncertain_since,first_attempt) ELSE uncertain_since END
        WHERE id=? AND ((status='queued' AND next_attempt<=?) OR (status='sending' AND lease_until<?)) RETURNING *`)
        .bind(token, now + 120, now, row.id, now, now).first<OutboxRow>();
      if (!claim) return;
      const finish = async (status: string, error: string | null, providerId: string | null = null, retry = 0, ambiguous = false) => {
        await env.DB.prepare(`UPDATE email_outbox SET status=?,last_error=?,provider_id=COALESCE(?,provider_id),
          next_attempt=?,lease_until=NULL,lease_token=NULL,accepted_at=CASE WHEN ?='accepted' THEN unixepoch() ELSE accepted_at END,
          uncertain_since=CASE WHEN ? THEN COALESCE(uncertain_since,unixepoch()) ELSE uncertain_since END
          WHERE id=? AND lease_token=?`).bind(status, error, providerId, now + retry, status, ambiguous ? 1 : 0, row.id, token).run();
        if (status === "failed" || status === "uncertain") console.error(JSON.stringify({ event: "email_dispatch_attention", outboxId: row.id, kind: row.kind, status, code: error }));
      };
      // Stay inside a conservative 12-minute dedupe window for ambiguous sends.
      // Older unknown outcomes require operator investigation, not blind retries.
      if (claim.uncertain_since && now - claim.uncertain_since >= 12 * 60) {
        await finish("uncertain", "provider_acceptance_unknown_check_brevo"); return;
      }
      const recipient = row.kind === "staff_enquiry" ? env.NOTIFICATION_EMAIL : row.recipient;
      if (!recipient || !validEmail(recipient)) { await finish("skipped", "missing_or_invalid_email"); return; }
      let message;
      try { message = renderOutboxEmail(row); } catch { await finish("failed", "invalid_event_payload"); return; }
      try {
        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST", signal: AbortSignal.timeout(8000),
          headers: { "api-key": env.BREVO_API_KEY!, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            sender: { name: env.BREVO_SENDER_NAME || company.brandName, email: row.kind === "staff_enquiry" ? "alerts@omrudrapackersandmovers.com" : env.BREVO_SENDER_EMAIL || company.email.general },
            to: [{ email: recipient }], replyTo: { name: company.brandName, email: company.email.general },
            headers: { idempotencyKey: row.event_key }, tags: ["customer-lifecycle", row.kind], ...message,
            subject: message.subject.replace(/[\r\n]+/g, " ").slice(0, 250),
          }),
        });
        const body = await res.json().catch(() => ({})) as { messageId?: string; code?: string };
        if (res.ok || body.code === "duplicate_parameter") {
          await finish("accepted", null, body.messageId || null); return;
        }
        if (res.status === 429 || res.status >= 500) {
          const retryAfter = Number(res.headers.get("Retry-After"));
          const retry = res.status === 429 ? Math.max(60, Math.min(86400, Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 3600)) : Math.min(300, 30 * 2 ** Math.min(claim.attempts, 3));
          await finish(claim.attempts >= 8 ? "failed" : "queued", `brevo_http_${res.status}`, null, retry, res.status >= 500); return;
        }
        await finish("failed", `brevo_http_${res.status}`);
      } catch {
        await finish("queued", "network_or_timeout", null, 60, true);
      }
    }));
  }
}

export async function maintainEmailOutbox(env: Bindings) {
  await drainEmailOutbox(env, 6);
  // Snapshots contain customer information; retain only a bounded audit trail.
  await env.DB.prepare("DELETE FROM email_outbox WHERE created_at < unixepoch()-? AND status IN ('accepted','skipped')").bind(30 * 86400).run();
  await env.DB.prepare("DELETE FROM email_outbox WHERE created_at < unixepoch()-? AND status IN ('failed','uncertain')").bind(90 * 86400).run();
}
