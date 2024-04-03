import { RequestOptions } from "../types/request_options";
import { ILikesRepository } from "../interfaces/repositories";
import { Like } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq } from "drizzle-orm";
import { likes } from "../db/schema/likes";

export class LikeRepository implements ILikesRepository<Like> {

    async create(data: Like): Promise<Like> {
        try {
            return (await database.insert(likes).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, postId: number): Promise<void> {
        try {
            await database.delete(likes).where(and(eq(likes.userId, userId), eq(likes.postId, postId))).execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(userId: number): Promise<void> {
        try {
            await database.delete(likes).where(eq(likes.userId, userId)).execute();
        } catch (error) {
            throw error;
        }
    }

    async findWithPostAndUser(postId: number, userId: number): Promise<Like | null> {
        try {
            return (await database.select().from(likes).where(and(eq(likes.postId, postId), eq(likes.userId, userId))))[0];
        } catch (error) {
            throw error;
        }
    }

    async findAllOfUser(userId: number, options?: RequestOptions): Promise<Like[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

        try {
            return await database.select()
                .from(likes)
                .where(eq(likes.userId, userId))
                .limit(entriesPerPage)
                .offset((page - 1) * entriesPerPage)
                .orderBy(desc(likes.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findAllOfPost(postId: number, options?: RequestOptions): Promise<Like[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

        try {
            return await database.select()
                .from(likes)
                .where(eq(likes.postId, postId))
                .limit(entriesPerPage)
                .offset((page - 1) * entriesPerPage)
                .orderBy(desc(likes.createdAt));
        } catch (error) {
            throw error;
        }
    }
}
