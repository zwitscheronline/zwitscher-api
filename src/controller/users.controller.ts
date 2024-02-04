import { Request, Response } from "express";
import { HTTPCodes } from "../types/http_codes.enum";
import { UserService } from "../services/user.service";
import { UserCreationData } from "../types/user-data";
import { isErr } from "../types/error";
import { User } from "@prisma/client";
import { AuthService } from "../services/auth.service";
import { RequestOptions } from "../types/request_options";

export class UserController {
    constructor(private userService: UserService, private authService: AuthService) {
        this.userService = userService;
        this.authService = authService;
    }

    async create(req: Request, res: Response) {
        try {
            const data: UserCreationData = {
                email: req.body.email,
                password: req.body.password,
                userTag: req.body.userTag,
                userName: req.body.userName ?? undefined,
                biography: req.body.biography ?? undefined,
            };

            const returning = await this.userService.create(data);
            if (isErr(returning)) {
                return res.status(returning.status).json({
                    error: returning.message,
                });
            }

            return res.status(HTTPCodes.Created).json({
                user: returning,
            });
        } catch (error) {
            console.log(error);
            return res.status(HTTPCodes.InternalServerError)
                .json({
                    error: "Unable to create user",
                });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const data: Omit<
                User, 
                "password" 
                | "avatar" 
                | "createdAt" 
                | "updatedAt" 
                | "deletedAt" 
                | "tokenVersion"
            > = req.body;

            const userId = req.body.id;
            if (userId === undefined || userId < 1) {
                return res.status(HTTPCodes.BadRequest)
                    .json({
                        error: "Invalid id",
                    });
            }
            data.id = userId;

            const token = req.headers.authorization;
            if (token === undefined) {
                return res.status(HTTPCodes.Unauthorized)
                    .json({
                        error: "You must be logged in to update your information",
                    });
            }

            const accessTokenData = this.authService.getInformationFromAccessToken(token);
            if (isErr(accessTokenData)) {
                return res.status(accessTokenData.status)
                    .json({
                        error: accessTokenData.message,
                    });
            }

            const returning = await this.userService.update(data, Number(accessTokenData.sub));

            return res.status(HTTPCodes.Ok)
                .json({
                    user: returning,
                });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError)
                .json({
                    error: "Unable to update user",
                });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const userId = req.body.id;
            if (userId === undefined || Number(userId) < 1) {
                return res.status(HTTPCodes.BadRequest)
                    .json({
                        error: "Invalid id",
                    });
            }

            const token = req.headers.authorization;
            if (token === undefined) {
                return res.status(HTTPCodes.Unauthorized)
                    .json({
                        error: "You must be logged in to delete your account",
                    });
            }

            const accessTokenData = this.authService.getInformationFromAccessToken(token);
            if (isErr(accessTokenData)) {
                return res.status(accessTokenData.status)
                    .json({
                        error: accessTokenData.message,
                    });
            }

            //TODO: delete likes, posts, groups, lists, etc

            const returning = await this.userService
                .delete(Number(userId), Number(accessTokenData.sub));

            if (isErr(returning)) {
                return res.status(returning.status)
                    .json({
                        error: returning.message,
                    });
            }

            return res.status(HTTPCodes.Ok).json({
                message: "User deleted",
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError)
                .json({
                    error: "Unable to delete user",
                });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const requestOptions: RequestOptions = {
                entriesPerPage: Number(req.query.limit) ?? undefined,
                page: Number(req.query.page) ?? undefined,
                orderBy: req.query.orderBy as string | undefined,
                orderByField: req.query.orderField as string | undefined,
            };

            const returning = await this.userService.findAll(requestOptions);
            if (isErr(returning)) {
                return res.status(returning.status).json({
                    error: returning.message,
                });
            }

            return res.status(HTTPCodes.Ok).json({
                users: returning,
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get users",
            });
        }
    }

    async findById(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const token = req.headers.authorization;
            if (token === undefined) {
                return res.status(HTTPCodes.Unauthorized)
                    .json({
                        error: "You must be logged in to get user information",
                    });
            }

            const accessTokenData = this.authService.getInformationFromAccessToken(token);
            if (isErr(accessTokenData)) {
                return res.status(accessTokenData.status)
                    .json({
                        error: accessTokenData.message,
                    });
            }

            const returning = await this.userService.findById(id, Number(accessTokenData.sub));
            if (isErr(returning)) {
                return res.status(returning.status).json({
                    error: returning.message,
                });
            }

            return res.status(HTTPCodes.Ok).json({
                user: returning,
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user",
            });
        }
    }

    async findPosts(req: Request, res: Response) {
        try {
            return res.status(HTTPCodes.Ok).json({
                message: "Not yet implemented",
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user posts",
            });
        }
    }

    async findFollowers(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const requestOptions: RequestOptions = {
                entriesPerPage: Number(req.query.limit) ?? undefined,
                page: Number(req.query.page) ?? undefined,
                orderBy: req.query.orderBy as string | undefined,
                orderByField: req.query.orderField as string | undefined,
            };

            const returning = await this.userService.findFollowers(id, requestOptions);
            if (isErr(returning)) {
                return res.status(returning.status).json({
                    error: returning.message,
                });
            }

            return res.status(HTTPCodes.Ok).json({
                followers: returning,
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user followers",
            });
        }
    }

    async findFollowing(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            const requestOptions: RequestOptions = {
                entriesPerPage: Number(req.query.limit) ?? undefined,
                page: Number(req.query.page) ?? undefined,
                orderBy: req.query.orderBy as string | undefined,
                orderByField: req.query.orderField as string | undefined,
            };

            const returning = await this.userService.findFollowing(id, requestOptions);
            if (isErr(returning)) {
                return res.status(returning.status).json({
                    error: returning.message,
                });
            }

            return res.status(HTTPCodes.Ok).json({
                following: returning,
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user following",
            });
        }
    }

    async findLists(req: Request, res: Response) {
        try {
            return res.status(HTTPCodes.Ok).json({
                message: "Not yet implemented",
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user lists",
            });
        }
    }

    async findLikes(req: Request, res: Response) {
        try {
            return res.status(HTTPCodes.Ok).json({
                message: "Not yet implemented",
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user likes",
            });
        }
    }

    async findGroups(req: Request, res: Response) {
        try {
            return res.status(HTTPCodes.Ok).json({
                message: "Not yet implemented",
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user groups",
            });
        }
    }

    async findGroupJoinRequests(req: Request, res: Response) {
        try {
            res.send("Get user join requests");
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to get user join requests",
            });
        }
    }

    async follow(req: Request, res: Response) {
        try {
            const userId = Number(req.params.id);

            const token = req.headers.authorization;
            if (token === undefined) {
                return res.status(HTTPCodes.Unauthorized)
                    .json({
                        error: "You must be logged in to follow a user",
                    });
            }

            const accessTokenData = this.authService.getInformationFromAccessToken(token);
            if (isErr(accessTokenData)) {
                return res.status(accessTokenData.status)
                    .json({
                        error: accessTokenData.message,
                    });
            }

            const returning = await this.userService.follow(userId, Number(accessTokenData.sub));
            if (isErr(returning)) {
                return res.status(returning.status).json({
                    error: returning.message,
                });
            }

            return res.status(HTTPCodes.Ok).json({
                message: "User followed",
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to follow user",
            });
        }
    }

    async unfollow(req: Request, res: Response) {
        try {
            const userId = Number(req.params.id);

            const token = req.headers.authorization;
            if (token === undefined) {
                return res.status(HTTPCodes.Unauthorized)
                    .json({
                        error: "You must be logged in to unfollow a user",
                    });
            }

            const accessTokenData = this.authService.getInformationFromAccessToken(token);
            if (isErr(accessTokenData)) {
                return res.status(accessTokenData.status)
                    .json({
                        error: accessTokenData.message,
                    });
            }

            const returning = await this.userService.unfollow(userId, Number(accessTokenData.sub));
            if (isErr(returning)) {
                return res.status(returning.status).json({
                    error: returning.message,
                });
            }

            return res.status(HTTPCodes.Ok).json({
                message: "User unfollowed",
            });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError).json({
                error: "Unable to unfollow user",
            });
        }
    }
}
