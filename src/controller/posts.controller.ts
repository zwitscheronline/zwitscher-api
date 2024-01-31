import { Request, Response } from "express";

export class PostController {
    constructor() {}

    create(req: Request, res: Response) {
        res.send("create post");
    }

    findAll(req: Request, res: Response) {
        res.send("get all posts");
    }

    findById(req: Request, res: Response) {
        res.send("get one post");
    }

    update(req: Request, res: Response) {
        res.send("update post");
    }

    delete(req: Request, res: Response) {
        res.send("delete post");
    }

    findComments(req: Request, res: Response) {
        res.send("get all comments");
    }

    findLikes(req: Request, res: Response) {
        res.send("get all likes");
    }

    like(req: Request, res: Response) {
        res.send("like post");
    }

    unlike(req: Request, res: Response) {
        res.send("unlike post");
    }
}
