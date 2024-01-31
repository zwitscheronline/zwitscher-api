import { Router } from "express";
import { BookmarkController } from "../controller/bookmarks.controller";

export const initBookmarkRoutes = (): Router => {
    const router = Router();

    const bookmarkController = new BookmarkController();

    router.post("/", bookmarkController.create);

    router.get("/", bookmarkController.findAll);

    router.delete("/:id", bookmarkController.delete);

    return router;
}
