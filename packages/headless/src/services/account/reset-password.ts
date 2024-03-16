import T from "../../translations/index.js";
import argon2 from "argon2";
import userTokens from "../user-tokens/index.js";
import email from "../email/index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	token: string;
	password: string;
}

const resetPassword = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const token = await serviceWrapper(userTokens.getSingle, false)(
		serviceConfig,
		{
			token: data.token,
			token_type: "password_reset",
		},
	);

	const hashedPassword = await argon2.hash(data.password);

	const user = await serviceConfig.db
		.updateTable("headless_users")
		.set({
			password: hashedPassword,
			updated_at: new Date(),
		})
		.where("id", "=", token.user_id)
		.returning(["first_name", "last_name", "email"])
		.executeTakeFirst();

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
		serviceConfig.db
			.deleteFrom("headless_user_tokens")
			.where("id", "=", token.id)
			.execute(),
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
