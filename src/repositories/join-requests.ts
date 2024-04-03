import { RequestOptions } from "../types/request_options";
import { IJoinRequestRepository } from "../interfaces/repositories";
import { GroupJoinRequest } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq } from "drizzle-orm";
import { groupJoinRequests } from "../db/schema/group-join-requests";

export class JoinRequestRepository implements IJoinRequestRepository<GroupJoinRequest> {
    async create(data: GroupJoinRequest): Promise<GroupJoinRequest> {
        try {
            return (await database.insert(groupJoinRequests).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, groupId: number): Promise<void> {
        try {
            await database.delete(groupJoinRequests)
                .where(and(eq(groupJoinRequests.userId, userId), eq(groupJoinRequests.groupId, groupId)))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(groupId: number): Promise<void> {
        try {
            await database.delete(groupJoinRequests)
                .where(eq(groupJoinRequests.groupId, groupId))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAllByUserId(userId: number): Promise<void> {
        try {
            await database.delete(groupJoinRequests)
                .where(eq(groupJoinRequests.userId, userId))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async findAll(groupId: number, options: RequestOptions): Promise<GroupJoinRequest[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(groupJoinRequests)
                .where(eq(groupJoinRequests.groupId, groupId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(groupJoinRequests.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(userId: number, options: RequestOptions): Promise<GroupJoinRequest[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(groupJoinRequests)
                .where(eq(groupJoinRequests.userId, userId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(groupJoinRequests.createdAt));
        } catch (error) {
            throw error;
        }
    }
}
