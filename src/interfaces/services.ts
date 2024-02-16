import { RequestOptions } from "../types/request_options";
import { UserCreationData } from "../types/user-data";
import { UserOutputStrict } from "../types/user_output";

export interface IUserService<Input, Output, OutputStrict> {
    create(data: UserCreationData): Promise<Output>;
    update(data: Partial<Input>, requesterId: number): Promise<Output>;
    updatePassword(oldPassword: string, newPassword: string, userId: number, requesterId: number): Promise<void>;
    delete(userId: number, requesterId: number): Promise<void>;
    findById(id: number, requesterId: number): Promise<Output | OutputStrict>;
    findByTag(tag: string, requesterId: number): Promise<Output | OutputStrict>;
    findAll(options: RequestOptions): Promise<OutputStrict[]>;
    follow(userId: number, requesterId: number): Promise<void>;
    unfollow(userId: number, requesterId: number): Promise<void>;
    removeFollower(followerId: number, requesterId: number): Promise<void>;
    findFollowers(userId: number, options?: RequestOptions): Promise<OutputStrict[]>;
    findFollowing(userId: number, options?: RequestOptions): Promise<OutputStrict[]>;
}

export interface IAuthService<Input, Output, TokenData> {
    login(credentials: Input): Promise<Output>;
    refreshAccessToken(token: string): Promise<string>;
    getInformationFromAccessToken(token: string): TokenData;
}

export interface IPostService<Input, Output> {
    create(data: Input): Promise<Output>;
    delete(postId: number, requesterId: number): Promise<void>;
    findByID(id: number): Promise<Output>;
    findAll(options: RequestOptions): Promise<Output[]>;
    findChildrenOfPost(postId: number, options?: RequestOptions): Promise<Output[]>;
    findParentPost(postId: number): Promise<Output>;
    deleteAllOfUser(userId: number, requesterId: number): Promise<void>;
    createLike(postId: number, userId: number): Promise<void>;
    deleteLike(postId: number, userId: number): Promise<void>;
    findLikesOfPost(postId: number, options?: RequestOptions): Promise<UserOutputStrict[]>;
    findPostsOfUser(userId: number): Promise<Output[]>;
}
