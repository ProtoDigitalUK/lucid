import T from "../../translations/index.js";
import formatEmails from "../../format/format-emails.js";
import emailServices from "./index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	id: number;
	renderTemplate: boolean;
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

	if (!data.renderTemplate) {
		return formatEmails(email);
	}

	const html = await emailServices.renderTemplate(
		email.template,
		email.data as Record<string, unknown>,
	);
	return formatEmails(email, html);
};

export default getSingle;
