import T from "../../translations/index.js";
import formatEmails from "../../format/format-emails.js";
import emailServices from "./index.js";
import { APIError } from "../../utils/error-handler.js";
import { parseJSON } from "../../utils/format-helpers.js";

export interface ServiceData {
	id: number;
	render_template: boolean;
}

const getSingle = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const email = await serviceConfig.db
		.selectFrom("headless_emails")
		.selectAll()
		.where("id", "=", data.id)
		.executeTakeFirst();

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
		return formatEmails({
			email: email,
		});
	}

	const html = await emailServices.renderTemplate(
		email.template,
		parseJSON<Record<string, unknown>>(email.data),
	);
	return formatEmails({
		email,
		html,
	});
};

export default getSingle;
