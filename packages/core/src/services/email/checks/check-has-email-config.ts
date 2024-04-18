import T from "../../../translations/index.js";
import type { Config } from "../../../types/config.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";

export interface ServiceData {
	config: Config;
}

const checkHasEmailConfig = (data: ServiceData) => {
	if (data.config.email === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			name: T("config_error_name"),
			message: T("email_not_configured_message"),
			status: 500,
		});
	}

	return data.config.email;
};

export default checkHasEmailConfig;
