import { UsersInLists } from "@prisma/client";
import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";
import { IListMemberRepository } from "../interfaces/repositories";

export class ListMemberRepository implements IListMemberRepository<UsersInLists> {

    async create(data: UsersInLists): Promise<UsersInLists> {
        try {
            return await prismaClient.usersInLists.create({
                data,
            });
        } catch (error) {
            throw error;
        }
    }

    async delete(userId: number, listId: number): Promise<void> {
        try {
            await prismaClient.usersInLists.delete({
                where: {
                    userId_listId: {
                        userId,
                        listId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAll(listId: number): Promise<void> {
        try {
            await prismaClient.usersInLists.deleteMany({
                where: {
                    listId,
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAll(listId: number, options: RequestOptions): Promise<UsersInLists[]> {
        const page = options.page || 1;
        const limit = options.entriesPerPage || 10;

        try {
            return await prismaClient.usersInLists.findMany({
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
}
