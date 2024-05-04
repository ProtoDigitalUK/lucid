import { deleteQB, type QueryBuilderWhereT } from "../db/query-builder.js";
import type { KyselyDB } from "../db/types.js";

export default class TranslationKeysRepo {
	constructor(private db: KyselyDB) {}

	// ----------------------------------------
	// delete
	deleteMultiple = async (props: {
		where: QueryBuilderWhereT<"lucid_translation_keys">;
	}) => {
		let query = this.db.deleteFrom("lucid_translation_keys");

		query = deleteQB(query, props.where);

		return query.execute();
	};
	// ----------------------------------------
	// create
	createMultiple = async (
		props: {
			createdAt: string;
		}[],
	) => {
		return this.db
			.insertInto("lucid_translation_keys")
			.values(props.map((d) => ({ created_at: d.createdAt })))
			.returning("id")
			.execute();
	};
}
