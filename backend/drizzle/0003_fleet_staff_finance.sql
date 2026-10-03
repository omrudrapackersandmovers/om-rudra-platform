CREATE TABLE IF NOT EXISTS `vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vehicle_number` text NOT NULL,
	`vehicle_type` text NOT NULL,
	`capacity_tons` real,
	`capacity_cft` real,
	`default_driver_name` text,
	`default_driver_phone` text,
	`status` text DEFAULT 'available' NOT NULL,
	`insurance_expiry` text,
	`fitness_expiry` text,
	`permit_expiry` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS `vehicles_vehicle_number_unique` ON `vehicles` (`vehicle_number`);

CREATE TABLE IF NOT EXISTS `staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`role` text NOT NULL,
	`specialization` text,
	`status` text DEFAULT 'available' NOT NULL,
	`id_type` text,
	`id_number` text,
	`address` text,
	`daily_wage` real,
	`joining_date` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `job_vehicles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL REFERENCES `jobs`(`id`),
	`vehicle_id` integer NOT NULL REFERENCES `vehicles`(`id`),
	`driver_name` text,
	`driver_phone` text,
	`role` text DEFAULT 'primary',
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `job_staff` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL REFERENCES `jobs`(`id`),
	`staff_id` integer NOT NULL REFERENCES `staff`(`id`),
	`role_on_job` text,
	`pay_type` text DEFAULT 'per_job',
	`rate_used` real DEFAULT 0,
	`days_worked` real DEFAULT 1,
	`amount_payable` real DEFAULT 0,
	`amount_paid` real DEFAULT 0,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`payment_date` text,
	`payment_mode` text,
	`payment_notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `job_expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`job_id` integer NOT NULL REFERENCES `jobs`(`id`),
	`category` text NOT NULL,
	`amount` real DEFAULT 0 NOT NULL,
	`description` text,
	`paid_by` text,
	`receipt_note` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS `invoice_payments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invoice_id` integer NOT NULL REFERENCES `invoices`(`id`),
	`amount` real NOT NULL,
	`payment_mode` text NOT NULL,
	`payment_date` text NOT NULL,
	`transaction_ref` text,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
