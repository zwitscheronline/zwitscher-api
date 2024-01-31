import { Router } from "express";
import { ListController } from "../controller/lists.controller";

export const initListsRoutes = (): Router => {
    const router = Router();

    const listsController = new ListController();

    router.post("/", listsController.create);

    router.get("/", listsController.findAll);

    router.get("/:id", listsController.findById);

    router.put("/:id", listsController.update);

    router.delete("/:id", listsController.delete);

    router.get("/:id/users", listsController.findUsers);

    router.post("/:id/users/:userId", listsController.addUser);

    router.delete("/:id/users/:userId", listsController.deleteUser);

    router.post("/:id/follower", listsController.follow);

    router.delete("/:id/follower/:userId", listsController.unfollow);

    router.get("/:id/follower", listsController.findFollowers);

    return router;
}
