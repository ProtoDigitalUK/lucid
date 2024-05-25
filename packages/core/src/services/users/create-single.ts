import T from "../../translations/index.js";
import { LucidAPIError } from "../../utils/error-handler.js";
import usersServices from "./index.js";
import serviceWrapper from "../../utils/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import Repository from "../../libs/repositories/index.js";
import { add } from "date-fns";
import constants from "../../constants.js";
import email from "../email/index.js";
import userTokens from "../user-tokens/index.js";
import type { ServiceConfig } from "../../utils/service-wrapper.js";

export interface ServiceData {
	email: string;
	username: string;
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
		throw new LucidAPIError({
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

	const newUser = await UsersRepo.createSingle({
		email: data.email,
		username: data.username,
		firstName: data.firstName,
		lastName: data.lastName,
		superAdmin: data.authSuperAdmin === 1 ? data.superAdmin : 0,
		triggerPasswordReset: 0,
	});

	if (newUser === undefined) {
		throw new LucidAPIError({
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

	// send invite email
	const expiryDate = add(new Date(), {
		minutes: constants.userInviteTokenExpirationMinutes,
	}).toISOString();

	const userToken = await serviceWrapper(userTokens.createSingle, false)(
		serviceConfig,
		{
			userId: newUser.id,
			tokenType: "password_reset",
			expiryDate: expiryDate,
		},
	);

	await serviceWrapper(email.sendEmail, false)(serviceConfig, {
		type: "internal",
		to: data.email,
		subject: T("user_invite_email_subject"),
		template: constants.emailTemplates.userInvite,
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			resetLink: `${serviceConfig.config.host}${constants.locations.resetPassword}?token=${userToken.token}`,
		},
	});

	return newUser.id;
};

export default createSingle;
