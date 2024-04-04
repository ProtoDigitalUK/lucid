import { sql } from "kysely";
import { deleteQB, type QueryBuilderWhereT } from "../db/query-builder.js";
import values from "../db/kysely/values.js";

export default class CollectionDocumentGroupsRepo {
	constructor(private db: DB) {}

	// ----------------------------------------
	// upsert
	upsertMultiple = async (props: {
		items: Array<{
			groupId?: number;
			parentGroupId?: number | null;
			collectionDocumentId: number;
			collectionBrickId: number;
			groupOrder: number;
			repeaterKey: string;
			languageId: number;
			ref?: string;
		}>;
	}) => {
		return this.db
			.insertInto("headless_collection_document_groups")
			.values(
				props.items.flatMap((g) => ({
					group_id: g.groupId,
					parent_group_id: g.parentGroupId,
					collection_document_id: g.collectionDocumentId,
					collection_brick_id: g.collectionBrickId,
					group_order: g.groupOrder,
					repeater_key: g.repeaterKey,
					language_id: g.languageId,
					ref: g.ref,
				})),
			)
			.onConflict((oc) =>
				oc.column("group_id").doUpdateSet((eb) => ({
					group_order: eb.ref("excluded.group_order"),
					parent_group_id: eb.ref("excluded.parent_group_id"),
				})),
			)
			.returning(["group_id", "ref"])
			.execute();
	};
	// ----------------------------------------
	// update
	updateMultipleParentIds = async (props: {
		items: Array<{
			parent_group_id: number | null;
			group_id: number;
		}>;
	}) => {
		return this.db
			.updateTable("headless_collection_document_groups")
			.from(values(props.items, "c"))
			.set({
				parent_group_id: sql`c.parent_group_id::int`,
			})
			.whereRef(
				"headless_collection_document_groups.group_id",
				"=",
				sql`c.group_id::int`,
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
