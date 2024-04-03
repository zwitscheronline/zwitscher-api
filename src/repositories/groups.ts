import { RequestOptions } from "../types/request_options";
import { IGroupRepository } from "../interfaces/repositories";
import { GroupCreationData } from "../types/group-data";
import { Group } from "../types/schema-types";
import { database } from "../main";
import { desc, eq } from "drizzle-orm";
import { groups } from "../db/schema/groups";

export class GroupRepository implements IGroupRepository<Group> {
    async create(data: GroupCreationData): Promise<Group> {
        try {
            return (await database.insert(groups).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async update(data: Group): Promise<Group> {

        if (data.id === undefined) {
            throw new Error("Group ID is required to update a group.");
        }

        try {
            return (await database.update(groups).set(data).where(eq(groups.id, data.id)).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await database.delete(groups).where(eq(groups.id, id)).execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(userId: number): Promise<void> {
        try {
            await database.delete(groups).where(eq(groups.creatorId, userId)).execute();
        } catch (error) {
            throw error;
        }
    }

    async findAll(options: RequestOptions): Promise<Group[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await database.select()
                .from(groups)
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(groups.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<Group | null> {
        try {
            return (await database.select().from(groups).where(eq(groups.id, id)).limit(1))[0] || null;
        } catch (error) {
            throw error;
        }
    }
}
