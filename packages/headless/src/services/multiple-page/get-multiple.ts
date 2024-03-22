import z from "zod";
import { parseCount } from "../../utils/app/helpers.js";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import queryBuilder from "../../db/query-builder.js";
import multiplePageSchema from "../../schemas/multiple-page.js";
import formatMultiplePage from "../../format/format-multiple-page.js";
import collectionsServices from "../collections/index.js";

export interface ServiceData {
	query: z.infer<typeof multiplePageSchema.getMultiple.query>;
	language_id: number;
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	const pagesQuery = serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.select((eb) => [
			"headless_collection_multiple_page.id",
			"headless_collection_multiple_page.parent_id",
			"headless_collection_multiple_page.collection_key",
			"headless_collection_multiple_page.slug",
			"headless_collection_multiple_page.full_slug",
			"headless_collection_multiple_page.homepage",
			"headless_collection_multiple_page.created_by",
			"headless_collection_multiple_page.created_at",
			"headless_collection_multiple_page.updated_at",
			"headless_collection_multiple_page.published",
			"headless_collection_multiple_page.published_at",
			"headless_collection_multiple_page.title_translation_key_id",
			"headless_collection_multiple_page.excerpt_translation_key_id",
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
						"headless_collection_multiple_page.title_translation_key_id",
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
						"headless_collection_multiple_page.excerpt_translation_key_id",
					),
			).as("excerpt_translations"),
			jsonArrayFrom(
				eb
					.selectFrom("headless_collection_multiple_page_categories")
					.select("category_id")
					.whereRef(
						"headless_collection_multiple_page_categories.collection_multiple_page_id",
						"=",
						"headless_collection_multiple_page.id",
					),
			).as("categories"),
		])
		.leftJoin("headless_translations as title_translations", (join) =>
			join
				.onRef(
					"title_translations.translation_key_id",
					"=",
					"headless_collection_multiple_page.title_translation_key_id",
				)
				.on("title_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_translations as excerpt_translations", (join) =>
			join
				.onRef(
					"excerpt_translations.translation_key_id",
					"=",
					"headless_collection_multiple_page.excerpt_translation_key_id",
				)
				.on("excerpt_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_collection_multiple_page_categories", (join) =>
			join.onRef(
				"headless_collection_multiple_page_categories.collection_multiple_page_id",
				"=",
				"headless_collection_multiple_page.id",
			),
		)
		.innerJoin(
			"headless_users",
			"headless_users.id",
			"headless_collection_multiple_page.created_by",
		)
		.select([
			"title_translations.value as title_translation_value",
			"excerpt_translations.value as excerpt_translation_value",
			"headless_users.id as author_id",
			"headless_users.email as author_email",
			"headless_users.first_name as author_first_name",
			"headless_users.last_name as author_last_name",
			"headless_users.username as author_username",
		])
		.where("headless_collection_multiple_page.is_deleted", "=", false)
		.groupBy([
			"headless_collection_multiple_page.id",
			"title_translations.value",
			"excerpt_translations.value",
			"headless_users.id",
		]);

	const pagesCountQuery = serviceConfig.db
		.selectFrom("headless_collection_multiple_page")
		.select(sql`count(*)`.as("count"))
		.leftJoin("headless_translations as title_translations", (join) =>
			join
				.onRef(
					"title_translations.translation_key_id",
					"=",
					"headless_collection_multiple_page.title_translation_key_id",
				)
				.on("title_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_translations as excerpt_translations", (join) =>
			join
				.onRef(
					"excerpt_translations.translation_key_id",
					"=",
					"headless_collection_multiple_page.excerpt_translation_key_id",
				)
				.on("excerpt_translations.language_id", "=", data.language_id),
		)
		.leftJoin("headless_collection_multiple_page_categories", (join) =>
			join.onRef(
				"headless_collection_multiple_page_categories.collection_multiple_page_id",
				"=",
				"headless_collection_multiple_page.id",
			),
		)
		.innerJoin(
			"headless_users",
			"headless_users.id",
			"headless_collection_multiple_page.created_by",
		)
		.select([
			"title_translations.value as title_translation_value",
			"excerpt_translations.value as excerpt_translation_value",
			"headless_users.id as author_id",
			"headless_users.email as author_email",
			"headless_users.first_name as author_first_name",
			"headless_users.last_name as author_last_name",
			"headless_users.username as author_username",
		])
		.where("headless_collection_multiple_page.is_deleted", "=", false)
		.groupBy([
			"headless_collection_multiple_page.id",
			"title_translations.value",
			"excerpt_translations.value",
			"headless_users.id",
		]);

	const { main, count } = queryBuilder(
		{
			main: pagesQuery,
			count: pagesCountQuery,
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
						operator: "%",
					},
					{
						queryKey: "full_slug",
						tableKey: "full_slug",
						operator: "%",
					},
					{
						queryKey: "category_id",
						tableKey:
							"headless_collection_multiple_page_categories.category_id",
						operator: "=",
					},
				],
				sorts: [
					{
						queryKey: "title",
						tableKey: "title_translations.value",
					},
					{
						queryKey: "created_at",
						tableKey: "created_at",
					},
					{
						queryKey: "updated_at",
						tableKey: "updated_at",
					},
					{
						queryKey: "published_at",
						tableKey: "published_at",
					},
				],
			},
		},
	);

	const [pages, pagesCount] = await Promise.all([
		main.execute(),
		count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
	]);

	const collections = await collectionsServices.getAll();

	return {
		data: pages.map((page) => {
			const collection = collections.find(
				(c) => c.key === page.collection_key,
			);
			return formatMultiplePage(page, collection);
		}),
		count: parseCount(pagesCount?.count),
	};
};

export default getMultiple;
