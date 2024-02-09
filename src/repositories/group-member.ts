import { UsersInGroups } from "@prisma/client";
import { RequestOptions } from "../types/request_options";
import { prismaClient } from "../utils/database";
import { IGroupMemberRepository } from "../interfaces/repositories";

export class GroupMemberRepository implements IGroupMemberRepository<UsersInGroups> {
    async create(data: UsersInGroups): Promise<UsersInGroups> {
        try {
            return await prismaClient.usersInGroups.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }
    
    async delete(userId: number, groupId: number): Promise<void> {
        try {
            await prismaClient.usersInGroups.delete({
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
            await prismaClient.usersInGroups.deleteMany({
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
            await prismaClient.usersInGroups.deleteMany({
                where: {
                    userId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAll(groupId: number, options: RequestOptions): Promise<UsersInGroups[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await prismaClient.usersInGroups.findMany({
                where: {
                    groupId,
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

    async findAllByUserId(userId: number, options: RequestOptions): Promise<UsersInGroups[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 25;

        try {
            return await prismaClient.usersInGroups.findMany({
                where: {
                    userId,
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
