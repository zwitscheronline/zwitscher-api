import { Bookmarks } from "@prisma/client";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";
import { IBookmarkRepository } from "../interfaces/repositories";

export class BookmarkRepository implements IBookmarkRepository<Bookmarks> {
    async create(data: Bookmarks): Promise<Bookmarks> {
        try {
            return await prismaClient.bookmarks.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, postId: number): Promise<void> {
        try {
            await prismaClient.bookmarks.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(userId: number): Promise<void> {
        try {
            await prismaClient.bookmarks.deleteMany({
                where: {
                    userId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAllOfUser(userId: number, options: RequestOptions): Promise<Bookmarks[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await prismaClient.bookmarks.findMany({
                where: {
                    userId,
                },
                take: entriesPerPage,
                skip: (page - 1) * entriesPerPage,
                orderBy: {
                    createdAt: "desc",
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findWithPostAndUser(userId: number, postId: number): Promise<Bookmarks | null> {
        try {
            return await prismaClient.bookmarks.findUnique({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
