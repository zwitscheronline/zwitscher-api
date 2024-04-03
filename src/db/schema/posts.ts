import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const posts = pgTable('posts', {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 500 }).notNull(),
    authorId: serial("author_id"),
    likesCount: integer("likes_count").default(0),
    parentPostId: serial("parent_post_id"),
    originalPostId: serial("original_post_id"),
    isRetweet: boolean("is_retweet").default(false),
    groupId: serial("group_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    deletedAt: timestamp("deleted_at"),
});

export type InsertPost = InferInsertModel<typeof posts>;
export type InsertPosts = InsertPost[];

export type SelectPost = InferSelectModel<typeof posts>;
export type SelectPosts = SelectPost[];

export const postRelations = relations(posts, ({one}) => ({
    parentPost: one(posts, {
        fields: [posts.parentPostId],
        references: [posts.id],
        relationName: "parentPost",
    }),
    author: one(users, {
        fields: [posts.authorId],
        references: [users.id],
        relationName: "postAuthor",
    }),
    originalPost: one(posts, {
        fields: [posts.originalPostId],
        references: [posts.id],
        relationName: "originalPost",
    }),
}));
