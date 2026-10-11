-- Durable notifications: trigger inserts are atomic with the business change.
-- No backfill: existing customers are never emailed by this migration.
CREATE TABLE email_outbox (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 event_key TEXT NOT NULL UNIQUE DEFAULT (lower(hex(randomblob(4))||'-'||hex(randomblob(2))||'-4'||substr(hex(randomblob(2)),2)||'-8'||substr(hex(randomblob(2)),2)||'-'||hex(randomblob(6)))),
 kind TEXT NOT NULL, entity_id INTEGER NOT NULL, recipient TEXT,
 payload TEXT NOT NULL,
 status TEXT NOT NULL DEFAULT 'queued' CHECK(status IN ('queued','sending','accepted','failed','skipped','uncertain')),
 attempts INTEGER NOT NULL DEFAULT 0, next_attempt INTEGER NOT NULL DEFAULT (unixepoch()),
 lease_until INTEGER, lease_token TEXT, first_attempt INTEGER,
 uncertain_since INTEGER, provider_id TEXT, last_error TEXT, created_at INTEGER NOT NULL DEFAULT (unixepoch()), accepted_at INTEGER
);
CREATE INDEX email_outbox_recipient_order ON email_outbox(lower(recipient),status,id);
CREATE INDEX email_outbox_retention ON email_outbox(status,created_at);
CREATE INDEX email_outbox_due ON email_outbox(status,next_attempt);
CREATE INDEX email_outbox_entity ON email_outbox(kind,entity_id,id);

CREATE TRIGGER email_lead_created AFTER INSERT ON leads
WHEN NEW.support_source<>'sample'
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES('enquiry_received',NEW.id,NEW.email,json_object('name',NEW.name,'phone',NEW.phone,'email',NEW.email,'moving_from',NEW.moving_from,'moving_to',NEW.moving_to,'move_type',NEW.move_type,'service',NEW.service,'timeline',NEW.timeline,'notes',NEW.notes,'subject_other',NEW.subject_other,'booking_reference',NEW.booking_reference,'support_status',NEW.support_status),CASE WHEN NEW.email IS NULL OR trim(NEW.email)='' OR EXISTS(SELECT 1 FROM email_outbox WHERE kind='enquiry_received' AND lower(recipient)=lower(NEW.email) AND created_at>unixepoch()-600 AND status IN ('queued','sending','accepted')) THEN 'skipped' ELSE 'queued' END,CASE WHEN NEW.email IS NULL OR trim(NEW.email)='' THEN 'missing_customer_email' WHEN EXISTS(SELECT 1 FROM email_outbox WHERE kind='enquiry_received' AND lower(recipient)=lower(NEW.email) AND created_at>unixepoch()-600 AND status IN ('queued','sending','accepted')) THEN 'acknowledgement_cooldown' ELSE NULL END);
 INSERT INTO email_outbox(kind,entity_id,recipient,payload) VALUES('staff_enquiry',NEW.id,NULL,json_object('name',NEW.name,'phone',NEW.phone,'email',NEW.email,'moving_from',NEW.moving_from,'moving_to',NEW.moving_to,'move_type',NEW.move_type,'service',NEW.service,'timeline',NEW.timeline,'notes',NEW.notes,'subject_other',NEW.subject_other,'booking_reference',NEW.booking_reference,'support_status',NEW.support_status));
END;

CREATE TRIGGER email_support_update AFTER UPDATE ON leads
WHEN NEW.move_type='Contact enquiry' AND NEW.support_source<>'sample' AND NEW.support_status IS NOT OLD.support_status
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES('support_updated',NEW.id,NEW.email,json_object('name',NEW.name,'support_status',NEW.support_status,'booking_reference',NEW.booking_reference),CASE WHEN NEW.email IS NULL OR trim(NEW.email)='' THEN 'skipped' ELSE 'queued' END,CASE WHEN NEW.email IS NULL OR trim(NEW.email)='' THEN 'missing_customer_email' ELSE NULL END);
END;

CREATE TRIGGER email_quote_created AFTER INSERT ON quotations
WHEN NEW.status='sent'
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES('quote_sent',NEW.id,(SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample'),json_object('quote_number',NEW.quote_number,'customer_name',NEW.customer_name,'moving_from',NEW.moving_from,'moving_to',NEW.moving_to,'move_date',NEW.move_date,'packaging_charges',NEW.packaging_charges,'transport_charges',NEW.transport_charges,'loading_charges',NEW.loading_charges,'unloading_charges',NEW.unloading_charges,'insurance_charges',NEW.insurance_charges,'other_charges',NEW.other_charges,'discount',NEW.discount,'gst_amount',NEW.gst_amount,'total_amount',NEW.total_amount,'valid_until',NEW.valid_until),CASE WHEN (SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample'))='' THEN 'skipped' ELSE 'queued' END,CASE WHEN (SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample'))='' THEN 'missing_customer_email' ELSE NULL END);
END;

CREATE TRIGGER email_quote_updated AFTER UPDATE ON quotations
WHEN NEW.status='sent' AND (OLD.status<>'sent' OR NEW.quote_number IS NOT OLD.quote_number OR NEW.moving_from IS NOT OLD.moving_from OR NEW.moving_to IS NOT OLD.moving_to OR NEW.move_date IS NOT OLD.move_date OR NEW.packaging_charges IS NOT OLD.packaging_charges OR NEW.transport_charges IS NOT OLD.transport_charges OR NEW.loading_charges IS NOT OLD.loading_charges OR NEW.unloading_charges IS NOT OLD.unloading_charges OR NEW.insurance_charges IS NOT OLD.insurance_charges OR NEW.other_charges IS NOT OLD.other_charges OR NEW.discount IS NOT OLD.discount OR NEW.gst_amount IS NOT OLD.gst_amount OR NEW.total_amount IS NOT OLD.total_amount OR NEW.valid_until IS NOT OLD.valid_until)
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES(CASE WHEN OLD.status='sent' THEN 'quote_revised' ELSE 'quote_sent' END,NEW.id,(SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample'),json_object('quote_number',NEW.quote_number,'customer_name',NEW.customer_name,'moving_from',NEW.moving_from,'moving_to',NEW.moving_to,'move_date',NEW.move_date,'packaging_charges',NEW.packaging_charges,'transport_charges',NEW.transport_charges,'loading_charges',NEW.loading_charges,'unloading_charges',NEW.unloading_charges,'insurance_charges',NEW.insurance_charges,'other_charges',NEW.other_charges,'discount',NEW.discount,'gst_amount',NEW.gst_amount,'total_amount',NEW.total_amount,'valid_until',NEW.valid_until),CASE WHEN (SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample'))='' THEN 'skipped' ELSE 'queued' END,CASE WHEN (SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=NEW.lead_id AND support_source<>'sample'))='' THEN 'missing_customer_email' ELSE NULL END);
END;

CREATE TRIGGER email_booking_created AFTER INSERT ON jobs
WHEN NEW.status='scheduled'
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES('booking_confirmed',NEW.id,(SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample'),json_object('job_number',NEW.job_number,'customer_name',NEW.customer_name,'pickup_address',NEW.pickup_address,'delivery_address',NEW.delivery_address,'scheduled_date',NEW.scheduled_date,'scheduled_time',NEW.scheduled_time,'driver_name',NEW.driver_name,'driver_phone',NEW.driver_phone,'status',NEW.status),CASE WHEN (SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample'))='' THEN 'skipped' ELSE 'queued' END,CASE WHEN (SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample'))='' THEN 'missing_customer_email' ELSE NULL END);
END;

CREATE TRIGGER email_booking_updated AFTER UPDATE ON jobs
WHEN NEW.status IS NOT OLD.status OR (NEW.status='scheduled' AND (NEW.scheduled_date IS NOT OLD.scheduled_date OR NEW.scheduled_time IS NOT OLD.scheduled_time OR NEW.pickup_address IS NOT OLD.pickup_address OR NEW.delivery_address IS NOT OLD.delivery_address OR NEW.driver_name IS NOT OLD.driver_name OR NEW.driver_phone IS NOT OLD.driver_phone))
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES(CASE NEW.status WHEN 'completed' THEN 'move_completed' WHEN 'cancelled' THEN 'booking_cancelled' WHEN 'in_progress' THEN 'move_started' ELSE 'booking_updated' END,NEW.id,(SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample'),json_object('job_number',NEW.job_number,'customer_name',NEW.customer_name,'pickup_address',NEW.pickup_address,'delivery_address',NEW.delivery_address,'scheduled_date',NEW.scheduled_date,'scheduled_time',NEW.scheduled_time,'driver_name',NEW.driver_name,'driver_phone',NEW.driver_phone,'status',NEW.status),CASE WHEN (SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample'))='' THEN 'skipped' ELSE 'queued' END,CASE WHEN (SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE(NEW.lead_id,(SELECT lead_id FROM quotations WHERE id=NEW.quote_id)) AND support_source<>'sample'))='' THEN 'missing_customer_email' ELSE NULL END);
END;

CREATE TRIGGER email_invoice_created AFTER INSERT ON invoices
WHEN 1
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES('invoice_issued',NEW.id,(SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample'),json_object('invoice_number',NEW.invoice_number,'customer_name',NEW.customer_name,'pickup_address',NEW.pickup_address,'delivery_address',NEW.delivery_address,'subtotal',NEW.subtotal,'gst_rate',NEW.gst_rate,'gst_amount',NEW.gst_amount,'total_amount',NEW.total_amount,'advance_paid',NEW.advance_paid,'balance_due',NEW.balance_due,'payment_mode',NEW.payment_mode),CASE WHEN (SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample'))='' THEN 'skipped' ELSE 'queued' END,CASE WHEN (SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample'))='' THEN 'missing_customer_email' ELSE NULL END);
END;

CREATE TRIGGER email_invoice_updated AFTER UPDATE ON invoices
WHEN NEW.advance_paid IS NOT OLD.advance_paid OR NEW.total_amount IS NOT OLD.total_amount OR NEW.balance_due IS NOT OLD.balance_due
BEGIN
 INSERT INTO email_outbox(kind,entity_id,recipient,payload,status,last_error)
 VALUES(CASE WHEN NEW.advance_paid>OLD.advance_paid THEN 'payment_received' ELSE 'invoice_updated' END,NEW.id,(SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample'),json_object('invoice_number',NEW.invoice_number,'customer_name',NEW.customer_name,'pickup_address',NEW.pickup_address,'delivery_address',NEW.delivery_address,'subtotal',NEW.subtotal,'gst_rate',NEW.gst_rate,'gst_amount',NEW.gst_amount,'total_amount',NEW.total_amount,'advance_paid',NEW.advance_paid,'balance_due',NEW.balance_due,'payment_mode',NEW.payment_mode,'id',NEW.id,'payment_amount',NEW.advance_paid-OLD.advance_paid),CASE WHEN (SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample'))='' THEN 'skipped' ELSE 'queued' END,CASE WHEN (SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample') IS NULL OR trim((SELECT email FROM leads WHERE id=COALESCE((SELECT lead_id FROM jobs WHERE id=NEW.job_id),(SELECT lead_id FROM quotations WHERE id=COALESCE(NEW.quote_id,(SELECT quote_id FROM jobs WHERE id=NEW.job_id)))) AND support_source<>'sample'))='' THEN 'missing_customer_email' ELSE NULL END);
END;
