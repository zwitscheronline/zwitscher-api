import { Request, Response } from "express";
import { IListService } from "../interfaces/services";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { List } from "../types/schema-types";

export class ListController {
    constructor(
        private listService: IListService
    ) {}

    async create(req: Request, res: Response) {
        let list = null;

        const data: { name: string, description?: string, isPrivate?: boolean } = req.body;

        try {
            const creatorId = parseInt(req.params.requesterId);
            list = await this.listService.create({
                creatorId,
                ...data
            });
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error creating list");
        }

        return res.status(HTTPCodes.Created).json(list);
    }

    async findAll(req: Request, res: Response) {
        let lists = null;

        const limit = parseInt(req.query.limit as string) || 25;
        const orderBy = req.query.sortBy as string;
        const orderByField = req.query.sortByField as string;
        const page = parseInt(req.query.page as string) || 1;

        try {
            const requesterId = parseInt(req.params.requesterId);
            lists = await this.listService.findAll(requesterId, {
                entriesPerPage: limit,
                orderBy,
                orderByField,
                page
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).send("Error getting lists");
        }

        return res.status(HTTPCodes.Ok).json(lists);
    }

    async findById(req: Request, res: Response) {
        let list = null;

        const id = parseInt(req.params.id);

        try {
            const requesterId = parseInt(req.params.requesterId);
            list = await this.listService.findById(id, requesterId);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error getting list");
        }

        return res.status(HTTPCodes.Ok).json(list);
    }

    async update(req: Request, res: Response) {
        const data: Partial<List> = req.body;

        let list = null;

        try {
            const requesterId = parseInt(req.params.requesterId);
            list = await this.listService.update(data, requesterId);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error updating list");
        }

        return res.status(HTTPCodes.Ok).json(list);
    }

    async delete(req: Request, res: Response) {
        const id = parseInt(req.params.listId);

        try {
            const requesterId = parseInt(req.params.requesterId);
            await this.listService.delete(id, requesterId);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error deleting list");
        }

        return res.status(HTTPCodes.NoContent).send("List deleted");
    }

    async findUsers(req: Request, res: Response) {
        let users = null;

        const limit = parseInt(req.query.limit as string) || 25;
        const orderBy = req.query.sortBy as string;
        const orderByField = req.query.sortByField as string;
        const page = parseInt(req.query.page as string) || 1;

        try {
            const listId = parseInt(req.params.listId);
            const requesterId = parseInt(req.params.requesterId);
            users = await this.listService.findMembers(listId, requesterId, {
                entriesPerPage: limit,
                orderBy,
                orderByField,
                page
            });
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error getting users");
        }

        return res.status(HTTPCodes.Ok).json(users);
    }

    async addUser(req: Request, res: Response) {
        try {
            const listId = parseInt(req.params.listId);
            const userId = parseInt(req.params.userId);
            const requesterId = parseInt(req.params.requesterId);
            await this.listService.addMember(listId, userId, requesterId);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error adding user");
        }

        return res.status(HTTPCodes.Created).send("User added to list");
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const listId = parseInt(req.params.listId);
            const userId = parseInt(req.params.userId);
            const requesterId = parseInt(req.params.requesterId);
            await this.listService.removeMember(listId, userId, requesterId);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error removing user");
        }

        return res.status(HTTPCodes.Ok).send("User removed from list");
    }

    async follow(req: Request, res: Response) {
        try {
            const listId = parseInt(req.params.listId);
            const requesterId = parseInt(req.params.requesterId);
            await this.listService.followList(listId, requesterId);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error following list");
        }

        return res.status(HTTPCodes.Created).send("List followed");
    }

    async unfollow(req: Request, res: Response) {
        try {
            const listId = parseInt(req.params.listId);
            const requesterId = parseInt(req.params.requesterId);
            await this.listService.unfollowList(listId, requesterId);
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error unfollowing list");
        }

        return res.status(HTTPCodes.Ok).send("List unfollowed");
    }

    async findFollowers(req: Request, res: Response) {
        let followers = null;

        const limit = parseInt(req.query.limit as string) || 25;
        const orderBy = req.query.sortBy as string;
        const orderByField = req.query.sortByField as string;
        const page = parseInt(req.query.page as string) || 1;

        try {
            const listId = parseInt(req.params.listId);
            const requesterId = parseInt(req.params.requesterId);
            followers = await this.listService.findFollowers(listId, requesterId, {
                entriesPerPage: limit,
                orderBy,
                orderByField,
                page
            });
        } catch (error) {
            if (error instanceof ErrorWithStatus) {
                return res.status(error.status).send(error.message);
            }
            return res.status(HTTPCodes.InternalServerError).send("Error getting followers");
        }

        return res.status(HTTPCodes.Ok).json(followers);
    }
}
