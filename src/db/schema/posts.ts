import { boolean, integer, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const posts = pgTable("posts", {
    id: serial("id").primaryKey(),
    likes: integer("likes").notNull().default(0),
    comments: integer("comments").notNull().default(0),
    content: varchar("content", { length: 280 }).notNull(),
    authorId: integer("author_id").notNull(),
    isRepost: boolean("is_repost").notNull().default(false),
    originalPostId: integer("original_post_id"),
    parentPostId: integer("parent_post_id"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});

export const postRelations = relations(posts, ({one}) => ({
    parentPost: one(posts, {
        fields: [posts.parentPostId],
        references: [posts.id],
    }),
    authorId: one(users, {
        fields: [posts.authorId],
        references: [users.id],
    }),
    originalPostId: one(posts, {
        fields: [posts.originalPostId],
        references: [posts.id],
    }),
}));
