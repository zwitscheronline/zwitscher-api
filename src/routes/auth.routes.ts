import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

export const initAuthRoutes = (): Router => {
    const router = Router();

    const authController = new AuthController();

    router.post("/", authController.login);

    router.delete("/", authController.logout);

    router.post("/token",  authController.createToken);

    return router;
}
