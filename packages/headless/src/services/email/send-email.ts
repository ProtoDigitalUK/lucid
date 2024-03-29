import T from "../../translations/index.js";
import emailServices from "./index.js";
import { getEmailHash } from "../../utils/helpers.js";
import formatEmails from "../../format/format-emails.js";
import { APIError } from "../../utils/error-handler.js";
import { stringifyJSON } from "../../utils/format-helpers.js";

export interface ServiceData {
	type: "internal" | "external";
	to: string;
	subject: string;
	template: string;
	cc?: string;
	bcc?: string;
	reply_to?: string;
	data: Record<string, unknown>;
}

const sendEmail = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const html = await emailServices.renderTemplate(data.template, data.data);
	const emailHash = getEmailHash(data);

	const result = await serviceConfig.config.email.strategy(
		{
			to: data.to,
			subject: data.subject,
			from: serviceConfig.config.email.from,
			cc: data.cc,
			bcc: data.bcc,
			replyTo: data.reply_to,
			html: html,
		},
		{
			data: data.data,
			template: data.template,
			hash: emailHash,
		},
	);

	const emailRecord = {
		deliveryStatus: result.success
			? "delivered"
			: ("failed" as "delivered" | "failed"),
		lastErrorMessage: result.success ? undefined : result.message,
		lastSuccessAt: result.success ? new Date().toISOString() : undefined,
	};

	const emailExists = await serviceConfig.db
		.selectFrom("headless_emails")
		.select(["id", "email_hash", "sent_count", "error_count"])
		.where("email_hash", "=", emailHash)
		.executeTakeFirst();

	if (emailExists) {
		const emailUpdated = await serviceConfig.db
			.updateTable("headless_emails")
			.set({
				delivery_status: emailRecord.deliveryStatus,
				last_error_message: emailRecord.lastErrorMessage,
				last_success_at: emailRecord.lastSuccessAt,
				sent_count: emailExists.sent_count + (result.success ? 1 : 0),
				error_count: emailExists.error_count + (result.success ? 0 : 1),
				last_attempt_at: new Date().toISOString(),
			})
			.where("id", "=", emailExists.id)
			.returningAll()
			.executeTakeFirst();

		if (emailUpdated === undefined) {
			throw new APIError({
				type: "basic",
				name: T("error_not_updated_name", {
					name: T("email"),
				}),
				message: T("update_error_message", {
					name: T("email").toLowerCase(),
				}),
				status: 500,
			});
		}

		return formatEmails({
			email: emailUpdated,
			html: html,
		});
	}

	const newEmail = await serviceConfig.db
		.insertInto("headless_emails")
		.values({
			email_hash: emailHash,
			from_address: serviceConfig.config.email.from.email,
			from_name: serviceConfig.config.email.from.name,
			to_address: data.to,
			subject: data.subject,
			template: data.template,
			cc: data.cc,
			bcc: data.bcc,
			data: stringifyJSON(data.data),
			type: data.type,
			sent_count: result.success ? 1 : 0,
			error_count: result.success ? 0 : 1,
			delivery_status: emailRecord.deliveryStatus,
			last_error_message: emailRecord.lastErrorMessage,
			last_success_at: emailRecord.lastSuccessAt,
		})
		.returningAll()
		.executeTakeFirst();

	if (newEmail === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("email"),
			}),
			message: T("creation_error_message", {
				name: T("email").toLowerCase(),
			}),
			status: 500,
		});
	}

	return formatEmails({
		email: newEmail,
		html: html,
	});
};

export default sendEmail;
