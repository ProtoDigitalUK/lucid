import DatabaseAdapter from "../../adapter.js";
import {
	SqliteDialect,
	type SqliteDialectConfig,
	ParseJSONResultsPlugin,
} from "kysely";
import { AdapterType } from "../../types.js";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

export default class SqliteAdapter extends DatabaseAdapter {
	constructor(config: SqliteDialectConfig) {
		super({
			adapter: AdapterType.SQLITE,
			dialect: new SqliteDialect(config),
			plugins: [new ParseJSONResultsPlugin()],
		});
	}
	// Getters
	get jsonArrayFrom() {
		return jsonArrayFrom;
	}
	get fuzzOperator() {
		return "like" as const;
	}
}
