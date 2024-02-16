import { Request, Response } from "express";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { IBookmarkService } from "../interfaces/services";

export class BookmarkController {
    constructor(
        private bookmarkService: IBookmarkService
    ) {}

    async create(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const userId = parseInt(req.params.userId);
            await this.bookmarkService.create(postId, userId);
            return res.status(HTTPCodes.Created).send("Bookmark created");
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).json({ message: "Error while creating bookmark" });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const userId = parseInt(req.params.userId);
            const bookmarks = await this.bookmarkService.findBookmarkedByUser(userId);
            return res.status(HTTPCodes.Ok).json(bookmarks);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).json({ message: "Error while getting bookmarks" });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const postId = parseInt(req.params.postId);
            const userId = parseInt(req.params.userId);
            await this.bookmarkService.delete(postId, userId);
            return res.status(HTTPCodes.Ok).send("Bookmark deleted");
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).json({ message: "Error while deleting bookmark" });
        }
    }
}
