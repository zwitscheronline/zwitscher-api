import { Groups, JoinRequests, Lists, Post, User } from "@prisma/client";
import { RequestOptions } from "../types/request_options";
import { UserCreationData } from "../types/user-data";
import { UserOutput, UserOutputStrict } from "../types/user_output";
import { PostCreationData } from "../types/post-data";
import { ListCreationData } from "../types/list-data";
import { GroupCreationData } from "../types/group-data";

export interface IUserService {
    create(data: UserCreationData): Promise<UserOutput>;
    update(data: Partial<User>, requesterId: number): Promise<UserOutput>;
    updatePassword(oldPassword: string, newPassword: string, userId: number, requesterId: number): Promise<void>;
    delete(userId: number, requesterId: number): Promise<void>;
    findById(id: number, requesterId: number): Promise<UserOutput | UserOutputStrict>;
    findByTag(tag: string, requesterId: number): Promise<UserOutput | UserOutputStrict>;
    findAll(options: RequestOptions): Promise<UserOutputStrict[]>;
    follow(userId: number, requesterId: number): Promise<void>;
    unfollow(userId: number, requesterId: number): Promise<void>;
    removeFollower(followerId: number, requesterId: number): Promise<void>;
    findFollowers(userId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
    findFollowing(userId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
}

export interface IAuthService<Input, Output, TokenData> {
    login(credentials: Input): Promise<Output>;
    refreshAccessToken(token: string): Promise<string>;
    getInformationFromAccessToken(token: string): TokenData;
}

export interface IPostService {
    create(data: PostCreationData): Promise<Post>;
    delete(postId: number, requesterId: number): Promise<void>;
    findByID(id: number): Promise<Post>;
    findAll(options: RequestOptions): Promise<Post[]>;
    findChildrenOfPost(postId: number, options?: RequestOptions): Promise<Post[]>;
    findParentPost(postId: number): Promise<Post>;
    deleteAllOfUser(userId: number, requesterId: number): Promise<void>;
    createLike(postId: number, userId: number): Promise<void>;
    deleteLike(postId: number, userId: number): Promise<void>;
    findLikesOfPost(postId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
    findPostsOfUser(userId: number): Promise<Post[]>;
}

export interface IBookmarkService {
    create(postId: number, userId: number): Promise<void>;
    delete(postId: number, userId: number): Promise<void>;
    findBookmarkedByUser(userId: number): Promise<Post[]>;
}

export interface IListService {
    create(data: ListCreationData): Promise<Lists>;
    update(data: Partial<Lists>, requesterId: number): Promise<Lists>;
    delete(listId: number, requesterId: number): Promise<void>;
    findById(id: number, requesterId: number): Promise<Lists>;
    findAll(requesterId: number, options?: RequestOptions): Promise<Lists[]>;
    findMembers(listId: number, requesterId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
    addMember(listId: number, userId: number, requesterId: number): Promise<void>;
    removeMember(listId: number, userId: number, requesterId: number): Promise<void>;
    findFollowers(listId: number, requesterId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
    followList(listId: number, userId: number): Promise<void>;
    unfollowList(listId: number, userId: number): Promise<void>;
}

export interface IGroupService {
    create(data: GroupCreationData): Promise<Groups>;
    update(data: Partial<Groups>, requesterId: number): Promise<Groups>;
    delete(groupId: number, requesterId: number): Promise<void>;
    findById(id: number, requesterId: number): Promise<Groups>;
    findAll(requesterId: number, options?: RequestOptions): Promise<Groups[]>;
    findMembers(groupId: number, requesterId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
    removeMember(groupId: number, userId: number, requesterId: number): Promise<void>;
    createJoinRequest(groupId: number, userId: number): Promise<JoinRequests>;
    deleteJoinRequest(groupId: number, userId: number, requesterId: number): Promise<void>;
    findJoinRequests(groupId: number, requesterId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
    acceptJoinRequest(groupId: number, userId: number, requesterId: number): Promise<void>;
    rejectJoinRequest(groupId: number, userId: number, requesterId: number): Promise<void>;
    findPosts(groupId: number, requesterId: number, options?: RequestOptions): Promise<Post[]>;
    deleteAllPosts(groupId: number, requesterId: number): Promise<void>;

}
