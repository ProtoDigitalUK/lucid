import T from "../../translations/index.js";
import argon2 from "argon2";
import userTokens from "../user-tokens/index.js";
import email from "../email/index.js";
import constants from "../../constants.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	token: string;
	password: string;
}

const resetPassword = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const UserTokensRepo = Repository.get("user-tokens", serviceConfig.db);
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const token = await serviceWrapper(userTokens.getSingle, false)(
		serviceConfig,
		{
			token: data.token,
			tokenType: "password_reset",
		},
	);

	const hashedPassword = await argon2.hash(data.password);

	const user = await UsersRepo.updateSingle({
		data: {
			password: hashedPassword,
			updatedAt: new Date().toISOString(),
		},
		where: [
			{
				key: "id",
				operator: "=",
				value: token.user_id,
			},
		],
	});

	if (user === undefined) {
		throw new LucidAPIError({
			type: "basic",
			status: 400,
		});
	}

	await Promise.all([
		UserTokensRepo.deleteMultiple({
			where: [
				{
					key: "id",
					operator: "=",
					value: token.id,
				},
			],
		}),
		serviceWrapper(email.sendEmail, false)(serviceConfig, {
			template: constants.emailTemplates.passwordResetSuccess,
			type: "internal",
			to: user.email,
			subject: T("password_reset_success_subject"),
			data: {
				firstName: user.first_name,
				lastName: user.last_name,
			},
		}),
	]);
};

export default resetPassword;
