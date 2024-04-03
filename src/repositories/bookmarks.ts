import { RequestOptions } from "../types/request_options";
import { IBookmarkRepository } from "../interfaces/repositories";
import { Bookmark } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq } from "drizzle-orm";
import { bookmarks } from "../db/schema/bookmarks";

export class BookmarkRepository implements IBookmarkRepository<Bookmark> {
    async create(data: Bookmark): Promise<Bookmark> {
        try {
            return (await database.insert(bookmarks).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, postId: number): Promise<void> {
        try {
            await database.delete(bookmarks)
                .where(
                    and(
                        eq(bookmarks.userId, userId), 
                        eq(bookmarks.postId, postId)
                    ))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(userId: number): Promise<void> {
        try {
            await database.delete(bookmarks)
                .where(eq(bookmarks.userId, userId))
                .execute();
        } catch (error) {
            throw error;
        }
    }

    async findAllOfUser(userId: number, options: RequestOptions): Promise<Bookmark[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(bookmarks)
                .where(eq(bookmarks.userId, userId))
                .limit(entriesPerPage)
                .offset((page - 1) * entriesPerPage)
                .orderBy(desc(bookmarks.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findWithPostAndUser(userId: number, postId: number): Promise<Bookmark | null> {
        try {
            return (await database.select()
                .from(bookmarks)
                .where(and(eq(bookmarks.userId, userId), eq(bookmarks.postId, postId)))
                .limit(1)
            )[0];
        } catch (error) {
            throw error;
        }
    }
}
