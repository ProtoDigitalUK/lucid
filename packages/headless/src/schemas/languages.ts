import z from "zod";
import defaultQuery from "./default-query.js";

export default {
	createSingle: {
		body: z.object({
			code: z.string().min(2),
			is_default: z.boolean(),
			is_enabled: z.boolean(),
		}),
		query: undefined,
		params: undefined,
	},
	getSingle: {
		query: undefined,
		params: z.object({
			code: z.string().min(2),
		}),
		body: undefined,
	},
	getMultiple: {
		query: z.object({
			filter: defaultQuery.filter,
			sort: z
				.array(
					z.object({
						key: z.enum(["created_at", "code", "updated_at"]),
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
	updateSingle: {
		body: z.object({
			code: z.string().min(2).optional(),
			is_default: z.boolean().optional(),
			is_enabled: z.boolean().optional(),
		}),
		query: undefined,
		params: z.object({
			code: z.string().min(2),
		}),
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			code: z.string().min(2),
		}),
	},
};
