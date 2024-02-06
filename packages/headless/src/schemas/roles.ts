import z from "zod";
import defaultQuery from "./default-query.js";

export default {
	createSingle: {
		body: z.object({
			name: z.string().min(2),
			description: z.string().optional(),
			permission_groups: z.array(
				z.object({
					environment_key: z.string().optional(),
					permissions: z.array(z.string()),
				}),
			),
		}),
		query: undefined,
		params: undefined,
	},
	updateSingle: {
		body: z.object({
			name: z.string().min(2).optional(),
			permission_groups: z
				.array(
					z.object({
						environment_key: z.string().optional(),
						permissions: z.array(z.string()),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
	getMultiple: {
		body: undefined,
		query: z.object({
			filter: z
				.object({
					name: z.string().optional(),
					role_ids: z
						.union([z.string(), z.array(z.string())])
						.optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum(["created_at", "name"]),
						value: z.enum(["asc", "desc"]),
					}),
				)
				.optional(),
			include: z.array(z.enum(["permissions"])).optional(),
			page: defaultQuery.page,
			per_page: defaultQuery.per_page,
		}),
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
