import { Router } from "express";
import { PostController } from "../controller/posts.controller";

export const initPostRoutes = (): Router => {
    const router = Router();

    const postController = new PostController();

    router.post("/", postController.create.bind(postController));

    router.get("/", postController.findAll.bind(postController));

    router.get("/:id", postController.findById.bind(postController));

    router.put("/:id", postController.update.bind(postController));

    router.delete("/:id", postController.delete.bind(postController));

    router.get("/:id/comments", postController.findComments.bind(postController));

    router.get("/:id/likes", postController.findLikes.bind(postController));

    router.post("/:id/likes", postController.like.bind(postController));

    router.delete("/:id/likes", postController.unlike.bind(postController));

    return router;
}
