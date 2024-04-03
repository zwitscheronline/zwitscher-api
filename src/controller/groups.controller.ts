import { Request, Response } from "express";
import { IGroupService } from "../interfaces/services";
import { GroupCreationData } from "../types/group-data";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { Group } from "../types/schema-types";

export class GroupController {
  constructor(private groupService: IGroupService) {}

  async create(req: Request, res: Response) {
    const data: GroupCreationData = req.body;

    try {
      const requesterId = parseInt(req.params.requesterId);

      data.creatorId = requesterId;

      const group = await this.groupService.create(data);

      return res.status(HTTPCodes.Created).json(group);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 25;
      const page = parseInt(req.query.page as string) || 0;
      const orderBy = req.query.orderBy as string;
      const orderByField = req.query.orderByField as string;

      const requesterId = parseInt(req.params.requesterId);

      const groups = await this.groupService.findAll(requesterId, {
        entriesPerPage: limit,
        page,
        orderBy,
        orderByField,
      });

      return res.status(HTTPCodes.Ok).json(groups);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);

      const group = await this.groupService.findById(groupId, requesterId);
      return res.status(HTTPCodes.Ok).json(group);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async update(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);
      const data: Partial<Group> = req.body;

      data.id = groupId;

      const group = await this.groupService.update(data, requesterId);
      return res.status(HTTPCodes.Ok).json(group);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id);
      const requesterId = parseInt(req.params.requesterId);

      await this.groupService.deleteAllPosts(groupId, requesterId);

      await this.groupService.delete(groupId, requesterId);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async findMembers(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);

      const limit = parseInt(req.query.limit as string) || 25;
      const page = parseInt(req.query.page as string) || 0;
      const orderBy = req.query.orderBy as string;
      const orderByField = req.query.orderByField as string;

      const members = await this.groupService.findMembers(
        groupId,
        requesterId,
        {
          entriesPerPage: limit,
          page,
          orderBy,
          orderByField,
        }
      );

      return res.status(HTTPCodes.Ok).json(members);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async deleteMember(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id);
      const requesterId = parseInt(req.params.requesterId);
      const memberId = parseInt(req.params.userId);

      await this.groupService.removeMember(groupId, memberId, requesterId);

      return res.status(HTTPCodes.Ok).send("Member removed");
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async createJoinRequest(req: Request, res: Response) {
    try {
      const groupId = parseInt(req.params.id);

      const requesterId = parseInt(req.params.requesterId);

      const joinRequest = await this.groupService.createJoinRequest(
        groupId,
        requesterId
      );

      return res.status(HTTPCodes.Created).json(joinRequest);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async findJoinRequests(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);

      const limit = parseInt(req.query.limit as string) || 25;
      const page = parseInt(req.query.page as string) || 0;
      const orderBy = req.query.orderBy as string;
      const orderByField = req.query.orderByField as string;

      const joinRequests = await this.groupService.findJoinRequests(
        groupId,
        requesterId,
        {
          entriesPerPage: limit,
          page,
          orderBy,
          orderByField,
        }
      );

      return res.status(HTTPCodes.Ok).json(joinRequests);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async deleteJoinRequest(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);

      await this.groupService.deleteJoinRequest(
        groupId,
        requesterId,
        requesterId
      );

      return res.status(HTTPCodes.Ok).send("Join request deleted");
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async acceptJoinRequest(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);

      await this.groupService.acceptJoinRequest(groupId, userId, requesterId);

      return res.status(HTTPCodes.Ok).send("Join request accepted");
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async rejectJoinRequest(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);
      const userId = parseInt(req.params.userId);

      await this.groupService.rejectJoinRequest(groupId, userId, requesterId);

      return res.status(HTTPCodes.Ok).send("Join request rejected");
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }

  async findPosts(req: Request, res: Response) {
    try {
      const requesterId = parseInt(req.params.requesterId);
      const groupId = parseInt(req.params.id);

      const limit = parseInt(req.query.limit as string) || 25;
      const page = parseInt(req.query.page as string) || 1;
      const orderBy = req.query.orderBy as string;
      const orderByField = req.query.orderByField as string;

      const posts = await this.groupService.findPosts(groupId, requesterId, {
        entriesPerPage: limit,
        page,
        orderBy,
        orderByField,
      });

      return res.status(HTTPCodes.Ok).json(posts);
    } catch (error) {
      if (error instanceof ErrorWithStatus) {
        return res.status(error.status).send(error.message);
      }
      return res
        .status(HTTPCodes.InternalServerError)
        .send("Internal Server Error");
    }
  }
}
