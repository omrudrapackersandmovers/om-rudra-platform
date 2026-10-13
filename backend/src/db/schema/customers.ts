import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const customers = sqliteTable("customers", {
 id: integer("id").primaryKey({autoIncrement:true}),
 name: text("name").notNull(), phone: text("phone").notNull().unique(),
 email: text("email"), notes: text("notes"),
 createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
});
