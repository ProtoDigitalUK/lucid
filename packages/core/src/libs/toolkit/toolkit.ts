import toolkitWrapper from "./toolkit-wrapper.js";
import lucidServices from "../../services/index.js";
import type { ExtractServiceFnArgs } from "../../utils/services/types.js";

const toolkit = {
	email: {
		sendEmail: (
			...data: ExtractServiceFnArgs<
				typeof lucidServices.email.sendExternal
			>
		) => toolkitWrapper(lucidServices.email.sendExternal, data),
	},
};

export default toolkit;
