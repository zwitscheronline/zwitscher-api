import { PostRepository } from "../repositories/posts";
import { RequestOptions } from "../types/request_options";
import { Post } from "@prisma/client";
import { HTTPCodes } from "../types/http_codes.enum";
import { IPostService } from "../interfaces/services";
import { ErrorWithStatus } from "../types/error";

export class PostService implements IPostService<Post[]> {
  private readonly postRepository: PostRepository;

  constructor(postRepository: PostRepository) {
    this.postRepository = postRepository;
  }

  async findAll(options: RequestOptions): Promise<Post[]> {
    try {
      const posts = await this.postRepository.findAll(options);
      return posts;
    } catch (error) {
      throw new ErrorWithStatus(`Error fetching posts: ${error}`, HTTPCodes.InternalServerError);
    }
  }
}
