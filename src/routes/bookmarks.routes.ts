import { Router } from "express";
import { BookmarkController } from "../controller/bookmarks.controller";

export const initBookmarkRoutes = (): Router => {
    const router = Router();

    const bookmarkController = new BookmarkController();

    router.post("/", bookmarkController.create.bind(bookmarkController));

    router.get("/", bookmarkController.findAll.bind(bookmarkController));

    router.delete("/:id", bookmarkController.delete.bind(bookmarkController));

    return router;
}
