import { Request, Response } from "express";

export class AuthController {
    constructor() {}

    login(req: Request, res: Response) {
        res.send("Login");
    }

    logout(req: Request, res: Response) {
        res.send("Logout");
    }
    
    createToken(req: Request, res: Response) {
        res.send("Create new access token");
    }
}
