import { Router } from "express";
import { BookmarkController } from "../controller/bookmarks.controller";
import { IBookmarkService } from "../interfaces/services";
import { authenticate } from "../middleware/auth.middleware";

export const initBookmarkRoutes = (bookmarkService: IBookmarkService): Router => {
    const router = Router();

    const bookmarkController = new BookmarkController(bookmarkService);

    router.post("/:postId", authenticate, bookmarkController.create.bind(bookmarkController));

    router.get("/", authenticate, bookmarkController.findAll.bind(bookmarkController));

    router.delete("/:postId", authenticate, bookmarkController.delete.bind(bookmarkController));

    return router;
}
