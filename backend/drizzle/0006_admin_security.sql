-- Admin profile and authentication fields required by the current schema.
ALTER TABLE admins ADD COLUMN email TEXT;
ALTER TABLE admins ADD COLUMN two_factor_enabled INTEGER NOT NULL DEFAULT 0;
ALTER TABLE admins ADD COLUMN otp_code TEXT;
ALTER TABLE admins ADD COLUMN otp_expires_at TEXT;
ALTER TABLE admins ADD COLUMN otp_purpose TEXT;
ALTER TABLE admins ADD COLUMN otp_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE admins ADD COLUMN updated_at TEXT;
