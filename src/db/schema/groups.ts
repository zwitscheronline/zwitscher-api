import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { boolean, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const groups = pgTable('groups', {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    description: varchar("description", { length: 500 }),
    isPrivate: boolean("is_private").default(false),
    creatorId: serial("creator_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export type InsertGroup = InferInsertModel<typeof groups>;

export type SelectGroup = InferSelectModel<typeof groups>;
export type SelectGroups = SelectGroup[];

export const groupRelations = relations(groups, ({one}) => ({
    creator: one(users, {
        fields: [groups.creatorId],
        references: [users.id],
        relationName: "groupCreator",
    }),
}));
