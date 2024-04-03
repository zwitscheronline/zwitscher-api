import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { lists } from "./lists";
import { users } from "./users";

export const listFollowers = pgTable('list_followers', {
    id: serial("id").primaryKey(),
    listId: serial("list_id").notNull(),
    userId: serial("user_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export type InsertListFollower = InferInsertModel<typeof listFollowers>;

export type SelectListFollower = InferSelectModel<typeof listFollowers>;
export type SelectListFollowers = SelectListFollower[];

export const listFollowersRelations = relations(listFollowers, ({one}) => ({
    list: one(lists, {
        fields: [listFollowers.listId],
        references: [lists.id],
        relationName: "listFollowerList",
    }),
    user: one(users, {
        fields: [listFollowers.userId],
        references: [users.id],
        relationName: "listFollower",
    }),
}));
