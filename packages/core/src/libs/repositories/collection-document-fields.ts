import type { BooleanInt, KyselyDB } from "../db/types.js";
import { deleteQB, type QueryBuilderWhereT } from "../db/query-builder.js";
import type { FieldTypes } from "../builders/field-builder/index.js";

export default class CollectionDocumentFieldsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// upsert
	createMultiple = async (props: {
		items: Array<{
			collectionDocumentId: number;
			collectionBrickId: number;
			key: string;
			type: FieldTypes;
			groupId?: number | null;
			textValue: string | null;
			intValue: number | null;
			boolValue: BooleanInt | null;
			jsonValue: string | null;
			userId: number | null;
			mediaId: number | null;
			languageId: number;
		}>;
	}) => {
		return this.db
			.insertInto("lucid_collection_document_fields")
			.values(
				props.items.map((f) => {
					return {
						collection_document_id: f.collectionDocumentId,
						collection_brick_id: f.collectionBrickId,
						key: f.key,
						type: f.type,
						group_id: f.groupId,
						text_value: f.textValue,
						int_value: f.intValue,
						bool_value: f.boolValue,
						json_value: f.jsonValue,
						user_id: f.userId,
						media_id: f.mediaId,
						language_id: f.languageId,
					};
				}),
			)
			.returning(["fields_id"])
			.execute();
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"lucid_collection_document_fields">;
	}) => {
		let query = this.db
			.deleteFrom("lucid_collection_document_fields")
			.returning(["fields_id"]);

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
