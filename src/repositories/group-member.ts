import { RequestOptions } from "../types/request_options";
import { IGroupMemberRepository } from "../interfaces/repositories";
import { GroupMember } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq } from "drizzle-orm";
import { groupMembers } from "../db/schema/group-members";

export class GroupMemberRepository implements IGroupMemberRepository<GroupMember> {
    async create(data: GroupMember): Promise<GroupMember> {
        try {
            return (await database.insert(groupMembers).values(data).returning())[0];
        } catch (error) {
            throw error; 
        }
    }
    
    async delete(userId: number, groupId: number): Promise<void> {
        try {
            await database.delete(groupMembers)
                .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(groupId: number): Promise<void> {
        try {
            await database.delete(groupMembers).where(eq(groupMembers.groupId, groupId)).execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAllByUserId(userId: number): Promise<void> {
        try {
            await database.delete(groupMembers).where(eq(groupMembers.userId, userId)).execute();
        } catch (error) {
            throw error;
        }
    }

    async findAll(groupId: number, options: RequestOptions): Promise<GroupMember[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(groupMembers)
                .where(eq(groupMembers.groupId, groupId))
                .limit(limit).offset((page - 1) * limit)
                .orderBy(desc(groupMembers.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(userId: number, options: RequestOptions): Promise<GroupMember[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(groupMembers)
                .where(eq(groupMembers.userId, userId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(groupMembers.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findByUserAndGroup(userId: number, groupId: number): Promise<GroupMember | null> {
        try {
            return (await database.select()
                .from(groupMembers)
                .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)))
                .limit(1))[0];
        } catch (error) {
            throw error;
        }
    }
}
