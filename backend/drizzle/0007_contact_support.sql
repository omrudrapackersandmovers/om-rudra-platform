-- Keep the original contact message in notes; staff notes have their own field.
ALTER TABLE leads ADD COLUMN support_status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE leads ADD COLUMN support_notes TEXT;
CREATE INDEX IF NOT EXISTS idx_leads_contact_support ON leads (move_type, support_status);
