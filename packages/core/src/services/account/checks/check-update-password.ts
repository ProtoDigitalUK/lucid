import T from "../../../translations/index.js";
import argon2 from "argon2";
import type { ServiceFn } from "../../../libs/services/types.js";

const checkPassed = (value: string | undefined) => {
	return value !== undefined && value.trim() !== "";
};

const checkUpdatePassword: ServiceFn<
	[
		{
			password: string; // the users hashed password
			currentPassword?: string;
			newPassword?: string;
			passwordConfirmation?: string;
		},
	],
	{
		newPassword: string | undefined;
		triggerPasswordReset: 0 | 1 | undefined;
	}
> = async (_, data) => {
	let newPassword = undefined;
	let triggerPasswordReset = undefined;

	// if current password is undefined/empty, and new password is passed
	if (
		checkPassed(data.newPassword) &&
		checkPassed(data.currentPassword) === false
	) {
		return {
			error: {
				type: "basic",
				message: T("please_provide_current_password"),
				status: 400,
				errorResponse: {
					body: {
						currentPassword: {
							code: "required",
							message: T("please_provide_current_password"),
						},
					},
				},
			},
			data: undefined,
		};
	}

	// if current password is passed, but new password is not
	if (
		checkPassed(data.currentPassword) &&
		checkPassed(data.newPassword) === false
	) {
		return {
			error: {
				type: "basic",
				message: T("please_provide_new_password"),
				status: 400,
				errorResponse: {
					body: {
						newPassword: {
							code: "required",
							message: T("please_provide_new_password"),
						},
					},
				},
			},
			data: undefined,
		};
	}

	if (!checkPassed(data.newPassword) && !checkPassed(data.currentPassword)) {
		return {
			error: undefined,
			data: {
				newPassword: newPassword,
				triggerPasswordReset: triggerPasswordReset,
			},
		};
	}

	// if new password does not match password confirmation
	if (data.newPassword !== data.passwordConfirmation) {
		return {
			error: {
				type: "basic",
				message: T("please_ensure_passwords_match"),
				status: 400,
				errorResponse: {
					body: {
						passwordConfirmation: {
							code: "invalid",
							message: T("please_ensure_passwords_match"),
						},
					},
				},
			},
			data: undefined,
		};
	}

	// set new password if it is given
	const passwordValid = await argon2.verify(
		data.password,
		data.currentPassword as string,
	);

	if (!passwordValid) {
		return {
			error: {
				type: "basic",
				message: T("please_ensure_password_is_correct"),
				status: 400,
				errorResponse: {
					body: {
						currentPassword: {
							code: "invalid",
							message: T("please_ensure_password_is_correct"),
						},
					},
				},
			},
			data: undefined,
		};
	}

	newPassword = await argon2.hash(data.newPassword as string);
	triggerPasswordReset = 0 as const;

	return {
		error: undefined,
		data: {
			newPassword: newPassword,
			triggerPasswordReset: triggerPasswordReset,
		},
	};
};

export default checkUpdatePassword;
