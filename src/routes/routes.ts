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
import { PostService } from "../services/post.service";
import { PostRepository } from "../repositories/posts";
import { LikeRepository } from "../repositories/likes";

export const initRouting = (): Router => {
    const router = Router();

    const userRepo = new UserRepository();
    const followRepo = new FollowerRepository();
    const postRepo = new PostRepository();
    const likeRepo = new LikeRepository();

    const userService = new UserService(userRepo, followRepo);
    const authService = new AuthService(userRepo);
    const postService = new PostService(postRepo, userRepo, likeRepo);

    router.use("/auth", initAuthRoutes(authService));
    router.use("/bookmarks", initBookmarkRoutes());
    router.use("/groups", initGroupsRoutes());
    router.use("/lists", initListsRoutes());
    router.use("/posts", initPostRoutes(postService));
    router.use("/users", initUserRoutes(userService, authService, postService));

    return router;
}
