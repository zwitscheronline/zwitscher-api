import {
  IGroupMemberRepository,
  IGroupRepository,
  IJoinRequestRepository,
  IPostRepository,
  IUserRepository,
} from "../interfaces/repositories";
import { GroupCreationData } from "../types/group-data";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { RequestOptions } from "../types/request_options";
import { UserOutputStrict, toUserOutputStrict } from "../types/user_output";
import { IGroupService } from "../interfaces/services";
import { Group, GroupJoinRequest, GroupMember, Post, User } from "../types/schema-types";

export class GroupService implements IGroupService {
  constructor(
    private groupRepository: IGroupRepository<Group>,
    private groupMemberRepository: IGroupMemberRepository<GroupMember>,
    private joinRequestRepository: IJoinRequestRepository<GroupJoinRequest>,
    private userRepository: IUserRepository<User>,
    private postRepository: IPostRepository<Post>
  ) {}

  async create(data: GroupCreationData): Promise<Group> {
    let group = null;

    try {
      group = await this.groupRepository.create(data);
    } catch (error) {
      throw error;
    }

    if (!group.id) throw new ErrorWithStatus("Group ID is needed", HTTPCodes.InternalServerError);
    if (!data.creatorId)

    try {
      await this.groupMemberRepository.create({
        userId: data.creatorId,
        groupId: group.id,
        createdById: data.creatorId,
        createdAt: new Date(),
      });
    } catch (error) {
      throw error;
    }

    return group;
  }

  async update(data: Partial<Group>, requesterId: number): Promise<Group> {
    if (data.id === undefined) {
      throw new ErrorWithStatus("Group ID is required", HTTPCodes.BadRequest);
    }

    let group = null;

    try {
      group = await this.groupRepository.findById(data.id);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.creatorId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not the creator of this group",
        HTTPCodes.Forbidden
      );
    }

    return await this.groupRepository.update({
      id: data.id,
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate,
    });
  }

  async delete(groupId: number, requesterId: number): Promise<void> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.creatorId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not the creator of this group",
        HTTPCodes.Forbidden
      );
    }

    await this.groupMemberRepository.deleteAll(groupId);

    await this.joinRequestRepository.deleteAll(groupId);

    await this.groupRepository.delete(groupId);
  }

  async findById(id: number, requesterId: number): Promise<Group> {
    let group = null;

    try {
      group = await this.groupRepository.findById(id);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.isPrivate) {
      let groupMembers = null;

      try {
        groupMembers = await this.groupMemberRepository.findByUserAndGroup(
          requesterId,
          id
        );
      } catch (error) {
        throw new ErrorWithStatus(
          "Error finding group members",
          HTTPCodes.InternalServerError
        );
      }

      if (!groupMembers) {
        throw new ErrorWithStatus(
          "You are not a member of this group",
          HTTPCodes.Forbidden
        );
      }
    }

    return group;
  }

  async findAll(
    requesterId: number,
    options?: RequestOptions
  ): Promise<Group[]> {
    let groups = null;

    try {
      groups = await this.groupRepository.findAll(options ?? {});
    } catch (error) {
      throw error;
    }

    return groups.filter(async (group) => {
      if (group.isPrivate) {
        let groupMember = null;

        if (!group.id) throw new ErrorWithStatus("Group ID is needed", HTTPCodes.InternalServerError);

        try {
          groupMember = await this.groupMemberRepository.findByUserAndGroup(
            requesterId,
            group.id
          );
        } catch (error) {
          return false;
        }

        if (!groupMember) {
          return false;
        }
      }
      return true;
    });
  }

  async findMembers(
    groupId: number,
    requesterId: number,
    options?: RequestOptions
  ): Promise<UserOutputStrict[]> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.isPrivate) {
      let groupMember = null;

      try {
        groupMember = await this.groupMemberRepository.findByUserAndGroup(
          requesterId,
          groupId
        );
      } catch (error) {
        throw new ErrorWithStatus(
          "Error finding group member",
          HTTPCodes.InternalServerError
        );
      }

      if (!groupMember) {
        throw new ErrorWithStatus(
          "You are not a member of this group",
          HTTPCodes.Forbidden
        );
      }
    }

    let members = null;

    try {
      members = await this.groupMemberRepository.findAll(
        groupId,
        options ?? {}
      );
    } catch (error) {
      throw error;
    }

    const memberIds = members.map((member) => member.userId);

    let users = null;

    try {
      users = await this.userRepository.findAll({ ids: memberIds });
    } catch (error) {
      throw error;
    }

    const output = toUserOutputStrict(users);

    if (Array.isArray(output)) {
      return output;
    }

    return [output];
  }

  async removeMember(
    groupId: number,
    userId: number,
    requesterId: number
  ): Promise<void> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.creatorId !== requesterId || userId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not the creator of this group",
        HTTPCodes.Forbidden
      );
    }

    if (group.creatorId === userId) {
      throw new ErrorWithStatus(
        "As owner you need to delete the group to leave it",
        HTTPCodes.Forbidden
      );
    }

    await this.groupMemberRepository.delete(userId, groupId);
  }

  async createJoinRequest(
    groupId: number,
    userId: number
  ): Promise<GroupJoinRequest> {
    let joinRequest = null;

    try {
      joinRequest = await this.joinRequestRepository.create({
        groupId,
        userId,
        createdAt: new Date(),
      });
    } catch (error) {
      throw error;
    }

    return joinRequest;
  }

  async deleteJoinRequest(userId: number, groupId: number): Promise<void> {
    await this.joinRequestRepository.delete(userId, groupId);
  }

  async findJoinRequests(
    groupId: number,
    requesterId: number,
    options?: RequestOptions
  ): Promise<UserOutputStrict[]> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.creatorId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not the creator of this group",
        HTTPCodes.Forbidden
      );
    }

    let joinRequests = null;

    try {
      joinRequests = await this.joinRequestRepository.findAll(
        groupId,
        options ?? {}
      );
    } catch (error) {
      throw error;
    }

    const userIds = joinRequests.map((request) => request.userId);

    let users = null;

    try {
      users = await this.userRepository.findAll({ ids: userIds });
    } catch (error) {
      throw error;
    }

    const output = toUserOutputStrict(users);

    if (Array.isArray(output)) {
      return output;
    }

    return [output];
  }

  async acceptJoinRequest(
    userId: number,
    groupId: number,
    requesterId: number
  ): Promise<void> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.creatorId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not the creator of this group",
        HTTPCodes.Forbidden
      );
    }

    await this.groupMemberRepository.create({
      userId,
      groupId,
      createdById: requesterId,
      createdAt: new Date(),
    });

    await this.joinRequestRepository.delete(userId, groupId);
  }

  async rejectJoinRequest(
    userId: number,
    groupId: number,
    requesterId: number
  ): Promise<void> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw new ErrorWithStatus(
        "Error finding group",
        HTTPCodes.InternalServerError
      );
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.creatorId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not the creator of this group",
        HTTPCodes.Forbidden
      );
    }

    await this.joinRequestRepository.delete(userId, groupId);
  }

  async findPosts(
    groupId: number,
    requesterId: number,
    options?: RequestOptions
  ): Promise<Post[]> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw error;
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    let groupMember = null;

    try {
      groupMember = await this.groupMemberRepository.findByUserAndGroup(
        requesterId,
        groupId
      );
    } catch (error) {
      throw error;
    }

    if (!groupMember) {
      throw new ErrorWithStatus(
        "You are not a member of this group",
        HTTPCodes.Forbidden
      );
    }

    try {
      return await this.postRepository.findAllOfGroup(groupId, options);
    } catch (error) {
      throw error;
    }
  }

  async deleteAllPosts(groupId: number, requesterId: number): Promise<void> {
    let group = null;

    try {
      group = await this.groupRepository.findById(groupId);
    } catch (error) {
      throw error;
    }

    if (!group) {
      throw new ErrorWithStatus("Group not found", HTTPCodes.NotFound);
    }

    if (group.creatorId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not the creator of this group",
        HTTPCodes.Forbidden
      );
    }

    try {
      await this.postRepository.deleteAllOfGroup(groupId);
    } catch (error) {
      throw error;
    }
  }
}
