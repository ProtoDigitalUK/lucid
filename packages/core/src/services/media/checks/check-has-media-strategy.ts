import T from "../../../translations/index.js";
import type { Config } from "../../../types/config.js";
import type { ServiceFn } from "../../../utils/services/types.js";

const checkHasMediaStrategy: ServiceFn<
	[],
	Exclude<Config["media"]["strategy"], undefined>
> = async (service) => {
	if (service.config.media?.strategy === undefined) {
		return {
			error: {
				type: "basic",
				name: T("config_error_name"),
				message: T("media_strategy_not_configured_message"),
				status: 500,
			},
			data: undefined,
		};
	}

	return {
		error: undefined,
		data: service.config.media.strategy as Exclude<
			Config["media"]["strategy"],
			undefined
		>,
	};
};

export default checkHasMediaStrategy;
