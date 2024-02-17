import z from "zod";
import T from "../translations/index.js";

export default {
	getMe: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
	updateMe: {
		body: z.object({
			first_name: z.string().optional(),
			last_name: z.string().optional(),
			username: z.string().min(3).optional(),
			email: z.string().email().optional(),
			role_ids: z.array(z.number()).optional(),
		}),
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
				password: z.string().min(8),
				password_confirmation: z.string().min(8),
			})
			.refine((data) => data.password === data.password_confirmation, {
				message: T("please_ensure_passwords_match"),
				path: ["password_confirmation"],
			}),
		query: undefined,
		params: z.object({
			token: z.string(),
		}),
	},
};
