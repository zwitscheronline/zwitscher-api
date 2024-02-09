import { Request, Response } from "express";
import { HTTPCodes } from "../types/http_codes.enum";
import { AuthService } from "../services/auth.service";
import { isErr } from "../types/error";

export class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    async login(req: Request, res: Response) {
        try {
            const { userTag, email, password } = req.body;

            const returning = await this.authService.login({
                userTag,
                email,
                password,
            });

            res.header("Authorization", returning.token);
            res.header("refresh-token", returning.refreshToken);

            return res.status(HTTPCodes.Ok).json({ message: "Logged in" });
        } catch (error) {
            console.log(error);
            return res.status(HTTPCodes.InternalServerError)
                .json({
                    error: "Unable to login",
                });
        }
    }
    
    async createToken(req: Request, res: Response) {
        try {
            const { token } = req.body;

            const returning = await this.authService.refreshAccessToken(token);

            res.header("Authorization", returning);

            return res.status(HTTPCodes.Ok).json({ message: "Token refreshed" });
        } catch (error) {
            return res.status(HTTPCodes.InternalServerError)
                .json({
                    error: "Unable to create new token",
                });
        }
    }
}
