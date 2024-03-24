import z from "zod";
import defaultQuery from "./default-query.js";

export default {
	createSingle: {
		body: z.object({
			collection_key: z.string(),
			slug: z.string(),
			title_translations: z.array(
				z.object({
					language_id: z.number(),
					value: z.string().nullable(),
				}),
			),
			description_translations: z
				.array(
					z.object({
						language_id: z.number(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: undefined,
	},
	updateSingle: {
		body: z.object({
			slug: z.string().optional(),
			title_translations: z
				.array(
					z.object({
						language_id: z.number(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
			description_translations: z
				.array(
					z.object({
						language_id: z.number(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
		}),
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
					collection_key: z.string().optional(),
					slug: z.string().optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum([
							"created_at",
							"updated_at",
							"title",
							"slug",
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
		body: undefined,
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
};
