import { User } from "@prisma/client";
import { UserRepository } from "../repositories/users";
import { ErrorWithStatus } from "../types/error";
import { HTTPCodes } from "../types/http_codes.enum";
import { LoginCredentials } from "../types/login_credentials";
import { LoginResponse } from "../types/responses";
import { compare } from "bcrypt";
import { AccessTokenData, RefreshTokenData } from "../types/token_data";
import { sign, verify } from "jsonwebtoken";
import { logger } from "../utils/logger";
import { IAuthService } from "../interfaces/services";

export class AuthService implements IAuthService<LoginCredentials, LoginResponse, AccessTokenData> {
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
      return verify(
        token,
        process.env.REFRESH_TOKEN_SECRET
      ) as RefreshTokenData;
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

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    if (!credentials.email && !credentials.userTag) {
      throw new ErrorWithStatus(
        "Email or user tag is required",
        HTTPCodes.BadRequest
      );
    }

    let user: User | null = null;

    if (credentials.email) {
      user = await this.userRepository.findByEmail(credentials.email);
    } else if (credentials.userTag) {
      user = await this.userRepository.findByUserTag(credentials.userTag);
    }

    if (!user)
      throw new ErrorWithStatus(
        this.INVALID_CREDENTIALS_ERR.message,
        this.INVALID_CREDENTIALS_ERR.status
      );

    if (!(await compare(credentials.password, user.password))) {
      throw new ErrorWithStatus(
        this.INVALID_CREDENTIALS_ERR.message,
        this.INVALID_CREDENTIALS_ERR.status
      );
    }

    try {
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
      console.error(error);
      throw new ErrorWithStatus(
        "Unable to login",
        HTTPCodes.InternalServerError
      );
    }
  }

  async refreshAccessToken(token: string): Promise<string> {
    let user = null;
    let refreshTokenData = null;
    try {
      refreshTokenData = this.verifyRefreshToken(token);
      user = await this.userRepository.findById(parseInt(refreshTokenData.sub));
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(
        "Unable to refresh token",
        HTTPCodes.InternalServerError
      );
    }

    if (!user || user.tokenVersion !== refreshTokenData.tokenVersion) {
      throw new ErrorWithStatus("Invalid token", HTTPCodes.Unauthorized);
    }
    try {
      return this.generateAccessToken({
        sub: user.id.toString(),
        email: user.email,
        userTag: user.userTag,
      });
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus(
        "Unable to refresh token",
        HTTPCodes.InternalServerError
      );
    }
  }

  getInformationFromAccessToken(token: string): AccessTokenData {
    try {
      return this.verifyAccessToken(token);
    } catch (error) {
      logger.error(error);
      throw new ErrorWithStatus("Invalid token", HTTPCodes.Unauthorized);
    }
  }
}
