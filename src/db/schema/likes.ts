import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

export const likes = pgTable('likes', {
    id: serial("id").primaryKey(),
    userId: serial("user_id").notNull(),
    postId: serial("post_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export type InsertLike = InferInsertModel<typeof likes>;
export type InsertLikes = InsertLike[];

export type SelectLike = InferSelectModel<typeof likes>;
export type SelectLikes = SelectLike[];

export const likeRelations = relations(likes, ({one}) => ({
    user: one(users, {
        fields: [likes.userId],
        references: [users.id],
        relationName: "likeUser",
    }),
    post: one(posts, {
        fields: [likes.postId],
        references: [posts.id],
        relationName: "likePost",
    }),
}));
