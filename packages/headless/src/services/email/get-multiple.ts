import type z from "zod";
import type emailSchema from "../../schemas/email.js";
import { parseCount } from "../../utils/helpers.js";
import formatEmails from "../../format/format-emails.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	query: z.infer<typeof emailSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const EmailsRepo = RepositoryFactory.getRepository(
		"emails",
		serviceConfig.db,
	);

	const [emails, emailsCount] = await EmailsRepo.selectMultipleFiltered({
		query: data.query,
		config: serviceConfig.config,
	});

	return {
		data: emails.map((email) =>
			formatEmails({
				email: email,
			}),
		),
		count: parseCount(emailsCount?.count),
	};
};

export default getMultiple;
