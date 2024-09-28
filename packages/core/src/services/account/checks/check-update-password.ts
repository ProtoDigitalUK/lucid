import T from "../../../translations/index.js";
import argon2 from "argon2";
import generateSecret from "../../../utils/helpers/generate-secret.js";
import { decrypt } from "../../../utils/helpers/encrypt-decrypt.js";
import type { ServiceFn } from "../../../utils/services/types.js";

const checkPassed = (value: string | undefined) => {
	return value !== undefined && value.trim() !== "";
};

const checkUpdatePassword: ServiceFn<
	[
		{
			encryptedSecret: string;
			password: string; // the users hashed password
			currentPassword?: string;
			newPassword?: string;
			passwordConfirmation?: string;
			encryptionKey: string;
		},
	],
	{
		newPassword: string | undefined;
		triggerPasswordReset: 0 | 1 | undefined;
		encryptSecret: string | undefined;
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
				encryptSecret: undefined,
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
		{
			secret: Buffer.from(decrypt(data.encryptedSecret, data.encryptionKey)),
		},
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

	const { secret, encryptSecret } = generateSecret(data.encryptionKey);

	newPassword = await argon2.hash(data.newPassword as string, {
		secret: Buffer.from(secret),
	});
	triggerPasswordReset = 0 as const;

	return {
		error: undefined,
		data: {
			newPassword: newPassword,
			triggerPasswordReset: triggerPasswordReset,
			encryptSecret: encryptSecret,
		},
	};
};

export default checkUpdatePassword;
