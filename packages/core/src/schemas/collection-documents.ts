import z from "zod";
import { BrickSchema } from "./collection-bricks.js";
import { FieldSchema } from "./collection-fields.js";
import defaultQuery, { filterSchemas } from "./default-query.js";

export default {
	updateDraft: {
		body: z.object({
			bricks: z.array(BrickSchema).optional(),
			fields: z.array(FieldSchema).optional(),
		}),
		query: undefined,
		params: z.object({
			collectionKey: z.string(),
			id: z.string(),
		}),
	},
	updatePublish: {
		body: z.object({
			bricks: z.array(BrickSchema).optional(),
			fields: z.array(FieldSchema).optional(),
		}),
		query: undefined,
		params: z.object({
			collectionKey: z.string(),
			id: z.string(),
		}),
	},
	createDraft: {
		body: z.object({
			bricks: z.array(BrickSchema).optional(),
			fields: z.array(FieldSchema).optional(),
		}),
		query: undefined,
		params: z.object({
			collectionKey: z.string(),
		}),
	},
	restoreRevision: {
		body: undefined,
		query: undefined,
		params: z.object({
			id: z.string(),
			versionId: z.string(),
			collectionKey: z.string(),
		}),
	},
	getSingle: {
		query: z.object({
			include: z.array(z.enum(["bricks"])).optional(),
		}),
		params: z.object({
			id: z.string(),
			statusOrId: z.union([
				z.literal("published"),
				z.literal("draft"),
				z.string(), // version id
			]),
			collectionKey: z.string(),
		}),
		body: undefined,
	},
	getMultiple: {
		query: z.object({
			filter: z
				.union([
					z.record(
						z.string(),
						z.union([filterSchemas.single, filterSchemas.union]),
					),
					z.object({
						documentId: z
							.union([filterSchemas.single, filterSchemas.union])
							.optional(),
						documentCreatedBy: z
							.union([filterSchemas.single, filterSchemas.union])
							.optional(),
						documentUpdatedBy: z
							.union([filterSchemas.single, filterSchemas.union])
							.optional(),
						documentCreatedAt: filterSchemas.single.optional(),
						documentUpdatedAt: filterSchemas.single.optional(),
					}),
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
			page: defaultQuery.page,
			perPage: defaultQuery.perPage,
		}),
		params: z.object({
			collectionKey: z.string(),
			status: z.enum(["published", "draft", "revision"]),
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
						z.record(
							z.string(),
							z.union([filterSchemas.single, filterSchemas.union]),
						),
						z.object({
							documentId: filterSchemas.single.optional(),
							documentCreatedBy: filterSchemas.single.optional(),
							documentUpdatedBy: filterSchemas.single.optional(),
							documentCreatedAt: filterSchemas.single.optional(),
							documentUpdatedAt: filterSchemas.single.optional(),
						}),
					])
					.optional(),
				include: z.array(z.enum(["bricks"])).optional(),
			}),
			params: z.object({
				collectionKey: z.string(),
				status: z.enum(["published", "draft"]),
			}),
			body: undefined,
		},
		getMultiple: {
			query: z.object({
				filter: z
					.union([
						z.record(
							z.string(),
							z.union([filterSchemas.single, filterSchemas.union]),
						),
						z.object({
							documentId: z
								.union([filterSchemas.single, filterSchemas.union])
								.optional(),
							documentCreatedBy: z
								.union([filterSchemas.single, filterSchemas.union])
								.optional(),
							documentUpdatedBy: z
								.union([filterSchemas.single, filterSchemas.union])
								.optional(),
							documentCreatedAt: filterSchemas.single.optional(),
							documentUpdatedAt: filterSchemas.single.optional(),
						}),
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
				page: defaultQuery.page,
				perPage: defaultQuery.perPage,
			}),
			params: z.object({
				collectionKey: z.string(),
				status: z.enum(["published", "draft"]),
			}),
			body: undefined,
		},
	},
};
