import { RequestOptions } from "../types/request_options";
import { IListRepository } from "../interfaces/repositories";
import { ListCreationData } from "../types/list-data";
import { List } from "../types/schema-types";
import { database } from "../main";
import { eq } from "drizzle-orm";
import { lists } from "../db/schema/lists";

export class ListRepository implements IListRepository<List> {
    async create(data: ListCreationData): Promise<List> {
        try {
            return (await database.insert(lists).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async update(data: List): Promise<List> {

        if (data.id === undefined) throw new Error("List ID is required to update list.");

        try {
            return (await database.update(lists).set(data).where(eq(lists.id, data.id)).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await database.delete(lists).where(eq(lists.id, id)).execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(userId: number): Promise<void> {
        try {
            await database.delete(lists).where(eq(lists.creatorId, userId)).execute();
        } catch (error) {
            throw error;
        }
    }

    async findAll(options: RequestOptions): Promise<List[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await database.select()
                .from(lists)
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(lists.createdAt);
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<List | null> {
        try {
            return (await database.select().from(lists).where(eq(lists.id, id)).limit(1))[0];
        } catch (error) {
            throw error;
        }
    }

    async findByUserId(userId: number, options: RequestOptions): Promise<List[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await database.select()
                .from(lists)
                .where(eq(lists.creatorId, userId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(lists.createdAt);
        } catch (error) {
            throw error;
        }
    }
}
