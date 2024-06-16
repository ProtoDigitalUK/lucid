import T from "../../translations/index.js";
import usersServices from "./index.js";
import Repository from "../../libs/repositories/index.js";
import { add } from "date-fns";
import constants from "../../constants.js";
import email from "../email/index.js";
import userTokens from "../user-tokens/index.js";
import serviceWrapper from "../../libs/services/service-wrapper.js";
import type { BooleanInt } from "../../libs/db/types.js";
import type { ServiceFn } from "../../libs/services/types.js";

const createSingle: ServiceFn<
	[
		{
			email: string;
			username: string;
			firstName?: string;
			lastName?: string;
			superAdmin?: BooleanInt;
			roleIds: Array<number>;
			authSuperAdmin: BooleanInt;
		},
	],
	number
> = async (serviceConfig, data) => {
	const UsersRepo = Repository.get("users", serviceConfig.db);

	const [userExists, roleExistsRes] = await Promise.all([
		UsersRepo.selectSingleByEmailUsername({
			select: ["id", "username", "email"],
			data: {
				username: data.username,
				email: data.email,
			},
		}),
		serviceWrapper(usersServices.checks.checkRolesExist, {
			transaction: false,
		})(serviceConfig, {
			roleIds: data.roleIds,
		}),
	]);
	if (roleExistsRes.error) return roleExistsRes;

	if (userExists !== undefined) {
		return {
			error: {
				type: "basic",
				status: 500,
				errorResponse: {
					body: {
						email:
							userExists.email === data.email
								? {
										code: "invalid",
										message: T(
											"duplicate_entry_error_message",
										),
									}
								: undefined,
						username:
							userExists.username === data.username
								? {
										code: "invalid",
										message: T(
											"duplicate_entry_error_message",
										),
									}
								: undefined,
					},
				},
			},
			data: undefined,
		};
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
		return {
			error: {
				type: "basic",
				status: 500,
			},
			data: undefined,
		};
	}

	// Email Invite
	const expiryDate = add(new Date(), {
		minutes: constants.userInviteTokenExpirationMinutes,
	}).toISOString();

	const userTokenRes = await serviceWrapper(userTokens.createSingle, {
		transaction: false,
	})(serviceConfig, {
		userId: newUser.id,
		tokenType: "password_reset",
		expiryDate: expiryDate,
	});
	if (userTokenRes.error) return userTokenRes;

	const sendEmailRes = await serviceWrapper(email.sendEmail, {
		transaction: false,
	})(serviceConfig, {
		type: "internal",
		to: data.email,
		subject: T("user_invite_email_subject"),
		template: constants.emailTemplates.userInvite,
		data: {
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			resetLink: `${serviceConfig.config.host}${constants.locations.resetPassword}?token=${userTokenRes.data.token}`,
		},
	});
	if (sendEmailRes.error) return sendEmailRes;

	// Roles
	if (data.roleIds === undefined || data.roleIds.length === 0) {
		return {
			error: undefined,
			data: newUser.id,
		};
	}

	const UserRolesRepo = Repository.get("user-roles", serviceConfig.db);

	await UserRolesRepo.createMultiple({
		items: data.roleIds.map((r) => ({
			userId: newUser.id,
			roleId: r,
		})),
	});

	return {
		error: undefined,
		data: newUser.id,
	};
};

export default createSingle;
