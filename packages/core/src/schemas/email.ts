import z from "zod";
import defaultQuery from "./default-query.js";

export default {
	getMultiple: {
		body: undefined,
		query: z.object({
			filter: z
				.object({
					toAddress: z.string().optional(),
					subject: z.string().optional(),
					deliveryStatus: z
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
							"lastAttemptAt",
							"lastSuccessAt",
							"createdAt",
							"sentCount",
							"errorCount",
						]),
						value: z.enum(["asc", "desc"]),
					}),
				)
				.optional(),
			include: defaultQuery.include,
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
