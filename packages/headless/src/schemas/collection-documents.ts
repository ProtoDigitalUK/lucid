import z from "zod";
import { BrickSchema, FieldSchema } from "./bricks.js";
import defaultQuery from "./default-query.js";

const slugRegex = /^[a-zA-Z0-9-_/]+$/;
const slugSchema = z
	.string()
	.refine(
		(slug) =>
			slug === null ||
			slug === undefined ||
			(typeof slug === "string" && slug.length === 0) ||
			(typeof slug === "string" &&
				slug.length >= 2 &&
				slugRegex.test(slug)),
		{
			message:
				"Slug must be at least 2 characters long and contain only letters, numbers, hyphens, and underscores",
		},
	);

const getMultipleQuerySchema = z.object({
	filter: z
		.object({
			collection_key: z
				.union([z.string(), z.array(z.string())])
				.optional(),
			slug: z.string().optional(),
			full_slug: z.string().optional(),
			category_id: z.union([z.string(), z.array(z.string())]).optional(),
		})
		.optional(),
	sort: z
		.array(
			z.object({
				key: z.enum(["created_at", "updated_at"]),
				value: z.enum(["asc", "desc"]),
			}),
		)
		.optional(),
	include: defaultQuery.include,
	exclude: defaultQuery.exclude,
	page: defaultQuery.page,
	per_page: defaultQuery.per_page,
});

export default {
	upsertSingle: {
		body: z.object({
			collection_key: z.string(),
			document_id: z.number().optional(),
			slug: slugSchema.optional(),
			homepage: z.boolean().optional(),
			parent_id: z.number().nullable().optional(),
			category_ids: z.array(z.number()).optional(),
			bricks: z.array(BrickSchema).optional(),
			fields: z.array(FieldSchema).optional(),
		}),
		query: undefined,
		params: undefined,
	},
	getSingle: {
		query: z.object({
			include: z.array(z.enum(["bricks"])).optional(),
		}),
		params: z.object({
			id: z.string(),
		}),
		body: undefined,
	},
	getMultiple: {
		query: getMultipleQuerySchema,
		params: undefined,
		body: undefined,
	},
	getMultipleValidParents: {
		query: getMultipleQuerySchema,
		params: z.object({
			id: z.string(),
		}),
		body: undefined,
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
		}),
	},
	deleteMultiple: {
		body: z.object({
			ids: z.array(z.number()),
		}),
		query: undefined,
		params: undefined,
	},
};
