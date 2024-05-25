import z from "zod";
import T from "../translations/index.js";

export default {
	getMe: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
	updateMe: {
		body: z
			.object({
				firstName: z.string().optional(),
				lastName: z.string().optional(),
				username: z.string().min(3).optional(),
				email: z.string().email().optional(),
				currentPassword: z.string().optional(),
				newPassword: z.string().min(8).max(128).optional(),
				passwordConfirmation: z.string().min(8).max(128).optional(),
			})
			.refine(
				(data) =>
					!(
						data.newPassword !== undefined &&
						(!data.currentPassword || data.currentPassword === "")
					),
				{
					message: T("please_provide_current_password"),
					path: ["currentPassword"],
				},
			)
			.refine(
				(data) =>
					!data.currentPassword || data.newPassword !== undefined,
				{
					message: T("please_provide_new_password"),
					path: ["newPassword"],
				},
			)
			.refine(
				(data) =>
					!data.newPassword ||
					data.newPassword === data.passwordConfirmation,
				{
					message: T("please_ensure_passwords_match"),
					path: ["passwordConfirmation"],
				},
			),
		query: undefined,
		params: undefined,
	},
	sendResetPassword: {
		body: z.object({
			email: z.string().email(),
		}),
		query: undefined,
		params: undefined,
	},
	verifyResetPassword: {
		body: undefined,
		query: undefined,
		params: z.object({
			token: z.string(),
		}),
	},
	resetPassword: {
		body: z
			.object({
				password: z.string().min(8).max(128),
				passwordConfirmation: z.string().min(8).max(128),
			})
			.refine((data) => data.password === data.passwordConfirmation, {
				message: T("please_ensure_passwords_match"),
				path: ["passwordConfirmation"],
			}),
		query: undefined,
		params: z.object({
			token: z.string(),
		}),
	},
};
