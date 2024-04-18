import pg from "pg";
import { PostgresDialect } from "kysely";
import DatabaseAdapter from "../../adapter.js";
import { AdapterType } from "../../types.js";
import { jsonArrayFrom } from "kysely/helpers/postgres";

const { Pool } = pg;

export default class PostgresAdapter extends DatabaseAdapter {
	constructor(config: pg.PoolConfig) {
		super({
			adapter: AdapterType.POSTGRES,
			dialect: new PostgresDialect({
				pool: new Pool(config),
			}),
		});
	}
	// Getters
	get jsonArrayFrom() {
		return jsonArrayFrom;
	}
	get fuzzOperator() {
		return "%" as const;
	}
}
