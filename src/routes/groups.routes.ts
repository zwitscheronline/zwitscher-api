import { Router } from "express";
import { GroupController } from "../controller/groups.controller";

export const initGroupsRoutes = (): Router => {
    const router = Router();

    const groupsController = new GroupController();

    router.post("/", groupsController.create.bind(groupsController));

    router.get("/", groupsController.findAll.bind(groupsController));

    router.get("/:id", groupsController.findById.bind(groupsController));

    router.put("/:id", groupsController.update.bind(groupsController));

    router.delete("/:id", groupsController.delete.bind(groupsController));

    router.get("/:id/members", groupsController.findMembers.bind(groupsController));

    router.post("/:id/members/:userId", groupsController.addMember.bind(groupsController));

    router.delete("/:id/members/:userId", groupsController.deleteMember.bind(groupsController));

    router.get("/:id/posts", groupsController.findPosts.bind(groupsController));

    router.post("/:id/join-requests", groupsController.createJoinRequest.bind(groupsController));

    router.get("/:id/join-requests", groupsController.findJoinRequests.bind(groupsController));

    router.delete("/:id/join-requests/:requestId", groupsController.deleteJoinRequest.bind(groupsController));

    router.put("/:id/join-requests/:requestId", groupsController.updateJoinRequest.bind(groupsController));

    return router;
}
