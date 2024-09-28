import queryBuilder, {
	type QueryBuilderWhere,
} from "../query-builder/index.js";
import type {
	KyselyDB,
	DocumentVersionType,
	LucidCollectionDocumentVersions,
	Select,
} from "../db/types.js";

export default class CollectionDocumentVersionsRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// select
	selectSingle = async <
		K extends keyof Select<LucidCollectionDocumentVersions>,
	>(props: {
		select: K[];
		where: QueryBuilderWhere<"lucid_collection_document_versions">;
	}) => {
		let query = this.db
			.selectFrom("lucid_collection_document_versions")
			.select(props.select);

		query = queryBuilder.select(query, props.where);

		return query.executeTakeFirst() as Promise<
			Pick<Select<LucidCollectionDocumentVersions>, K> | undefined
		>;
	};
	// ----------------------------------------
	// create
	createSingle = async (props: {
		document_id: number;
		version_type: DocumentVersionType;
		created_by: number;
	}) => {
		return this.db
			.insertInto("lucid_collection_document_versions")
			.values({
				document_id: props.document_id,
				version_type: props.version_type,
				created_by: props.created_by,
			})
			.returningAll()
			.executeTakeFirst();
	};
	// ----------------------------------------
	// update
	updateSingle = async (props: {
		where: QueryBuilderWhere<"lucid_collection_document_versions">;
		data: {
			version_type?: DocumentVersionType;
			previous_version_type?: DocumentVersionType;
			created_by?: number;
		};
	}) => {
		let query = this.db
			.updateTable("lucid_collection_document_versions")
			.set({
				version_type: props.data.version_type,
				previous_version_type: props.data.previous_version_type,
				created_by: props.data.created_by,
			})
			.returning("id");

		query = queryBuilder.update(query, props.where);

		return query.executeTakeFirst();
	};
}
