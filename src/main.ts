import express from "express";
import dotenv from "dotenv";
import { initRouting } from "./routes/routes";

const startServer = () => {
    dotenv.config();

    const app = express();

    app.use(initRouting());

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
}

startServer();
