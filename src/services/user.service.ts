import { User } from "@prisma/client";
import { UserRepository } from "../repositories/users";
import { UserCreationData } from "../types/user-data";
import { compare, genSalt, hash } from "bcrypt";
import { Err } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { checkOwnerIDs, validateID, validateMultipleIDs } from "../utils/validator";
import { UserOutput, UserOutputStrict } from "../types/user_output";
import { RequestOptions } from "../types/request_options";
import { FollowerRepository } from "../repositories/followers";

export class UserService {
    private readonly EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    private readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g;
    private readonly USER_TAG_REGEX = /^[\w\d]{4,}$/g;

    private readonly userRepository: UserRepository;
    private readonly followingsRepository: FollowerRepository;

    constructor(userRepository: UserRepository, followingsRepository: FollowerRepository) {
        this.userRepository = userRepository;
        this.followingsRepository = followingsRepository;
    }

    private async isValidEmail(email: string): Promise<Err|null> {
        if (!this.EMAIL_REGEX.test(email)) {
            return {
                message: "Invalid email format",
                status: HTTPCodes.BadRequest,
            };
        }

        if (await this.userRepository.findByEmail(email) !== null) {
            return {
                message: "User with email already exists",
                status: HTTPCodes.BadRequest,
            };
        }

        return null;
    }

    private async isValidUserTag(userTag: string): Promise<Err|null> {
        if (!this.USER_TAG_REGEX.test(userTag)) {
            return {
                message: "User tag must be at least 4 characters long and can only contain letters and numbers",
                status: HTTPCodes.BadRequest,
            };
        }

        if (await this.userRepository.findByUserTag(userTag) !== null) {
            return {
                message: "User with tag already exists",
                status: HTTPCodes.BadRequest,
            };
        }

        return null;
    }

    private async isValidPassword(password: string): Promise<Err|null> {
        if (!this.PASSWORD_REGEX.test(password)) {
            return {
                message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter and one number",
                status: HTTPCodes.BadRequest,
            };
        }

        return null;
    }

    async create(data: UserCreationData): Promise<User|Err> {
        try {
            const userTagError = await this.isValidUserTag(data.userTag);
            if (userTagError !== null) {
                return userTagError;
            }   

            const emailError = await this.isValidEmail(data.email);
            if (emailError !== null) {
                return emailError;
            }

            const passwordError = await this.isValidPassword(data.password);
            if (passwordError !== null) {
                return passwordError;
            }

            const salt = await genSalt(10);
            const hashedPassword = await hash(data.password, salt);

            return await this.userRepository.create({
                password: hashedPassword,
                userTag: data.userTag,
                email: data.email,
                userName: data.userName ?? null,
                biography: data.biography ?? null,
                tokenVersion: 0,
            });
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async update(data: Partial<User>, requesterId: number): Promise<User|Err> {
        try {
            if (!data.id) {
                return {
                    message: "User id is required",
                    status: HTTPCodes.BadRequest,
                };
            }

            const idError = validateMultipleIDs([data.id, requesterId]);
            if (idError !== null) {
                return idError;
            }

            const user = await this.userRepository.findById(data.id);
            if (!user) {
                return {
                    message: "User not found",
                    status: HTTPCodes.NotFound,
                };
            }

            const ownerIdErr = checkOwnerIDs(data.id, requesterId);
            if (ownerIdErr !== null) {
                return ownerIdErr;
            }

            if (data.password) {
                data.password = undefined;
            }

            if (data.email) {
                const emailError = await this.isValidEmail(data.email);
                if (emailError !== null) {
                    return emailError;
                }
            }

            if (data.userTag) {
                const userTagError = await this.isValidUserTag(data.userTag);
                if (userTagError !== null) {
                    return userTagError;
                }
            }

            const updatedUser = await this.userRepository.update(data);
            if (!updatedUser) {
                return {
                    message: "User not found",
                    status: HTTPCodes.NotFound,
                };
            }

            return updatedUser;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async updatePassword(oldPassword: string, newPassword: string, userId: number, requesterId: number): Promise<Err|null> {
        try {
            const idError = validateMultipleIDs([userId, requesterId]);
            if (idError !== null) {
                return idError;
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                return {
                    message: "User not found",
                    status: HTTPCodes.NotFound,
                };
            }

            const ownerIdErr = checkOwnerIDs(userId, requesterId);
            if (ownerIdErr !== null) {
                return ownerIdErr;
            }

            const isValidPassword = await this.isValidPassword(newPassword);
            if (isValidPassword !== null) {
                return isValidPassword;
            }

            if (!await compare(oldPassword, user?.password)) {
                return {
                    message: "Invalid password",
                    status: HTTPCodes.BadRequest,
                };
            }

            const salt = await genSalt(10);
            const hashedPassword = await hash(newPassword, salt);

            await this.userRepository.update({
                id: userId,
                password: hashedPassword,
            });

            return null;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async delete(userId: number, requesterId: number): Promise<Err|null> {
        try {
            const idError = validateMultipleIDs([userId, requesterId]);
            if (idError !== null) {
                return idError;
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                return {
                    message: "User not found",
                    status: HTTPCodes.NotFound,
                };
            }

            const ownerIdErr = checkOwnerIDs(userId, requesterId);
            if (ownerIdErr !== null) {
                return ownerIdErr;
            }

            await this.userRepository.delete(userId);

            return null;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async findById(id: number, requesterId: number): Promise<UserOutput|UserOutputStrict|Err> {
        try {
            const idError = validateMultipleIDs([id, requesterId]);
            if (idError !== null) {
                return idError;
            }

            const user = await this.userRepository.findById(id);
            if (!user) {
                return {
                    message: "User not found",
                    status: HTTPCodes.NotFound,
                };
            }

            if (user.id === requesterId) {
                return user as UserOutput;
            }
            
            return user as UserOutputStrict;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async findByTag(userTag: string, requesterId: number): Promise<UserOutput|UserOutputStrict|Err> {
        try {
            const user = await this.userRepository.findByUserTag(userTag);
            if (!user) {
                return {
                    message: "User not found",
                    status: HTTPCodes.NotFound,
                };
            }

            if ((user.id === requesterId) && (validateID(requesterId) === null)) {
                return user as UserOutput;
            }
            
            return user as UserOutputStrict;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async findAll(options: RequestOptions): Promise<UserOutputStrict[]|Err> {
        try {
            return await this.userRepository.findAll(options);
        } catch (error) {
            return {
                message: "Unable to find users",
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async follow(userId: number, requesterId: number): Promise<Err|null> {
        try {
            if (userId === requesterId) {
                return {
                    message: "You can't follow yourself",
                    status: HTTPCodes.BadRequest,
                };
            }

            const user = await this.userRepository.findById(userId);
            if (!user) {
                return {
                    message: "User not found",
                    status: HTTPCodes.NotFound,
                };
            }

            const requester = await this.userRepository.findById(requesterId);
            if (!requester) {
                return {
                    message: "Requester not found",
                    status: HTTPCodes.NotFound,
                };
            }

            await this.followingsRepository.create({
                followedId: userId,
                followerId: requesterId,
                createdAt: new Date(),
            });

            return null;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async unfollow(userId: number, requesterId: number): Promise<Err|null> {
        try {
            if (userId === requesterId) {
                return {
                    message: "You can't unfollow yourself",
                    status: HTTPCodes.BadRequest,
                };
            }

            const following = await this.followingsRepository.findWithFollowerAndFollowing(requesterId, userId);
            if (!following) {
                return {
                    message: "You are not following this user",
                    status: HTTPCodes.BadRequest,
                };
            }

            await this.followingsRepository.delete(requesterId, userId);

            return null;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async removeFollower(followerId: number, requesterId: number): Promise<Err|null> {
        try {
            if (followerId === requesterId) {
                return {
                    message: "You can't remove yourself from followers",
                    status: HTTPCodes.BadRequest,
                };
            }

            const followingItem = await this.followingsRepository.findWithFollowerAndFollowing(followerId, requesterId);
            if (!followingItem) {
                return {
                    message: "Follower not found",
                    status: HTTPCodes.NotFound,
                };
            }

            await this.followingsRepository.delete(followerId, requesterId);

            return null;
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async findFollowers(userId: number, options?: RequestOptions): Promise<UserOutputStrict[]|Err> {
        try {
            const idError = validateID(userId);
            if (idError !== null) {
                return idError;
            }

            const followers = await this.followingsRepository.findFollowers(userId, options ?? {});
            if (followers.length === 0) {
                return [];
            }

            return await this.userRepository.findAll({
                ids: followers.map(follower => follower.followerId),
                page: 0,
                entriesPerPage: followers.length,
                orderByField: "createdAt",
                orderBy: "desc",
            });
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async findFollowing(userId: number, options?: RequestOptions): Promise<UserOutputStrict[]|Err> {
        try {
            const idError = validateID(userId);
            if (idError !== null) {
                return idError;
            }

            const following = await this.followingsRepository.findFollowing(userId, options ?? {});
            if (following.length === 0) {
                return [];
            }

            return await this.userRepository.findAll({
                ids: following.map(following => following.followedId),
                page: 0,
                entriesPerPage: following.length,
                orderByField: "createdAt",
                orderBy: "desc",
            });
        } catch (error) {
            return {
                message: `${error}`,
                status: HTTPCodes.InternalServerError,
            };
        }
    }
}
