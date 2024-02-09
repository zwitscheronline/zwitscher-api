import { Router } from "express";
import { UserController } from "../controller/users.controller";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { authenticate } from "../middleware/auth.middleware";

export const initUserRoutes = (userService: UserService, authService: AuthService): Router => {
    const router = Router();

    const userController = new UserController(userService, authService);

    router.post("/", userController.create.bind(userController));

    router.put("/:id", authenticate, userController.update.bind(userController));

    router.delete("/:id", authenticate, userController.delete.bind(userController));

    router.get("/", userController.findAll.bind(userController));

    router.get("/:id", userController.findById.bind(userController));

    router.get("/:id/posts", userController.findPosts.bind(userController));

    router.get("/:id/follower", userController.findFollowers.bind(userController));

    router.get("/:id/following", userController.findFollowing.bind(userController));

    router.get("/:id/lists", userController.findLists.bind(userController));

    router.get("/:id/likes", userController.findLikes.bind(userController));

    router.get("/:id/groups", userController.findGroups.bind(userController));

    router.get("/:id/join-requests", authenticate, userController.findGroupJoinRequests.bind(userController));

    router.post("/:id/follower", authenticate, userController.follow.bind(userController));

    router.delete("/:id/follower/:followerId", authenticate, userController.unfollow.bind(userController));

    return router;
}
