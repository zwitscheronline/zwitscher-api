import { Groups } from "@prisma/client";
import { RequestOptions } from "../types/request_options";
import { prismaClient } from "../utils/database";

export class GroupRepository {
    async create(data: Groups): Promise<Groups> {
        try {
            return await prismaClient.groups.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async update(data: Groups): Promise<Groups> {
        try {
            return await prismaClient.groups.update({
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
            await prismaClient.groups.update({
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
            await prismaClient.groups.updateMany({
                where: {
                    creatorId: userId,
                },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAll(options: RequestOptions): Promise<Groups[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await prismaClient.groups.findMany({
                where: {
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

    async findById(id: number): Promise<Groups | null> {
        try {
            return await prismaClient.groups.findUnique({
                where: {
                    id,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}
