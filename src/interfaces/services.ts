import { RequestOptions } from "../types/request_options";
import { UserCreationData } from "../types/user-data";

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

export interface IPostService<Output> {
    findAll(options: RequestOptions): Promise<Output>;
}
