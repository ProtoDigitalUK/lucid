require("dotenv").config();
import init from "./init.js";
import { buildConfig } from "./services/Config.js";
import { submitFormExternal } from "./services/form-submissions/submit-form.js";
import emailsService from "./services/email/index.js";
import BrickBuilder from "./builders/brick-builder/index.js";
import CollectionBuilder from "./builders/collection-builder/index.js";
import FormBuilder from "./builders/form-builder/index.js";
const sendEmail = emailsService.sendEmailExternal;
const submitForm = submitFormExternal;
export { init, buildConfig, sendEmail, BrickBuilder, CollectionBuilder, FormBuilder, submitForm, };
export default {
    init,
};
//# sourceMappingURL=index.js.map