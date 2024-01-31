import { Request, Response } from "express";

export class GroupController {
    constructor() {}

    create(req: Request, res: Response) {
        res.send("create group");
    }

    findAll(req: Request, res: Response) {
        res.send("get all groups");
    }

    findById(req: Request, res: Response) {
        res.send("get one group");
    }

    update(req: Request, res: Response) {
        res.send("update group");
    }

    delete(req: Request, res: Response) {
        res.send("delete group");
    }

    findMembers(req: Request, res: Response) {
        res.send("get all members");
    }

    addMember(req: Request, res: Response) {
        res.send("add member");
    }

    deleteMember(req: Request, res: Response) {
        res.send("delete member");
    }

    createJoinRequest(req: Request, res: Response) {
        res.send("create join request");
    }

    findJoinRequests(req: Request, res: Response) {
        res.send("get all join requests");
    }

    deleteJoinRequest(req: Request, res: Response) {
        res.send("delete join request");
    }

    updateJoinRequest(req: Request, res: Response) {
        res.send("update join request");
    }

    findPosts(req: Request, res: Response) {
        res.send("get all posts");
    }
}
