import { LibsqlDialect, type LibsqlDialectConfig } from "@libsql/kysely-libsql";
import { sql } from "kysely";
import DatabaseAdapter from "../../adapter.js";
import { AdapterType } from "../../types.js";
import { ParseJSONResultsPlugin } from "../../kysely/parse-json-results-plugin.js";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

export default class LibsqlAdapter extends DatabaseAdapter {
	constructor(config: LibsqlDialectConfig) {
		super({
			adapter: AdapterType.LIBSQL,
			dialect: new LibsqlDialect(config),
			plugins: [new ParseJSONResultsPlugin()],
		});
	}
	// Static
	static defaultTimestamp() {
		return sql`CURRENT_TIMESTAMP`;
	}
	static primaryKeyColumnType() {
		return "integer" as const;
	}
	// Getters
	get jsonArrayFrom() {
		return jsonArrayFrom;
	}
	get fuzzOperator() {
		return "like" as const;
	}
}
