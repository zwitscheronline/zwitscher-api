import { JoinRequests } from "@prisma/client";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";

export class JoinRequestRepository {
    async create(data: JoinRequests): Promise<JoinRequests> {
        try {
            return await prismaClient.joinRequests.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, groupId: number): Promise<void> {
        try {
            await prismaClient.joinRequests.delete({
                where: {
                    userId_groupId: {
                        userId,
                        groupId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(groupId: number): Promise<void> {
        try {
            await prismaClient.joinRequests.deleteMany({
                where: {
                    groupId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAllByUserId(userId: number): Promise<void> {
        try {
            await prismaClient.joinRequests.deleteMany({
                where: {
                    userId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAll(groupId: number, options: RequestOptions): Promise<JoinRequests[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await prismaClient.joinRequests.findMany({
                where: {
                    groupId,
                },
                include: {
                    user: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findAllByUserId(userId: number, options: RequestOptions): Promise<JoinRequests[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await prismaClient.joinRequests.findMany({
                where: {
                    userId,
                },
                include: {
                    group: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
