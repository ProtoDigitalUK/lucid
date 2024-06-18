import getConfig from "../config/get-config.js";
import toolkitWrapper, { type ExtractServiceArgs } from "./toolkit-wrapper.js";
import lucidServices from "../../services/index.js";

// TODO: return to this and wrapper to flesh it out

// const config = await getConfig();

const toolkit = {
	email: {
		// sendEmail: (
		// 	...data: ExtractServiceArgs<typeof lucidServices.email.sendEmail>
		// ) =>
		// 	toolkitWrapper({
		// 		config: config,
		// 		fn: lucidServices.email.sendEmail,
		// 		data: data,
		// 	}),
	},
};

export default toolkit;
