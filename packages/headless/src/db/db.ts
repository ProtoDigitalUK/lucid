import T from "../translations/index.js";
import getConfig from "../libs/config/get-config.js";
import { InternalError } from "../utils/error-handler.js";
import { Kysely, PostgresDialect } from "kysely";
import type { DB as DBSchema } from "kysely-codegen";
import pg from "pg";

const { Pool } = pg;
let dbInstance: Kysely<DBSchema>;

const initialiseDB = async () => {
	const config = await getConfig();
	const dialect = new PostgresDialect({
		pool: new Pool({
			connectionString: config.databaseUrl,
			max: 20,
			ssl: {
				rejectUnauthorized: false,
			},
		}),
	});

	dbInstance = new Kysely<DBSchema>({
		dialect,
	});

	return dbInstance;
};

const headlessDB = () => {
	if (!dbInstance) {
		throw new InternalError(T("db_connection_error"));
	}
	return dbInstance;
};

export { initialiseDB, headlessDB };
