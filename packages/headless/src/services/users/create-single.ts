import T from "../../translations/index.js";
import { APIError, modelErrors } from "../../utils/app/error-handler.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/app/service-wrapper.js";

export interface ServiceData {
	email: string;
	username: string;
	password: string;
	password_confirmation: string;
	first_name?: string;
	last_name?: string;
	super_admin?: boolean;
	role_ids: Array<number>;
	auth_super_admin: boolean;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const [userExists] = await Promise.all([
		serviceConfig.db
			.selectFrom("headless_users")
			.select(["id", "username", "email"])
			.where((eb) =>
				eb.or([
					eb("username", "=", data.username),
					eb("email", "=", data.email),
				]),
			)
			.executeTakeFirst(),
		serviceWrapper(usersServices.checks.checkRolesExist, false)(
			{
				db: serviceConfig.db,
			},
			{
				role_ids: data.role_ids,
				is_create: true,
			},
		),
	]);

	if (userExists !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("user"),
			}),
			message: T("creation_error_message", {
				name: T("user"),
			}),
			status: 500,
			errors: modelErrors({
				email:
					userExists.email === data.email
						? {
								code: "invalid",
								message: T("duplicate_entry_error_message"),
							}
						: undefined,
				username:
					userExists.username === data.username
						? {
								code: "invalid",
								message: T("duplicate_entry_error_message"),
							}
						: undefined,
			}),
		});
	}

	const hashedPassword = await argon2.hash(data.password);

	const newUser = await serviceConfig.db
		.insertInto("headless_users")
		.values({
			email: data.email,
			username: data.username,
			password: hashedPassword,
			first_name: data.first_name,
			last_name: data.last_name,
			super_admin: data.auth_super_admin ? data.super_admin : false,
		})
		.returning("id")
		.executeTakeFirst();

	if (newUser === undefined) {
		throw new APIError({
			type: "basic",
			name: T("error_not_created_name", {
				name: T("user"),
			}),
			message: T("creation_error_message", {
				name: T("user"),
			}),
			status: 500,
		});
	}

	if (data.role_ids === undefined || data.role_ids.length === 0)
		return newUser.id;

	await serviceConfig.db
		.insertInto("headless_user_roles")
		.values(
			data.role_ids.map((roleId) => ({
				user_id: newUser.id,
				role_id: roleId,
			})),
		)
		.execute();

	return newUser.id;
};

export default createSingle;
