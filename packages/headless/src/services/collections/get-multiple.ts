import z from "zod";
import collectionsSchema from "../../schemas/collections.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import formatCollection from "../../format/format-collection.js";
import getConfig from "../config.js";
import queryBuilder from "../../db/query-builder.js";
import { sql } from "kysely";
import { parseCount } from "../../utils/app/helpers.js";

export interface ServiceData {
	query: z.infer<typeof collectionsSchema.getMultiple.query>;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let collectionQuery = serviceConfig.db
		.selectFrom("headless_collections")
		.select([
			"key",
			"title",
			"singular",
			"description",
			"type",
			"slug",
			"created_at",
			"updated_at",
			"disable_homepages",
			"disable_parents",
		]);

	if (data.query.include?.includes("bricks")) {
		collectionQuery = collectionQuery.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom("headless_collections_assigned_bricks")
					.select([
						"headless_collections_assigned_bricks.key",
						"headless_collections_assigned_bricks.type",
						"headless_collections_assigned_bricks.position",
					])
					.whereRef(
						"headless_collections_assigned_bricks.collection_key",
						"=",
						"headless_collections.key",
					),
			).as("bricks"),
		]);
	}

	const collectionCountQuery = serviceConfig.db
		.selectFrom("headless_collections")
		.select(sql`count(*)`.as("count"));

	const { main, count } = queryBuilder(
		{
			main: collectionQuery,
			count: collectionCountQuery,
		},
		{
			requestQuery: {
				filter: data.query.filter,
				sort: data.query.sort,
				include: data.query.include,
				exclude: data.query.exclude,
				page: data.query.page,
				per_page: data.query.per_page,
			},
			meta: {
				filters: [
					{
						queryKey: "type",
						tableKey: "type",
						operator: "=",
					},
				],
				sorts: [
					{
						queryKey: "title",
						tableKey: "title",
					},
					{
						queryKey: "created_at",
						tableKey: "created_at",
					},
					{
						queryKey: "updated_at",
						tableKey: "updated_at",
					},
				],
			},
		},
	);

	const [collections, collectionsCount] = await Promise.all([
		main.execute(),
		count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
	]);

	const config = await getConfig();

	return {
		data: collections.map((collection) =>
			formatCollection(collection, config.bricks),
		),
		count: parseCount(collectionsCount?.count),
	};
};

export default getMultiple;
