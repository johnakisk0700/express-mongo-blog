import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import compression from "compression";
import routes from "./routes";
import errorHandler from "./core/errorHandler";
import { mongooseInit } from "./database/config";

const app = express();

// Connect to mongodb
mongooseInit();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "50mb" }));

app.use(
  compression({
    filter: (req: Request, res: Response) => {
      if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
      }
      // fallback to standard filter function
      return compression.filter(req, res);
    },
  })
);

app.use("/uploads", express.static("uploads"));

/**
 * Routes
 */
app.use("/", routes);
app.use(errorHandler);

export default app;
