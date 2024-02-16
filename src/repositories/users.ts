import { prismaClient } from "../utils/database";
import { RequestOptions } from "../types/request_options";
import { IUserRepository } from "../interfaces/repositories";
import { UserCreationData } from "../types/user-data";
import { User } from "@prisma/client";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";

export class UserRepository implements IUserRepository<User> {
  async create(data: UserCreationData): Promise<User> {
    try {
      return await prismaClient.user.create({
        data,
      });
    } catch (error) {
      throw error;
    }
  }
  async update(data: Partial<User>): Promise<User> {
    if (!data.id) {
      throw new ErrorWithStatus("User id is required", HTTPCodes.BadRequest);
    }
    
    try {
      return await prismaClient.user.update({
        where: {
          id: data.id,
          deletedAt: null,
        },
        data,
      });
    } catch (error) {
      throw error;
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await prismaClient.user.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findById(id: number): Promise<User | null> {
    try {
      return await prismaClient.user.findUnique({
        where: {
          id,
          deletedAt: null,
        },
      });
    } catch (error) {
      throw error;
    }
  }
  async findAll(options: RequestOptions & { ids?: number[] }): Promise<User[]> {
    const page: number = options.page || 1;
    const entriesPerPage: number = options.entriesPerPage || 25;

    try {
      if (options.orderByField) {
        return await prismaClient.user.findMany({
          where: {
            deletedAt: null,
            ...(options.ids && { id: { in: options.ids } }),
          },
          orderBy: {
            [options.orderByField]: options.orderBy,
          },
          skip: (page - 1) * entriesPerPage,
          take: entriesPerPage,
        });
      } else {
        return await prismaClient.user.findMany({
          where: {
            deletedAt: null,
            ...(options.ids && { id: { in: options.ids } }),
          },
          skip: (page - 1) * entriesPerPage,
          take: entriesPerPage,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await prismaClient.user.findUnique({
        where: {
          email,
          deletedAt: null,
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async findByUserTag(userTag: string): Promise<User | null> {
    try {
      return await prismaClient.user.findUnique({
        where: {
          userTag,
          deletedAt: null,
        },
      });
    } catch (error) {
      throw error;
    }
  }
}
