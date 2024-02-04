import { Router } from "express";
import { initAuthRoutes } from "./auth.routes";
import { initBookmarkRoutes } from "./bookmarks.routes";
import { initGroupsRoutes } from "./groups.routes";
import { initListsRoutes } from "./lists.routes";
import { initPostRoutes } from "./posts.routes";
import { initUserRoutes } from "./users.routes";
import { UserService } from "../services/user.service";
import { UserRepository } from "../repositories/users";
import { FollowerRepository } from "../repositories/followers";
import { AuthService } from "../services/auth.service";

export const initRouting = (): Router => {
    const router = Router();

    const userRepo = new UserRepository();
    const followRepo = new FollowerRepository();

    const userService = new UserService(userRepo, followRepo);
    const authService = new AuthService(userRepo);

    router.use("/auth", initAuthRoutes(authService));
    router.use("/bookmarks", initBookmarkRoutes());
    router.use("/groups", initGroupsRoutes());
    router.use("/lists", initListsRoutes());
    router.use("/posts", initPostRoutes());
    router.use("/users", initUserRoutes(userService, authService));

    return router;
}
