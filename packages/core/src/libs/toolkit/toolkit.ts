import toolkitWrapper, { type ExtractServiceArgs } from "./toolkit-wrapper.js";
import lucidServices from "../../services/index.js";

const toolkit = {
	email: {
		sendEmail: (
			...data: ExtractServiceArgs<typeof lucidServices.email.sendEmail>
		) =>
			toolkitWrapper({
				fn: lucidServices.email.sendEmail,
				data: data,
			}),
	},
};

export default toolkit;
