import T from "../../translations/index.js";
import argon2 from "argon2";
import userTokens from "../user-tokens/index.js";
import email from "../email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import { APIError } from "../../utils/error-handler.js";
import RepositoryFactory from "../../libs/factories/repository-factory.js";

export interface ServiceData {
	token: string;
	password: string;
}

const resetPassword = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UserTokensRepo = RepositoryFactory.getRepository(
		"user-tokens",
		serviceConfig.db,
	);
	const UsersRepo = RepositoryFactory.getRepository(
		"users",
		serviceConfig.db,
	);

	const token = await serviceWrapper(userTokens.getSingle, false)(
		serviceConfig,
		{
			token: data.token,
			token_type: "password_reset",
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
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("account"),
			}),
			message: T("update_error_message", {
				name: T("your_account"),
			}),
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
			template: "password-reset",
			type: "internal",
			to: user.email,
			subject: T("password_reset_success_subject"),
			data: {
				first_name: user.first_name,
				last_name: user.last_name,
			},
		}),
	]);
};

export default resetPassword;
