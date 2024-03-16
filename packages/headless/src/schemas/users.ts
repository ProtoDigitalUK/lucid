import T from "../translations/index.js";
import z from "zod";

export default {
	createSingle: {
		body: z
			.object({
				email: z.string().email(),
				username: z.string(),
				password: z.string().min(8).max(128),
				password_confirmation: z.string().min(8).max(128),
				role_ids: z.array(z.number()),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				super_admin: z.boolean().optional(),
			})
			.refine((data) => data.password === data.password_confirmation, {
				message: T("please_ensure_passwords_match"),
				path: ["password_confirmation"],
			}),
		query: undefined,
		params: undefined,
	},
	getSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
};
