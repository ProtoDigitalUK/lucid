import path from "node:path";
import pg from "pg";
import { PostgresDialect } from "kysely";
import DatabaseAdapter from "../adapter.js";
import { getDirName } from "../../../utils/helpers.js";

const { Pool } = pg;

const currentDir = getDirName(import.meta.url);

export default class PostgresAdapter extends DatabaseAdapter {
	constructor(config: pg.PoolConfig) {
		super({
			dialect: new PostgresDialect({
				pool: new Pool(config),
			}),
			migrationFolder: path.join(currentDir, "/migrations"),
		});
	}
}
