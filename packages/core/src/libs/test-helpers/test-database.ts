import fs from "fs-extra";
import path from "node:path";
import testConfig from "./test-config.js";
import { getDirName } from "../../utils/helpers.js";

const currentDir = getDirName(import.meta.url);

const migrateDatabase = async () => {
	const config = await testConfig.basic();
	await config.db.migrateToLatest();
};

const destroyDatabase = async () => {
	const dbPath = path.resolve(currentDir, "../../../../../db.sqlite");

	if (await fs.pathExists(dbPath)) {
		await fs.remove(dbPath);
	}
};

const testDatabase = {
	migrate: migrateDatabase,
	destroy: destroyDatabase,
};

export default testDatabase;
