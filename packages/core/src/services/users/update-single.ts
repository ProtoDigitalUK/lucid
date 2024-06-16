import T from "../../translations/index.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import Repository from "../../libs/repositories/index.js";
import email from "../email/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import constants from "../../constants.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type { ServiceFn } from "../../libs/services/types.js";

const updateSingle: ServiceFn<
	[
		{
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
		},
	],
	number
> = async (serviceConfig, data) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	if (data.auth.id === data.userId) {
		return {
			error: {
				type: "basic",
				message: T("error_cant_update_yourself"),
				status: 400,
			},
			data: undefined,
		};
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
		return {
			error: {
				type: "basic",
				name: T("error_not_found_name", {
					name: T("user"),
				}),
				message: T("error_not_found_message", {
					name: T("user"),
				}),
				status: 404,
			},
			data: undefined,
		};
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
	if (data.username !== undefined && usernameExists !== undefined) {
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

	let hashedPassword = undefined;
	if (data.password) {
		hashedPassword = await argon2.hash(data.password);
	}

	const [updateUser, updateRoelsRes] = await Promise.all([
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
		serviceWrapper(usersServices.updateMultipleRoles, {
			transaction: false,
		})(serviceConfig, {
			userId: data.userId,
			roleIds: data.roleIds,
		}),
	]);
	if (updateRoelsRes.error) return updateRoelsRes;

	if (updateUser === undefined) {
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	if (data.email !== undefined) {
		const sendEmailRes = await serviceWrapper(email.sendEmail, {
			transaction: false,
		})(serviceConfig, {
			template: constants.emailTemplates.emailChanged,
			type: "internal",
			to: data.email,
			subject: T("email_update_success_subject"),
			data: {
				firstName: data.firstName || user.first_name,
			},
		});
		if (sendEmailRes.error) return sendEmailRes;
	}

	return {
		error: undefined,
		data: user.id,
	};
};

export default updateSingle;
