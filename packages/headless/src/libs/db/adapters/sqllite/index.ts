import DatabaseAdapter from "../../adapter.js";
import { SqliteDialect, sql, type SqliteDialectConfig } from "kysely";
import { ParseJSONResultsPlugin } from "../../kysely/parse-json-results-plugin.js";
import { AdapterType } from "../../types.js";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

export default class SqlLiteAdapter extends DatabaseAdapter {
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
