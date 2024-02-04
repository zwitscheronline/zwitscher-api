import { User } from "@prisma/client";
import { UserRepository } from "../repositories/users";
import { Err } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { LoginCredentials } from "../types/login_credentials";
import { LoginResponse } from "../types/responses";
import { compare } from "bcrypt";
import { AccessTokenData, RefreshTokenData } from "../types/token_data";
import { sign, verify } from "jsonwebtoken";

export class AuthService {
    private readonly userRepository: UserRepository;
    
    private readonly INVALID_CREDENTIALS_ERR = {
        message: "Invalid password or email or user tag",
        status: HTTPCodes.Unauthorized,
    };

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    private generateAccessToken(data: AccessTokenData): string {
        try {
            if (process.env.ACCESS_TOKEN_SECRET === undefined) {
                throw new Error("Access token secret is not defined");
            }
            return sign(
                {
                    email: data.email,
                    userTag: data.userTag,
                },
                process.env.ACCESS_TOKEN_SECRET, 
                {
                    expiresIn: "15m",
                    subject: data.sub,
                }
            );
        } catch (error) {
            throw error;
        }
    }

    private generateRefreshToken(data: RefreshTokenData): string {
        try {
            if (process.env.REFRESH_TOKEN_SECRET === undefined) {
                throw new Error("Refresh token secret is not defined");
            }

            return sign(
                {
                    tokenVersion: data.tokenVersion,
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: "7d",
                    subject: data.sub,
                }
            );
        } catch (error) {
            throw error;
        }
    }

    private verifyRefreshToken(token: string): RefreshTokenData {
        try {
            if (process.env.REFRESH_TOKEN_SECRET === undefined) {
                throw new Error("Refresh token secret is not defined");
            }
            return verify(token, process.env.REFRESH_TOKEN_SECRET) as RefreshTokenData;
        } catch (error) {
            throw error;
        }
    }

    private verifyAccessToken(token: string): AccessTokenData {
        try {
            if (process.env.ACCESS_TOKEN_SECRET === undefined) {
                throw new Error("Access token secret is not defined");
            }
            return verify(token, process.env.ACCESS_TOKEN_SECRET) as AccessTokenData;
        } catch (error) {
            throw error;
        }
    }

    async login(credentials: LoginCredentials): Promise<LoginResponse|Err> {
        try {
            if (!credentials.email && !credentials.userTag) {
                return {
                    message: "Email or user tag is required",
                    status: HTTPCodes.BadRequest,
                };
            }

            let user: User | null = null;

            if (credentials.email) {
                user = await this.userRepository.findByEmail(credentials.email);
            } else if (credentials.userTag) {
                user = await this.userRepository.findByUserTag(credentials.userTag);
            }

            if (!user) return this.INVALID_CREDENTIALS_ERR;

            if (!await compare(credentials.password, user.password)) {
                return this.INVALID_CREDENTIALS_ERR;
            }

            const refreshToken = this.generateRefreshToken({
                sub: user.id.toString(),
                tokenVersion: user.tokenVersion,
            });

            const accessToken = this.generateAccessToken({
                sub: user.id.toString(),
                email: user.email,
                userTag: user.userTag,
            });

            return {
                token: accessToken,
                refreshToken,
            };
        } catch (error) {
            return {
                message: "Unable to login",
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    async refreshAccessToken(token: string): Promise<string|Err> {
        try {
            const refreshTokenData = this.verifyRefreshToken(token);
            const user = await this.userRepository.findById(parseInt(refreshTokenData.sub));

            if (!user || user.tokenVersion !== refreshTokenData.tokenVersion) {
                return {
                    message: "Invalid token",
                    status: HTTPCodes.Unauthorized,
                };
            }

            return this.generateAccessToken({
                sub: user.id.toString(),
                email: user.email,
                userTag: user.userTag,
            });
        } catch (error) {
            return {
                message: "Unable to refresh token",
                status: HTTPCodes.InternalServerError,
            };
        }
    }

    getInformationFromAccessToken(token: string): Err|AccessTokenData {
        try {
            return this.verifyAccessToken(token);
        } catch (error) {
            return {
                message: "Unable to get information from token",
                status: HTTPCodes.InternalServerError,
            };
        }
    }
}
