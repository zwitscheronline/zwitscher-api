import { IBookmarkService } from "../interfaces/services";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { IBookmarkRepository, IPostRepository } from "../interfaces/repositories";
import { Bookmark, Post } from "../types/schema-types";

export class BookmarkService implements IBookmarkService {
    constructor(
        private bookmarkRepository: IBookmarkRepository<Bookmark>,
        private postRepository: IPostRepository<Post>
    ) {}

    async create(postId: number, userId: number): Promise<void> {
        try {
            await this.bookmarkRepository.create({
                postId,
                userId,
                createdAt: new Date(),
            });
        } catch (error) {
            throw new ErrorWithStatus("Error creating bookmark", HTTPCodes.InternalServerError);
        }
    }

    async delete(postId: number, userId: number): Promise<void> {
        try {
            await this.bookmarkRepository.delete(userId, postId);
        } catch (error) {
            throw new ErrorWithStatus("Error deleting bookmark", HTTPCodes.InternalServerError);
        }
    }

    async findBookmarkedByUser(userId: number): Promise<Post[]> {
        try {
            const bookmarks = await this.bookmarkRepository.findAllOfUser(userId, {});
            const postIds = bookmarks.map((bookmark) => bookmark.postId);
            return this.postRepository.findAll({ ids: postIds });
        } catch (error) {
            throw new ErrorWithStatus("Error finding bookmarks", HTTPCodes.InternalServerError);
        }
    }
}
