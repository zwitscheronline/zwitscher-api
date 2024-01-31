import { Router } from "express";
import { UserController } from "../controller/users.controller";

export const initUserRoutes = (): Router => {
    const router = Router();

    const userController = new UserController();

    router.post("/", userController.create);

    router.put("/:id", userController.update);

    router.delete("/:id", userController.delete);

    router.get("/", userController.findAll);

    router.get("/:id", userController.findById);

    router.get("/:id/posts", userController.findPosts);

    router.get("/:id/follower", userController.findFollowers);

    router.get("/:id/following", userController.findFollowing);

    router.get("/:id/lists", userController.findLists);

    router.get("/:id/likes", userController.findLikes);

    router.get("/:id/groups", userController.findGroups);

    router.get("/:id/join-requests", userController.findGroupJoinRequests);

    router.post("/:id/follower", userController.follow);

    router.delete("/:id/follower/:followerId", userController.unfollow);

    return router;
}
