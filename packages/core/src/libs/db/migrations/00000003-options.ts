import type { Kysely } from "kysely";
import type { MigrationFn } from "../types.js";

const Migration00000003: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {
			await db.schema
				.createTable("lucid_options")
				.addColumn("name", "text", (col) =>
					col.unique().notNull().primaryKey(),
				)
				.addColumn("value_int", "integer")
				.addColumn("value_text", "text")
				.addColumn("value_bool", "integer")
				.execute();
		},
		async down(db: Kysely<unknown>) {},
	};
};

export default Migration00000003;
