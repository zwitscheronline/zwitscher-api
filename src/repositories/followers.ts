import { Follows } from "@prisma/client";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";

export class FollowerRepository {

    async create(data: Follows): Promise<Follows> {
        try {
            return await prismaClient.follows.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(followerId: number, followingId: number): Promise<void> {
        try {
            await prismaClient.follows.delete({
                where: {
                    followerId_followedId: {
                        followerId,
                        followedId: followingId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(id: number): Promise<void> {
        try {
            await prismaClient.follows.deleteMany({
                where: {
                    OR: [
                        {
                            followerId: id,
                        },
                        {
                            followedId: id,
                        },
                    ],
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findFollowing(id: number, options: RequestOptions): Promise<Follows[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await prismaClient.follows.findMany({
                where: {
                    followedId: id,
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

    async findFollowers(id: number, option: RequestOptions): Promise<Follows[]> {
        const page = option.page || 1;
        const entriesPerPage = option.entriesPerPage || 25;

        try {
            return await prismaClient.follows.findMany({
                where: {
                    followerId: id,
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

    async findWithFollowerAndFollowing(followerId: number, followingId: number): Promise<Follows | null> {
        try {
            return await prismaClient.follows.findUnique({
                where: {
                    followerId_followedId: {
                        followerId,
                        followedId: followingId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
