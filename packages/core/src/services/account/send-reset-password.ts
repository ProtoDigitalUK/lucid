import T from "../../translations/index.js";
import { add } from "date-fns";
import constants from "../../constants.js";
import userTokens from "../user-tokens/index.js";
import email from "../email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	email: string;
}

const sendResetPassword = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const userExists = await UsersRepo.selectSingle({
		select: ["id", "first_name", "last_name", "email"],
		where: [
			{
				key: "email",
				operator: "=",
				value: data.email,
			},
		],
	});

	if (userExists === undefined) {
		return {
			message: T("if_account_exists_with_email_not_found"),
		};
	}

	const expiryDate = add(new Date(), {
		minutes: constants.passwordResetTokenExpirationMinutes,
	}).toISOString();

	const userToken = await serviceWrapper(userTokens.createSingle, false)(
		serviceConfig,
		{
			userId: userExists.id,
			tokenType: "password_reset",
			expiryDate: expiryDate,
		},
	);

	await serviceWrapper(email.sendEmail, false)(serviceConfig, {
		type: "internal",
		to: userExists.email,
		subject: T("reset_password_email_subject"),
		template: constants.emailTemplates.resetPassword,
		data: {
			firstName: userExists.first_name,
			lastName: userExists.last_name,
			email: userExists.email,
			resetLink: `${serviceConfig.config.host}${constants.locations.resetPassword}?token=${userToken.token}`,
		},
	});

	return {
		message: T("if_account_exists_with_email_not_found"),
	};
};

export default sendResetPassword;
