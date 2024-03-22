import emailServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { headlessDB } from "../../db/db.js";

export interface ServiceData {
	to: string;
	subject: string;
	template: string;
	cc?: string;
	bcc?: string;
	replyTo?: string; // user facing camelCase
	data: {
		[key: string]: unknown;
	};
}

const sendExternal = async (data: ServiceData) =>
	serviceWrapper(emailServices.sendEmail, true)(
		{
			db: headlessDB(),
		},
		{
			type: "external",
			to: data.to,
			subject: data.subject,
			template: data.template,
			cc: data.cc,
			bcc: data.bcc,
			reply_to: data.replyTo,
			data: data.data,
		},
	);

export default sendExternal;
