import { ListCreationData } from "../types/list-data";
import { PostCreationData } from "../types/post-data";
import { RequestOptions } from "../types/request_options";
import { UserCreationData } from "../types/user-data";

interface IUserRepository<T> {
    create(data: UserCreationData): Promise<T>;
    update(data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
    findById(id: number): Promise<T|null>;
    findAll(options: RequestOptions & { ids?: number[] }): Promise<T[]>;
    findByEmail(email: string): Promise<T|null>;
    findByUserTag(userTag: string): Promise<T|null>;
}

interface IPostRepository<T> {
    create(data: PostCreationData): Promise<T>;
    update(data: T): Promise<T>;
    delete(id: number): Promise<void>;
    deleteAllOfUser(userId: number): Promise<void>;
    findAll(options: RequestOptions & { ids?: number[] }): Promise<T[]>;
    findAllOfUser(userId: number, options?: RequestOptions): Promise<T[]>;
    findChildrenOfPost(postId: number, options?: RequestOptions): Promise<T[]>;
    findParentOfPost(postId: number): Promise<T|null>;
    findById(id: number): Promise<T|null>;
}

interface IListRepository<T> {
    create(data: ListCreationData): Promise<T>;
    update(data: Partial<T>): Promise<T>;
    delete(id: number): Promise<void>;
    deleteAll(userId: number): Promise<void>;
    findAll(options: RequestOptions): Promise<T[]>;
    findById(id: number): Promise<T|null>;
    findByUserId(userId: number, options: RequestOptions): Promise<T[]>;
}

interface IListMemberRepository<T> {
    create(data: T): Promise<T>;
    delete(userId: number, listId: number): Promise<void>;
    deleteAll(listId: number): Promise<void>;
    findAll(listId: number, options: RequestOptions): Promise<T[]>;
    findByUserAndList(userId: number, listId: number): Promise<T|null>;
}

interface IListFollowerRepository<T> {
    create(data: T): Promise<T>;
    delete(userId: number, listId: number): Promise<void>;
    deleteAll(listId: number): Promise<void>;
    deleteAllByUserId(userId: number): Promise<void>;
    findAll(listId: number, options: RequestOptions): Promise<T[]>;
    findAllByUserId(userId: number, options: RequestOptions): Promise<T[]>;
    findConnection(userId: number, listId: number): Promise<T|null>;
}

interface ILikesRepository<T> {
    create(data: T): Promise<T>;
    delete(userId: number, postId: number): Promise<void>;
    deleteAll(postId: number): Promise<void>;
    findWithPostAndUser(postId: number, userId: number): Promise<T|null>;
    findAllOfUser(userId: number, options?: RequestOptions): Promise<T[]>;
    findAllOfPost(postId: number, options?: RequestOptions): Promise<T[]>;
}

interface IJoinRequestRepository<T> {
    create(data: T): Promise<T>;
    delete(userId: number, groupId: number): Promise<void>;
    deleteAll(groupId: number): Promise<void>;
    deleteAllByUserId(userId: number): Promise<void>;
    findAll(groupId: number, options: RequestOptions): Promise<T[]>;
    findAllByUserId(userId: number, options: RequestOptions): Promise<T[]>;
}

interface IGroupRepository<T> {
    create(data: T): Promise<T>;
    update(data: T): Promise<T>;
    delete(id: number): Promise<void>;
    deleteAll(userId: number): Promise<void>;
    findAll(options: RequestOptions): Promise<T[]>;
    findById(id: number): Promise<T|null>;
}

interface IGroupMemberRepository<T> {
    create(data: T): Promise<T>;
    delete(userId: number, groupId: number): Promise<void>;
    deleteAll(groupId: number): Promise<void>;
    deleteAllByUserId(userId: number): Promise<void>;
    findAll(groupId: number, options: RequestOptions): Promise<T[]>;
    findAllByUserId(userId: number, options: RequestOptions): Promise<T[]>;
}

interface IFollowerRepository<T> {
    create(data: T): Promise<T>;
    delete(followerId: number, followingId: number): Promise<void>;
    deleteAll(userId: number): Promise<void>;
    findFollowing(userId: number, options: RequestOptions): Promise<T[]>;
    findFollowers(userId: number, options: RequestOptions): Promise<T[]>;
    findWithFollowerAndFollowing(followerId: number, followingId: number): Promise<T|null>;
}

interface IBookmarkRepository<T> {
    create(data: T): Promise<T>;
    delete(userId: number, postId: number): Promise<void>;
    deleteAll(userId: number): Promise<void>;
    findAllOfUser(userId: number, options: RequestOptions): Promise<T[]>;
    findWithPostAndUser(userId: number, postId: number): Promise<T|null>;
}

export {
    IUserRepository,
    IPostRepository,
    IListRepository,
    IListMemberRepository,
    IListFollowerRepository,
    ILikesRepository,
    IJoinRequestRepository,
    IGroupRepository,
    IGroupMemberRepository,
    IFollowerRepository,
    IBookmarkRepository,
};
