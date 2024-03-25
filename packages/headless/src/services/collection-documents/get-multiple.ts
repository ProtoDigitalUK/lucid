import type z from "zod";
import { parseCount } from "../../utils/helpers.js";
import { type SelectQueryBuilder, sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import queryBuilder from "../../db/query-builder.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import formatCollectionDocument from "../../format/format-collection-document.js";
import collectionsServices from "../collections/index.js";
import type { DB } from "kysely-codegen";
import type { RequestQueryParsedT } from "../../middleware/validate-query.js";

export interface ServiceData {
	collection_key: string;
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
		.where("headless_collection_documents.is_deleted", "=", false)
		.groupBy(["headless_collection_documents.id", "headless_users.id"]);

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
		.where("headless_collection_documents.is_deleted", "=", false)
		.groupBy(["headless_collection_documents.id", "headless_users.id"]);

	// Filer by specified document ids
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

	// TODO: fix types
	const cFQueries = await customFieldQueryBuilder({
		collection_key: data.collection_key,
		filter: data.query.filter,
		queries: {
			main: pagesQuery,
			count: pagesCountQuery,
		},
	});

	const { main, count } = queryBuilder(
		{
			main: cFQueries.main,
			count: cFQueries.count,
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
						// @ts-ignore
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

	const collections = await collectionsServices.getAll(serviceConfig, {
		include_document_id: false,
	});

	return {
		data: pages.map((page) => {
			const collection = collections.find(
				// @ts-ignore
				(c) => c.key === page.collection_key,
			);
			// @ts-ignore
			return formatCollectionDocument(page, collection);
		}),
		count: parseCount(pagesCount?.count),
	};
};

interface CustomFieldQueryBuilderT {
	collection_key: string;
	filter: RequestQueryParsedT["filter"];
	queries: {
		main: SelectQueryBuilder<DB, "headless_collection_documents", unknown>;
		count: SelectQueryBuilder<
			DB,
			"headless_collection_documents",
			{ count: unknown }
		>;
	};
}

const customFieldQueryBuilder = async (params: CustomFieldQueryBuilderT) => {
	const collectionInstance = await collectionsServices.getSingleInstance({
		key: params.collection_key,
	});

	const allowedIncludes = collectionInstance.data.config.fields.include;
	const allowedFilters = collectionInstance.data.config.fields.filter;

	if (allowedIncludes.length === 0) {
		return {
			main: params.queries.main,
			count: params.queries.count,
		};
	}

	let mainQuery = params.queries.main
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom("headless_collection_document_fields")
					.select([
						"headless_collection_document_fields.text_value",
						"headless_collection_document_fields.int_value",
						"headless_collection_document_fields.bool_value",
						"headless_collection_document_fields.language_id",
						"headless_collection_document_fields.type",
						"headless_collection_document_fields.key",
					])
					.whereRef(
						"headless_collection_document_fields.collection_document_id",
						"=",
						"headless_collection_documents.id",
					)
					.where(
						"headless_collection_document_fields.key",
						"in",
						allowedIncludes,
					),
			).as("fields"),
		])
		.leftJoin(
			"headless_collection_document_fields",
			"headless_collection_document_fields.collection_document_id",
			"headless_collection_documents.id",
		);

	let countQuery = params.queries.count
		.select((eb) => [
			jsonArrayFrom(
				eb
					.selectFrom("headless_collection_document_fields")
					.select([
						"headless_collection_document_fields.text_value",
						"headless_collection_document_fields.int_value",
						"headless_collection_document_fields.bool_value",
						"headless_collection_document_fields.language_id",
						"headless_collection_document_fields.type",
						"headless_collection_document_fields.key",
					])
					.whereRef(
						"headless_collection_document_fields.collection_document_id",
						"=",
						"headless_collection_documents.id",
					)
					.where(
						"headless_collection_document_fields.key",
						"in",
						allowedIncludes,
					),
			).as("fields"),
		])
		.leftJoin(
			"headless_collection_document_fields",
			"headless_collection_document_fields.collection_document_id",
			"headless_collection_documents.id",
		);

	let fieldFilters = params.filter?.fields;
	if (fieldFilters === undefined) {
		return {
			main: mainQuery,
			count: countQuery,
		};
	}

	if (typeof fieldFilters === "string") {
		fieldFilters = [fieldFilters];
	}

	const filterKeyValues: Array<{
		key: string;
		value: string | string[];
	}> = [];
	for (const key of allowedFilters) {
		const filterValue = fieldFilters.filter((filter) =>
			filter.startsWith(`${key}=`),
		);

		if (filterValue) {
			const keyValues = filterValue
				.map((filter) => filter.split("=")[1])
				.filter((v) => v !== "");

			if (keyValues.length === 0) continue;

			filterKeyValues.push({
				key,
				value: keyValues.length > 1 ? keyValues : keyValues[0],
			});
		}
	}

	for (const { key, value } of filterKeyValues) {
		console.log("key", key);
		console.log("value", value);
		mainQuery = mainQuery.where(({ eb, and }) =>
			and([
				eb("headless_collection_document_fields.key", "=", key),
				eb(
					// TODO: text_value needs replacing based on cusotm field type
					"headless_collection_document_fields.text_value",
					Array.isArray(value) ? "in" : "=",
					value,
				),
			]),
		);
		countQuery = countQuery.where(({ eb, and }) =>
			and([
				eb("headless_collection_document_fields.key", "=", key),
				eb(
					// TODO: text_value needs replacing based on cusotm field type
					"headless_collection_document_fields.text_value",
					Array.isArray(value) ? "in" : "=",
					value,
				),
			]),
		);
	}

	return {
		main: mainQuery,
		count: countQuery,
	};
};

export default getMultiple;
