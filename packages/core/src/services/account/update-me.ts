import T from "../../translations/index.js";
import type { FastifyRequest } from "fastify";
import argon2 from "argon2";
import { LucidAPIError } from "../../utils/error-handler.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";
import email from "../email/index.js";
import account from "./index.js";
import constants from "../../constants.js";

export interface ServiceData {
	auth: FastifyRequest["auth"];
	firstName?: string;
	lastName?: string;
	username?: string;
	email?: string;
	currentPassword?: string;
	newPassword?: string;
	passwordConfirmation?: string;
}

const updateMe = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

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
		throw new LucidAPIError({
			type: "basic",
			message: T("error_not_found_message", {
				name: T("account"),
			}),
			status: 404,
		});
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
			serviceWrapper(account.checks.checkUpdatePassword, false)(
				serviceConfig,
				{
					password: getUser.password,
					currentPassword: data.currentPassword,
					newPassword: data.newPassword,
					passwordConfirmation: data.passwordConfirmation,
				},
			),
		],
	);

	if (data.email !== undefined && userWithEmail !== undefined) {
		throw new LucidAPIError({
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
		});
	}
	if (data.username !== undefined && userWithUsername !== undefined) {
		throw new LucidAPIError({
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
		});
	}

	const updateMe = await UsersRepo.updateSingle({
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			email: data.email,
			updatedAt: new Date().toISOString(),
			password: updatePassword.newPassword,
			triggerPasswordReset: updatePassword.triggerPasswordReset,
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
		throw new LucidAPIError({
			type: "basic",
			message: T("update_error_message", {
				name: T("your_account"),
			}),
			status: 400,
		});
	}

	if (data.email !== undefined) {
		await serviceWrapper(email.sendEmail, false)(serviceConfig, {
			template: constants.emailTemplates.emailChanged,
			type: "internal",
			to: data.email,
			subject: T("email_update_success_subject"),
			data: {
				firstName: data.firstName || getUser.first_name,
			},
		});
	}

	if (getUser.super_admin === 0) return;
};

export default updateMe;
