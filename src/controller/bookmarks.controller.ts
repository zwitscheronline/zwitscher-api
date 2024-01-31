import { Request, Response } from "express";

export class BookmarkController {
    constructor() {}

    create(req: Request, res: Response) {
        res.send("create bookmark");
    }

    findAll(req: Request, res: Response) {
        res.send("get all bookmarks");
    }

    delete(req: Request, res: Response) {
        res.send("delete bookmark");
    }
}
