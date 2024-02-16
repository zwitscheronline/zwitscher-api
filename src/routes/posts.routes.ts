import { Router } from "express";
import { PostController } from "../controller/posts.controller";
import { PostService } from "../services/post.service";
import { authenticate } from "../middleware/auth.middleware";

export const initPostRoutes = (postService: PostService): Router => {
    const router = Router();

    const postController = new PostController(postService);

    router.post("/", authenticate, postController.create.bind(postController));

    router.get("/", postController.findAll.bind(postController));

    router.get("/:id", postController.findById.bind(postController));

    router.delete("/:id", authenticate, postController.delete.bind(postController));

    router.get("/:id/comments", postController.findComments.bind(postController));

    router.get("/:id/likes", postController.findLikes.bind(postController));

    router.post("/:id/likes", authenticate, postController.like.bind(postController));

    router.delete("/:id/likes", authenticate, postController.unlike.bind(postController));

    return router;
}
