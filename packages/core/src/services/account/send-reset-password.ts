import T from "../../translations/index.js";
import { add } from "date-fns";
import constants from "../../constants/constants.js";
import lucidServices from "../index.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceFn } from "../../utils/services/types.js";

const sendResetPassword: ServiceFn<
	[
		{
			email: string;
		},
	],
	{
		message: string;
	}
> = async (service, data) => {
	const UsersRepo = Repository.get("users", service.db);

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
			error: undefined,
			data: {
				message: T("if_account_exists_with_email_not_found"),
			},
		};
	}

	const expiryDate = add(new Date(), {
		minutes: constants.passwordResetTokenExpirationMinutes,
	}).toISOString();

	const userToken = await lucidServices.user.token.createSingle(service, {
		userId: userExists.id,
		tokenType: "password_reset",
		expiryDate: expiryDate,
	});
	if (userToken.error) return userToken;

	const sendEmail = await lucidServices.email.sendEmail(service, {
		type: "internal",
		to: userExists.email,
		subject: T("reset_password_email_subject"),
		template: constants.emailTemplates.resetPassword,
		data: {
			firstName: userExists.first_name,
			lastName: userExists.last_name,
			email: userExists.email,
			resetLink: `${service.config.host}${constants.locations.resetPassword}?token=${userToken.data.token}`,
		},
	});
	if (sendEmail.error) return sendEmail;

	return {
		error: undefined,
		data: {
			message: T("if_account_exists_with_email_not_found"),
		},
	};
};

export default sendResetPassword;
