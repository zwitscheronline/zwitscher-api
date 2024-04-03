import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const lists = pgTable('lists', {
    id: serial("id").primaryKey(),
    creatorId: serial("user_id").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    isPrivate: boolean("is_private").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertList = InferInsertModel<typeof lists>;

export type SelectList = InferSelectModel<typeof lists>;
export type SelectLists = SelectList[];

export const listRelations = relations(lists, ({one}) => ({
    creator: one(users, {
        fields: [lists.creatorId],
        references: [users.id],
        relationName: "listCreator",
    }),
}));
