import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { posts } from "./posts";

export const bookmarks = pgTable("bookmarks", {
    userId: integer("user_id").notNull().references(() => users.id),
    postId: integer("post_id").notNull().references(() => posts.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});
