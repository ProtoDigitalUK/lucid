import z from "zod";
import defaultQuery from "./default-query.js";

export default {
	getMultiple: {
		body: undefined,
		query: z.object({
			filter: z
				.object({
					to_address: z.string().optional(),
					subject: z.string().optional(),
					delivery_status: z
						.union([z.string(), z.array(z.string())])
						.optional(),
					type: z.union([z.string(), z.array(z.string())]).optional(), // internal | external
					template: z.string().optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum([
							"last_attempt_at",
							"last_success_at",
							"created_at",
							"sent_count",
							"error_count",
						]),
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
	},
	getSingle: {
		body: undefined,
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
	resendSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
};
