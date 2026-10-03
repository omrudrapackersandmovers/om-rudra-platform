-- Phase 1 Migration: Admins, Quotations, Jobs, Invoices, Bilties

-- 1. Admins table (Web Crypto PBKDF2)
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Quotations table
CREATE TABLE IF NOT EXISTS quotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_number TEXT NOT NULL UNIQUE,
  lead_id INTEGER REFERENCES leads(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  moving_from TEXT NOT NULL,
  moving_to TEXT NOT NULL,
  move_date TEXT,
  inventory_data TEXT, -- JSON string of room inventory items & approximate CFT
  packaging_charges REAL NOT NULL DEFAULT 0,
  transport_charges REAL NOT NULL DEFAULT 0,
  loading_charges REAL NOT NULL DEFAULT 0,
  unloading_charges REAL NOT NULL DEFAULT 0,
  insurance_declared_value REAL NOT NULL DEFAULT 0,
  insurance_rate_percent REAL NOT NULL DEFAULT 0,
  insurance_charges REAL NOT NULL DEFAULT 0,
  other_charges REAL NOT NULL DEFAULT 0,
  discount REAL NOT NULL DEFAULT 0,
  gst_rate REAL NOT NULL DEFAULT 0, -- 0, 5, 18
  gst_amount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, accepted, rejected
  valid_until TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotations_quote_number ON quotations (quote_number);
CREATE INDEX IF NOT EXISTS idx_quotations_lead_id ON quotations (lead_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations (status);

-- 3. Jobs table (Active moves)
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_number TEXT NOT NULL UNIQUE,
  quote_id INTEGER REFERENCES quotations(id),
  lead_id INTEGER REFERENCES leads(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT,
  vehicle_assigned TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  crew_members TEXT,
  special_notes TEXT,
  status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_jobs_job_number ON jobs (job_number);
CREATE INDEX IF NOT EXISTS idx_jobs_scheduled_date ON jobs (scheduled_date);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs (status);

-- 4. Invoices table (GST Tax Invoices)
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  invoice_number TEXT NOT NULL UNIQUE,
  job_id INTEGER REFERENCES jobs(id),
  quote_id INTEGER REFERENCES quotations(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_gstin TEXT,
  pickup_address TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  sac_code TEXT NOT NULL DEFAULT '9965',
  subtotal REAL NOT NULL DEFAULT 0,
  gst_rate REAL NOT NULL DEFAULT 0,
  gst_amount REAL NOT NULL DEFAULT 0,
  total_amount REAL NOT NULL DEFAULT 0,
  advance_paid REAL NOT NULL DEFAULT 0,
  balance_due REAL NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'unpaid', -- unpaid, partial, paid
  payment_mode TEXT, -- UPI, Cash, Bank Transfer, Card
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices (invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_status ON invoices (payment_status);

-- 5. Bilties table (Lorry Receipts - LR)
CREATE TABLE IF NOT EXISTS bilties (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lr_number TEXT NOT NULL UNIQUE,
  job_id INTEGER REFERENCES jobs(id),
  consignor_name TEXT NOT NULL,
  consignor_address TEXT NOT NULL,
  consignor_phone TEXT NOT NULL,
  consignee_name TEXT NOT NULL,
  consignee_address TEXT NOT NULL,
  consignee_phone TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  truck_number TEXT NOT NULL,
  driver_name TEXT NOT NULL,
  driver_phone TEXT NOT NULL,
  packages_count INTEGER NOT NULL DEFAULT 1,
  goods_description TEXT NOT NULL,
  declared_value REAL NOT NULL DEFAULT 0,
  freight_amount REAL NOT NULL DEFAULT 0,
  freight_status TEXT NOT NULL DEFAULT 'to_pay', -- paid, to_pay
  risk_type TEXT NOT NULL DEFAULT 'owner_risk', -- owner_risk, carrier_risk
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bilties_lr_number ON bilties (lr_number);
CREATE INDEX IF NOT EXISTS idx_bilties_job_id ON bilties (job_id);
