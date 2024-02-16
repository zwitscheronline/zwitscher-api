export interface PostCreationData {
    content: string;
    authorId: number;
    parentPostId?: number;
    originalPostId?: number;
    isRetweet?: boolean;
}
