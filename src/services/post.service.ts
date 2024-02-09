import {PostRepository} from "../repositories/posts";
import {RequestOptions} from "../types/request_options";
import {UserOutputStrict} from "../types/user_output";
import {Post} from "@prisma/client";
import {Err} from "../types/error";
import {HTTPCodes} from "../types/http_codes.enum";

export class PostService {
    private readonly postRepository: PostRepository;

    constructor(postRepository: PostRepository) {
        this.postRepository = postRepository;
    }

    async findAll(options: RequestOptions): Promise<Post[] | Err> {
        try {
            const posts = await this.postRepository.findAll(options);
            console.log(posts);
            return posts;
        } catch (error) {
            return {
                message: "Unable to find users",
                status: HTTPCodes.InternalServerError,
            };
        }
    }
}