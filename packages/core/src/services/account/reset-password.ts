import T from "../../translations/index.js";
import argon2 from "argon2";
import userTokens from "../user-tokens/index.js";
import email from "../email/index.js";
import constants from "../../constants.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../libs/services/types.js";

const resetPassword: ServiceFn<
	[
		{
			token: string;
			password: string;
		},
	],
	undefined
> = async (service, data) => {
	const UserTokensRepo = Repository.get("user-tokens", service.db);
	const UsersRepo = Repository.get("users", service.db);

	const token = await serviceWrapper(userTokens.getSingle, {
		transaction: false,
	})(service, {
		token: data.token,
		tokenType: "password_reset",
	});
	if (token.error) return token;

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
				value: token.data.user_id,
			},
		],
	});

	if (user === undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
			},
			data: undefined,
		};
	}

	const [_, sendEmail] = await Promise.all([
		UserTokensRepo.deleteMultiple({
			where: [
				{
					key: "id",
					operator: "=",
					value: token.data.id,
				},
			],
		}),
		serviceWrapper(email.sendEmail, {
			transaction: false,
		})(service, {
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
	if (sendEmail.error) return sendEmail;

	return {
		error: undefined,
		data: undefined,
	};
};

export default resetPassword;
