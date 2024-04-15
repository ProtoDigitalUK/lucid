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
				key: z.enum(["createdAt", "updatedAt"]),
				value: z.enum(["asc", "desc"]),
			}),
		)
		.optional(),
	include: defaultQuery.include,
	exclude: defaultQuery.exclude,
	page: defaultQuery.page,
	perPage: defaultQuery.perPage,
});

export default {
	upsertSingle: {
		body: z.object({
			documentId: z.number().optional(),
			bricks: z.array(BrickSchema).optional(),
			fields: z.array(FieldSchemaCollection).optional(),
		}),
		query: undefined,
		params: z.object({
			collectionKey: z.string(),
		}),
	},
	getSingle: {
		query: z.object({
			include: z.array(z.enum(["bricks"])).optional(),
		}),
		params: z.object({
			id: z.string(),
			collectionKey: z.string(),
		}),
		body: undefined,
	},
	getMultiple: {
		query: getMultipleQuerySchema,
		params: z.object({
			collectionKey: z.string(),
		}),
		body: undefined,
	},
	deleteSingle: {
		body: undefined,
		query: undefined,
		params: z.object({
			collectionKey: z.string(),
			id: z.string(),
		}),
	},
	deleteMultiple: {
		body: z.object({
			ids: z.array(z.number()),
		}),
		query: undefined,
		params: z.object({
			collectionKey: z.string(),
		}),
	},
};
