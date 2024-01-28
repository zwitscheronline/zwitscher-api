import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const lists = pgTable("lists", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    creatorId: serial("creator_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});

export const listEntries = pgTable("list_entries", {
    listId: serial("list_id").notNull().references(() => lists.id),
    userId: serial("post_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});
