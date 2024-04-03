import { RequestOptions } from "../types/request_options";
import { IUserRepository } from "../interfaces/repositories";
import { UserCreationData } from "../types/user-data";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { User } from "../types/schema-types";
import { users } from "../db/schema/users";
import { database } from "../main";
import { and, desc, eq, isNull, or } from "drizzle-orm";

export class UserRepository implements IUserRepository<User> {
  async create(data: UserCreationData): Promise<User> {
    try {
      return (await database.insert(users).values(data).returning())[0];
    } catch (error) {
      throw error;
    }
  }
  async update(data: Partial<User>): Promise<User> {
    if (!data.id) {
      throw new ErrorWithStatus("User id is required", HTTPCodes.BadRequest);
    }
    
    try {
      return (await database.update(users)
        .set(data)
        .where(eq(users.id, data.id))
        .returning())[0];
    } catch (error) {
      throw error;
    }
  }
  async delete(id: number): Promise<void> {
    try {
      await database.delete(users)
        .where(eq(users.id, id))
        .execute();
    } catch (error) {
      throw error;
    }
  }
  async findById(id: number): Promise<User | null> {
    try {
      const ret = await database.query.users.findFirst({
        where: and(isNull(users.deletedAt), eq(users.id, id)),
      });

      if (!ret) return null;

      return ret;
    } catch (error) {
      throw error;
    }
  }
  async findAll(options: RequestOptions & { ids?: number[] }): Promise<User[]> {
    const page: number = options.page || 1;
    const entriesPerPage: number = options.entriesPerPage || 25;

    try {
      return await database.query.users.findMany({
        where: and(isNull(users.deletedAt), or(...(options.ids ? options.ids.map(id => eq(users.id, id)) : []))),
        orderBy: desc(users.createdAt),
        limit: entriesPerPage,
        offset: (page - 1) * entriesPerPage,
      });
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const ret = await database.query.users.findFirst({
        where: and(isNull(users.deletedAt), eq(users.email, email)),
      });
      
      if (!ret) return null;

      return ret;
    } catch (error) {
      throw error;
    }
  }

  async findByUserTag(userTag: string): Promise<User | null> {
    try {
      const ret = await database.query.users.findFirst({
        where: and(isNull(users.deletedAt), eq(users.userTag, userTag)),
      });

      if (!ret) return null;

      return ret;
    } catch (error) {
      throw error;
    }
  }
}
