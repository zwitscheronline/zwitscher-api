import { Lists } from "@prisma/client";
import { RequestOptions } from "../types/request_options";
import { prismaClient } from "../utils/database";

export class ListRepository {
    async create(data: Lists): Promise<Lists> {
        try {
            return await prismaClient.lists.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async update(data: Lists): Promise<Lists> {
        try {
            return await prismaClient.lists.update({
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
            await prismaClient.lists.delete({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(userId: number): Promise<void> {
        try {
            await prismaClient.lists.deleteMany({
                where: {
                    creatorId: userId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAll(options: RequestOptions): Promise<Lists[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await prismaClient.lists.findMany({
                where: {
                    deletedAt: null,
                    isPrivate: false,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<Lists | null> {
        try {
            return await prismaClient.lists.findFirst({
                where: {
                    id,
                    deletedAt: null,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findByUserId(userId: number, options: RequestOptions): Promise<Lists[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await prismaClient.lists.findMany({
                where: {
                    creatorId: userId,
                    deletedAt: null,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    createdAt: "desc",
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
