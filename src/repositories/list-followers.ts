import { RequestOptions } from "../types/request_options";
import { IListFollowerRepository } from "../interfaces/repositories";
import { ListFollower } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq } from "drizzle-orm";
import { listFollowers } from "../db/schema/list-followers";

export class ListFollowerRepository implements IListFollowerRepository<ListFollower> {
    async create(data: ListFollower): Promise<ListFollower> {
        try {
            return (await database.insert(listFollowers).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, listId: number): Promise<void> {
        try {
            await database.delete(listFollowers)
                .where(and(eq(listFollowers.userId, userId), eq(listFollowers.listId, listId)))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(listId: number): Promise<void> {
        try {
            await database.delete(listFollowers)
                .where(eq(listFollowers.listId, listId))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAllByUserId(userId: number): Promise<void> {
        try {
            await database.delete(listFollowers)
                .where(eq(listFollowers.userId, userId))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async findAll(listId: number, options: RequestOptions): Promise<ListFollower[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(listFollowers)
                .where(eq(listFollowers.listId, listId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(listFollowers.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(userId: number, options: RequestOptions): Promise<ListFollower[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(listFollowers)
                .where(eq(listFollowers.userId, userId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(listFollowers.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findConnection(userId: number, listId: number): Promise<ListFollower | null> {
        try {
            return (await database.select()
                .from(listFollowers)
                .where(and(eq(listFollowers.userId, userId), eq(listFollowers.listId, listId)))
                .limit(1)
            )[0] || null;
        } catch (error) {
            throw error;
        }
    }
}
