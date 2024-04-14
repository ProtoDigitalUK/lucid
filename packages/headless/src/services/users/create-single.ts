import T from "../../translations/index.js";
import { APIError } from "../../utils/error-handler.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";

export interface ServiceData {
	email: string;
	username: string;
	password: string;
	password_confirmation: string;
	first_name?: string;
	last_name?: string;
	super_admin?: BooleanInt;
	role_ids: Array<number>;
	auth_super_admin: BooleanInt;
}

const createSingle = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const [userExists] = await Promise.all([
		UsersRepo.selectSingleByEmailUsername({
			select: ["id", "username", "email"],
			data: {
				username: data.username,
				email: data.email,
			},
		}),
		serviceWrapper(usersServices.checks.checkRolesExist, false)(
			serviceConfig,
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
			errors: {
				body: {
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
				},
			},
		});
	}

	const hashedPassword = await argon2.hash(data.password);

	const newUser = await UsersRepo.createSingle({
		email: data.email,
		username: data.username,
		password: hashedPassword,
		firstName: data.first_name,
		lastName: data.last_name,
		superAdmin: data.auth_super_admin === 1 ? data.super_admin : 0,
	});

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

	const UserRolesRepo = Repository.get("user-roles", serviceConfig.db);

	await UserRolesRepo.createMultiple({
		items: data.role_ids.map((r) => ({
			userId: newUser.id,
			roleId: r,
		})),
	});

	return newUser.id;
};

export default createSingle;
