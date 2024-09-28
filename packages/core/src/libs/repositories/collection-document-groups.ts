import queryBuilder, {
	type QueryBuilderWhere,
} from "../query-builder/index.js";
import type { BooleanInt, KyselyDB } from "../db/types.js";

export default class CollectionDocumentGroupsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// upsert
	createMultiple = async (props: {
		items: Array<{
			collectionDocumentVersionId: number;
			collectionBrickId: number;
			groupOrder: number;
			repeaterKey: string;
			groupOpen: BooleanInt;
			ref: string;
		}>;
	}) => {
		return this.db
			.insertInto("lucid_collection_document_groups")
			.values(
				props.items.flatMap((g) => ({
					collection_document_version_id: g.collectionDocumentVersionId,
					collection_brick_id: g.collectionBrickId,
					group_order: g.groupOrder,
					repeater_key: g.repeaterKey,
					group_open: g.groupOpen,
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
			collectionDocumentVersionId: number;
			collectionBrickId: number;
			groupOrder: number;
			repeaterKey: string;
			groupOpen: BooleanInt;
			ref: string;
		}>;
	}) => {
		return this.db
			.insertInto("lucid_collection_document_groups")
			.values(
				props.items.map((g) => {
					return {
						parent_group_id: g.parentGroupId,
						group_id: g.groupId,
						collection_document_version_id: g.collectionDocumentVersionId,
						collection_brick_id: g.collectionBrickId,
						group_order: g.groupOrder,
						repeater_key: g.repeaterKey,
						ref: g.ref,
						group_open: g.groupOpen,
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
		where: QueryBuilderWhere<"lucid_collection_document_groups">;
	}) => {
		let query = this.db
			.deleteFrom("lucid_collection_document_groups")
			.returning(["group_id"]);

		query = queryBuilder.delete(query, props.where);

		return query.execute();
	};
}
