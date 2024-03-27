import { Kysely } from "kysely";
import { MigrationFn } from "../db.js";
import {
	defaultTimestamp,
	primaryKeyColumnType,
	primaryKeyColumn,
} from "../kysely/column-helpers.js";

const Migration00000003: MigrationFn = (adapter) => {
	return {
		async up(db: Kysely<unknown>) {},
		async down(db: Kysely<unknown>) {},
	};
};

export default Migration00000003;

// import { Kysely, Migration } from "kysely";

// const Migration00000003: Migration = {
// 	async up(db: Kysely<unknown>) {
// 		await db.schema
// 			.createTable("headless_options")
// 			.addColumn("name", "text", (col) =>
// 				col.unique().notNull().primaryKey(),
// 			)
// 			.addColumn("value_int", "integer")
// 			.addColumn("value_text", "text")
// 			.addColumn("value_bool", "boolean")
// 			.execute();
// 	},
// 	async down(db: Kysely<unknown>) {},
// };

// export default Migration00000003;
