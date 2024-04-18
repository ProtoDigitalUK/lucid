import { LibsqlDialect, type LibsqlDialectConfig } from "@libsql/kysely-libsql";
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
	// Getters
	get jsonArrayFrom() {
		return jsonArrayFrom;
	}
	get fuzzOperator() {
		return "like" as const;
	}
}
