import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email"),
  passwordHash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).default(false).notNull(),
  otpCode: text("otp_code"),
  otpExpiresAt: text("otp_expires_at"),
  otpPurpose: text("otp_purpose"),
  otpAttempts: integer("otp_attempts").default(0).notNull(),
  updatedAt: text("updated_at"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

