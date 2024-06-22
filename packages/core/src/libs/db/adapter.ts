import T from "../../translations/index.js";
import {
	type Dialect,
	type Migration,
	Kysely,
	Migrator,
	type KyselyPlugin,
} from "kysely";
import { jsonArrayFrom } from "kysely/helpers/sqlite";
import { LucidError } from "../../utils/errors/index.js";
import serviceWrapper from "../../utils/services/service-wrapper.js";
import lucidLogger from "../../utils/logging/index.js";
import type lucidServices from "../../services/index.js";
import type { AdapterType, LucidDB } from "./types.js";
import type { Config } from "../../types/config.js";
// Migrations
import Migration00000001 from "./migrations/00000001-locales.js";
import Migration00000002 from "./migrations/00000002-translations.js";
import Migration00000003 from "./migrations/00000003-options.js";
import Migration00000004 from "./migrations/00000004-users-and-permissions.js";
import Migration00000005 from "./migrations/00000005-emails.js";
import Migration00000006 from "./migrations/00000006-media.js";
import Migration00000007 from "./migrations/00000007-collections.js";

export default class DatabaseAdapter {
	db: Kysely<LucidDB> | undefined;
	adapter: AdapterType;
	constructor(config: {
		adapter: AdapterType;
		dialect: Dialect;
		plugins?: Array<KyselyPlugin>;
	}) {
		this.adapter = config.adapter;
		this.db = new Kysely<LucidDB>({
			dialect: config.dialect,
			plugins: config.plugins,
		});
	}
	// Public methods
	async migrateToLatest() {
		const migrator = this.migrator;

		const { error, results } = await migrator.migrateToLatest();

		if (results) {
			for (const it of results) {
				if (it.status === "Success") {
					lucidLogger("info", {
						message: `"${it.migrationName}" was executed successfully`,
						scope: "migration",
					});
				} else if (it.status === "Error") {
					lucidLogger("error", {
						message: `failed to execute migration "${it.migrationName}"`,
						scope: "migration",
					});
				}
			}
		}

		if (error) {
			throw new LucidError({
				// @ts-expect-error
				message: error?.message || T("db_migration_failed"),
				// @ts-expect-error
				data: error.errors,
				kill: true,
			});
		}
	}
	async seed(config: Config, services: typeof lucidServices) {
		try {
			lucidLogger("info", {
				message: T("running_database_seed_jobs"),
			});

			await Promise.all([
				serviceWrapper(services.seed.defaultOptions, {
					transaction: true,
					logError: true,
					defaultError: {
						name: T("seed_error_name"),
						message: T("option_error_occured_saving_default"),
					},
				})({
					db: this.client,
					config: config,
					services: services,
				}),
				serviceWrapper(services.seed.defaultRoles, {
					transaction: true,
					logError: true,
					defaultError: {
						name: T("seed_error_name"),
						message: T("roles_error_occured_saving_default"),
					},
				})({
					db: this.client,
					config: config,
					services: services,
				}),
				serviceWrapper(services.seed.defaultUser, {
					transaction: true,
					logError: true,
					defaultError: {
						name: T("seed_error_name"),
						message: T("user_error_occured_saving_default"),
					},
				})({
					db: this.client,
					config: config,
					services: services,
				}),
				serviceWrapper(services.seed.syncLocales, {
					transaction: true,
					logError: true,
					defaultError: {
						name: T("seed_error_name"),
						message: T("locale_error_occured_saving_default"),
					},
				})({
					db: this.client,
					config: config,
					services: services,
				}),
			]);
		} catch (error) {
			lucidLogger("error", {
				message: T("seed_error_message"),
			});
		}
	}
	// getters
	get client() {
		if (!this.db) {
			throw new LucidError({
				message: T("db_connection_error"),
			});
		}
		return this.db;
	}
	get jsonArrayFrom() {
		return jsonArrayFrom;
	}
	get fuzzOperator(): "like" | "ilike" | "%" {
		return "like";
	}
	private get migrations(): Record<string, Migration> {
		return {
			"00000001-locales": Migration00000001(this.adapter),
			"00000002-translations": Migration00000002(this.adapter),
			"00000003-options": Migration00000003(this.adapter),
			"00000004-users-and-permissions": Migration00000004(this.adapter),
			"00000005-emails": Migration00000005(this.adapter),
			"00000006-media": Migration00000006(this.adapter),
			"00000007-collections": Migration00000007(this.adapter),
		};
	}
	private get migrator() {
		const m = this.migrations;
		return new Migrator({
			db: this.client,
			provider: {
				async getMigrations() {
					return m;
				},
			},
		});
	}
}
