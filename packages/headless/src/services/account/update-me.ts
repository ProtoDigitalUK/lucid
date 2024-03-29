import T from "../../translations/index.js";
import type { FastifyRequest } from "fastify";
import { APIError } from "../../utils/error-handler.js";
import usersService from "../users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";

export interface ServiceData {
	auth: FastifyRequest["auth"];
	first_name?: string;
	last_name?: string;
	username?: string;
	email?: string;
	role_ids?: number[];
}

const updateMe = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const getUser = await serviceConfig.config.db.client
		.selectFrom("headless_users")
		.select(["super_admin"])
		.where("id", "=", data.auth.id)
		.executeTakeFirst();

	if (getUser === undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("account"),
			}),
			message: T("error_not_found_message", {
				name: T("account"),
			}),
			status: 404,
		});
	}

	const [userWithEmail, userWithUsername] = await Promise.all([
		data.email !== undefined
			? serviceConfig.config.db.client
					.selectFrom("headless_users")
					.where("email", "=", data.email)
					.where("id", "!=", data.auth.id)
					.executeTakeFirst()
			: undefined,
		data.username !== undefined
			? serviceConfig.config.db.client
					.selectFrom("headless_users")
					.where("username", "=", data.username)
					.where("id", "!=", data.auth.id)
					.executeTakeFirst()
			: undefined,
		data.role_ids !== undefined
			? serviceWrapper(usersService.checks.checkRolesExist, false)(
					serviceConfig,
					{
						role_ids: data.role_ids,
						is_create: false,
					},
			  )
			: undefined,
	]);

	if (data.email !== undefined && userWithEmail !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("account"),
			}),
			message: T("this_email_is_already_in_use"),
			status: 400,
		});
	}
	if (data.username !== undefined && userWithUsername !== undefined) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("account"),
			}),
			message: T("this_username_is_already_in_use"),
			status: 400,
		});
	}

	const updateMe = await serviceConfig.config.db.client
		.updateTable("headless_users")
		.set({
			first_name: data.first_name,
			last_name: data.last_name,
			username: data.username,
			email: data.email,
			updated_at: new Date().toISOString(),
		})
		.where("id", "=", data.auth.id)
		.executeTakeFirst();

	if (updateMe.numUpdatedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("error_not_updated_name", {
				name: T("account"),
			}),
			message: T("update_error_message", {
				name: T("your_account"),
			}),
			status: 400,
		});
	}

	// TODO: send email to user to confirm email change ?

	if (getUser.super_admin === false) return;

	await serviceWrapper(usersService.updateMultipleRoles, false)(
		serviceConfig,
		{
			user_id: data.auth.id,
			role_ids: data.role_ids,
		},
	);
};

export default updateMe;
