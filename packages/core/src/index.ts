require("dotenv").config();
import http from "http";
import { log } from "console-log-colors";
import { type ConfigT } from "@db/models/Config";
import app from "./app";
// Internal packages
import BrickBuilder from "@lucid/brick-builder";

const start = async (config: ConfigT) => {
  const server = http.createServer(await app(config));

  // ------------------------------------
  // Start server
  server.listen(config.port, () => {
    log.white("----------------------------------------------------");
    log.yellow(`CMS started at: http://localhost:${config.port}`);
    log.yellow(`API started at: http://localhost:${config.port}/api`);
    log.white("----------------------------------------------------");
  });
};

export { BrickBuilder };
export default start;
