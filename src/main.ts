import { client } from "./database"
import express from "express";
import dotenv from "dotenv";

const startServer = () => {
    dotenv.config();

    client.connect().then(() => {
        console.log("Connected to database");
    }).catch((err) => {
        console.log("Error connecting to database. Error: ", err);
    });

    const app = express();

    app.get("/", (req, res) => {
        res.send("Hello World!");
    });

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });

    console.log(process.env.DB_USER, process.env.DB_NAME)
}

startServer();
