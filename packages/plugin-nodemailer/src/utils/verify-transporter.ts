import T from "../translations/index.js";
import type { Transporter } from "nodemailer";

const verifyTransporter = (transporter: Transporter) => {
	transporter
		.verify()
		.then(() => {})
		.catch((error) => {
			// TODO: update to use internal logger / error class
			console.error(T("email_transporter_not_ready"), error);
		});
};

export default verifyTransporter;
