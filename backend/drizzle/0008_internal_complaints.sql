ALTER TABLE leads ADD COLUMN support_source TEXT NOT NULL DEFAULT 'website';
ALTER TABLE leads ADD COLUMN booking_reference TEXT;
