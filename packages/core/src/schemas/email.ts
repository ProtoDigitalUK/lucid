import z from "zod";
import defaultQuery, { filterSchemas } from "./default-query.js";

export default {
	getMultiple: {
		body: undefined,
		query: z.object({
			filter: z
				.object({
					toAddress: filterSchemas.single.optional(),
					subject: filterSchemas.single.optional(),
					deliveryStatus: filterSchemas.union.optional(),
					type: filterSchemas.union.optional(), // internal | external
					template: filterSchemas.single.optional(),
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
