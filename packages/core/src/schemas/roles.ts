import z from "zod";
import defaultQuery, { filterSchemas } from "./default-query.js";

export default {
	createSingle: {
		body: z.object({
			name: z.string().min(2),
			description: z.string().optional(),
			permissions: z.array(z.string()),
		}),
		query: undefined,
		params: undefined,
	},
	updateSingle: {
		body: z.object({
			name: z.string().min(2).optional(),
			description: z.string().optional(),
			permissions: z.array(z.string()).optional(),
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
					name: filterSchemas.single.optional(),
					roleIds: filterSchemas.union.optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum(["createdAt", "name"]),
						value: z.enum(["asc", "desc"]),
					}),
				)
				.optional(),
			include: z.array(z.enum(["permissions"])).optional(),
			exclude: defaultQuery.exclude,
			page: defaultQuery.page,
			perPage: defaultQuery.perPage,
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
