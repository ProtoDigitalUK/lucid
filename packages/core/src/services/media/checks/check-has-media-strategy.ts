import T from "../../../translations/index.js";
import type { Config } from "../../../types/config.js";
import { HeadlessAPIError } from "../../../utils/error-handler.js";

export interface ServiceData {
	config: Config;
}

const checkHasMediaStrategy = (data: ServiceData) => {
	if (data.config.media?.strategy === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			name: T("config_error_name"),
			message: T("media_strategy_not_configured_message"),
			status: 500,
		});
	}

	return data.config.media.strategy;
};

export default checkHasMediaStrategy;
