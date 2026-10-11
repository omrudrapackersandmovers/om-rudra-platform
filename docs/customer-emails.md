# Automatic customer emails

Customer lifecycle email is captured by D1 triggers in migration `0010_email_outbox.sql`. Each notification snapshot is saved in the same database transaction as its milestone. No historical mailout runs when installing the migration.

## Triggers

- New enquiry: customer acknowledgement and company notification. Duplicate acknowledgements to the same mailbox are suppressed for ten minutes; the enquiry itself is still saved.
- Contact/support request: acknowledgement on creation and public status changes. Internal support notes never appear in customer mail.
- Quote: send on creation as `sent`, transition from draft to sent, and changes to a sent quote's route, amounts, date or validity. Draft and accepted/rejected status saves do not email estimates.
- Job: creation as scheduled confirms the booking. Date/time/address/driver changes send revised arrangements. Status changes send started, completed or cancelled notifications.
- Invoice: creation sends the invoice summary. Changes to cumulative paid amount, total or balance send a receipt or adjustment summary. Receipt amounts are the increment in cumulative paid amount.
- Existing OTP emails retain immediate security delivery.

Customer addresses come only from the linked enquiry: job → lead or quote → lead; invoice → job or quote → lead. No name or phone-number guessing. A record without a linked email is recorded as skipped. Sample leads use `support_source='sample'` and never generate sendable customer messages.

Quotes and invoices include amounts in the email body. They do not attach PDF documents. Completion emails invite feedback by reply. Customer messages link to the company mailbox, never the admin panel.

## Delivery

Successful mutation requests kick off a small dispatcher through `waitUntil`. A one-minute Cron Trigger recovers work when a request is interrupted or delivery fails. The database claim and lease prevent concurrent workers from sending the same event. Events retain their original recipient and business snapshot.

Brevo receives a stable UUID idempotency key per event. Temporary HTTP errors retry with bounded backoff; 429 respects Retry-After or waits an hour. Network errors and server errors can leave acceptance ambiguous. Ambiguous retries stop after a conservative twelve-minute window and require checking Brevo's logs, rather than risking a duplicate. Definite failures can be retried in Settings → Email Activity. Accepted means accepted by Brevo, not confirmed inbox delivery; delivery/bounce webhooks are not configured by this feature.

Email Activity shows the latest 100 records, summary counts, skip/failure reasons and retry controls. The protected `/api/admin/emails` API is never public. Accepted/skipped snapshots expire after 30 days; failed/uncertain snapshots after 90 days. Pending events remain until handled. Operational reset also clears the outbox.

`CUSTOMER_EMAILS_ENABLED=false` pauses outbox sending; queued events remain saved. Restore `true` to resume. OTP mail remains active during a lifecycle pause. `BREVO_API_KEY`, `BREVO_SENDER_EMAIL`, `BREVO_SENDER_NAME`, and `NOTIFICATION_EMAIL` use the existing Worker configuration.

## Validation and deployment

Run `npm run test:emails` and `npx tsc --noEmit` in backend. Tests use in-memory SQLite and mock Brevo; they send no real emails. Build the admin panel and check its Email Activity tab.

Apply D1 migrations before deploying the Worker: `npx wrangler d1 migrations apply DB --remote`. Deploy with `npm run deploy`. The production migration does not alter existing business records. Deploy the admin panel through its normal Pages build.

Verify with a fresh enquiry to a mailbox you control, then create a sent estimate, scheduled job, invoice and recorded payment for that enquiry. Confirm messages and Email Activity states. Customer lifecycle emails are real external messages once production is enabled; do not use arbitrary real addresses for sample testing.
