require("dotenv").config();
import init from "./init";
// Models
import { ConfigT, buildConfig } from "@db/models/Config";
// Services
import { sendEmailExternal } from "@services/emails/send-email";
import { saveFormSubmission } from "@services/forms/save-form";
// Packages
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
import FormBuilder from "@lucid/form-builder";

// ------------------------------------
// Export
export type { ConfigT as Config };

const sendEmail = sendEmailExternal;

export {
  init,
  buildConfig,
  sendEmail,
  BrickBuilder,
  CollectionBuilder,
  FormBuilder,
  saveFormSubmission,
};

export default {
  init,
};
