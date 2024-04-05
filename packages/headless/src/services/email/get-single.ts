import T from "../../translations/index.js";
import emailServices from "./index.js";
import { APIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

export interface ServiceData {
	id: number;
	render_template: boolean;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const EmailsRepo = Repository.get("emails", serviceConfig.db);
	const EmailsFormatter = Formatter.get("emails");

	const email = await EmailsRepo.selectSingleById({
		id: data.id,
	});

	if (email === undefined) {
		throw new APIError({
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

	if (!data.render_template) {
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
