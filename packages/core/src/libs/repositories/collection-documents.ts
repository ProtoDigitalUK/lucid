import type z from "zod";
import { sql } from "kysely";
import type {
	BooleanInt,
	HeadlessCollectionDocuments,
	Select,
	KyselyDB,
} from "../db/types.js";
import type { Config } from "../../types/config.js";
import queryBuilder, {
	deleteQB,
	selectQB,
	updateQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";
import { collectionDocFilters } from "../../utils/field-helpers.js";
import type { FieldFilters } from "../builders/collection-builder/index.js";

export default class CollectionDocumentsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// select
	selectSingle = async <
		K extends keyof Select<HeadlessCollectionDocuments>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_collection_documents">;
	}) => {
		let query = this.db
			.selectFrom("headless_collection_documents")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessCollectionDocuments>, K> | undefined
		>;
	};
	selectSingleById = async (props: {
		id: number;
		config: Config;
	}) => {
		return this.db
			.selectFrom("headless_collection_documents")
			.select([
				"headless_collection_documents.id",
				"headless_collection_documents.collection_key",
				"headless_collection_documents.created_by",
				"headless_collection_documents.created_at",
				"headless_collection_documents.updated_at",
			])
			.innerJoin(
				"headless_users",
				"headless_users.id",
				"headless_collection_documents.created_by",
			)
			.where("headless_collection_documents.id", "=", props.id)
			.where("headless_collection_documents.is_deleted", "=", 0)
			.executeTakeFirst();
	};
	selectMultiple = async <
		K extends keyof Select<HeadlessCollectionDocuments>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_collection_documents">;
	}) => {
		let query = this.db
			.selectFrom("headless_collection_documents")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessCollectionDocuments>, K>>
		>;
	};
	selectMultipleFiltered = async (props: {
		query: z.infer<typeof collectionDocumentsSchema.getMultiple.query>;
		allowedFieldFilters: FieldFilters;
		allowedFieldIncludes: Array<string>;
		languageId: number; // TODO: will be used for field joins
		config: Config;
	}) => {
		let pagesQuery = this.db
			.selectFrom("headless_collection_documents")
			.select([
				"headless_collection_documents.id",
				"headless_collection_documents.collection_key",
				"headless_collection_documents.created_by",
				"headless_collection_documents.created_at",
				"headless_collection_documents.updated_at",
			])
			.leftJoin(
				"headless_users",
				"headless_users.id",
				"headless_collection_documents.created_by",
			)
			.where("headless_collection_documents.is_deleted", "=", 0)
			.groupBy(["headless_collection_documents.id", "headless_users.id"]);

		let pagesCountQuery = this.db
			.selectFrom("headless_collection_documents")
			.select(sql`count(*)`.as("count"))
			.leftJoin(
				"headless_users",
				"headless_users.id",
				"headless_collection_documents.created_by",
			)
			.where("headless_collection_documents.is_deleted", "=", 0);

		const collectionDocFiltersRes = collectionDocFilters(
			props.allowedFieldFilters,
			props.query.filter,
		);

		if (props.allowedFieldIncludes.length > 0) {
			// TODO: add join for user, media, pagelink, etc.
			pagesQuery = pagesQuery
				.select((eb) => [
					props.config.db
						.jsonArrayFrom(
							eb
								.selectFrom(
									"headless_collection_document_fields",
								)
								.select([
									"headless_collection_document_fields.fields_id",
									"headless_collection_document_fields.text_value",
									"headless_collection_document_fields.int_value",
									"headless_collection_document_fields.bool_value",
									"headless_collection_document_fields.language_id",
									"headless_collection_document_fields.type",
									"headless_collection_document_fields.key",
									"headless_collection_document_fields.collection_brick_id",
									"headless_collection_document_fields.collection_document_id",
									"headless_collection_document_fields.group_id",
								])
								.whereRef(
									"headless_collection_document_fields.collection_document_id",
									"=",
									"headless_collection_documents.id",
								)
								.where(
									"headless_collection_document_fields.key",
									"in",
									props.allowedFieldIncludes,
								),
						)
						.as("fields"),
				])
				.leftJoin("headless_collection_document_fields", (join) =>
					join.onRef(
						"headless_collection_document_fields.collection_document_id",
						"=",
						"headless_collection_documents.id",
					),
				);

			if (collectionDocFiltersRes.length > 0) {
				pagesCountQuery = pagesCountQuery.leftJoin(
					"headless_collection_document_fields",
					(join) =>
						join.onRef(
							"headless_collection_document_fields.collection_document_id",
							"=",
							"headless_collection_documents.id",
						),
				);
			}
		}

		const { main, count } = queryBuilder(
			{
				main: pagesQuery,
				count: pagesCountQuery,
			},
			{
				requestQuery: {
					filter: props.query.filter,
					sort: props.query.sort,
					include: props.query.include,
					exclude: props.query.exclude,
					page: props.query.page,
					perPage: props.query.perPage,
				},
				collectionDocumentFilters: collectionDocFiltersRes,
				meta: {
					filters: [],
					sorts: [
						{
							queryKey: "createdAt",
							tableKey: "created_at",
						},
						{
							queryKey: "updatedAt",
							tableKey: "updated_at",
						},
					],
				},
			},
		);

		return await Promise.all([
			main.execute(),
			count?.executeTakeFirst() as Promise<{ count: string } | undefined>,
		]);
	};
	// ----------------------------------------
	// upsert
	upsertSingle = async (props: {
		id?: number;
		collectionKey: string;
		createdBy: number;
		updatedBy: number;
		isDeleted: BooleanInt;
	}) => {
		return this.db
			.insertInto("headless_collection_documents")
			.values({
				id: props.id,
				collection_key: props.collectionKey,
				created_by: props.createdBy,
				updated_by: props.updatedBy,
				is_deleted: props.isDeleted,
			})
			.onConflict((oc) =>
				oc.column("id").doUpdateSet({
					created_by: props.createdBy,
					updated_by: props.updatedBy,
					is_deleted: props.isDeleted,
				}),
			)
			.returning("id")
			.executeTakeFirst();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhereT<"headless_collection_documents">;
		data: {
			isDeleted?: BooleanInt;
			isDeletedAt?: string;
			deletedBy?: number;
		};
	}) => {
		let query = this.db
			.updateTable("headless_collection_documents")
			.set({
				is_deleted: props.data.isDeleted,
				is_deleted_at: props.data.isDeletedAt,
				deleted_by: props.data.deletedBy,
			})
			.returning(["id"]);

		query = updateQB(query, props.where);

		return query.executeTakeFirst();
	};
	updateMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_collection_documents">;
		data: {
			isDeleted?: BooleanInt;
			isDeletedAt?: string;
			deletedBy?: number;
		};
	}) => {
		let query = this.db
			.updateTable("headless_collection_documents")
			.set({
				is_deleted: props.data.isDeleted,
				is_deleted_at: props.data.isDeletedAt,
				deleted_by: props.data.deletedBy,
			})
			.returning(["id"]);

		query = updateQB(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// delete
	deleteSingle = async (props: {
		where: QueryBuilderWhereT<"headless_collection_documents">;
	}) => {
		let query = this.db
			.deleteFrom("headless_collection_documents")
			.returning(["id"]);

		query = deleteQB(query, props.where);

		return query.executeTakeFirst();
	};
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_collection_documents">;
	}) => {
		let query = this.db
			.deleteFrom("headless_collection_documents")
			.returning(["id"]);

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
