import { Router } from "express";
import { ListController } from "../controller/lists.controller";
import { IListService, IUserService } from "../interfaces/services";
import { authenticate } from "../middleware/auth.middleware";

export const initListsRoutes = (listService: IListService, userService: IUserService): Router => {
    const router = Router();

    const listsController = new ListController(listService);

    router.post("/", authenticate(userService), listsController.create.bind(listsController));

    router.get("/", authenticate(userService), listsController.findAll.bind(listsController));

    router.get("/:id", authenticate(userService), listsController.findById.bind(listsController));

    router.put("/:id", authenticate(userService), listsController.update.bind(listsController));

    router.delete("/:id", authenticate(userService), listsController.delete.bind(listsController));

    router.get("/:id/users", authenticate(userService), listsController.findUsers.bind(listsController));

    router.post("/:id/users/:userId", authenticate(userService), listsController.addUser.bind(listsController));

    router.delete("/:id/users/:userId", authenticate(userService), listsController.deleteUser.bind(listsController));

    router.post("/:id/follower", authenticate(userService), listsController.follow.bind(listsController));

    router.delete("/:id/follower/:userId", authenticate(userService), listsController.unfollow.bind(listsController));

    router.get("/:id/follower", authenticate(userService), listsController.findFollowers.bind(listsController));

    return router;
}
