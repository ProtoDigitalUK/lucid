import z from "zod";
import defaultQuery from "./default-query.js";

export default {
	createSingle: {
		body: z.object({
			code: z.string().min(2),
			is_default: z.union([z.literal(1), z.literal(0)]),
			is_enabled: z.union([z.literal(1), z.literal(0)]),
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
			include: defaultQuery.include,
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
			is_default: z.union([z.literal(1), z.literal(0)]).optional(),
			is_enabled: z.union([z.literal(1), z.literal(0)]).optional(),
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
