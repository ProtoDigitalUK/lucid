import { Kysely } from "kysely";
import { MigrationFn } from "../types.js";

const Migration00000003: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {
			await db.schema
				.createTable("headless_options")
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
