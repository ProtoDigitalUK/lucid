require("dotenv").config();
import init from "./init";
// Models
import { ConfigT } from "@db/models/Config";
// Services
import { sendEmailExternal } from "@services/emails/send-email";

// ------------------------------------
// Export
export type { ConfigT as Config };

export default {
  init,
  sendEmail: sendEmailExternal,
};
