import T from "../../translations/index.js";
import type { FastifyRequest } from "fastify";
import { LucidAPIError } from "../../utils/error-handler.js";
import usersService from "../users/index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import Repository from "../../libs/repositories/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	auth: FastifyRequest["auth"];
	firstName?: string;
	lastName?: string;
	username?: string;
	email?: string;
	roleIds?: number[];
}

const updateMe = async (serviceConfig: ServiceConfig, data: ServiceData) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const getUser = await UsersRepo.selectSingle({
		select: ["super_admin"],
		where: [
			{
				key: "id",
				operator: "=",
				value: data.auth.id,
			},
		],
	});

	if (getUser === undefined) {
		throw new LucidAPIError({
			type: "basic",
			message: T("error_not_found_message", {
				name: T("account"),
			}),
			status: 404,
		});
	}

	const [userWithEmail, userWithUsername] = await Promise.all([
		data.email !== undefined
			? UsersRepo.selectSingle({
					select: ["id"],
					where: [
						{
							key: "email",
							operator: "=",
							value: data.email,
						},
						{
							key: "id",
							operator: "!=",
							value: data.auth.id,
						},
					],
				})
			: undefined,
		data.username !== undefined
			? UsersRepo.selectSingle({
					select: ["id"],
					where: [
						{
							key: "username",
							operator: "=",
							value: data.username,
						},
						{
							key: "id",
							operator: "!=",
							value: data.auth.id,
						},
					],
				})
			: undefined,
		data.roleIds !== undefined
			? serviceWrapper(usersService.checks.checkRolesExist, false)(
					serviceConfig,
					{
						roleIds: data.roleIds,
					},
				)
			: undefined,
	]);

	if (data.email !== undefined && userWithEmail !== undefined) {
		throw new LucidAPIError({
			type: "basic",
			message: T("this_email_is_already_in_use"),
			status: 400,
		});
	}
	if (data.username !== undefined && userWithUsername !== undefined) {
		throw new LucidAPIError({
			type: "basic",
			message: T("this_username_is_already_in_use"),
			status: 400,
		});
	}

	const updateMe = await UsersRepo.updateSingle({
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			username: data.username,
			email: data.email,
			updatedAt: new Date().toISOString(),
		},
		where: [
			{
				key: "id",
				operator: "=",
				value: data.auth.id,
			},
		],
	});

	if (updateMe === undefined) {
		throw new LucidAPIError({
			type: "basic",
			message: T("update_error_message", {
				name: T("your_account"),
			}),
			status: 400,
		});
	}

	// TODO: send email to user to confirm email change ?

	if (getUser.super_admin === 0) return;

	await serviceWrapper(usersService.updateMultipleRoles, false)(
		serviceConfig,
		{
			userId: data.auth.id,
			roleIds: data.roleIds,
		},
	);
};

export default updateMe;
