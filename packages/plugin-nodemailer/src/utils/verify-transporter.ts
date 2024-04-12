import T from "../translations/index.js";
import { headlessLogger } from "@protoheadless/headless";
import type { Transporter } from "nodemailer";
import { PLUGIN_KEY } from "../constants.js";

const verifyTransporter = async (transporter: Transporter) => {
	try {
		await transporter.verify();
	} catch (error) {
		if (error instanceof Error) {
			headlessLogger("warn", {
				message: error.message,
				scope: PLUGIN_KEY,
			});
			return;
		}

		headlessLogger("warn", {
			message: T("email_transporter_not_ready"),
			scope: PLUGIN_KEY,
		});
	}
};

export default verifyTransporter;
