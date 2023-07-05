require("dotenv").config();
import init from "./init";
import { sendEmailExternal } from "@services/emails/send-email";
// Models
import { ConfigT, buildConfig } from "@db/models/Config";
// Packages
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";

// ------------------------------------
// Export
export type { ConfigT as Config };

const sendEmail = sendEmailExternal;

export { init, buildConfig, sendEmail, BrickBuilder, CollectionBuilder };

export default {
  init,
  buildConfig,
  sendEmail,
  BrickBuilder,
  CollectionBuilder,
};
