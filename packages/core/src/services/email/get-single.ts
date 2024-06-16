import T from "../../translations/index.js";
import LucidServices from "../index.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";
import type { ServiceFn } from "../../libs/services/types.js";
import type { EmailResponse } from "../../types/response.js";

const getSingle: ServiceFn<
	[
		{
			id: number;
			renderTemplate: boolean;
		},
	],
	EmailResponse
> = async (service, data) => {
	const EmailsRepo = Repository.get("emails", service.db);
	const EmailsFormatter = Formatter.get("emails");

	const email = await EmailsRepo.selectSingleById({
		id: data.id,
	});

	if (email === undefined) {
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("email"),
				}),
				message: T("error_not_found_message", {
					name: T("email"),
				}),
				status: 404,
			},
			data: undefined,
		};
	}

	if (!data.renderTemplate) {
		return {
			error: undefined,
			data: EmailsFormatter.formatSingle({
				email: email,
			}),
		};
	}

	const html = await LucidServices.email.renderTemplate(service, {
		template: email.template,
		data: Formatter.parseJSON<Record<string, unknown>>(email.data),
	});
	if (html.error) return html;

	return {
		error: undefined,
		data: EmailsFormatter.formatSingle({
			email: email,
			html: html.data,
		}),
	};
};

export default getSingle;
