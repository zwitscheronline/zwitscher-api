import { Request, Response } from "express";

export class ListController {
    constructor() {}

    create(req: Request, res: Response) {
        res.send("create list");
    }

    findAll(req: Request, res: Response) {
        res.send("get all lists");
    }

    findById(req: Request, res: Response) {
        res.send("get one list");
    }

    update(req: Request, res: Response) {
        res.send("update list");
    }

    delete(req: Request, res: Response) {
        res.send("delete list");
    }

    findUsers(req: Request, res: Response) {
        res.send("get all users");
    }

    addUser(req: Request, res: Response) {
        res.send("add user");
    }

    deleteUser(req: Request, res: Response) {
        res.send("delete user");
    }

    follow(req: Request, res: Response) {
        res.send("follow list");
    }

    unfollow(req: Request, res: Response) {
        res.send("unfollow list");
    }

    findFollowers(req: Request, res: Response) {
        res.send("get all followers");
    }
}
