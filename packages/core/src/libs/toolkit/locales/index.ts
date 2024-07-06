import T from "../../../translations/index.js";
import toolkitWrapper from "../toolkit-wrapper.js";
import lucidServices from "../../../services/index.js";
import type { ExtractServiceFnArgs } from "../../../utils/services/types.js";

const localeToolkit = {
	getAll: async (
		...data: ExtractServiceFnArgs<typeof lucidServices.locale.getAll>
	) =>
		toolkitWrapper({
			fn: lucidServices.locale.getAll,
			data: data,
			config: {
				transaction: false,
				defaultError: {
					name: T("route_locale_fetch_error_name"),
				},
			},
		}),
};

export default localeToolkit;
