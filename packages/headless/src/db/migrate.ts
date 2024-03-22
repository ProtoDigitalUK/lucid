import fs from "fs-extra";
import path from "node:path";
import { getDirName } from "../utils/helpers.js";
import { green } from "console-log-colors";
import { InternalError } from "../utils/error-handler.js";
import { sql } from "kysely";

const currentDir = getDirName(import.meta.url);

const getOutstanding = async (db: DB) => {
	const migrationFiles = await fs.readdir(
		path.join(currentDir, "./migrations"),
	);

	let migrations: string[] = [];

	// Get all migrations from database
	try {
		const migrationsRes = await db
			.selectFrom("headless_migrations")
			.selectAll()
			.execute();
		for (let i = 0; i < migrationsRes.length; i++) {
			const migration = migrationsRes[i];
			if (migration.file === null) continue;
			migrations.push(migration.file);
		}
	} catch (err) {
		migrations = [];
	}

	// Filter out migrations that have already been run
	const outstandingMigrations = migrationFiles
		.filter((migrationFile) => {
			if (!migrationFile.endsWith(".sql")) return false;
			return !migrations.find((migration) => migration === migrationFile);
		})
		.map((migrationFile) => ({
			file: migrationFile,
			sql: fs.readFileSync(
				path.join(currentDir, "./migrations", migrationFile),
				"utf-8",
			),
		}))
		.sort((a, b) => {
			const aNum = Number.parseInt(a.file.substring(0, 8));
			const bNum = Number.parseInt(b.file.substring(0, 8));
			return aNum - bNum;
		});

	return outstandingMigrations;
};

const migrate = async (db: DB) => {
	try {
		const outstanding = await getOutstanding(db);

		if (outstanding.length === 0) {
			console.log(
				green("No outstanding migrations, database is up to date"),
			);
			return;
		}

		console.log(
			green(
				`Found ${outstanding.length} outstanding migrations, running...`,
			),
		);

		for (const migration of outstanding) {
			console.log(green(`- running migration ${migration.file}`));
			await db.transaction().execute(async (trx) => {
				await sql.raw(migration.sql).execute(trx);
				await trx
					.insertInto("headless_migrations")
					.values({
						file: migration.file,
					})
					.execute();
			});
		}
	} catch (err) {
		new InternalError((err as Error).message);
		process.exit(1);
	}
};

export default migrate;
