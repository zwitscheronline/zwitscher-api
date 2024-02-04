import express from "express";
import dotenv from "dotenv";
import { initRouting } from "./routes/routes";
import bodyParser from "body-parser";
import { initDatabaseConnection } from "./utils/database";

const startServer = () => {
    dotenv.config();

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    initDatabaseConnection();

    app.use(initRouting());

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
}

startServer();
