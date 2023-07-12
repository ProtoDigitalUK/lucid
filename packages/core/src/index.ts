require("dotenv").config();
import init from "./init";
// Models
import { ConfigT, buildConfig } from "@services/Config";
// Utils
import formSubService from "@services/form-submissions";
// Services
import emailsService from "@services/email";
// Packages
import BrickBuilder from "@lucid/brick-builder";
import CollectionBuilder from "@lucid/collection-builder";
import FormBuilder from "@lucid/form-builder";

// ------------------------------------
// Export
export type { ConfigT as Config };

const sendEmail = emailsService.sendEmailExternal;
const submitForm = formSubService.submitForm;

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
