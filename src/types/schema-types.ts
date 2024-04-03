export interface User {
    id?: number;
    email: string;
    userName?: string | null;
    userTag: string;
    password: string;
    avatar?: string | null;
    biography?: string | null;
    tokenVersion?: number | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}

export interface Post {
    id?: number;
    content: string;
    authorId: number;
    author?: User;
    likesCount?: number | null;
    parentPostId?: number;
    parentPost?: Post;
    originalPostId?: number;
    originalPost?: Post;
    isRetweet?: boolean | null;
    groupId?: number;
    group?: Group;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}

export interface Like {
    id?: number;
    userId: number;
    postId: number;
    createdAt?: Date | null;
}

export interface Bookmark {
    id?: number;
    userId: number;
    postId: number;
    createdAt?: Date | null;
}

export interface Follows {
    id?: number;
    followerId: number;
    followingId: number;
    createdAt?: Date | null;
}

export interface List {
    id?: number;
    creatorId: number;
    name: string;
    description?: string | null;
    isPrivate?: boolean | null;
    createdAt?: Date | null;
    updatedAt?: Date | null;
}

export interface ListFollower {
    id?: number;
    listId: number;
    userId: number;
    createdAt?: Date | null;
}

export interface ListMember {
    id?: number;
    listId: number;
    userId: number;
    createdAt?: Date | null;
}

export interface Group {
    id?: number;
    name: string;
    description?: string | null;
    isPrivate?: boolean | null;
    creatorId: number;
    createdAt?: Date | null;
    updatedAt?: Date | null;
    deletedAt?: Date | null;
}

export interface GroupMember {
    id?: number;
    groupId: number;
    userId: number;
    createdAt?: Date | null;
    createdById: number;
}

export interface GroupJoinRequest {
    id?: number;
    groupId: number;
    userId: number;
    createdAt?: Date | null;
}
