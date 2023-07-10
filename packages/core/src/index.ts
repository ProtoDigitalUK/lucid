require("dotenv").config();
import init from "./init";
// Models
import { ConfigT, buildConfig } from "@db/models/Config";
// Utils
import formSubmissions from "@services/form-submissions";
// Services
import emails from "@services/email";
// Packages
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
import FormBuilder from "@lucid/form-builder";

// ------------------------------------
// Export
export type { ConfigT as Config };

const sendEmail = emails.sendEmailExternal;
const submitForm = formSubmissions.submitForm;

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
