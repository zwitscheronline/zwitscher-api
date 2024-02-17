import { User } from "@prisma/client";
import { UserRepository } from "../repositories/users";
import { compare, genSalt, hash } from "bcrypt";
import { Err, ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import {
  checkOwnerIDs,
  validateID,
  validateMultipleIDs,
} from "../utils/validator";
import {
  UserOutput,
  UserOutputStrict,
  toUserOutput,
  toUserOutputStrict,
} from "../types/user_output";
import { RequestOptions } from "../types/request_options";
import { FollowerRepository } from "../repositories/followers";
import { logger } from "../utils/logger";
import { IUserService } from "../interfaces/services";
import { UserCreationData } from "../types/user-data";

export class UserService implements IUserService {
  private readonly EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  private readonly PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  private readonly USER_TAG_REGEX = /^[\w\d]{4,}$/;

  constructor(
    private userRepository: UserRepository,
    private followingsRepository: FollowerRepository,
  ) {}

  private async isValidEmail(email: string): Promise<Err | null> {
    if (!this.EMAIL_REGEX.test(email)) {
      return {
        message: "Invalid email format",
        status: HTTPCodes.BadRequest,
      };
    }

    if ((await this.userRepository.findByEmail(email)) !== null) {
      return {
        message: "User with email already exists",
        status: HTTPCodes.BadRequest,
      };
    }

    return null;
  }

  private async isValidUserTag(userTag: string): Promise<Err | null> {
    if (!this.USER_TAG_REGEX.test(userTag)) {
      return {
        message:
          "User tag must be at least 4 characters long and can only contain letters and numbers",
        status: HTTPCodes.BadRequest,
      };
    }

    if ((await this.userRepository.findByUserTag(userTag)) !== null) {
      return {
        message: "User with tag already exists",
        status: HTTPCodes.BadRequest,
      };
    }

    return null;
  }

  private async isValidPassword(password: string): Promise<Err | null> {
    if (!this.PASSWORD_REGEX.test(password)) {
      return {
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one special character and one number",
        status: HTTPCodes.BadRequest,
      };
    }

    return null;
  }

  async create(data: UserCreationData): Promise<UserOutput> {
    const userTagError = await this.isValidUserTag(data.userTag);
    if (userTagError !== null) {
      throw new ErrorWithStatus(userTagError.message, userTagError.status);
    }

    const emailError = await this.isValidEmail(data.email);
    if (emailError !== null) {
      throw new ErrorWithStatus(emailError.message, emailError.status);
    }

    const passwordError = await this.isValidPassword(data.password);
    if (passwordError !== null) {
      throw new ErrorWithStatus(passwordError.message, passwordError.status);
    }

    try {
      const salt = await genSalt(10);
      const hashedPassword = await hash(data.password, salt);

      const user = await this.userRepository.create({
        password: hashedPassword,
        userTag: data.userTag,
        email: data.email,
        userName: data.userName ?? undefined,
        biography: data.biography ?? undefined,
      });

      const userOutput = toUserOutput(user);

      if (Array.isArray(userOutput)) {
        return userOutput[0];
      } else {
        return userOutput;
      }
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async update(data: Partial<User>, requesterId: number): Promise<UserOutput> {
    if (!data.id) {
      throw new ErrorWithStatus("User id is required", HTTPCodes.BadRequest);
    }

    const idError = validateMultipleIDs([data.id, requesterId]);
    if (idError !== null) {
      throw new ErrorWithStatus(idError.message, idError.status);
    }

    const user = await this.userRepository.findById(data.id);
    if (!user) {
      throw new ErrorWithStatus("User not found", HTTPCodes.NotFound);
    }

    const ownerIdErr = checkOwnerIDs(data.id, requesterId);
    if (ownerIdErr !== null) {
      throw new ErrorWithStatus(ownerIdErr.message, ownerIdErr.status);
    }

    if (data.password) {
      data.password = undefined;
    }

    if (data.email) {
      const emailError = await this.isValidEmail(data.email);
      if (emailError !== null) {
        throw new ErrorWithStatus(emailError.message, emailError.status);
      }
    }

    if (data.userTag) {
      const userTagError = await this.isValidUserTag(data.userTag);
      if (userTagError !== null) {
        throw new ErrorWithStatus(userTagError.message, userTagError.status);
      }
    }

    try {
      const updatedUser = await this.userRepository.update(data);
      if (!updatedUser) {
        throw new ErrorWithStatus(
          "Unable to update user",
          HTTPCodes.InternalServerError
        );
      }

      const userOutput = toUserOutput(updatedUser);

      if (Array.isArray(userOutput)) {
        return userOutput[0];
      } else {
        return userOutput;
      }
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async updatePassword(
    oldPassword: string,
    newPassword: string,
    userId: number,
    requesterId: number
  ): Promise<void> {
    const idError = validateMultipleIDs([userId, requesterId]);
    if (idError !== null) {
      throw new ErrorWithStatus(idError.message, idError.status);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", HTTPCodes.NotFound);
    }

    const ownerIdErr = checkOwnerIDs(userId, requesterId);
    if (ownerIdErr !== null) {
      throw new ErrorWithStatus(ownerIdErr.message, ownerIdErr.status);
    }

    const isValidPassword = await this.isValidPassword(newPassword);
    if (isValidPassword !== null) {
      throw new ErrorWithStatus(
        isValidPassword.message,
        isValidPassword.status
      );
    }

    if (!(await compare(oldPassword, user?.password))) {
      throw new ErrorWithStatus("Invalid old password", HTTPCodes.BadRequest);
    }
    try {
      const salt = await genSalt(10);
      const hashedPassword = await hash(newPassword, salt);

      await this.userRepository.update({
        id: userId,
        password: hashedPassword,
      });
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async delete(userId: number, requesterId: number): Promise<void> {
    const idError = validateMultipleIDs([userId, requesterId]);
    if (idError !== null) {
      throw new ErrorWithStatus(idError.message, idError.status);
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new ErrorWithStatus("User not found", HTTPCodes.NotFound);
    }

    const ownerIdErr = checkOwnerIDs(userId, requesterId);
    if (ownerIdErr !== null) {
      throw new ErrorWithStatus(ownerIdErr.message, ownerIdErr.status);
    }

    try {
      await this.userRepository.delete(userId);
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async findById(
    id: number,
    requesterId: number
  ): Promise<UserOutput | UserOutputStrict> {
    const idError = validateMultipleIDs([id, requesterId]);
    if (idError !== null) {
      throw new ErrorWithStatus(idError.message, idError.status);
    }

    let user: User | null;
    try {
      user = await this.userRepository.findById(id);
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
    if (!user) {
      throw new ErrorWithStatus("User not found", HTTPCodes.NotFound);
    }

    let userOutput = null;

    if (user.id === requesterId) {
      userOutput = toUserOutput(user);
    } else {
      userOutput = toUserOutputStrict(user);
    }

    if (Array.isArray(userOutput)) {
      return userOutput[0];
    } else {
      return userOutput;
    }
  }

  async findByTag(
    userTag: string,
    requesterId: number
  ): Promise<UserOutput | UserOutputStrict> {
    let user: User | null;
    try {
      user = await this.userRepository.findByUserTag(userTag);
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
    if (!user) {
      throw new ErrorWithStatus("User not found", HTTPCodes.NotFound);
    }

    let userOutput = null;

    if (user.id === requesterId && validateID(requesterId) === null) {
      userOutput = toUserOutput(user);
    } else {
      userOutput = toUserOutputStrict(user);
    }

    if (Array.isArray(userOutput)) {
      return userOutput[0];
    } else {
      return userOutput;
    }
  }

  async findAll(options: RequestOptions): Promise<UserOutputStrict[]> {
    try {
      const users = await this.userRepository.findAll(options);
      const usersOutput = toUserOutputStrict(users);
      if (Array.isArray(usersOutput)) {
        return usersOutput;
      } else {
        return [usersOutput];
      }
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async follow(userId: number, requesterId: number): Promise<void> {
    if (userId === requesterId) {
      throw new ErrorWithStatus(
        "You can't follow yourself",
        HTTPCodes.BadRequest
      );
    }

    let user = null;

    try {
      user = await this.userRepository.findById(userId);
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
    if (!user) {
      throw new ErrorWithStatus("User not found", HTTPCodes.NotFound);
    }

    let requester = null;
    try {
      requester = await this.userRepository.findById(requesterId);
    } catch (error) {
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
    if (!requester) {
      throw new ErrorWithStatus("Requester not found", HTTPCodes.NotFound);
    }

    try {
      await this.followingsRepository.create({
        followedId: userId,
        followerId: requesterId,
        createdAt: new Date(),
      });
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async unfollow(userId: number, requesterId: number): Promise<void> {
    if (userId === requesterId) {
      throw new ErrorWithStatus(
        "You can't unfollow yourself",
        HTTPCodes.BadRequest
      );
    }

    let following = null;
    try {
      following = await this.followingsRepository.findWithFollowerAndFollowing(
        requesterId,
        userId
      );
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
    if (!following) {
      throw new ErrorWithStatus("Following not found", HTTPCodes.NotFound);
    }
    try {
      await this.followingsRepository.delete(requesterId, userId);
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async removeFollower(followerId: number, requesterId: number): Promise<void> {
    if (followerId === requesterId) {
      throw new ErrorWithStatus(
        "You can't remove yourself",
        HTTPCodes.BadRequest
      );
    }

    let followingItem = null;
    try {
      followingItem =
        await this.followingsRepository.findWithFollowerAndFollowing(
          followerId,
          requesterId
        );
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
    if (!followingItem) {
      throw new ErrorWithStatus("Following not found", HTTPCodes.NotFound);
    }
    try {
      await this.followingsRepository.delete(followerId, requesterId);
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async findFollowers(
    userId: number,
    options?: RequestOptions
  ): Promise<UserOutputStrict[]> {
    const idError = validateID(userId);
    if (idError !== null) {
      throw new ErrorWithStatus(idError.message, idError.status);
    }
    let followers = null;
    try {
      followers = await this.followingsRepository.findFollowers(
        userId,
        options ?? {}
      );
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
    if (followers.length === 0) {
      return [];
    }
    try {
      const follower = await this.userRepository.findAll({
        ids: followers.map((follower) => follower.followerId),
        page: 0,
        entriesPerPage: followers.length,
        orderByField: "createdAt",
        orderBy: "desc",
      });

      const followersOutput = toUserOutputStrict(follower);
      if (Array.isArray(followersOutput)) {
        return followersOutput;
      } else {
        return [followersOutput];
      }
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }

  async findFollowing(
    userId: number,
    options?: RequestOptions
  ): Promise<UserOutputStrict[]> {
    const idError = validateID(userId);
    if (idError !== null) {
      throw new ErrorWithStatus(idError.message, idError.status);
    }

    let following = null;
    try {
      following = await this.followingsRepository.findFollowing(
        userId,
        options ?? {}
      );
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }

    if (following.length === 0) {
      return [];
    }

    try {
      const followingUsers = await this.userRepository.findAll({
        ids: following.map((following) => following.followedId),
        page: 0,
        entriesPerPage: following.length,
        orderByField: "createdAt",
        orderBy: "desc",
      });

      const followingUsersOutput = toUserOutputStrict(followingUsers);
      if (Array.isArray(followingUsersOutput)) {
        return followingUsersOutput;
      } else {
        return [followingUsersOutput];
      }
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(`${error}`, HTTPCodes.InternalServerError);
    }
  }
}
