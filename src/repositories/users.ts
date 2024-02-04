import { User } from "@prisma/client";
import { Repository } from "../utils/repository";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";

export class UserRepository implements Repository<User> {
    async create(data: Omit<User, "id" | "createdAt" | "updatedAt" | "deletedAt" | "avatar">): Promise<User> {
        try {
            return await prismaClient.user.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }
    async update(data: Partial<User>): Promise<User> {
        try {
            if (!data.id) {
                throw new Error("User id is required");
            }

            return await prismaClient.user.update({
                where: {
                    id: data.id,
                    deletedAt: null,
                },
                data,
            });
        } catch (error) {
            throw error;
        }
    }
    async delete(id: number): Promise<void> {
        try {
            await prismaClient.user.update({
                where: {
                    id,
                },
                data: {
                    deletedAt: new Date(),
                }
            });
        } catch (error) {
            throw error;
        }
    }
    async findById(id: number): Promise<User|null> {
        try {
            return await prismaClient.user.findUnique({
                where: {
                    id,
                    deletedAt: null,
                }
            });
        } catch (error) {
            throw error;
        }
    }
    async findAll(options: RequestOptions & { ids?: number[] }): Promise<User[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            if (options.orderByField) {
                return await prismaClient.user.findMany({
                    where: {
                        deletedAt: null,
                        ...(options.ids && { id: { in: options.ids } }),
                    },
                    orderBy: {
                        [options.orderByField]: options.orderBy
                    },
                    skip: (page - 1) * entriesPerPage,
                    take: options.entriesPerPage,
                });
            } else {
                return await prismaClient.user.findMany({
                    where: {
                        deletedAt: null,
                        ...(options.ids && { id: { in: options.ids } }),
                    },
                    skip: (page - 1) * entriesPerPage,
                    take: options.entriesPerPage,
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async findByEmail(email: string): Promise<User|null> {
        try {
            return await prismaClient.user.findUnique({
                where: {
                    email,
                    deletedAt: null,
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findByUserTag(userTag: string): Promise<User|null> {
        try {
            return await prismaClient.user.findUnique({
                where: {
                    userTag,
                    deletedAt: null,
                }
            });
        } catch (error) {
            throw error;
        }
    }
}
