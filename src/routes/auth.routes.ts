import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../services/auth.service";

export const initAuthRoutes = (authService: AuthService): Router => {
    const router = Router();

    const authController = new AuthController(authService);

    router.post("/", authController.login);

    router.post("/token",  authController.createToken);

    return router;
}
