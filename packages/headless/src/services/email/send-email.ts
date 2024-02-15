import getConfig from "../config.js";
import emailServices from "./index.js";
import { getEmailHash } from "../../utils/app/helpers.js";

export interface ServiceData {
	type: "internal" | "external";
	to: string;
	subject: string;
	template: string;
	cc?: string;
	bcc?: string;
	replyTo?: string;
	data: {
		[key: string]: unknown;
	};
}

const sendEmail = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const config = await getConfig();
	const html = await emailServices.renderTemplate(data.template, data.data);
	const emailHash = getEmailHash(data);

	const result = await config.email.strategy(
		{
			to: data.to,
			subject: data.subject,
			from: config.email.from,
			cc: data.cc,
			bcc: data.bcc,
			replyTo: data.replyTo,
			html: html,
		},
		{
			data: data.data,
			template: data.template,
			hash: emailHash,
		},
	);

	const emailRecord = {
		deliveryStatus: result.success ? "delivered" : "failed",
		lastErrorMessage: result.success ? undefined : result.message,
		lastSuccessAt: result.success ? new Date() : undefined,
	};

	const emailExists = await serviceConfig.db
		.selectFrom("headless_emails")
		.select(["id", "email_hash", "sent_count", "error_count"])
		.where("email_hash", "=", emailHash)
		.executeTakeFirst();

	if (emailExists) {
		await serviceConfig.db
			.updateTable("headless_emails")
			.set({
				delivery_status: emailRecord.deliveryStatus,
				last_error_message: emailRecord.lastErrorMessage,
				last_success_at: emailRecord.lastSuccessAt,
				sent_count: emailExists.sent_count + (result.success ? 1 : 0),
				error_count: emailExists.error_count + (result.success ? 0 : 1),
				last_attempt_at: new Date(),
			})
			.where("id", "=", emailExists.id)
			.execute();
	} else {
		await serviceConfig.db
			.insertInto("headless_emails")
			.values({
				email_hash: emailHash,
				from_address: config.email.from.email,
				from_name: config.email.from.name,
				to_address: data.to,
				subject: data.subject,
				template: data.template,
				cc: data.cc,
				bcc: data.bcc,
				data: JSON.stringify(data.data),
				type: data.type,
				sent_count: result.success ? 1 : 0,
				error_count: result.success ? 0 : 1,
				delivery_status: emailRecord.deliveryStatus,
				last_error_message: emailRecord.lastErrorMessage,
				last_success_at: emailRecord.lastSuccessAt,
			})
			.execute();
	}

	return;
};

export default sendEmail;
