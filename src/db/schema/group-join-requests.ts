import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { users } from "./users";

export const groupJoinRequests = pgTable('group_join_requests', {
    id: serial("id").primaryKey(),
    groupId: serial("group_id").notNull(),
    userId: serial("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export type InsertGroupJoinRequest = InferInsertModel<typeof groupJoinRequests>;

export type SelectGroupJoinRequest = InferSelectModel<typeof groupJoinRequests>;
export type SelectGroupJoinRequests = SelectGroupJoinRequest[];

export const groupJoinRequestsRelations = relations(groupJoinRequests, ({one}) => ({
    group: one(groups, {
        fields: [groupJoinRequests.groupId],
        references: [groups.id],
        relationName: "groupJoinRequestGroup",
    }),
    user: one(users, {
        fields: [groupJoinRequests.userId],
        references: [users.id],
        relationName: "groupJoinRequestUser",
    }),
}));
