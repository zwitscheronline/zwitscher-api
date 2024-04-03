import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { lists } from "./lists";
import { users } from "./users";

export const listMembers = pgTable('list_members', {
    id: serial("id").primaryKey(),
    listId: serial("list_id").notNull(),
    userId: serial("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export type InsertListMember = InferInsertModel<typeof listMembers>;

export type SelectListMember = InferSelectModel<typeof listMembers>;
export type SelectListMembers = SelectListMember[];

export const listMembersRelations = relations(listMembers, ({one}) => ({
    list: one(lists, {
        fields: [listMembers.listId],
        references: [lists.id],
        relationName: "listMemberList",
    }),
    user: one(users, {
        fields: [listMembers.userId],
        references: [users.id],
        relationName: "listMember",
    }),
}));
