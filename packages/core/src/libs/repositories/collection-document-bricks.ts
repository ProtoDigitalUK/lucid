import type {
	HeadlessCollectionDocumentBricks,
	Select,
	KyselyDB,
} from "../db/types.js";
import {
	deleteQB,
	selectQB,
	type QueryBuilderWhereT,
} from "../db/query-builder.js";
import type { Config } from "../../types/config.js";
import type { BrickSchema } from "../../schemas/collection-bricks.js";

export default class CollectionDocumentBricksRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// select
	selectSingle = async <
		K extends keyof Select<HeadlessCollectionDocumentBricks>,
	>(props: {
		select: K[];
		where: QueryBuilderWhereT<"headless_collection_document_bricks">;
	}) => {
		let query = this.db
			.selectFrom("headless_collection_document_bricks")
			.select(props.select);

		query = selectQB(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<HeadlessCollectionDocumentBricks>, K> | undefined
		>;
	};
	selectMultipleByDocumentId = async (props: {
		documentId: number;
		languageId: number;
		config: Config;
	}) => {
		return this.db
			.selectFrom("headless_collection_document_bricks")
			.select((eb) => [
				"headless_collection_document_bricks.id",
				"headless_collection_document_bricks.brick_type",
				"headless_collection_document_bricks.brick_key",
				"headless_collection_document_bricks.collection_document_id",
				"headless_collection_document_bricks.brick_order",
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("headless_collection_document_groups")
							.select([
								"headless_collection_document_groups.group_id",
								"headless_collection_document_groups.collection_document_id",
								"headless_collection_document_groups.collection_brick_id",
								"headless_collection_document_groups.parent_group_id",
								"headless_collection_document_groups.repeater_key",
								"headless_collection_document_groups.group_order",
								"headless_collection_document_groups.ref",
							])
							.whereRef(
								"headless_collection_document_groups.collection_brick_id",
								"=",
								"headless_collection_document_bricks.id",
							),
					)
					.as("groups"),
				props.config.db
					.jsonArrayFrom(
						eb
							.selectFrom("headless_collection_document_fields")
							.leftJoin("headless_media", (join) =>
								join.onRef(
									"headless_media.id",
									"=",
									"headless_collection_document_fields.media_id",
								),
							)
							.leftJoin("headless_users", (join) =>
								join.onRef(
									"headless_users.id",
									"=",
									"headless_collection_document_fields.user_id",
								),
							)
							.select((eb) => [
								"headless_collection_document_fields.fields_id",
								"headless_collection_document_fields.collection_brick_id",
								"headless_collection_document_fields.group_id",
								"headless_collection_document_fields.language_id",
								"headless_collection_document_fields.key",
								"headless_collection_document_fields.type",
								"headless_collection_document_fields.text_value",
								"headless_collection_document_fields.int_value",
								"headless_collection_document_fields.bool_value",
								"headless_collection_document_fields.json_value",
								"headless_collection_document_fields.media_id",
								"headless_collection_document_fields.collection_document_id",
								// User fields
								"headless_users.id as user_id",
								"headless_users.email as user_email",
								"headless_users.first_name as user_first_name",
								"headless_users.last_name as user_last_name",
								"headless_users.email as user_email",
								"headless_users.username as user_username",
								// Media fields
								"headless_media.key as media_key",
								"headless_media.mime_type as media_mime_type",
								"headless_media.file_extension as media_file_extension",
								"headless_media.file_size as media_file_size",
								"headless_media.width as media_width",
								"headless_media.height as media_height",
								"headless_media.type as media_type",
								props.config.db
									.jsonArrayFrom(
										eb
											.selectFrom("headless_translations")
											.select([
												"headless_translations.value",
												"headless_translations.language_id",
											])
											.where(
												"headless_translations.value",
												"is not",
												null,
											)
											.whereRef(
												"headless_translations.translation_key_id",
												"=",
												"headless_media.title_translation_key_id",
											),
									)
									.as("media_title_translations"),
								props.config.db
									.jsonArrayFrom(
										eb
											.selectFrom("headless_translations")
											.select([
												"headless_translations.value",
												"headless_translations.language_id",
											])
											.where(
												"headless_translations.value",
												"is not",
												null,
											)
											.whereRef(
												"headless_translations.translation_key_id",
												"=",
												"headless_media.alt_translation_key_id",
											),
									)
									.as("media_alt_translations"),
							])
							.whereRef(
								"headless_collection_document_fields.collection_brick_id",
								"=",
								"headless_collection_document_bricks.id",
							)
							.where(
								"headless_collection_document_fields.language_id",
								"=",
								props.languageId,
							),
					)
					.as("fields"),
			])
			.orderBy("headless_collection_document_bricks.brick_order", "asc")
			.where(
				"headless_collection_document_bricks.collection_document_id",
				"=",
				props.documentId,
			)
			.execute();
	};
	// ----------------------------------------
	// create
	createMultiple = async (props: {
		items: Array<{
			id?: number;
			brickType: BrickSchema["type"];
			brickKey?: string;
			brickOrder?: number;
			collectionDocumentId: number;
		}>;
	}) => {
		return this.db
			.insertInto("headless_collection_document_bricks")
			.values(
				props.items.map((b) => {
					return {
						id: b.id,
						brick_type: b.brickType,
						brick_key: b.brickKey,
						brick_order: b.brickOrder,
						collection_document_id: b.collectionDocumentId,
					};
				}),
			)
			.returning(["id", "brick_order", "brick_key", "brick_type"])
			.execute();
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_collection_document_bricks">;
	}) => {
		let query = this.db.deleteFrom("headless_collection_document_bricks");

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
