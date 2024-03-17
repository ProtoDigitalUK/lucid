import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	user_id: number;
	first_name?: string;
	last_name?: string;
	username?: string;
	email?: string;
	password?: string;
	role_ids?: number[];
	super_admin?: boolean;

	auth_super_admin: boolean;
}

const updateSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const user = await serviceConfig.db
		.selectFrom("headless_users")
		.select(["id"])
		.where("id", "=", data.user_id)
		.where("is_deleted", "=", false)
		.executeTakeFirst();

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
			? serviceConfig.db
					.selectFrom("headless_users")
					.select("email")
					.where("email", "=", data.email)
					.executeTakeFirst()
			: undefined,
		data.username
			? serviceConfig.db
					.selectFrom("headless_users")
					.select("username")
					.where("username", "=", data.username)
					.executeTakeFirst()
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
		serviceConfig.db
			.updateTable("headless_users")
			.set({
				first_name: data.first_name,
				last_name: data.last_name,
				username: data.username,
				email: data.email,
				password: hashedPassword,
				super_admin: data.auth_super_admin
					? data.super_admin
					: undefined,
				updated_at: new Date().toISOString(),
			})
			.where("id", "=", data.user_id)
			.executeTakeFirst(),
		serviceWrapper(usersServices.updateMultipleRoles, false)(
			serviceConfig,
			{
				user_id: data.user_id,
				role_ids: data.role_ids,
			},
		),
	]);

	if (updateUser.numUpdatedRows === 0n) {
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
