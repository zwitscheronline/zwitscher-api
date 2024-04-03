import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial("id").primaryKey(),
    userName: varchar("user_name", { length: 150 }),
    userTag: varchar("user_tag", { length: 100 }).notNull().unique(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    avatar: varchar("avatar").default("default.jpg"),
    biography: varchar("biography", { length: 500 }),
    tokenVersion: integer("token_version").default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
});

export type InsertUser = InferInsertModel<typeof users>;
export type SelectUser = InferSelectModel<typeof users>;
export type SelectUsers = SelectUser[];
