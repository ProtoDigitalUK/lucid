import toolkitWrapper from "./toolkit-wrapper.js";
import lucidServices from "../../services/index.js";
import type { ExtractServiceFnArgs } from "../services/types.js";

const toolkit = {
	email: {
		sendEmail: (
			...data: ExtractServiceFnArgs<typeof lucidServices.email.sendEmail>
		) => toolkitWrapper(lucidServices.email.sendEmail, data),
	},
};

export default toolkit;
