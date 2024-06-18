import type { Config } from "../../types.js";
import serviceWrapper from "../services/service-wrapper.js";
import type { ServiceFn } from "../services/types.js";

export type ExtractServiceArgs<T> = T extends ServiceFn<infer Args, unknown>
	? Args
	: never;

const toolkitWrapper = <T extends unknown[], R>(props: {
	config: Config;
	fn: ServiceFn<T, R>;
	data: T;
}) => {
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
			db: props.config.db.client,
			config: props.config,
		},
		...props.data,
	);
};

export default toolkitWrapper;
