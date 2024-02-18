import { Router } from "express";
import { GroupController } from "../controller/groups.controller";
import { IGroupService, IUserService } from "../interfaces/services";
import { authenticate } from "../middleware/auth.middleware";

export const initGroupsRoutes = (groupService: IGroupService, userService: IUserService): Router => {
    const router = Router();

    const groupsController = new GroupController(groupService);

    router.post("/", authenticate(userService), groupsController.create.bind(groupsController));

    router.get("/", authenticate(userService), groupsController.findAll.bind(groupsController));

    router.get("/:id", authenticate(userService), groupsController.findById.bind(groupsController));

    router.put("/:id", authenticate(userService), groupsController.update.bind(groupsController));

    router.delete("/:id", authenticate(userService), groupsController.delete.bind(groupsController));

    router.get("/:id/members", authenticate(userService), groupsController.findMembers.bind(groupsController));

    router.delete("/:id/members/:userId", authenticate(userService), groupsController.deleteMember.bind(groupsController));

    router.get("/:id/posts", authenticate(userService), groupsController.findPosts.bind(groupsController));

    router.post("/:id/join-requests", authenticate(userService), groupsController.createJoinRequest.bind(groupsController));

    router.get("/:id/join-requests", authenticate(userService), groupsController.findJoinRequests.bind(groupsController));

    router.delete("/:id/join-requests", authenticate(userService), groupsController.deleteJoinRequest.bind(groupsController));

    router.delete("/:id/join-requests/:userId", authenticate(userService), groupsController.rejectJoinRequest.bind(groupsController));

    router.post("/:id/join-requests/:userId", authenticate(userService), groupsController.acceptJoinRequest.bind(groupsController));

    router.get("/:id/posts", authenticate(userService), groupsController.findPosts.bind(groupsController));

    return router;
}
