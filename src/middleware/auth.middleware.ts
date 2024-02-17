import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { HTTPCodes } from "../types/http_codes.enum";
import { AccessTokenData } from "../types/token_data";
import { IUserService } from "../interfaces/services";

export function authenticate(
  userService: IUserService
) {
  return function(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new Error("Access token secret is not defined");
      }

      const rawTokenData = verify(token, process.env.ACCESS_TOKEN_SECRET);

      let tokenData: JwtPayload & AccessTokenData;

      if (typeof rawTokenData === "string") {
        tokenData = JSON.parse(rawTokenData);
      } else {
        tokenData = rawTokenData as JwtPayload & AccessTokenData;
      }

      if (!tokenData.sub) {
        throw new Error("Invalid token");
      }

      const userId = parseInt(tokenData.sub);
      
      const user = userService.findById(userId, userId);

      if (!user) {
        throw new Error("User not found");
      }

      req.params.requesterId = tokenData.sub?.toString();

      next();
    } catch (error) {
      return res
        .status(HTTPCodes.Unauthorized)
        .json({ message: "Unauthorized" });
    }
  };
};
