import { Post } from "@prisma/client";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";
import { IPostRepository } from "../interfaces/repositories";
import { PostCreationData } from "../types/post-data";

export class PostRepository implements IPostRepository<Post> {

    async create(data: PostCreationData): Promise<Post> {
        try {
            return await prismaClient.post.create({
                data: {
                    createdAt: new Date(),
                    ...data,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async update(data: Post): Promise<Post> {
        try {
            return await prismaClient.post.update({
                where: {
                    id: data.id,
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

    async deleteAllOfUser(userId: number): Promise<void> {
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

    async findAll(options: RequestOptions & { ids?: number[] }): Promise<Post[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            if (options.orderByField) {
                return await prismaClient.post.findMany({
                    where: {
                        deletedAt: null,
                        ...(options.ids && { id: { in: options.ids } }),
                    },
                    take: entriesPerPage,
                    skip: (page - 1) * entriesPerPage,
                    orderBy: {
                        [options.orderByField]: options.orderBy,
                    },
                });
            } else {
                return await prismaClient.post.findMany({
                    where: {
                        deletedAt: null,
                        ...(options.ids && { id: { in: options.ids } }),
                    },
                    take: entriesPerPage,
                    skip: (page - 1) * entriesPerPage,
                    orderBy: {
                        createdAt: "desc",
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async findAllOfUser(userId: number, options?: RequestOptions): Promise<Post[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

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

    async findChildrenOfPost(postId: number, options?: RequestOptions): Promise<Post[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

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

    async findById(id: number): Promise<Post | null> {
        try {
            return await prismaClient.post.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
                include: {
                    originalPost: true,
                    parentPost: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findAllOfGroup(groupId: number, options?: RequestOptions): Promise<Post[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

        try {
            return await prismaClient.post.findMany({
                where: {
                    groupId,
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

    async deleteAllOfGroup(groupId: number): Promise<void> {
        try {
            await prismaClient.post.updateMany({
                where: {
                    groupId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
