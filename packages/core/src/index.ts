require("dotenv").config();
import init from "./init";
// Models
import { ConfigT, buildConfig } from "@db/models/Config";
// Services
import {
  sendEmailExternal,
  sendEmailInternal,
} from "@services/emails/send-email";

// ------------------------------------
// Export
export type { ConfigT as Config };

const sendEmail = sendEmailInternal;

export { init, buildConfig, sendEmail };

export default {
  init,
  buildConfig,
  sendEmail,
};
