import T from "../translations/index.js";
import { headlessLogger } from "@protoheadless/headless";
import type { Transporter } from "nodemailer";

const verifyTransporter = async (transporter: Transporter) => {
	try {
		await transporter.verify();
	} catch (error) {
		if (error instanceof Error) {
			headlessLogger("warn", {
				message: error.message,
				scope: T("scope"),
			});
			return;
		}

		headlessLogger("warn", {
			message: T("email_transporter_not_ready"),
			scope: T("scope"),
		});
	}
};

export default verifyTransporter;
