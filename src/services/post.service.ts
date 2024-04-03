import { RequestOptions } from "../types/request_options";
import { HTTPCodes } from "../types/http_codes.enum";
import { IPostService } from "../interfaces/services";
import { ErrorWithStatus } from "../types/error";
import { PostCreationData } from "../types/post-data";
import { UserOutputStrict, toUserOutputStrict } from "../types/user_output";
import { ILikesRepository, IPostRepository, IUserRepository } from "../interfaces/repositories";
import { Like, Post, User } from "../types/schema-types";

export class PostService implements IPostService {
  constructor(
    private postRepository: IPostRepository<Post>,
    private userRepository: IUserRepository<User>,
    private likeRepository: ILikesRepository<Like>
  ) {}

  private async isValidUserID(id: number): Promise<boolean> {
    return (await this.userRepository.findById(id)) ? true : false;
  }

  private async isValidPostID(id: number): Promise<boolean> {
    try {
      return (await this.postRepository.findById(id)) ? true : false;
    } catch (error) {
      return false;
    }
  }

  async create(data: PostCreationData): Promise<Post> {
    if (data.isRetweet && data.originalPostId !== undefined) {
      throw new ErrorWithStatus(
        "A retweet has to have the original post id",
        HTTPCodes.BadRequest
      );
    }

    if (!(await this.isValidUserID(data.authorId))) {
      throw new ErrorWithStatus("Invalid author", HTTPCodes.BadRequest);
    }

    if (
      data.originalPostId !== undefined &&
      !(await this.isValidPostID(data.originalPostId))
    ) {
      throw new ErrorWithStatus("Invalid original post", HTTPCodes.BadRequest);
    }

    if (data.originalPostId !== undefined) {
      data.isRetweet = true;
    }

    if (
      data.parentPostId !== undefined &&
      !(await this.isValidPostID(data.parentPostId))
    ) {
      throw new ErrorWithStatus("Invalid parent post", HTTPCodes.BadRequest);
    }
    try {
      return await this.postRepository.create(data);
    } catch (error) {
      throw new ErrorWithStatus(
        `Error while creating post: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async delete(postId: number, requesterId: number): Promise<void> {
    let post: Post | null = null;
    try {
      post = await this.postRepository.findById(postId);
    } catch (error) {
      throw new ErrorWithStatus(
        `Error while fetching post: ${error}`,
        HTTPCodes.InternalServerError
      );
    }

    if (!post) {
      throw new ErrorWithStatus("Could not find post", HTTPCodes.NotFound);
    }

    if (!(await this.isValidUserID(requesterId))) {
      throw new ErrorWithStatus("Invalid requester", HTTPCodes.BadRequest);
    }

    if (post.authorId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not allowed to delete this post",
        HTTPCodes.Forbidden
      );
    }

    try {
      await this.postRepository.delete(postId);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while deleting post: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async findByID(id: number): Promise<Post> {
    let post: Post | null = null;
    try {
      post = await this.postRepository.findById(id);
    } catch (error) {
      throw new ErrorWithStatus(
        `Error while fetching post: ${error}`,
        HTTPCodes.InternalServerError
      );
    }

    if (!post) {
      throw new ErrorWithStatus("Could not find post", HTTPCodes.NotFound);
    }

    return post;
  }

  async findAll(options: RequestOptions): Promise<Post[]> {
    try {
      return await this.postRepository.findAll(options);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error fetching posts: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async findChildrenOfPost(
    postId: number,
    options?: RequestOptions
  ): Promise<Post[]> {
    try {
      return await this.postRepository.findChildrenOfPost(
        postId,
        options ?? {}
      );
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while fetching children: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async findParentPost(postId: number): Promise<Post> {
    let post: Post | null = null;
    try {
      post = await this.postRepository.findParentOfPost(postId);
    } catch (error) {
      throw new ErrorWithStatus(
        `Error while fetching parent post: ${error}`,
        HTTPCodes.InternalServerError
      );
    }

    if (!post) {
      throw new ErrorWithStatus("Could not find post", HTTPCodes.NotFound);
    }

    return post;
  }

  async deleteAllOfUser(userId: number, requesterId: number): Promise<void> {
    if (userId !== requesterId) {
      throw new ErrorWithStatus(
        "You are not able to delete post from others",
        HTTPCodes.Forbidden
      );
    }

    try {
      await this.postRepository.deleteAllOfUser(userId);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while deleting posts: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async createLike(postId: number, userId: number): Promise<void> {
    let like = null;
    try {
      like = await this.likeRepository.findWithPostAndUser(postId, userId);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while toggling like: ${error}`,
        HTTPCodes.InternalServerError
      );
    }

    if (like) {
      throw new ErrorWithStatus("Like already exists", HTTPCodes.BadRequest);
    }

    try {
      await this.likeRepository.create({
        postId,
        userId,
        createdAt: new Date(),
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while toggling like: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async deleteLike(postId: number, userId: number): Promise<void> {
    let like = null;
    try {
      like = await this.likeRepository.findWithPostAndUser(postId, userId);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while toggling like: ${error}`,
        HTTPCodes.InternalServerError
      );
    }

    if (!like) {
      throw new ErrorWithStatus("Like not found", HTTPCodes.NotFound);
    }

    try {
      await this.likeRepository.delete(userId, postId);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while toggling like: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async findLikesOfPost(
    postId: number,
    options?: RequestOptions
  ): Promise<UserOutputStrict[]> {
    try {
      const likes = await this.likeRepository.findAllOfPost(postId, options);

      const ids: number[] = likes.map((like) => like.userId);

      const users = await this.userRepository.findAll({ ids });
      const output = toUserOutputStrict(users);
      if (Array.isArray(output)) {
        return output;
      } else {
        return [output];
      }
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while fetching likes: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async findPostsOfUser(userId: number): Promise<Post[]> {
    try {
      return await this.postRepository.findAllOfUser(userId);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while fetching posts: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }

  async findLikedPostsOfUser(userId: number): Promise<Post[]> {
    try {
      const likes = await this.likeRepository.findAllOfUser(userId);

      const ids: number[] = likes.map((like) => like.postId);

      return await this.postRepository.findAll({ ids });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        throw error;
      }
      throw new ErrorWithStatus(
        `Error while fetching liked posts: ${error}`,
        HTTPCodes.InternalServerError
      );
    }
  }
}
