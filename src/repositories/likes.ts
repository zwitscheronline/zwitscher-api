import { Likes } from "@prisma/client";
import { RequestOptions } from "../types/request_options";
import { prismaClient } from "../utils/database";
import { ILikesRepository } from "../interfaces/repositories";

export class LikeRepository implements ILikesRepository<Likes> {

    async create(data: Likes): Promise<Likes> {
        try {
            return await prismaClient.likes.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, postId: number): Promise<void> {
        try {
            await prismaClient.likes.delete({
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
            await prismaClient.likes.deleteMany({
                where: {
                    userId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findWithPostAndUser(postId: number, userId: number): Promise<Likes | null> {
        try {
            return await prismaClient.likes.findFirst({
                where: {
                    AND: [
                        {
                            postId,
                        },
                        {
                            userId,
                        },
                    ]
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAllOfUser(userId: number, options: RequestOptions): Promise<Likes[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await prismaClient.likes.findMany({
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

    async findAllOfPost(postId: number, options: RequestOptions): Promise<Likes[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await prismaClient.likes.findMany({
                where: {
                    postId,
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
}
