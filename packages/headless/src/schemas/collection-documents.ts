import z from "zod";
import { BrickSchema } from "./collection-bricks.js";
import { FieldSchemaCollection } from "./collection-fields.js";
import defaultQuery from "./default-query.js";

const getMultipleQuerySchema = z.object({
	filter: z
		.object({
			cf: z.union([z.string(), z.array(z.string())]).optional(),
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
			document_id: z.number().optional(),
			bricks: z.array(BrickSchema).optional(),
			fields: z.array(FieldSchemaCollection).optional(),
		}),
		query: undefined,
		params: z.object({
			collection_key: z.string(),
		}),
	},
	getSingle: {
		query: z.object({
			include: z.array(z.enum(["bricks"])).optional(),
		}),
		params: z.object({
			id: z.string(),
			collection_key: z.string(),
		}),
		body: undefined,
	},
	getMultiple: {
		query: getMultipleQuerySchema,
		params: z.object({
			collection_key: z.string(),
		}),
		body: undefined,
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			collection_key: z.string(),
			id: z.string(),
		}),
	},
	deleteMultiple: {
		body: z.object({
			ids: z.array(z.number()),
		}),
		query: undefined,
		params: z.object({
			collection_key: z.string(),
		}),
	},
};
