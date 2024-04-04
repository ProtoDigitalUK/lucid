import type { BooleanInt } from "../db/types.js";
import { deleteQB, type QueryBuilderWhereT } from "../db/query-builder.js";
import type { FieldTypesT } from "../builders/field-builder/index.js";

export default class CollectionDocumentFieldsRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// upsert
	upsertMultiple = async (props: {
		items: Array<{
			fieldsId?: number | undefined;
			collectionDocumentId: number;
			collectionBrickId: number;
			key: string;
			type: FieldTypesT;
			groupId?: number | null;
			textValue: string | null;
			intValue: number | null;
			boolValue: BooleanInt | null;
			jsonValue: string | null;
			pageLinkId: number | null;
			mediaId: number | null;
			languageId: number;
		}>;
	}) => {
		return this.db
			.insertInto("headless_collection_document_fields")
			.values(
				props.items.map((f) => {
					return {
						fields_id: f.fieldsId,
						collection_document_id: f.collectionDocumentId,
						collection_brick_id: f.collectionBrickId,
						key: f.key,
						type: f.type,
						group_id: f.groupId,
						text_value: f.textValue,
						int_value: f.intValue,
						bool_value: f.boolValue,
						json_value: f.jsonValue,
						page_link_id: f.pageLinkId,
						media_id: f.mediaId,
						language_id: f.languageId,
					};
				}),
			)
			.onConflict((oc) =>
				oc.column("fields_id").doUpdateSet((eb) => ({
					text_value: eb.ref("excluded.text_value"),
					int_value: eb.ref("excluded.int_value"),
					bool_value: eb.ref("excluded.bool_value"),
					json_value: eb.ref("excluded.json_value"),
					page_link_id: eb.ref("excluded.page_link_id"),
					media_id: eb.ref("excluded.media_id"),
					group_id: eb.ref("excluded.group_id"),
				})),
			)
			.returning(["fields_id"])
			.execute();
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_collection_document_fields">;
	}) => {
		let query = this.db
			.deleteFrom("headless_collection_document_fields")
			.returning(["fields_id"]);

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
