import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  movingFrom: text("moving_from").notNull(),
  movingTo: text("moving_to").notNull(),
  moveType: text("move_type").notNull(),
  service: text("service").notNull(),
  timeline: text("timeline").notNull(),
  email: text("email"),
  status: text("status", { enum: ["new", "contacted", "converted", "lost"] })
    .default("new")
    .notNull(),
  notes: text("notes"),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
