import { ListFollowers, Lists, User, UsersInLists } from "@prisma/client";
import { IListFollowerRepository, IListMemberRepository, IListRepository, IUserRepository } from "../interfaces/repositories";
import { IListService } from "../interfaces/services";
import { ListCreationData } from "../types/list-data";
import { RequestOptions } from "../types/request_options";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { UserOutputStrict } from "../types/user_output";

export class ListService implements IListService {
    constructor(
        private listRepository: IListRepository<Lists>,
        private listMemberRepository: IListMemberRepository<UsersInLists>,
        private userRepository: IUserRepository<User>,
        private listFollowerRepository: IListFollowerRepository<ListFollowers>
    ) {}

    async create(data: ListCreationData): Promise<Lists> {
        try {
            return await this.listRepository.create({
                name: data.name,
                description: data.description,
                isPrivate: data.isPrivate ?? false,
                creatorId: data.creatorId,
            })
        } catch (error) {
            throw error;
        }
    }

    async update(data: Partial<Lists>, requesterId: number): Promise<Lists> {
        if (!data.id) {
            throw new ErrorWithStatus("List ID is required", HTTPCodes.BadRequest);
        }

        if (data.creatorId !== requesterId) {
            throw new ErrorWithStatus("You are not authorized to update this list", HTTPCodes.Unauthorized);
        }

        try {
            return await this.listRepository.update(data);
        } catch (error) {
            throw new ErrorWithStatus("Error updating list", HTTPCodes.InternalServerError);
        }
    }

    async delete(listId: number, requesterId: number): Promise<void> {
        let list = null;
        try {
            list = await this.listRepository.findById(listId);
        } catch (error) {
            throw new ErrorWithStatus("Error deleting list", HTTPCodes.InternalServerError);
        }

        if (!list) {
            throw new ErrorWithStatus("List not found", HTTPCodes.NotFound);
        }

        if (list.creatorId !== requesterId) {
            throw new ErrorWithStatus("You are not authorized to delete this list", HTTPCodes.Unauthorized);
        }

        try {
            await this.listRepository.delete(listId);
        } catch (error) {
            throw new ErrorWithStatus("Error deleting list", HTTPCodes.InternalServerError);
        }
    }

    async findById(id: number, requesterId: number): Promise<Lists> {
        let list = null;

        try {
            list = await this.listRepository.findById(id);
        } catch (error) {
            throw new ErrorWithStatus("Error finding list", HTTPCodes.InternalServerError);
        }

        if (!list) {
            throw new ErrorWithStatus("List not found", HTTPCodes.NotFound);
        }

        if (list.isPrivate && list.creatorId !== requesterId) {
            throw new ErrorWithStatus("You are not authorized to view this list", HTTPCodes.Forbidden);
        }

        return list;
    }

    async findAll(requesterId: number, options?: RequestOptions): Promise<Lists[]> {
        let lists = null;

        try {
            lists = await this.listRepository.findAll(options ?? {});
        } catch (error) {
            throw new ErrorWithStatus("Error finding lists", HTTPCodes.InternalServerError);
        }

        return lists.filter((list) => !list.isPrivate || list.creatorId === requesterId);
    }

    async findMembers(listId: number, requesterId: number, options?: RequestOptions): Promise<UserOutputStrict[]> {
        let members = null;
    
        let list = null;

        try {
            list = await this.listRepository.findById(listId);
        } catch (error) {
            throw new ErrorWithStatus("Error finding members", HTTPCodes.InternalServerError);
        }

        if (!list) {
            throw new ErrorWithStatus("List not found", HTTPCodes.NotFound);
        }

        if (list.isPrivate && list.creatorId !== requesterId) {
            throw new ErrorWithStatus("You are not authorized to view members of this list", HTTPCodes.Forbidden);
        }

        try {
            members = await this.listMemberRepository.findAll(listId, options ?? {});
        } catch (error) {
            throw new ErrorWithStatus("Error finding members", HTTPCodes.InternalServerError);
        }

        try {
            return await this.userRepository.findAll({ ids: members.map((member) => member.userId) });
        } catch (error) {
            throw new ErrorWithStatus("Error finding members", HTTPCodes.InternalServerError);
        }
    }

    async addMember(listId: number, userId: number, requesterId: number): Promise<void> {
        let list = null;
        try {
            list = await this.listRepository.findById(listId);
        } catch (error) {
            throw new ErrorWithStatus("Error adding member", HTTPCodes.InternalServerError);
        }

        if (!list) {
            throw new ErrorWithStatus("List not found", HTTPCodes.NotFound);
        }

        let user = null;
        try {
            user = await this.userRepository.findById(userId);
        } catch (error) {
            throw new ErrorWithStatus("Error adding member", HTTPCodes.InternalServerError);
        }

        if (!user) {
            throw new ErrorWithStatus("User not found", HTTPCodes.NotFound);
        }

        if (list.creatorId !== requesterId) {
            throw new ErrorWithStatus("You are not authorized to add members to this list", HTTPCodes.Unauthorized);
        }

        try {
            await this.listMemberRepository.create({
                listId,
                userId,
                createdAt: new Date(),
            });
        } catch (error) {
            throw new ErrorWithStatus("Error adding member", HTTPCodes.InternalServerError);
        }
    }

    async removeMember(listId: number, userId: number, requesterId: number): Promise<void> {
        let list = null;
        try {
            list = await this.listRepository.findById(listId);
        } catch (error) {
            throw new ErrorWithStatus("Error removing member", HTTPCodes.InternalServerError);
        }

        if (!list) {
            throw new ErrorWithStatus("List not found", HTTPCodes.NotFound);
        }

        if (list.creatorId !== requesterId) {
            throw new ErrorWithStatus("You are not authorized to remove members from this list", HTTPCodes.Unauthorized);
        }

        let user = null;
        try {
            user = await this.listMemberRepository.findByUserAndList(userId, listId);
        } catch (error) {
            throw new ErrorWithStatus("Error removing member", HTTPCodes.InternalServerError);
        }

        if (!user) {
            throw new ErrorWithStatus("User not found in list", HTTPCodes.NotFound);
        }

        try {
            await this.listMemberRepository.delete(userId, listId);
        } catch (error) {
            throw new ErrorWithStatus("Error removing member", HTTPCodes.InternalServerError);
        }
    }

    async findFollowers(listId: number, requesterId: number, options?: RequestOptions): Promise<UserOutputStrict[]> {
        let followers = null;

        let list = null;

        try {
            list = await this.listRepository.findById(listId);
        } catch (error) {
            throw new ErrorWithStatus("Error finding followers", HTTPCodes.InternalServerError);
        }

        if (!list) {
            throw new ErrorWithStatus("List not found", HTTPCodes.NotFound);
        }

        if (list.isPrivate && list.creatorId !== requesterId) {
            throw new ErrorWithStatus("You are not authorized to view followers of this list", HTTPCodes.Forbidden);
        }

        try {
            followers = await this.listFollowerRepository.findAll(listId, options ?? {});
        } catch (error) {
            throw new ErrorWithStatus("Error finding followers", HTTPCodes.InternalServerError);
        }

        try {
            return await this.userRepository.findAll({ ids: followers.map((follower) => follower.followerId) });
        } catch (error) {
            throw new ErrorWithStatus("Error finding followers", HTTPCodes.InternalServerError);
        }
    }

    async followList(listId: number, userId: number): Promise<void> {
        let list = null;
        try {
            list = await this.listRepository.findById(listId);
        } catch (error) {
            throw new ErrorWithStatus("Error following list", HTTPCodes.InternalServerError);
        }

        if (!list) {
            throw new ErrorWithStatus("List not found", HTTPCodes.NotFound);
        }

        if (list.isPrivate && list.creatorId !== userId) {
            throw new ErrorWithStatus("You are not authorized to follow this list", HTTPCodes.Forbidden);
        }

        try {
            await this.listFollowerRepository.create({
                listId,
                followerId: userId,
                createdAt: new Date(),
            });
        } catch (error) {
            throw new ErrorWithStatus("Error following list", HTTPCodes.InternalServerError);
        }
    }

    async unfollowList(listId: number, userId: number): Promise<void> {
        let listConnection = null;
        try {
            listConnection = await this.listFollowerRepository.findConnection(userId, listId);
        } catch (error) {
            throw new ErrorWithStatus("Error unfollowing list", HTTPCodes.InternalServerError);
        }

        if (!listConnection) {
            throw new ErrorWithStatus("You are not following this list", HTTPCodes.NotFound);
        }

        try {
            await this.listFollowerRepository.delete(userId, listId);
        } catch (error) {
            throw new ErrorWithStatus("Error unfollowing list", HTTPCodes.InternalServerError);
        }
    }
}
