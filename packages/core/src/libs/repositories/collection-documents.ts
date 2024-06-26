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
import type CollectionBuilder from "../builders/collection-builder/index.js";
import type collectionDocumentsSchema from "../../schemas/collection-documents.js";

export default class CollectionDocumentsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// select
	selectSingle = async <
		K extends keyof Select<HeadlessCollectionDocuments>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_collection_documents">;
	}) => {
		let query = this.db
			.selectFrom("lucid_collection_documents")
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
			.selectFrom("lucid_collection_documents")
			.select([
				"lucid_collection_documents.id",
				"lucid_collection_documents.collection_key",
				"lucid_collection_documents.created_by",
				"lucid_collection_documents.created_at",
				"lucid_collection_documents.updated_at",
				"lucid_collection_documents.updated_by",
			])
			.leftJoin(
				"lucid_users as cb_user",
				"cb_user.id",
				"lucid_collection_documents.created_by",
			)
			.leftJoin(
				"lucid_users as ub_user",
				"cb_user.id",
				"lucid_collection_documents.updated_by",
			)
			.select([
				"cb_user.id as cb_user_id",
				"cb_user.email as cb_user_email",
				"cb_user.first_name as cb_user_first_name",
				"cb_user.last_name as cb_user_last_name",
				"cb_user.username as cb_user_username",
				"ub_user.id as ub_user_id",
				"ub_user.email as ub_user_email",
				"ub_user.first_name as ub_user_first_name",
				"ub_user.last_name as ub_user_last_name",
				"ub_user.username as ub_user_username",
			])
			.where("lucid_collection_documents.id", "=", props.id)
			.where("lucid_collection_documents.is_deleted", "=", 0)
			.executeTakeFirst();
	};
	selectMultiple = async <
		K extends keyof Select<HeadlessCollectionDocuments>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"lucid_collection_documents">;
	}) => {
		let query = this.db
			.selectFrom("lucid_collection_documents")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.execute() as Promise<
			Array<Pick<Select<HeadlessCollectionDocuments>, K>>
		>;
	};
	selectMultipleFiltered = async (props: {
		query: z.infer<typeof collectionDocumentsSchema.getMultiple.query>;
		collection: CollectionBuilder;
		config: Config;
	}) => {
		let pagesQuery = this.db
			.selectFrom("lucid_collection_documents")
			.select([
				"lucid_collection_documents.id",
				"lucid_collection_documents.collection_key",
				"lucid_collection_documents.created_by",
				"lucid_collection_documents.created_at",
				"lucid_collection_documents.updated_at",
				"lucid_collection_documents.updated_by",
			])
			.leftJoin(
				"lucid_users",
				"lucid_users.id",
				"lucid_collection_documents.created_by",
			)
			.where("lucid_collection_documents.is_deleted", "=", 0)
			.where(
				"lucid_collection_documents.collection_key",
				"=",
				props.collection.key,
			)
			.groupBy(["lucid_collection_documents.id", "lucid_users.id"]);

		let pagesCountQuery = this.db
			.selectFrom("lucid_collection_documents")
			.select(sql`count(*)`.as("count"))
			.leftJoin(
				"lucid_users",
				"lucid_users.id",
				"lucid_collection_documents.created_by",
			)
			.where(
				"lucid_collection_documents.collection_key",
				"=",
				props.collection.key,
			)
			.where("lucid_collection_documents.is_deleted", "=", 0);

		const collectionDocFiltersRes = props.collection.documentFilters(
			props.query.filter,
		);

		if (props.collection.data.config.fields.include.length > 0) {
			pagesQuery = pagesQuery
				.select((eb) => [
					props.config.db
						.jsonArrayFrom(
							eb
								.selectFrom("lucid_collection_document_fields")
								.leftJoin("lucid_media", (join) =>
									join.onRef(
										"lucid_media.id",
										"=",
										"lucid_collection_document_fields.media_id",
									),
								)
								.leftJoin("lucid_users", (join) =>
									join.onRef(
										"lucid_users.id",
										"=",
										"lucid_collection_document_fields.user_id",
									),
								)
								.select((eb) => [
									"lucid_collection_document_fields.fields_id",
									"lucid_collection_document_fields.text_value",
									"lucid_collection_document_fields.int_value",
									"lucid_collection_document_fields.bool_value",
									"lucid_collection_document_fields.locale_code",
									"lucid_collection_document_fields.media_id",
									"lucid_collection_document_fields.user_id",
									"lucid_collection_document_fields.type",
									"lucid_collection_document_fields.key",
									"lucid_collection_document_fields.collection_brick_id",
									"lucid_collection_document_fields.collection_document_id",
									"lucid_collection_document_fields.group_id",
									// User fields
									"lucid_users.id as user_id",
									"lucid_users.email as user_email",
									"lucid_users.first_name as user_first_name",
									"lucid_users.last_name as user_last_name",
									"lucid_users.email as user_email",
									"lucid_users.username as user_username",
									// Media fields
									"lucid_media.key as media_key",
									"lucid_media.mime_type as media_mime_type",
									"lucid_media.file_extension as media_file_extension",
									"lucid_media.file_size as media_file_size",
									"lucid_media.width as media_width",
									"lucid_media.height as media_height",
									"lucid_media.type as media_type",
									props.config.db
										.jsonArrayFrom(
											eb
												.selectFrom(
													"lucid_translations",
												)
												.select([
													"lucid_translations.value",
													"lucid_translations.locale_code",
												])
												.where(
													"lucid_translations.value",
													"is not",
													null,
												)
												.whereRef(
													"lucid_translations.translation_key_id",
													"=",
													"lucid_media.title_translation_key_id",
												),
										)
										.as("media_title_translations"),
									props.config.db
										.jsonArrayFrom(
											eb
												.selectFrom(
													"lucid_translations",
												)
												.select([
													"lucid_translations.value",
													"lucid_translations.locale_code",
												])
												.where(
													"lucid_translations.value",
													"is not",
													null,
												)
												.whereRef(
													"lucid_translations.translation_key_id",
													"=",
													"lucid_media.alt_translation_key_id",
												),
										)
										.as("media_alt_translations"),
								])
								.whereRef(
									"lucid_collection_document_fields.collection_document_id",
									"=",
									"lucid_collection_documents.id",
								)
								.where(
									"lucid_collection_document_fields.key",
									"in",
									props.collection.data.config.fields.include,
								),
						)
						.as("fields"),
				])
				.leftJoin("lucid_collection_document_fields", (join) =>
					join.onRef(
						"lucid_collection_document_fields.collection_document_id",
						"=",
						"lucid_collection_documents.id",
					),
				);

			if (collectionDocFiltersRes.length > 0) {
				pagesCountQuery = pagesCountQuery.leftJoin(
					"lucid_collection_document_fields",
					(join) =>
						join.onRef(
							"lucid_collection_document_fields.collection_document_id",
							"=",
							"lucid_collection_documents.id",
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
				documentFilters: collectionDocFiltersRes,
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
			.insertInto("lucid_collection_documents")
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
		where: QueryBuilderWhereT<"lucid_collection_documents">;
		data: {
			isDeleted?: BooleanInt;
			isDeletedAt?: string;
			deletedBy?: number;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_collection_documents")
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
		where: QueryBuilderWhereT<"lucid_collection_documents">;
		data: {
			isDeleted?: BooleanInt;
			isDeletedAt?: string;
			deletedBy?: number;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_collection_documents")
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
		where: QueryBuilderWhereT<"lucid_collection_documents">;
	}) => {
		let query = this.db
			.deleteFrom("lucid_collection_documents")
			.returning(["id"]);

		query = deleteQB(query, props.where);

		return query.executeTakeFirst();
	};
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"lucid_collection_documents">;
	}) => {
		let query = this.db
			.deleteFrom("lucid_collection_documents")
			.returning(["id"]);

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
