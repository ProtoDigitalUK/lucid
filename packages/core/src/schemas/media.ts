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
					mimeType: z
						.union([z.string(), z.array(z.string())])
						.optional(),
					type: z.union([z.string(), z.array(z.string())]).optional(),
					fileExtension: z
						.union([z.string(), z.array(z.string())])
						.optional(),
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
							"fileExtension",
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
			titleTranslations: z
				.array(
					z.object({
						localeCode: z.string(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
			altTranslations: z
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
			titleTranslations: z
				.array(
					z.object({
						localeCode: z.string(),
						value: z.string().nullable(),
					}),
				)
				.optional(),
			altTranslations: z
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
			key: z.string(),
		}),
	},
	clearAllProcessed: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
};
