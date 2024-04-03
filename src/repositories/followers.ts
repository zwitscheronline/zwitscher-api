import { RequestOptions } from "../types/request_options";
import { IFollowerRepository } from "../interfaces/repositories";
import { Follows } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq, or } from "drizzle-orm";
import { follows } from "../db/schema/follows";

export class FollowerRepository implements IFollowerRepository<Follows> {

    async create(data: Follows): Promise<Follows> {
        try {
            return (await database.insert(follows).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(followerId: number, followingId: number): Promise<void> {
        try {
            await database.delete(follows)
                .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(id: number): Promise<void> {
        try {
            await database.delete(follows)
                .where(or(eq(follows.followerId, id), eq(follows.followingId, id)))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async findFollowing(id: number, options: RequestOptions): Promise<Follows[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(follows)
                .where(eq(follows.followerId, id))
                .limit(entriesPerPage)
                .offset((page - 1) * entriesPerPage)
                .orderBy(desc(follows.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findFollowers(id: number, option: RequestOptions): Promise<Follows[]> {
        const page = option.page || 1;
        const entriesPerPage = option.entriesPerPage || 25;

        try {
            return await database.select()
                .from(follows)
                .where(eq(follows.followingId, id))
                .limit(entriesPerPage)
                .offset((page - 1) * entriesPerPage)
                .orderBy(desc(follows.createdAt));

        } catch (error) {
            throw error;
        }
    }

    async findWithFollowerAndFollowing(followerId: number, followingId: number): Promise<Follows | null> {
        try {
            return (await database.select()
                .from(follows)
                .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
                .limit(1)
            )[0];
        } catch (error) {
            throw error;
        }
    }
}
