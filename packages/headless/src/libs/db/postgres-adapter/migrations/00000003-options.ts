import { Kysely, Migration } from "kysely";

const Migration00000003: Migration = {
	async up(db: Kysely<unknown>) {
		await db.schema
			.createTable("headless_options")
			.addColumn("name", "text", (col) =>
				col.unique().notNull().primaryKey(),
			)
			.addColumn("value_int", "integer")
			.addColumn("value_text", "text")
			.addColumn("value_bool", "boolean")
			.execute();
	},
	async down(db: Kysely<unknown>) {},
};

export default Migration00000003;
