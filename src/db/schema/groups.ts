import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const groups = pgTable("groups", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    isPublicGroup: boolean("is_public_group").notNull().default(true),
    creatorId: serial("creator_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});

export const groupMembers = pgTable("group_members", {
    groupId: serial("group_id").notNull().references(() => groups.id),
    userId: serial("post_id").notNull().references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});

export const groupJoinRequests = pgTable("group_join_requests", {
    id: serial("id").primaryKey(),
    groupId: serial("group_id").notNull().references(() => groups.id),
    userId: serial("post_id").notNull().references(() => users.id),
    justification: varchar("justification", { length: 500 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});
