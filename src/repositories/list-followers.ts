import { ListFollowers } from "@prisma/client";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";
import { IListFollowerRepository } from "../interfaces/repositories";

export class ListFollowerRepository implements IListFollowerRepository<ListFollowers> {
    async create(data: ListFollowers): Promise<ListFollowers> {
        try {
            return await prismaClient.listFollowers.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, listId: number): Promise<void> {
        try {
            await prismaClient.listFollowers.delete({
                where: {
                    listId_followerId: {
                        listId,
                        followerId: userId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(listId: number): Promise<void> {
        try {
            await prismaClient.listFollowers.deleteMany({
                where: {
                    listId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAllByUserId(userId: number): Promise<void> {
        try {
            await prismaClient.listFollowers.deleteMany({
                where: {
                    followerId: userId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAll(listId: number, options: RequestOptions): Promise<ListFollowers[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await prismaClient.listFollowers.findMany({
                where: {
                    listId,
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

    async findAllByUserId(userId: number, options: RequestOptions): Promise<ListFollowers[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await prismaClient.listFollowers.findMany({
                where: {
                    followerId: userId,
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

    async findConnection(userId: number, listId: number): Promise<ListFollowers | null> {
        try {
            return await prismaClient.listFollowers.findFirst({
                where: {
                    listId,
                    followerId: userId,
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
