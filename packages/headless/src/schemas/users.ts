import T from "../translations/index.js";
import defaultQuery from "./default-query.js";
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
	getMultiple: {
		query: z.object({
			filter: z
				.object({
					first_name: z.string().optional(),
					last_name: z.string().optional(),
					email: z.string().optional(),
					username: z.string().optional(),
					role_ids: z
						.union([z.array(z.string()), z.string()])
						.optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum([
							"created_at",
							"updated_at",
							"first_name",
							"last_name",
							"email",
							"username",
						]),
						value: z.enum(["asc", "desc"]),
					}),
				)
				.optional(),
			include: z.array(z.enum(["permissions"])).optional(),
			exclude: defaultQuery.exclude,
			page: defaultQuery.page,
			per_page: defaultQuery.per_page,
		}),
		params: undefined,
		body: undefined,
	},
};
