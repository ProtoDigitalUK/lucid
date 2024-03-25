import T from "../../translations/index.js";
import { type Dialect, FileMigrationProvider, Kysely, Migrator } from "kysely";
import { InternalError } from "../../utils/error-handler.js";
import type { DB as DBSchema } from "kysely-codegen";
import fs from "node:fs/promises";
import path from "node:path";

export default class DatabaseAdapter {
	migrationFolder: string | undefined;
	db: Kysely<DBSchema> | undefined;
	constructor(config: {
		dialect: Dialect;
		migrationFolder: string;
	}) {
		this.migrationFolder = config.migrationFolder;

		this.db = new Kysely<DBSchema>({
			dialect: config.dialect,
		});
	}
	// Public methods
	async migrate() {
		const migrator = this.migrator;

		const { error, results } = await migrator.migrateToLatest();

		if (results) {
			for (const it of results) {
				if (it.status === "Success") {
					console.log(
						`migration "${it.migrationName}" was executed successfully`,
					);
				} else if (it.status === "Error") {
					console.error(
						`failed to execute migration "${it.migrationName}"`,
					);
				}
			}
		}

		if (error) {
			console.error("failed to migrate");
			console.error(error);
			process.exit(1);
		}
	}
	// getters
	get database() {
		if (!this.db) {
			throw new InternalError(T("db_connection_error"));
		}
		return this.db;
	}
	get migrator() {
		if (!this.migrationFolder) {
			throw new InternalError("migration_folder_not_set");
		}

		return new Migrator({
			db: this.database,
			provider: new FileMigrationProvider({
				fs,
				path,
				migrationFolder: this.migrationFolder,
			}),
		});
	}
}

export type DatabaseAdapterT = InstanceType<typeof DatabaseAdapter>;
