import T from "../../translations/index.js";
import type { FastifyRequest } from "fastify";
import { LucidAPIError } from "../../utils/error-handler.js";
import Repository from "../../libs/repositories/index.js";
import argon2 from "argon2";
import email from "../email/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import constants from "../../constants.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

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

	const [userWithEmail, userWithUsername] = await Promise.all([
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
	]);

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

	// password
	let newPassword = undefined;
	let triggerPasswordReset = undefined;

	if (data.newPassword !== undefined && data.currentPassword !== undefined) {
		const passwordValid = await argon2.verify(
			getUser.password,
			data.currentPassword,
		);

		if (!passwordValid) {
			throw new LucidAPIError({
				type: "basic",
				message: T("please_ensure_password_is_correct"),
				status: 400,
				errorResponse: {
					body: {
						currentPassword: {
							code: "invalid",
							message: T("please_ensure_password_is_correct"),
						},
					},
				},
			});
		}

		newPassword = await argon2.hash(data.newPassword);
		triggerPasswordReset = 0 as const;
	}

	const updateMe = await UsersRepo.updateSingle({
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			email: data.email,
			updatedAt: new Date().toISOString(),
			password: newPassword,
			triggerPasswordReset: triggerPasswordReset,
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

	if (data.email === undefined) return;

	await serviceWrapper(email.sendEmail, false)(serviceConfig, {
		template: constants.emailTemplates.emailChanged,
		type: "internal",
		to: data.email,
		subject: T("email_update_success_subject"),
		data: {
			firstName: data.firstName || getUser.first_name,
		},
	});

	if (getUser.super_admin === 0) return;
};

export default updateMe;
