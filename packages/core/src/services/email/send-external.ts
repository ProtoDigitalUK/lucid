import lucidServices from "../index.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import getConfig from "../../libs/config/get-config.js";

const sendExternal = async (data: {
	to: string;
	subject: string;
	template: string;
	cc?: string;
	bcc?: string;
	replyTo?: string;
	data: {
		[key: string]: unknown;
	};
}) => {
	const config = await getConfig();
	return serviceWrapper(lucidServices.email.sendEmail, {
		transaction: true,
	})(
		{
			db: config.db.client,
			config: config,
		},
		{
			type: "external",
			to: data.to,
			subject: data.subject,
			template: data.template,
			cc: data.cc,
			bcc: data.bcc,
			replyTo: data.replyTo,
			data: data.data,
		},
	);
};

export default sendExternal;
