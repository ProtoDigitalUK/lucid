import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";
import email from "../email/index.js";
import constants from "../../constants.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	userId: number;
	firstName?: string;
	lastName?: string;
	username?: string;
	email?: string;
	password?: string;
	roleIds?: number[];
	superAdmin?: BooleanInt;
	triggerPasswordReset?: BooleanInt;
	isDeleted?: BooleanInt;
	auth: {
		id: number;
		superAdmin: BooleanInt;
	};
}

const updateSingle = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	if (data.auth.id === data.userId) {
		throw new LucidAPIError({
			type: "basic",
			message: T("error_cant_update_yourself"),
			status: 400,
		});
	}

	const user = await UsersRepo.selectSingle({
		select: ["id", "first_name"],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.userId,
			},
			{
				key: "is_deleted",
				operator: "=",
				value: 0,
			},
		],
	});

	if (!user) {
		throw new LucidAPIError({
			type: "basic",
			name: T("error_not_found_name", {
				name: T("user"),
			}),
			message: T("error_not_found_message", {
				name: T("user"),
			}),
			status: 404,
		});
	}

	const [emailExists, usernameExists] = await Promise.all([
		data.email
			? UsersRepo.selectSingle({
					select: ["email"],
					where: [
						{
							key: "email",
							operator: "=",
							value: data.email,
						},
					],
				})
			: undefined,
		data.username
			? UsersRepo.selectSingle({
					select: ["username"],
					where: [
						{
							key: "username",
							operator: "=",
							value: data.username,
						},
					],
				})
			: undefined,
	]);

	if (data.email !== undefined && emailExists !== undefined) {
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
	if (data.username !== undefined && usernameExists !== undefined) {
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

	let hashedPassword = undefined;
	if (data.password) {
		hashedPassword = await argon2.hash(data.password);
	}

	const [updateUser] = await Promise.all([
		UsersRepo.updateSingle({
			data: {
				firstName: data.firstName,
				lastName: data.lastName,
				username: data.username,
				email: data.email,
				password: hashedPassword,
				superAdmin:
					data.auth.superAdmin === 1 ? data.superAdmin : undefined,
				updatedAt: new Date().toISOString(),
				triggerPasswordReset: data.triggerPasswordReset,
				isDeleted: data.isDeleted,
			},
			where: [
				{
					key: "id",
					operator: "=",
					value: data.userId,
				},
			],
		}),
		serviceWrapper(usersServices.updateMultipleRoles, false)(
			serviceConfig,
			{
				userId: data.userId,
				roleIds: data.roleIds,
			},
		),
	]);

	if (updateUser === undefined) {
		throw new LucidAPIError({
			type: "basic",
			status: 500,
		});
	}

	if (data.email !== undefined) {
		await serviceWrapper(email.sendEmail, false)(serviceConfig, {
			template: constants.emailTemplates.emailChanged,
			type: "internal",
			to: data.email,
			subject: T("email_update_success_subject"),
			data: {
				firstName: data.firstName || user.first_name,
			},
		});
	}

	return user.id;
};

export default updateSingle;
