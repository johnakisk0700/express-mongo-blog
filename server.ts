import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import { port } from "./config";
import app from "./app";

app
  .listen(port, () => {
    console.info(`Freebirth running on port: ${port}`);
  })
  .on("error", (e) => console.error(e));
