import { Request, Response } from "express";
import { HTTPCodes } from "../types/http_codes.enum";
import { UserService } from "../services/user.service";
import { UserCreationData } from "../types/user-data";
import { ErrorWithStatus } from "../types/error";
import { AuthService } from "../services/auth.service";
import { RequestOptions } from "../types/request_options";
import { UserOutputStrict } from "../types/user_output";
import { PostService } from "../services/post.service";
import { User } from "../types/schema-types";

export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private postService: PostService
  ) {}

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

      return res.status(HTTPCodes.Created).json({
        user: returning,
      });
    } catch (error: ErrorWithStatus | any) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(error.status).json({
          error: error.message,
        });
      }
    }
  }

  async update(req: Request, res: Response) {
    try {
      const data: Omit<
        User,
        | "password"
        | "avatar"
        | "createdAt"
        | "updatedAt"
        | "deletedAt"
        | "tokenVersion"
      > = req.body;

      const userId = parseInt(req.params.id);
      if (userId === undefined || userId < 1) {
        return res.status(HTTPCodes.BadRequest).json({
          error: "Invalid id",
        });
      }
      data.id = userId;

      const requesterId = parseInt(req.params.requesterId);

      const returning = await this.userService.update(
        data,
        requesterId
      );

      return res.status(HTTPCodes.Ok).json({
        user: returning,
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to update user",
        });
      }
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);
      if (userId === undefined || Number(userId) < 1) {
        return res.status(HTTPCodes.BadRequest).json({
          error: "Invalid id",
        });
      }

      const requesterId = parseInt(req.params.requesterId);
      //TODO: delete likes, posts, groups, lists, etc

      await this.userService.delete(
        userId,
        requesterId
      );

      return res.status(HTTPCodes.Ok).json({
        message: "User deleted",
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to delete user",
        });
      }
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

      const returning: UserOutputStrict[] = await this.userService.findAll(requestOptions);

      return res.status(HTTPCodes.Ok).json({
        users: returning,
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get users",
        });
      }
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      const requesterId = parseInt(req.params.requesterId);

      const returning = await this.userService.findById(
        id,
        requesterId
      );

      return res.status(HTTPCodes.Ok).json({
        user: returning,
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user",
        });
      }
    }
  }

  async findPosts(req: Request, res: Response) {
    const userId = Number(req.params.id);

    try {
      const posts = await this.postService.findPostsOfUser(userId);

      return res.status(HTTPCodes.Ok).json(posts);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user posts",
        });
      }
    }
  }

  async findFollowers(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const requestOptions: RequestOptions = {
        entriesPerPage: parseInt(req.query.limit as string) ?? undefined,
        page: parseInt(req.query.page as string) ?? undefined,
        orderBy: req.query.orderBy as string | undefined,
        orderByField: req.query.orderField as string | undefined,
      };

      const returning = await this.userService.findFollowers(
        id,
        requestOptions
      );

      return res.status(HTTPCodes.Ok).json({
        followers: returning,
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user followers",
        });
      }
    }
  }

  async findFollowing(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const requestOptions: RequestOptions = {
        entriesPerPage: parseInt(req.query.limit as string) ?? undefined,
        page: parseInt(req.query.page as string) ?? undefined,
        orderBy: req.query.orderBy as string | undefined,
        orderByField: req.query.orderField as string | undefined,
      };

      const returning = await this.userService.findFollowing(
        id,
        requestOptions
      );

      return res.status(HTTPCodes.Ok).json({
        following: returning,
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user following",
        });
      }
    }
  }

  async findLists(req: Request, res: Response) {
    try {
      return res.status(HTTPCodes.Ok).json({
        message: "Not yet implemented",
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user lists",
        });
      }
    }
  }

  async findLikes(req: Request, res: Response) {
    const userId = Number(req.params.id);

    try {
      const likes = await this.postService.findLikesOfPost(userId);

      return res.status(HTTPCodes.Ok).json(likes);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user likes",
        });
      }
    }
  }

  async findGroups(req: Request, res: Response) {
    try {
      return res.status(HTTPCodes.Ok).json({
        message: "Not yet implemented",
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user groups",
        });
      }
    }
  }

  async findGroupJoinRequests(req: Request, res: Response) {
    try {
      res.send("Get user join requests");
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to get user join requests",
        });
      }
    }
  }

  async follow(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const requesterId = parseInt(req.params.requesterId);

      await this.userService.follow(userId, requesterId);

      return res.status(HTTPCodes.Ok).json({
        message: "User followed",
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to follow user",
        });
      }
    }
  }

  async unfollow(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const requesterId = parseInt(req.params.requesterId);

      await this.userService.unfollow(userId, requesterId);

      return res.status(HTTPCodes.Ok).json({
        message: "User unfollowed",
      });
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({
          error: error.message,
        });
      } else {
        return res.status(HTTPCodes.InternalServerError).json({
          error: "Unable to unfollow user",
        });
      }
    }
  }
}
