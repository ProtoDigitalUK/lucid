import serviceWrapper from "../services/service-wrapper.js";
import getConfig from "../config/get-config.js";
import type { ServiceFn } from "../services/types.js";

export type ExtractServiceArgs<T> = T extends ServiceFn<infer Args, unknown>
	? Args
	: never;

const toolkitWrapper = async <T extends unknown[], R>(props: {
	fn: ServiceFn<T, R>;
	data: T;
}) => {
	const config = await getConfig();

	return serviceWrapper(props.fn, {
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
		},
		...props.data,
	);
};

export default toolkitWrapper;
