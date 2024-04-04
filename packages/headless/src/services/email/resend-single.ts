import T from "../../translations/index.js";
import emailServices from "./index.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	id: number;
}

const resendSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const EmailsRepo = RepositoryFactory.getRepository(
		"emails",
		serviceConfig.db,
	);

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

	const templateData = (email.data ?? {}) as Record<string, unknown>;
	const html = await emailServices.renderTemplate(
		email.template,
		templateData,
	);

	const result = await serviceConfig.config.email.strategy(
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

	await EmailsRepo.updateSingle({
		where: [
			{
				key: "id",
				operator: "=",
				value: email.id,
			},
		],
		data: {
			deliveryStatus: result.success ? "delivered" : "failed",
			lastErrorMessage: result.success ? undefined : result.message,
			lastSuccessAt: result.success
				? new Date().toISOString()
				: undefined,
			sentCount: email.sent_count + (result.success ? 1 : 0),
			errorCount: email.error_count + (result.success ? 0 : 1),
			lastAttemptAt: new Date().toISOString(),
		},
	});

	return {
		success: result.success,
		message: result.message,
	};
};

export default resendSingle;
