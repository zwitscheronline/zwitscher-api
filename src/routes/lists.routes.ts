import { Router } from "express";
import { ListController } from "../controller/lists.controller";

export const initListsRoutes = (): Router => {
    const router = Router();

    const listsController = new ListController();

    router.post("/", listsController.create.bind(listsController));

    router.get("/", listsController.findAll.bind(listsController));

    router.get("/:id", listsController.findById.bind(listsController));

    router.put("/:id", listsController.update.bind(listsController));

    router.delete("/:id", listsController.delete.bind(listsController));

    router.get("/:id/users", listsController.findUsers.bind(listsController));

    router.post("/:id/users/:userId", listsController.addUser.bind(listsController));

    router.delete("/:id/users/:userId", listsController.deleteUser.bind(listsController));

    router.post("/:id/follower", listsController.follow.bind(listsController));

    router.delete("/:id/follower/:userId", listsController.unfollow.bind(listsController));

    router.get("/:id/follower", listsController.findFollowers.bind(listsController));

    return router;
}
