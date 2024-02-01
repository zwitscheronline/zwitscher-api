import { User } from "@prisma/client";
import { Repository } from "../utils/repository";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";

export class UserRepository implements Repository<User> {
    async create(data: User): Promise<User> {
        try {
            return await prismaClient.user.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }
    async update(data: User): Promise<User> {
        try {
            return await prismaClient.user.update({
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
                }
            });
        } catch (error) {
            throw error;
        }
    }
    async findAll(options: RequestOptions): Promise<User[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            if (options.orderByField) {
                const users = await prismaClient.user.findMany({
                    where: {
                        deletedAt: null,
                    },
                    orderBy: {
                        [options.orderByField]: options.orderBy
                    },
                    skip: (page - 1) * entriesPerPage,
                    take: options.entriesPerPage,
                });
                return users;
            } else {
                const users = await prismaClient.user.findMany({
                    where: {
                        deletedAt: null,
                    },
                    skip: (page - 1) * entriesPerPage,
                    take: options.entriesPerPage,
                });
                return users;
            }
        } catch (error) {
            throw error;
        }
    }
}
