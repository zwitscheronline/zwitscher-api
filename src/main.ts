import express from "express";
import dotenv from "dotenv";
import { initRouting } from "./routes/routes";
import bodyParser from "body-parser";
import morgan from "morgan";
import { getConnection } from "./db";

dotenv.config();

let db = null;

try {
    db = getConnection();
} catch (error) {
    console.log(error);
    process.exit(1);
}

export const database = db;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(function (tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
    ].join(" ");
}));

app.use(initRouting());

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
