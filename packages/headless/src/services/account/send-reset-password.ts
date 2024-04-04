import T from "../../translations/index.js";
import { add } from "date-fns";
import constants from "../../constants.js";
import userTokens from "../user-tokens/index.js";
import email from "../email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import RepositoryFactory from "../../libs/repositories/index.js";

export interface ServiceData {
	email: string;
}

const sendResetPassword = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UsersRepo = RepositoryFactory.getRepository(
		"users",
		serviceConfig.db,
	);

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
			user_id: userExists.id,
			token_type: "password_reset",
			expiry_date: expiryDate,
		},
	);

	await serviceWrapper(email.sendEmail, false)(serviceConfig, {
		type: "internal",
		to: userExists.email,
		subject: T("reset_password_email_subject"),
		template: "reset-password",
		data: {
			first_name: userExists.first_name,
			last_name: userExists.last_name,
			email: userExists.email,
			reset_link: `${serviceConfig.config.host}${constants.locations.resetPassword}?token=${userToken.token}`,
		},
	});

	return {
		message: T("if_account_exists_with_email_not_found"),
	};
};

export default sendResetPassword;
