import { RequestOptions } from "../types/request_options";
import { IListMemberRepository } from "../interfaces/repositories";
import { ListMember } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq } from "drizzle-orm";
import { listMembers } from "../db/schema/list-members";

export class ListMemberRepository implements IListMemberRepository<ListMember> {

    async create(data: ListMember): Promise<ListMember> {
        try {
            return (await database.insert(listMembers).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, listId: number): Promise<void> {
        try {
            await database.delete(listMembers).where(and(eq(listMembers.userId, userId), eq(listMembers.listId, listId))).execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(listId: number): Promise<void> {
        try {
            await database.delete(listMembers).where(eq(listMembers.listId, listId)).execute();
        } catch (error) {
            throw error;
        }
    }

    async findAll(listId: number, options: RequestOptions): Promise<ListMember[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await database.select()
                .from(listMembers)
                .where(eq(listMembers.listId, listId))
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(listMembers.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findByUserAndList(userId: number, listId: number): Promise<ListMember | null> {
        try {
            return (await database.select()
                .from(listMembers)
                .where(and(eq(listMembers.userId, userId), eq(listMembers.listId, listId)))
                .limit(1)
            )[0];
        } catch (error) {
            throw error;
        }
    }
}
