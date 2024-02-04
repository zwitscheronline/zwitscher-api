import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error("Access token secret is not defined");
        }

        verify(token, process.env.ACCESS_TOKEN_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}
