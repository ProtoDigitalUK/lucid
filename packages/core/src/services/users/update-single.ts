import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import argon2 from "argon2";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";
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
		select: ["id"],
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
			status: 500,
			errorResponse: {
				body: {
					email: {
						code: "invalid",
						message: T("duplicate_entry_error_message"),
					},
				},
			},
		});
	}
	if (data.username !== undefined && usernameExists !== undefined) {
		throw new LucidAPIError({
			type: "basic",
			status: 500,
			errorResponse: {
				body: {
					username: {
						code: "invalid",
						message: T("duplicate_entry_error_message"),
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

	// TODO: send email to user to confirm email change ?

	return user.id;
};

export default updateSingle;
