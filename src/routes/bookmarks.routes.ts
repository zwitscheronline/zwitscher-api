import { Router } from "express";
import { BookmarkController } from "../controller/bookmarks.controller";
import { IBookmarkService, IUserService } from "../interfaces/services";
import { authenticate } from "../middleware/auth.middleware";

export const initBookmarkRoutes = (bookmarkService: IBookmarkService, userService: IUserService): Router => {
    const router = Router();

    const bookmarkController = new BookmarkController(bookmarkService);

    router.post("/:postId", authenticate(userService), bookmarkController.create.bind(bookmarkController));

    router.get("/", authenticate(userService), bookmarkController.findAll.bind(bookmarkController));

    router.delete("/:postId", authenticate(userService), bookmarkController.delete.bind(bookmarkController));

    return router;
}
