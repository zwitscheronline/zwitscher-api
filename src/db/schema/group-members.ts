import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { users } from "./users";

export const groupMembers = pgTable('group_members', {
    id: serial("id").primaryKey(),
    groupId: serial("group_id").notNull(),
    userId: serial("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    createdById: serial("created_by_id").notNull(),
});

export type InsertGroupMember = InferInsertModel<typeof groupMembers>;

export type SelectGroupMember = InferSelectModel<typeof groupMembers>;
export type SelectGroupMembers = SelectGroupMember[];

export const groupMembersRelations = relations(groupMembers, ({one}) => ({
    group: one(groups, {
        fields: [groupMembers.groupId],
        references: [groups.id],
        relationName: "groupMemberGroup",
    }),
    user: one(users, {
        fields: [groupMembers.userId],
        references: [users.id],
        relationName: "groupMember",
    }),
    creator: one(users, {
        fields: [groupMembers.createdById],
        references: [users.id],
        relationName: "groupMemberCreator",
    })
}));
