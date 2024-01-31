import { Request, Response } from "express";

export class UserController {
    constructor() {}

    create(req: Request, res: Response) {
        res.send("Create user");
    }

    update(req: Request, res: Response) {
        res.send("Update user");
    }

    delete(req: Request, res: Response) {
        res.send("Delete user");
    }

    findAll(req: Request, res: Response) {
        res.send("Get all users");
    }

    findById(req: Request, res: Response) {
        res.send("Get user by id");
    }

    findPosts(req: Request, res: Response) {
        res.send("Get user posts");
    }

    findFollowers(req: Request, res: Response) {
        res.send("Get user followers");
    }

    findFollowing(req: Request, res: Response) {
        res.send("Get user following");
    }

    findLists(req: Request, res: Response) {
        res.send("Get user lists");
    }

    findLikes(req: Request, res: Response) {
        res.send("Get user likes");
    }

    findGroups(req: Request, res: Response) {
        res.send("Get user groups");
    }

    findGroupJoinRequests(req: Request, res: Response) {
        res.send("Get user join requests");
    }

    follow(req: Request, res: Response) {
        res.send("Follow user");
    }

    unfollow(req: Request, res: Response) {
        res.send("Unfollow user");
    }
}
