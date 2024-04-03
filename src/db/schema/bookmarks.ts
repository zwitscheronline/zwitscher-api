import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

export const bookmarks = pgTable('bookmarks', {
    id: serial("id").primaryKey(),
    userId: serial("user_id").notNull(),
    postId: serial("post_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export type InsertBookmark = InferInsertModel<typeof bookmarks>;
export type InsertBookmarks = InsertBookmark[];

export type SelectBookmark = InferSelectModel<typeof bookmarks>;
export type SelectBookmarks = SelectBookmark[];

export const bookmarkRelations = relations(bookmarks, ({one}) => ({
    user: one(users, {
        fields: [bookmarks.userId],
        references: [users.id],
        relationName: "bookmarkUser",
    }),
    post: one(posts, {
        fields: [bookmarks.postId],
        references: [posts.id],
        relationName: "bookmarkPost",
    }),
}));
