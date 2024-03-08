import z from "zod";
import defaultQuery from "./default-query.js";

export default {
	getAll: {
		body: undefined,
		query: undefined,
		params: undefined,
	},
	getSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
	updateSingle: {
		body: z.object({
			slug: z.string().optional(),
			title: z.string().optional(),
			singular: z.string().optional(),
			description: z.string().optional().nullable(),
			disable_homepages: z.boolean().optional(),
			disable_parents: z.boolean().optional(),
			bricks: z
				.array(
					z.object({
						key: z.string(),
						type: z.enum(["builder", "fixed"]),
						position: z.enum(["top", "bottom", "sidebar"]),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
	createSingle: {
		body: z.object({
			key: z
				.string()
				.min(4)
				.max(128)
				.refine((value) => /^[a-z-]+$/.test(value), {
					message:
						"Invalid key format. Only lowercase letters and dashes are allowed.",
				}),
			type: z.enum(["multiple-builder", "single-builder"]),
			slug: z.string().optional(),
			title: z.string(),
			singular: z.string(),
			description: z.string().optional(),
			disable_homepages: z.boolean().optional(),
			disable_parents: z.boolean().optional(),
			bricks: z
				.array(
					z.object({
						key: z.string(),
						type: z.enum(["builder", "fixed"]),
						position: z
							.enum(["top", "bottom", "sidebar"])
							.optional(),
					}),
				)
				.optional(),
		}),
		query: undefined,
		params: undefined,
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			key: z.string(),
		}),
	},
	getMultiple: {
		body: undefined,
		query: z.object({
			filter: z
				.object({
					type: z
						.enum(["single-builder", "multiple-builder"])
						.optional(),
				})
				.optional(),
			sort: z
				.array(
					z.object({
						key: z.enum(["created_at", "title", "updated_at"]),
						value: z.enum(["asc", "desc"]),
					}),
				)
				.optional(),
			include: z.array(z.enum(["bricks"])).optional(),
			exclude: defaultQuery.exclude,
			page: defaultQuery.page,
			per_page: defaultQuery.per_page,
		}),
		params: undefined,
	},
};
