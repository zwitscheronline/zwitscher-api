import { posts } from "./posts";
import { integer, pgTable, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const likes = pgTable("likes", {
    userId: integer("user_id").notNull().references(() => users.id),
    postId: integer("post_id").notNull().references(() => posts.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
});
