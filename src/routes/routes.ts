import { Router } from "express";
import { initAuthRoutes } from "./auth.routes";
import { initBookmarkRoutes } from "./bookmarks.routes";
import { initGroupsRoutes } from "./groups.routes";
import { initListsRoutes } from "./lists.routes";
import { initPostRoutes } from "./posts.routes";
import { initUserRoutes } from "./users.routes";

export const initRouting = (): Router => {
    const router = Router();

    router.use("/auth", initAuthRoutes());
    router.use("/bookmarks", initBookmarkRoutes());
    router.use("/groups", initGroupsRoutes());
    router.use("/lists", initListsRoutes());
    router.use("/posts", initPostRoutes());
    router.use("/users", initUserRoutes());

    return router;
}
