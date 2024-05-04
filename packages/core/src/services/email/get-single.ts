import T from "../../translations/index.js";
import emailServices from "./index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	id: number;
	renderTemplate: boolean;
}

const getSingle = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const EmailsRepo = Repository.get("emails", serviceConfig.db);
	const EmailsFormatter = Formatter.get("emails");

	const email = await EmailsRepo.selectSingleById({
		id: data.id,
	});

	if (email === undefined) {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("email"),
			}),
			message: T("error_not_found_message", {
				name: T("email"),
			}),
			status: 404,
		});
	}

	if (!data.renderTemplate) {
		return EmailsFormatter.formatSingle({
			email: email,
		});
	}

	const html = await emailServices.renderTemplate(
		email.template,
		Formatter.parseJSON<Record<string, unknown>>(email.data),
	);

	return EmailsFormatter.formatSingle({
		email: email,
		html: html,
	});
};

export default getSingle;
