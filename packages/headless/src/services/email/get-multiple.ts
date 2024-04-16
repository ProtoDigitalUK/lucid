import type z from "zod";
import type emailSchema from "../../schemas/email.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	query: z.infer<typeof emailSchema.getMultiple.query>;
}

const getMultiple = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const EmailsRepo = Repository.get("emails", serviceConfig.db);
	const EmailsFormatter = Formatter.get("emails");

	const [emails, emailsCount] = await EmailsRepo.selectMultipleFiltered({
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: EmailsFormatter.formatMultiple({
			emails: emails,
		}),
		count: Formatter.parseCount(emailsCount?.count),
	};
};

export default getMultiple;
