import serviceWrapper from "../../utils/services/service-wrapper.js";
import getConfig from "../config/get-config.js";
import lucidServices from "../../services/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const toolkitWrapper = async <T extends unknown[], R>(
	fn: ServiceFn<T, R>,
	data: T,
) => {
	const config = await getConfig();

	return serviceWrapper(fn, {
		transaction: false,
		defaultError: {
			type: "basic",
			name: "Error",
			message: "An error occurred",
			status: 500,
		},
	})(
		{
			db: config.db.client,
			config: config,
			services: lucidServices,
		},
		...data,
	);
};

export default toolkitWrapper;
