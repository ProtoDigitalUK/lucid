require("dotenv").config();
import init from "./init";
import { sendEmailExternal } from "@services/emails/send-email";
// Models
import { ConfigT, buildConfig } from "@db/models/Config";

// ------------------------------------
// Export
export type { ConfigT as Config };

const sendEmail = sendEmailExternal;

export { init, buildConfig, sendEmail };

export default {
  init,
  buildConfig,
  sendEmail,
};
