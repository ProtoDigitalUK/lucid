import pg from "pg";
import { PostgresDialect } from "kysely";
import DatabaseAdapter from "../adapter.js";
// Migrations
import Migration00000001 from "./migrations/00000001-languages.js";
import Migration00000002 from "./migrations/00000002-translations.js";
import Migration00000003 from "./migrations/00000003-options.js";
import Migration00000004 from "./migrations/00000004-users-and-permissions.js";
import Migration00000005 from "./migrations/00000005-emails.js";
import Migration00000006 from "./migrations/00000006-media.js";
import Migration00000007 from "./migrations/00000007-collections.js";

const { Pool } = pg;

export default class PostgresAdapter extends DatabaseAdapter {
	constructor(config: pg.PoolConfig) {
		super({
			dialect: new PostgresDialect({
				pool: new Pool(config),
			}),
			migrations: {
				"00000001": Migration00000001,
				"00000002": Migration00000002,
				"00000003": Migration00000003,
				"00000004": Migration00000004,
				"00000005": Migration00000005,
				"00000006": Migration00000006,
				"00000007": Migration00000007,
			},
		});
	}
}
