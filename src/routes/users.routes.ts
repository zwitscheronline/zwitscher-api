import { Router } from "express";
import { UserController } from "../controller/users.controller";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { authenticate } from "../middleware/auth.middleware";

export const initUserRoutes = (userService: UserService, authService: AuthService): Router => {
    const router = Router();

    const userController = new UserController(userService, authService);

    router.post("/", userController.create);

    router.put("/:id", authenticate, userController.update);

    router.delete("/:id", authenticate, userController.delete);

    router.get("/", userController.findAll);

    router.get("/:id", userController.findById);

    router.get("/:id/posts", userController.findPosts);

    router.get("/:id/follower", userController.findFollowers);

    router.get("/:id/following", userController.findFollowing);

    router.get("/:id/lists", userController.findLists);

    router.get("/:id/likes", userController.findLikes);

    router.get("/:id/groups", userController.findGroups);

    router.get("/:id/join-requests", authenticate, userController.findGroupJoinRequests);

    router.post("/:id/follower", authenticate, userController.follow);

    router.delete("/:id/follower/:followerId", authenticate, userController.unfollow);

    return router;
}
