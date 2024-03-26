import { LibsqlDialect, type LibsqlDialectConfig } from "@libsql/kysely-libsql";
import DatabaseAdapter from "../adapter.js";
import { getDirName } from "../../../utils/helpers.js";

const currentDir = getDirName(import.meta.url);

export default class LibsqlAdapter extends DatabaseAdapter {
	constructor(config: LibsqlDialectConfig) {
		super({
			dialect: new LibsqlDialect(config),
			migrations: {},
		});
	}
}
