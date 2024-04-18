import checks from "./checks/index.js";
import renderTemplate from "./render-template.js";
import sendEmail from "./send-email.js";
import getMultiple from "./get-multiple.js";
import getSingle from "./get-single.js";
import deleteSingle from "./delete-single.js";
import resendSingle from "./resend-single.js";
import sendExternal from "./send-external.js";

export default {
	checks,
	renderTemplate,
	sendEmail,
	getMultiple,
	getSingle,
	deleteSingle,
	resendSingle,
	sendExternal,
};
