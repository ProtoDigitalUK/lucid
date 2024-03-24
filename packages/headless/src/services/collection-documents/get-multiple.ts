import type z from "zod";
import { parseCount } from "../../utils/helpers.js";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import queryBuilder from "../../db/query-builder.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import formatCollectionDocument from "../../format/format-collection-document.js";
import collectionsServices from "../collections/index.js";

export interface ServiceData {
	query: z.infer<typeof collectionDocumentsSchema.getMultiple.query>;
	language_id: number; // TODO: will be used for field joins
	in_ids?: number[];
}

const getMultiple = async (
	serviceConfig: ServiceConfigT,
	data: ServiceData,
) => {
	let pagesQuery = serviceConfig.db
		.selectFrom("headless_collection_documents")
		.select((eb) => [
			"headless_collection_documents.id",
			"headless_collection_documents.parent_id",
			"headless_collection_documents.collection_key",
			"headless_collection_documents.slug",
			"headless_collection_documents.full_slug",
			"headless_collection_documents.homepage",
			"headless_collection_documents.created_by",
			"headless_collection_documents.created_at",
			"headless_collection_documents.updated_at",
			jsonArrayFrom(
				eb
					.selectFrom("headless_collection_document_categories")
					.select("category_id")
					.whereRef(
						"headless_collection_document_categories.collection_document_id",
						"=",
						"headless_collection_documents.id",
					),
			).as("categories"),
		])
		.leftJoin("headless_collection_document_categories", (join) =>
			join.onRef(
				"headless_collection_document_categories.collection_document_id",
				"=",
				"headless_collection_documents.id",
			),
		)
		.innerJoin(
			"headless_users",
			"headless_users.id",
			"headless_collection_documents.created_by",
		)
		.select([
			"headless_users.id as author_id",
			"headless_users.email as author_email",
			"headless_users.first_name as author_first_name",
			"headless_users.last_name as author_last_name",
			"headless_users.username as author_username",
		])
		.where("headless_collection_documents.is_deleted", "=", false);

	let pagesCountQuery = serviceConfig.db
		.selectFrom("headless_collection_documents")
		.select(sql`count(*)`.as("count"))
		.leftJoin("headless_collection_document_categories", (join) =>
			join.onRef(
				"headless_collection_document_categories.collection_document_id",
				"=",
				"headless_collection_documents.id",
			),
		)
		.innerJoin(
			"headless_users",
			"headless_users.id",
			"headless_collection_documents.created_by",
		)
		.where("headless_collection_documents.is_deleted", "=", false);

	if (data.in_ids !== undefined && data.in_ids.length > 0) {
		pagesQuery = pagesQuery.where(
			"headless_collection_documents.id",
			"in",
			data.in_ids,
		);
		pagesCountQuery = pagesCountQuery.where(
			"headless_collection_documents.id",
			"in",
			data.in_ids,
		);
	}

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
							"headless_collection_document_categories.category_id",
						operator: "=",
					},
				],
				sorts: [
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
			return formatCollectionDocument(page, collection);
		}),
		count: parseCount(pagesCount?.count),
	};
};

export default getMultiple;
