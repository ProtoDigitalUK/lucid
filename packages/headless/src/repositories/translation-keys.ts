import type { Config } from "../libs/config/config-schema.js";
import { deleteQB, type QueryBuilderWhereT } from "../libs/db/query-builder.js";

export default class TranslationKeys {
	constructor(private config: Config) {}

	delete = (props: {
		where: QueryBuilderWhereT<"headless_translation_keys">;
	}) => {
		let query = this.config.db.client.deleteFrom(
			"headless_translation_keys",
		);

		query = deleteQB(query, props.where);

		return query.execute();
	};
	createMultiple = (
		props: {
			createdAt: string;
		}[],
	) => {
		return this.config.db.client
			.insertInto("headless_translation_keys")
			.values(props.map((d) => ({ created_at: d.createdAt })))
			.returning("id")
			.execute();
	};
}
