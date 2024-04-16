import T from "../../translations/index.js";
import { HeadlessAPIError } from "../../utils/error-handler.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	email: string;
	username: string;
	password: string;
	passwordConfirmation: string;
	firstName?: string;
	lastName?: string;
	superAdmin?: BooleanInt;
	roleIds: Array<number>;
	authSuperAdmin: BooleanInt;
}

const createSingle = async (
	serviceConfig: ServiceConfig,
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
				roleIds: data.roleIds,
			},
		),
	]);

	if (userExists !== undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 500,
			errorResponse: {
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
		firstName: data.firstName,
		lastName: data.lastName,
		superAdmin: data.authSuperAdmin === 1 ? data.superAdmin : 0,
	});

	if (newUser === undefined) {
		throw new HeadlessAPIError({
			type: "basic",
			status: 500,
		});
	}

	if (data.roleIds === undefined || data.roleIds.length === 0)
		return newUser.id;

	const UserRolesRepo = Repository.get("user-roles", serviceConfig.db);

	await UserRolesRepo.createMultiple({
		items: data.roleIds.map((r) => ({
			userId: newUser.id,
			roleId: r,
		})),
	});

	return newUser.id;
};

export default createSingle;
