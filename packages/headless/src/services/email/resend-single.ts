import T from "../../translations/index.js";
import getConfig from "../config.js";
import emailServices from "./index.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	id: number;
}

const resendSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const config = await getConfig();

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

	const templateData = (email.data ?? {}) as Record<string, unknown>;
	const html = await emailServices.renderTemplate(
		email.template,
		templateData,
	);

	const result = await config.email.strategy(
		{
			to: email.to_address,
			subject: email.subject ?? "",
			from: {
				name: email.from_name,
				email: email.from_address,
			},
			html: html,
			cc: email.cc ?? undefined,
			bcc: email.bcc ?? undefined,
		},
		{
			data: templateData,
			template: email.template,
			hash: email.email_hash,
		},
	);

	await serviceConfig.db
		.updateTable("headless_emails")
		.set({
			delivery_status: result.success ? "delivered" : "failed",
			last_error_message: result.success ? undefined : result.message,
			last_success_at: result.success ? new Date() : undefined,
			sent_count: email.sent_count + (result.success ? 1 : 0),
			error_count: email.error_count + (result.success ? 0 : 1),
			last_attempt_at: new Date(),
		})
		.where("id", "=", email.id)
		.execute();

	return {
		success: result.success,
		message: result.message,
	};
};

export default resendSingle;
