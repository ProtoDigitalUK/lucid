import T from "../../translations/index.js";
import Repository from "../../libs/repositories/index.js";
import LucidServices from "../index.js";
import constants from "../../constants.js";
import type { FastifyRequest } from "fastify";
import type { ServiceFn } from "../../libs/services/types.js";

const updateMe: ServiceFn<
	[
		{
			auth: FastifyRequest["auth"];
			firstName?: string;
			lastName?: string;
			username?: string;
			email?: string;
			currentPassword?: string;
			newPassword?: string;
			passwordConfirmation?: string;
		},
	],
	undefined
> = async (service, data) => {
	const UsersRepo = Repository.get("users", service.db);

	const getUser = await UsersRepo.selectSingle({
		select: ["super_admin", "password", "first_name"],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.auth.id,
			},
		],
	});

	if (getUser === undefined) {
		return {
			error: {
				type: "basic",
				message: T("account_not_found_message"),
				status: 404,
			},
			data: undefined,
		};
	}

	const [userWithEmail, userWithUsername, updatePassword] = await Promise.all(
		[
			data.email !== undefined
				? UsersRepo.selectSingle({
						select: ["id"],
						where: [
							{
								key: "email",
								operator: "=",
								value: data.email,
							},
							{
								key: "id",
								operator: "!=",
								value: data.auth.id,
							},
						],
					})
				: undefined,
			data.username !== undefined
				? UsersRepo.selectSingle({
						select: ["id"],
						where: [
							{
								key: "username",
								operator: "=",
								value: data.username,
							},
							{
								key: "id",
								operator: "!=",
								value: data.auth.id,
							},
						],
					})
				: undefined,
			LucidServices.account.checks.checkUpdatePassword(service, {
				password: getUser.password,
				currentPassword: data.currentPassword,
				newPassword: data.newPassword,
				passwordConfirmation: data.passwordConfirmation,
			}),
		],
	);
	if (updatePassword.error) return updatePassword;

	if (data.email !== undefined && userWithEmail !== undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
				errorResponse: {
					body: {
						email: {
							code: "invalid",
							message: T("this_email_is_already_in_use"),
						},
					},
				},
			},
			data: undefined,
		};
	}
	if (data.username !== undefined && userWithUsername !== undefined) {
		return {
			error: {
				type: "basic",
				status: 400,
				errorResponse: {
					body: {
						username: {
							code: "invalid",
							message: T("this_username_is_already_in_use"),
						},
					},
				},
			},
			data: undefined,
		};
	}

	const updateMe = await UsersRepo.updateSingle({
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			email: data.email,
			updatedAt: new Date().toISOString(),
			password: updatePassword.data.newPassword,
			triggerPasswordReset: updatePassword.data.triggerPasswordReset,
		},
		where: [
			{
				key: "id",
				operator: "=",
				value: data.auth.id,
			},
		],
	});

	if (updateMe === undefined) {
		return {
			error: {
				type: "basic",
				message: T("route_user_me_update_error_message"),
				status: 400,
			},
			data: undefined,
		};
	}

	if (data.email !== undefined) {
		const sendEmail = await LucidServices.email.sendEmail(service, {
			template: constants.emailTemplates.emailChanged,
			type: "internal",
			to: data.email,
			subject: T("email_update_success_subject"),
			data: {
				firstName: data.firstName || getUser.first_name,
			},
		});
		if (sendEmail.error) return sendEmail;
	}

	if (getUser.super_admin === 0) {
		return {
			error: undefined,
			data: undefined,
		};
	}

	// super admin specific

	return {
		error: undefined,
		data: undefined,
	};
};

export default updateMe;
