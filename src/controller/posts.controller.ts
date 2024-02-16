import { Request, Response } from "express";
import { PostService } from "../services/post.service";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { PostCreationData } from "../types/post-data";

export class PostController {
  constructor(private postService: PostService) {}

  async create(req: Request, res: Response) {
    const data: PostCreationData = req.body;
    data.authorId = parseInt(req.params.userId);

    try {
        const post = await this.postService.create(data);
        return res.status(HTTPCodes.Created).json(post);
    } catch (error) {
        if (error instanceof ErrorWithStatus) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(HTTPCodes.InternalServerError).json({ error });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const { limit, page, orderBy, orderByField } = req.query;
      const posts = await this.postService.findAll({
        entriesPerPage: limit ? parseInt(limit as string) : undefined,
        page: page ? parseInt(page as string) : undefined,
        orderBy: orderBy as string | undefined,
        orderByField: orderByField as string | undefined,
      });

      res.status(HTTPCodes.Ok).json(posts);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({ error });
    }
  }

  async findById(req: Request, res: Response) {
    const postId = parseInt(req.params.id);
    try {
        const post = await this.postService.findByID(postId);
        return res.status(HTTPCodes.Ok).json(post);
    } catch (error) {
        if (error instanceof ErrorWithStatus) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(HTTPCodes.InternalServerError).json({ error });
    }
  }

  async delete(req: Request, res: Response) {
    const postId = parseInt(req.params.id);

    const requesterId = parseInt(req.params.userId);

    try {
        await this.postService.delete(postId, requesterId);
        return res.status(HTTPCodes.Ok).send("Post deleted");
    } catch (error) {
        if (error instanceof ErrorWithStatus) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(HTTPCodes.InternalServerError).json({ error });
    }
  }

  async findComments(req: Request, res: Response) {
    const postId = parseInt(req.params.id);

    const { limit, page, orderBy, orderByField } = req.query;

    try {
        const children = await this.postService.findChildrenOfPost(postId, {
            entriesPerPage: limit ? parseInt(limit as string) : undefined,
            page: page ? parseInt(page as string) : undefined,
            orderBy: orderBy as string | undefined,
            orderByField: orderByField as string | undefined,
        });

        return res.status(HTTPCodes.Ok).json(children);
    } catch (error) {
        if (error instanceof ErrorWithStatus) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(HTTPCodes.InternalServerError).json({ error });
    }
  }

  async findLikes(req: Request, res: Response) {
    const postId = parseInt(req.params.id);

    const { limit, page, orderBy, orderByField } = req.query;

    try {
        const liker = await this.postService.findLikesOfPost(postId, {
            entriesPerPage: limit ? parseInt(limit as string) : undefined,
            page: page ? parseInt(page as string) : undefined,
            orderBy: orderBy as string | undefined,
            orderByField: orderByField as string | undefined,
        });

        return res.status(HTTPCodes.Ok).json(liker);
    } catch (error) {
        if (error instanceof ErrorWithStatus) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(HTTPCodes.InternalServerError).json({ error });
    }
  }

  async like(req: Request, res: Response) {
    try {
        const postId = parseInt(req.params.id);
        const requesterId = parseInt(req.params.userId);

        await this.postService.createLike(postId, requesterId);
        return res.status(HTTPCodes.Created).send("Post liked");
    } catch (error) {
        if (error instanceof ErrorWithStatus) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(HTTPCodes.InternalServerError).json({ error });
    }
  }

  async unlike(req: Request, res: Response) {
    try {
        const postId = parseInt(req.params.id);
        const requesterId = parseInt(req.params.userId);

        await this.postService.deleteLike(postId, requesterId);
        return res.status(HTTPCodes.Ok).send("Post unliked");
    } catch (error) {
        if (error instanceof ErrorWithStatus) {
            return res.status(error.status).json({ error: error.message });
        }
        res.status(HTTPCodes.InternalServerError).json({ error });
    }
  }
}
