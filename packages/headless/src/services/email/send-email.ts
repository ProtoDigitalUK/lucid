import T from "../../translations/index.js";
import emailServices from "./index.js";
import { getEmailHash } from "../../utils/helpers.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import Formatter from "../../libs/formatters/index.js";

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
	const EmailsRepo = Repository.get("emails", serviceConfig.db);
	const EmailsFormatter = Formatter.get("emails");

	const emailConfig = emailServices.checks.checkHasEmailConfig({
		config: serviceConfig.config,
	});

	const html = await emailServices.renderTemplate(data.template, data.data);
	const emailHash = getEmailHash(data);

	const result = await emailConfig.strategy(
		{
			to: data.to,
			subject: data.subject,
			from: emailConfig.from,
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

	const emailExists = await EmailsRepo.selectSingle({
		select: ["id", "email_hash", "sent_count", "error_count"],
		where: [
			{
				key: "email_hash",
				operator: "=",
				value: emailHash,
			},
		],
	});

	if (emailExists) {
		const emailUpdated = await EmailsRepo.updateSingle({
			where: [
				{
					key: "id",
					operator: "=",
					value: emailExists.id,
				},
			],
			data: {
				deliveryStatus: emailRecord.deliveryStatus,
				lastErrorMessage: emailRecord.lastErrorMessage,
				lastSuccessAt: emailRecord.lastSuccessAt,
				sentCount: emailExists.sent_count + (result.success ? 1 : 0),
				errorCount: emailExists.error_count + (result.success ? 0 : 1),
				lastAttemptAt: new Date().toISOString(),
			},
		});

		if (emailUpdated === undefined) {
			throw new HeadlessAPIError({
				type: "basic",
				status: 500,
			});
		}

		return EmailsFormatter.formatSingle({
			email: emailUpdated,
			html: html,
		});
	}
	const newEmail = await EmailsRepo.createSingle({
		emailHash: emailHash,
		fromAddress: emailConfig.from.email,
		fromName: emailConfig.from.name,
		toAddress: data.to,
		subject: data.subject,
		template: data.template,
		cc: data.cc,
		bcc: data.bcc,
		data: Formatter.stringifyJSON(data.data),
		type: data.type,
		sentCount: result.success ? 1 : 0,
		errorCount: result.success ? 0 : 1,
		deliveryStatus: emailRecord.deliveryStatus,
		lastErrorMessage: emailRecord.lastErrorMessage,
		lastSuccessAt: emailRecord.lastSuccessAt,
	});

	if (newEmail === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 500,
		});
	}

	return EmailsFormatter.formatSingle({
		email: newEmail,
		html: html,
	});
};

export default sendEmail;
