import { RequestOptions } from "../types/request_options";
import { IPostRepository } from "../interfaces/repositories";
import { PostCreationData } from "../types/post-data";
import { Post } from "../types/schema-types";
import { database } from "../main";
import { and, desc, eq, isNull, or } from "drizzle-orm";
import { posts } from "../db/schema/posts";

export class PostRepository implements IPostRepository<Post> {

    async create(data: PostCreationData): Promise<Post> {
        try {
            return (await database.insert(posts).values(data).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async update(data: Post): Promise<Post> {

        if (data.id === undefined) throw new Error("Post ID is required to update post.");

        try {
            return (await database.update(posts).set(data).where(eq(posts.id, data.id)).returning())[0];
        } catch (error) {
            throw error;
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await database.delete(posts).where(eq(posts.id, id)).execute();
        } catch (error) {
            throw error;
        }
    }

    async deleteAllOfUser(userId: number): Promise<void> {
        try {
            await database.delete(posts).where(eq(posts.authorId, userId)).execute();
        } catch (error) {
            throw error;
        }
    }

    async findAll(options: RequestOptions & { ids?: number[] }): Promise<Post[]> {
        const page = options.page || 1;
        const entriesPerPage = options.entriesPerPage || 25;

        try {
            return await database.select()
                .from(posts)
                .where(and(or(...(options.ids ? options.ids.map(id => eq(posts.id, id)) : [])), isNull(posts.deletedAt)))
                .limit(entriesPerPage)
                .offset((page - 1) * entriesPerPage)
                .orderBy(desc(posts.createdAt));
        } catch (error) {
            throw error;
        }
    }

    async findAllOfUser(userId: number, options?: RequestOptions): Promise<Post[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

        try {
            return await database.query.posts.findMany({
                where: and(eq(posts.authorId, userId), isNull(posts.deletedAt)),
                limit: entriesPerPage,
                offset: (page - 1) * entriesPerPage,
                orderBy: desc(posts.createdAt),
                with: {
                    originalPost: {
                        with: {
                            author: true,
                        }
                    },
                    parentPost: {
                        with: {
                            author: true,
                        }
                    },
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findChildrenOfPost(postId: number, options?: RequestOptions): Promise<Post[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

        try {
            return await database.query.posts.findMany({
                where: and(eq(posts.parentPostId, postId), isNull(posts.deletedAt)),
                limit: entriesPerPage,
                offset: (page - 1) * entriesPerPage,
                orderBy: desc(posts.createdAt),
                with: {
                    originalPost: {
                        with: {
                            author: true,
                        }
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async findParentOfPost(postId: number): Promise<Post | null> {
        try {
            const returning = await database.query.posts.findFirst({
                where: and(eq(posts.id, postId), isNull(posts.deletedAt)),
            });

            if (returning === undefined) return null;

            return returning;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: number): Promise<Post | null> {
        try {
            const returning = await database.query.posts.findFirst({
                where: and(eq(posts.id, id), isNull(posts.deletedAt)),
                with: {
                    originalPost: {
                        with: {
                            author: true,
                        }
                    },
                    parentPost: {
                        with: {
                            author: true,
                        }
                    }
                }
            });

            if (returning === undefined) return null;

            return returning;
        } catch (error) {
            throw error;
        }
    }

    async findAllOfGroup(groupId: number, options?: RequestOptions): Promise<Post[]> {
        const page = options?.page || 1;
        const entriesPerPage = options?.entriesPerPage || 25;

        try {
            return await database.query.posts.findMany({
                where: eq(posts.groupId, groupId),
                limit: entriesPerPage,
                offset: (page - 1) * entriesPerPage,
                orderBy: desc(posts.createdAt),
                with: {
                    originalPost: {
                        with: {
                            author: true,
                        }
                    },
                    parentPost: {
                        with: {
                            author: true,
                        }
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async deleteAllOfGroup(groupId: number): Promise<void> {
        try {
            await database.update(posts)
                .set({ deletedAt: new Date() })
                .where(eq(posts.groupId, groupId))
                .execute();
        } catch (error) {
            throw error;
        }
    }
}
