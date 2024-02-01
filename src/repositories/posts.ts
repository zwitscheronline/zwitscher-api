import { Post } from "@prisma/client";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";

export class PostRepository {

    async create(data: Post): Promise<Post> {
        try {
            return await prismaClient.post.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async update(id: number, data: Post): Promise<Post> {
        try {
            return await prismaClient.post.update({
                where: {
                    id,
                },
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prismaClient.post.update({
                where: {
                    id,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(userId: number): Promise<void> {
        try {
            await prismaClient.post.updateMany({
                where: {
                    authorId: userId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAll(options: RequestOptions): Promise<Post[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await prismaClient.post.findMany({
                where: {
                    deletedAt: null,
                },
                take: entriesPerPage,
                skip: (page - 1) * entriesPerPage,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    originalPost: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findAllOfUser(userId: number, options: RequestOptions): Promise<Post[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await prismaClient.post.findMany({
                where: {
                    authorId: userId,
                    deletedAt: null,
                },
                take: entriesPerPage,
                skip: (page - 1) * entriesPerPage,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    originalPost: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findChildrenOfPost(postId: number, options: RequestOptions): Promise<Post[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await prismaClient.post.findMany({
                where: {
                    parentPostId: postId,
                    deletedAt: null,
                },
                take: entriesPerPage,
                skip: (page - 1) * entriesPerPage,
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    originalPost: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findParentOfPost(postId: number): Promise<Post | null> {
        try {
            return await prismaClient.post.findFirst({
                where: {
                    id: postId,
                    deletedAt: null,
                },
                include: {
                    parentPost: true,
                    originalPost: true,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
