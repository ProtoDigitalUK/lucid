import("dotenv/config.js");
import init from "./init.js";
// Models
import { ConfigT, buildConfig } from "@services/Config.js";
// Utils
import { submitFormExternal } from "@services/form-submissions/submit-form.js";
// Services
import emailServices from "@services/email/index.js";
// Packages
import BrickBuilder from "@builders/brick-builder/index.js";
import CollectionBuilder from "@builders/collection-builder/index.js";
import FormBuilder from "@builders/form-builder/index.js";

// ------------------------------------
// Export
export type { ConfigT as Config };

const sendEmail = emailServices.sendExternal;
const submitForm = submitFormExternal;

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
