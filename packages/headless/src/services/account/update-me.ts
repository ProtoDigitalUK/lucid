import T from "../../translations/index.js";
import { type FastifyRequest } from "fastify";
import { APIError } from "../../utils/app/error-handler.js";

export interface ServiceData {
	auth: FastifyRequest["auth"];
	firstName?: string;
	lastName?: string;
	username?: string;
	email?: string;
	roleIds?: number[];
}

const updateMe = async (serviceConfig: ServiceConfigT, data: ServiceData) => {
	const getUser = await serviceConfig.db
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
			? serviceConfig.db
					.selectFrom("headless_users")
					.where("email", "=", data.email)
					.where("id", "!=", data.auth.id)
					.executeTakeFirst()
			: undefined,
		data.username !== undefined
			? serviceConfig.db
					.selectFrom("headless_users")
					.where("username", "=", data.username)
					.where("id", "!=", data.auth.id)
					.executeTakeFirst()
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

	const updateMe = await serviceConfig.db
		.updateTable("headless_users")
		.set({
			first_name: data.firstName,
			last_name: data.lastName,
			username: data.username,
			email: data.email,
			updated_at: new Date().toISOString(),
		})
		.where("id", "=", data.auth.id)
		.executeTakeFirst();

	if (updateMe.numUpdatedRows === 0n) {
		throw new APIError({
			type: "basic",
			name: T("dynamic_error_name", {
				name: T("account"),
			}),
			message: T("update_error_message", {
				name: T("your_account"),
			}),
			status: 400,
		});
	}

	// TODO: send email to user to confirm email change

	// EXIT OUT IF USER IS NOT SUPER ADMIN
	if (getUser.super_admin === false) return;

	if (data.roleIds === undefined) return;

	await serviceConfig.db
		.deleteFrom("headless_user_roles")
		.where("user_id", "=", data.auth.id)
		.execute();

	await serviceConfig.db
		.insertInto("headless_user_roles")
		.values(
			data.roleIds.map((roleId) => ({
				user_id: data.auth.id,
				role_id: roleId,
			})),
		)
		.execute();
};

export default updateMe;
