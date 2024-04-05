import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/error-handler.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	user_id: number;
	first_name?: string;
	last_name?: string;
	username?: string;
	email?: string;
	password?: string;
	role_ids?: number[];
	super_admin?: BooleanInt;

	auth_super_admin: BooleanInt;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const user = await UsersRepo.selectSingle({
		select: ["id"],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.user_id,
			},
			{
				key: "is_deleted",
				operator: "=",
				value: 0,
			},
		],
	});

	if (!user) {
		throw new APIError({
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
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("user"),
			}),
			message: T("update_error_message", {
				name: T("user"),
			}),
			status: 500,
			errors: modelErrors({
				email: {
					code: "invalid",
					message: T("duplicate_entry_error_message"),
				},
			}),
		});
	}
	if (data.username !== undefined && usernameExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("user"),
			}),
			message: T("update_error_message", {
				name: T("user"),
			}),
			status: 500,
			errors: modelErrors({
				username: {
					code: "invalid",
					message: T("duplicate_entry_error_message"),
				},
			}),
		});
	}

	let hashedPassword = undefined;
	if (data.password) {
		hashedPassword = await argon2.hash(data.password);
	}

	const [updateUser] = await Promise.all([
		UsersRepo.updateSingle({
			data: {
				firstName: data.first_name,
				lastName: data.last_name,
				username: data.username,
				email: data.email,
				password: hashedPassword,
				superAdmin:
					data.auth_super_admin === 1 ? data.super_admin : undefined,
				updatedAt: new Date().toISOString(),
			},
			where: [
				{
					key: "id",
					operator: "=",
					value: data.user_id,
				},
			],
		}),
		serviceWrapper(usersServices.updateMultipleRoles, false)(
			serviceConfig,
			{
				user_id: data.user_id,
				role_ids: data.role_ids,
			},
		),
	]);

	if (updateUser === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("user"),
			}),
			message: T("update_error_message", {
				name: T("user"),
			}),
			status: 500,
		});
	}

	// TODO: send email to user to confirm email change ?

	return user.id;
};

export default updateSingle;
