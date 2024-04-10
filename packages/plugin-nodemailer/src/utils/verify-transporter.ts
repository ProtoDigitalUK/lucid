import T from "../translations/index.js";
import { HeadlessError } from "@protoheadless/headless";
import type { Transporter } from "nodemailer";

const verifyTransporter = async (transporter: Transporter) => {
	try {
		await transporter.verify();
	} catch (error) {
		if (error instanceof Error) {
			throw new HeadlessError({
				message: error.message,
				plugin: "plugin-nodemailer",
			});
		}
		throw new HeadlessError({
			message: T("email_transporter_not_ready"),
			plugin: "plugin-nodemailer",
		});
	}
};

export default verifyTransporter;
