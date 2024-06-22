import T from "../../../translations/index.js";
import type { Config } from "../../../types/config.js";
import type { ServiceFn } from "../../../utils/services/types.js";

const checkHasEmailConfig: ServiceFn<
	[],
	Exclude<Config["email"], undefined>
> = async (context) => {
	if (context.config.email === undefined) {
		return {
			error: {
				type: "basic",
				name: T("config_error_name"),
				message: T("email_not_configured_message"),
				status: 500,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: context.config.email as Exclude<Config["email"], undefined>,
	};
};

export default checkHasEmailConfig;
