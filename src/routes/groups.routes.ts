import { Router } from "express";
import { GroupController } from "../controller/groups.controller";

export const initGroupsRoutes = (): Router => {
    const router = Router();

    const groupsController = new GroupController();

    router.post("/", groupsController.create);

    router.get("/", groupsController.findAll);

    router.get("/:id", groupsController.findById);

    router.put("/:id", groupsController.update);

    router.delete("/:id", groupsController.delete);

    router.get("/:id/members", groupsController.findMembers);

    router.post("/:id/members/:userId", groupsController.addMember);

    router.delete("/:id/members/:userId", groupsController.deleteMember);

    router.get("/:id/posts", groupsController.findPosts);

    router.post("/:id/join-requests", groupsController.createJoinRequest);

    router.get("/:id/join-requests", groupsController.findJoinRequests);

    router.delete("/:id/join-requests/:requestId", groupsController.deleteJoinRequest);

    router.put("/:id/join-requests/:requestId", groupsController.updateJoinRequest);

    return router;
}
