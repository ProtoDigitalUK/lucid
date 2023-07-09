require("dotenv").config();
import init from "./init";
// Models
import { ConfigT, buildConfig } from "@db/models/Config";
// Utils
import { sendEmailExternal } from "@utils/emails/send-email";
import { submitForm } from "@utils/forms/submit-form";
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
  submitForm,
};

export default {
  init,
};
