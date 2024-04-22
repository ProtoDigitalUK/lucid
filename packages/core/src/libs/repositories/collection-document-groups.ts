import { sql } from "kysely";
import { deleteQB, type QueryBuilderWhereT } from "../db/query-builder.js";
import values from "../db/kysely/values.js";
import type { KyselyDB } from "../db/types.js";

export default class CollectionDocumentGroupsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// upsert
	createMultiple = async (props: {
		items: Array<{
			collectionDocumentId: number;
			collectionBrickId: number;
			groupOrder: number;
			repeaterKey: string;
			ref: string;
		}>;
	}) => {
		return this.db
			.insertInto("headless_collection_document_groups")
			.values(
				props.items.flatMap((g) => ({
					collection_document_id: g.collectionDocumentId,
					collection_brick_id: g.collectionBrickId,
					group_order: g.groupOrder,
					repeater_key: g.repeaterKey,
					ref: g.ref,
				})),
			)
			.returning(["group_id", "ref"])
			.execute();
	};
	// ----------------------------------------
	// update
	updateMultipleParentIds = async (props: {
		items: Array<{
			parentGroupId: number | null;
			groupId: number;
			collectionDocumentId: number;
			collectionBrickId: number;
			groupOrder: number;
			repeaterKey: string;
			ref: string;
		}>;
	}) => {
		return this.db
			.insertInto("headless_collection_document_groups")
			.values(
				props.items.map((g) => {
					return {
						parent_group_id: g.parentGroupId,
						group_id: g.groupId,
						collection_document_id: g.collectionDocumentId,
						collection_brick_id: g.collectionBrickId,
						group_order: g.groupOrder,
						repeater_key: g.repeaterKey,
						ref: g.ref,
					};
				}),
			)
			.onConflict((oc) =>
				oc.column("group_id").doUpdateSet((eb) => ({
					parent_group_id: eb.ref("excluded.parent_group_id"),
				})),
			)
			.execute();
	};
	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"headless_collection_document_groups">;
	}) => {
		let query = this.db
			.deleteFrom("headless_collection_document_groups")
			.returning(["group_id"]);

		query = deleteQB(query, props.where);

		return query.execute();
	};
}
