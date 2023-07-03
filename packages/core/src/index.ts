require("dotenv").config();
import http from "http";
import { log } from "console-log-colors";
import app from "./app";
// Models
import Config, { ConfigT } from "@db/models/Config";
// Services
import { sendEmailExternal } from "@services/emails/send-email";

// ------------------------------------
// Start server
const start = async () => {
  const server = http.createServer(await app());

  // ------------------------------------
  // Start server
  server.listen(Config.get().port, () => {
    log.white("----------------------------------------------------");
    log.yellow(`CMS started at: http://localhost:${Config.get().port}`);
    log.yellow(`API started at: http://localhost:${Config.get().port}/api`);
    log.white("----------------------------------------------------");
  });
};

// ------------------------------------
// Export
export type { ConfigT as Config };

export default {
  start,
  sendEmail: sendEmailExternal,
};
