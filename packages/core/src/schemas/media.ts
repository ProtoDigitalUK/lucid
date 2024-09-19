import z from "zod";
import defaultQuery, { filterSchemas } from "./default-query.js";

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
					title: filterSchemas.single.optional(),
					key: filterSchemas.single.optional(),
					mimeType: filterSchemas.union.optional(),
					type: filterSchemas.union.optional(),
					extension: filterSchemas.union.optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum([
							"createdAt",
							"updatedAt",
							"title",
							"fileSize",
							"width",
							"height",
							"mimeType",
							"extension",
						]),
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
		body: undefined,
	},
	uploadSingle: {
		body: z.object({
			title: z
				.array(
					z.object({
						localeCode: z.string(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
			alt: z
				.array(
					z.object({
						localeCode: z.string(),
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
			title: z
				.array(
					z.object({
						localeCode: z.string(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
			alt: z
				.array(
					z.object({
						localeCode: z.string(),
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
	clearSingleProcessed: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
	clearAllProcessed: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
	getPresignedUrl: {
		body: z.object({
			fileName: z.string(),
			mimeType: z.string(),
			width: z.number().optional(),
			height: z.number().optional(),
		}),
		query: undefined,
		params: undefined,
	},
};
