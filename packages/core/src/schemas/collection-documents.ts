import z from "zod";
import { BrickSchema } from "./collection-bricks.js";
import { FieldSchema } from "./collection-fields.js";
import defaultQuery, { filterSchemas } from "./default-query.js";

export default {
	upsertSingle: {
		body: z.object({
			documentId: z.number().optional(),
			bricks: z.array(BrickSchema).optional(),
			fields: z.array(FieldSchema).optional(),
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
		query: z.object({
			filter: z
				.union([
					z.object({
						documentId: filterSchemas.single.optional(),
						documentCreatedBy: filterSchemas.single.optional(),
						documentUpdatedBy: filterSchemas.single.optional(),
						documentCreatedAt: filterSchemas.single.optional(),
						documentUpdatedAt: filterSchemas.single.optional(),
					}),
					z.record(
						z.string(),
						z.union([filterSchemas.single, filterSchemas.union]),
					),
				])
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
		}),
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
	client: {
		getSingle: {
			query: z.object({
				filter: z
					.union([
						z.object({
							documentId: filterSchemas.single.optional(),
							documentCreatedBy: filterSchemas.single.optional(),
							documentUpdatedBy: filterSchemas.single.optional(),
							documentCreatedAt: filterSchemas.single.optional(),
							documentUpdatedAt: filterSchemas.single.optional(),
						}),
						z.record(
							z.string(),
							z.union([
								filterSchemas.single,
								filterSchemas.union,
							]),
						),
					])
					.optional(),
				include: z.array(z.enum(["bricks"])).optional(),
			}),
			params: undefined,
			body: undefined,
		},
	},
};
