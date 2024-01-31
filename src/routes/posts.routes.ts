import { Router } from "express";
import { PostController } from "../controller/posts.controller";

export const initPostRoutes = (): Router => {
    const router = Router();

    const postController = new PostController();

    router.post("/", postController.create);

    router.get("/", postController.findAll);

    router.get("/:id", postController.findById);

    router.put("/:id", postController.update);

    router.delete("/:id", postController.delete);

    router.get("/:id/comments", postController.findComments);

    router.get("/:id/likes", postController.findLikes);

    router.post("/:id/likes", postController.like);

    router.delete("/:id/likes", postController.unlike);

    return router;
}
