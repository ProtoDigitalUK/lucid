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
				passwordConfirmation: z.string().min(8).max(128),
				roleIds: z.array(z.number()),
				firstName: z.string().optional(),
				lastName: z.string().optional(),
				superAdmin: z.union([z.literal(1), z.literal(0)]).optional(),
			})
			.refine((data) => data.password === data.passwordConfirmation, {
				message: T("please_ensure_passwords_match"),
				path: ["passwordConfirmation"],
			}),
		query: undefined,
		params: undefined,
	},
	updateSingle: {
		body: z.object({
			roleIds: z.array(z.number()).optional(),
			superAdmin: z.union([z.literal(1), z.literal(0)]).optional(),
		}),
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
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
					firstName: z.string().optional(),
					lastName: z.string().optional(),
					email: z.string().optional(),
					username: z.string().optional(),
					roleIds: z
						.union([z.array(z.string()), z.string()])
						.optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum([
							"createdAt",
							"updatedAt",
							"firstName",
							"lastName",
							"email",
							"username",
						]),
						value: z.enum(["asc", "desc"]),
					}),
				)
				.optional(),
			include: z.array(z.enum(["permissions"])).optional(),
			exclude: z.array(z.enum(["current"])).optional(),
			page: defaultQuery.page,
			perPage: defaultQuery.perPage,
		}),
		params: undefined,
		body: undefined,
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
};
