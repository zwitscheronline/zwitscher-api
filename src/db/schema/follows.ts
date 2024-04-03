import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const follows = pgTable('follows', {
    id: serial("id").primaryKey(),
    followerId: serial("follower_id").notNull(),
    followingId: serial("following_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export type InsertFollow = InferInsertModel<typeof follows>;
export type InsertFollows = InsertFollow[];

export type SelectFollow = InferSelectModel<typeof follows>;
export type SelectFollows = SelectFollow[];

export const followsRelations = relations(follows, ({one}) => ({
    follower: one(users, {
        fields: [follows.followerId],
        references: [users.id],
        relationName: "follower",
    }),
    following: one(users, {
        fields: [follows.followingId],
        references: [users.id],
        relationName: "following",
    }),
}));
