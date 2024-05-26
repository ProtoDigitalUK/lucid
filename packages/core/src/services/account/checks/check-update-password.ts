import T from "../../../translations/index.js";
import argon2 from "argon2";
import { LucidAPIError } from "../../../utils/error-handler.js";
import type { ServiceConfig } from "../../../utils/service-wrapper.js";

export interface ServiceData {
	password: string; // the users hashed password
	currentPassword?: string;
	newPassword?: string;
	passwordConfirmation?: string;
}

const checkPassed = (value: string | undefined) => {
	return value !== undefined && value.trim() !== "";
};

const checkUpdatePassword = async (
	serviceConfig: ServiceConfig,
	data: ServiceData,
) => {
	let newPassword = undefined;
	let triggerPasswordReset = undefined;

	// if current password is undefined/empty, and new password is passed
	if (
		checkPassed(data.newPassword) &&
		checkPassed(data.currentPassword) === false
	) {
		throw new LucidAPIError({
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
		});
	}

	// if current password is passed, but new password is not
	if (
		checkPassed(data.currentPassword) &&
		checkPassed(data.newPassword) === false
	) {
		throw new LucidAPIError({
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
		});
	}

	if (!checkPassed(data.newPassword) && !checkPassed(data.currentPassword)) {
		return {
			newPassword,
			triggerPasswordReset,
		};
	}

	// if new password does not match password confirmation
	if (data.newPassword !== data.passwordConfirmation) {
		throw new LucidAPIError({
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
		});
	}

	// set new password if it is given
	const passwordValid = await argon2.verify(
		data.password,
		data.currentPassword as string,
	);

	if (!passwordValid) {
		throw new LucidAPIError({
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
		});
	}

	newPassword = await argon2.hash(data.newPassword as string);
	triggerPasswordReset = 0 as const;

	return {
		newPassword,
		triggerPasswordReset,
	};
};

export default checkUpdatePassword;
