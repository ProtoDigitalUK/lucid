import fs from "fs-extra";
import path from "path";
import { PoolClient } from "pg";
import { green } from "console-log-colors";
import { RuntimeError } from "@utils/app/error-handler.js";
import { getDBClient } from "@db/db.js";
// Models
import Migration from "@db/models/Migration.js";

const getOutstandingMigrations = async (client: PoolClient) => {
  // Get all migration sql files
  const migrationFiles = await fs.readdir(path.join(__dirname, "./migrations"));

  // Get all migrations from database
  const migrations = await Migration.all(client);

  // Filter out migrations that have already been run
  const outstandingMigrations = migrationFiles
    .filter((migrationFile) => {
      if (!migrationFile.endsWith(".sql")) return false;
      return !migrations.find((migration) => migration.file === migrationFile);
    })
    .map((migrationFile) => ({
      file: migrationFile,
      sql: fs.readFileSync(
        path.join(__dirname, "./migrations", migrationFile),
        "utf-8"
      ),
    }))
    .sort((a, b) => {
      const aNum = parseInt(a.file.substring(0, 8));
      const bNum = parseInt(b.file.substring(0, 8));
      return aNum - bNum;
    });

  return outstandingMigrations;
};

const migrate = async () => {
  const client = await getDBClient();
  try {
    const outstandingMigrations = await getOutstandingMigrations(client);

    if (outstandingMigrations.length === 0) {
      console.log(green("No outstanding migrations, database is up to date"));
      return;
    }

    console.log(
      green(
        `Found ${outstandingMigrations.length} outstanding migrations, running...`
      )
    );

    for (const migration of outstandingMigrations) {
      console.log(green(`- running migration ${migration.file}`));
      await Migration.create(client, {
        file: migration.file,
        rawSql: migration.sql,
      });
    }
  } catch (err) {
    new RuntimeError((err as Error).message);
    process.exit(1);
  }
};

export default migrate;
