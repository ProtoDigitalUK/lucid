import z from "zod";
import defaultQuery from "./default-query.js";

export default {
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
	getMultiple: {
		query: z.object({
			filter: z
				.object({
					title: z.string().optional(),
					key: z.string().optional(),
					mime_type: z
						.union([z.string(), z.array(z.string())])
						.optional(),
					type: z.union([z.string(), z.array(z.string())]).optional(),
					file_extension: z
						.union([z.string(), z.array(z.string())])
						.optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum([
							"created_at",
							"updated_at",
							"title",
							"file_size",
							"width",
							"height",
							"mime_type",
							"file_extension",
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
	uploadSingle: {
		body: z.object({
			translations: z
				.array(
					z.object({
						language_id: z.number(),
						value: z.string().nullable(),
						key: z.enum(["title", "alt"]),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: undefined,
	},
	clearSingleProcessed: {
		body: undefined,
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
};
