import type z from "zod";
import type collectionCategoriesSchema from "../../schemas/collection-categories.js";
import queryBuilder from "../../db/query-builder.js";
import { sql } from "kysely";
import { parseCount } from "../../utils/helpers.js";
import formatCollectionCategories from "../../format/format-collection-categories.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export interface ServiceData {
	query: z.infer<typeof collectionCategoriesSchema.getMultiple.query>;
	language_id: number;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const categoryQuery = serviceConfig.db
		.selectFrom("headless_collection_categories")
		.select((eb) => [
			"headless_collection_categories.id",
			"headless_collection_categories.collection_key",
			"headless_collection_categories.slug",
			"headless_collection_categories.title_translation_key_id",
			"headless_collection_categories.description_translation_key_id",
			"headless_collection_categories.created_at",
			"headless_collection_categories.updated_at",
			jsonArrayFrom(
				eb
					.selectFrom("headless_translations")
					.select([
						"headless_translations.value",
						"headless_translations.language_id",
					])
					.where("headless_translations.value", "is not", null)
					.whereRef(
						"headless_translations.translation_key_id",
						"=",
						"headless_collection_categories.title_translation_key_id",
					),
			).as("title_translations"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_translations")
					.select([
						"headless_translations.value",
						"headless_translations.language_id",
					])
					.where("headless_translations.value", "is not", null)
					.whereRef(
						"headless_translations.translation_key_id",
						"=",
						"headless_collection_categories.description_translation_key_id",
					),
			).as("description_translations"),
		])
		.leftJoin("headless_translations as title_translations", (join) =>
			join
				.onRef(
					"title_translations.translation_key_id",
					"=",
					"headless_collection_categories.title_translation_key_id",
				)
				.on("title_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_translations as description_translations", (join) =>
			join
				.onRef(
					"description_translations.translation_key_id",
					"=",
					"headless_collection_categories.description_translation_key_id",
				)
				.on(
					"description_translations.language_id",
					"=",
					data.language_id,
				),
		)
		.select([
			"title_translations.value as title_translation_value",
			"description_translations.value as description_translation_value",
		])
		.groupBy([
			"headless_collection_categories.id",
			"title_translations.value",
			"description_translations.value",
		]);

	const categoryCountQuery = serviceConfig.db
		.selectFrom("headless_collection_categories")
		.select(sql`count(*)`.as("count"))
		.leftJoin("headless_translations as title_translations", (join) =>
			join
				.onRef(
					"title_translations.translation_key_id",
					"=",
					"headless_collection_categories.title_translation_key_id",
				)
				.on("title_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_translations as description_translations", (join) =>
			join
				.onRef(
					"description_translations.translation_key_id",
					"=",
					"headless_collection_categories.description_translation_key_id",
				)
				.on(
					"description_translations.language_id",
					"=",
					data.language_id,
				),
		)
		.select([
			"title_translations.value as title_translation_value",
			"description_translations.value as description_translation_value",
		])
		.groupBy([
			"headless_collection_categories.id",
			"title_translations.value",
			"description_translations.value",
		]);

	const { main, count } = queryBuilder(
		{
			main: categoryQuery,
			count: categoryCountQuery,
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
						queryKey: "title",
						tableKey: "title_translations.value",
						operator: "%",
					},
					{
						queryKey: "collection_key",
						tableKey: "collection_key",
						operator: "=",
					},
					{
						queryKey: "slug",
						tableKey: "slug",
						operator: "=",
					},
				],
				sorts: [
					{
						queryKey: "title",
						tableKey: "title_translations.value",
					},
					{
						queryKey: "slug",
						tableKey: "slug",
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

	const [categories, categoriesCount] = await Promise.all([
		main.execute(),
		count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
	]);

	return {
		data: categories.map((category) =>
			formatCollectionCategories(category),
		),
		count: parseCount(categoriesCount?.count),
	};
};

export default getMultiple;
