import T from "../../translations/index.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import getConfig from "../config/get-config.js";
import lucidServices from "../../services/index.js";
import type {
	ServiceFn,
	ServiceWrapperConfig,
} from "../../utils/services/types.js";

const toolkitWrapper = async <T extends unknown[], R>(props: {
	fn: ServiceFn<T, R>;
	data: T;
	config?: Partial<ServiceWrapperConfig>;
}) => {
	const config = await getConfig();

	return serviceWrapper(props.fn, {
		transaction: props.config?.transaction ?? false,
		defaultError: {
			...props.config?.defaultError,
			type: props.config?.defaultError?.type ?? "toolkit",
			message:
				props.config?.defaultError?.message ??
				T("toolkit_error_message"),
		},
		schema: props.config?.schema,
		schemaArgIndex: props.config?.schemaArgIndex,
	})(
		{
			db: config.db.client,
			config: config,
			services: lucidServices,
		},
		...props.data,
	);
};

export default toolkitWrapper;
