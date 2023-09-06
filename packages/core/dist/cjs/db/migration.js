"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const console_log_colors_1 = require("console-log-colors");
const error_handler_js_1 = require("../utils/app/error-handler.js");
const db_js_1 = require("./db.js");
const Migration_js_1 = __importDefault(require("./models/Migration.js"));
const getOutstandingMigrations = async (client) => {
    const migrationFiles = await fs_extra_1.default.readdir(path_1.default.join(__dirname, "./migrations"));
    const migrations = await Migration_js_1.default.all(client);
    const outstandingMigrations = migrationFiles
        .filter((migrationFile) => {
        if (!migrationFile.endsWith(".sql"))
            return false;
        return !migrations.find((migration) => migration.file === migrationFile);
    })
        .map((migrationFile) => ({
        file: migrationFile,
        sql: fs_extra_1.default.readFileSync(path_1.default.join(__dirname, "./migrations", migrationFile), "utf-8"),
    }))
        .sort((a, b) => {
        const aNum = parseInt(a.file.substring(0, 8));
        const bNum = parseInt(b.file.substring(0, 8));
        return aNum - bNum;
    });
    return outstandingMigrations;
};
const migrate = async () => {
    const client = await (0, db_js_1.getDBClient)();
    try {
        const outstandingMigrations = await getOutstandingMigrations(client);
        if (outstandingMigrations.length === 0) {
            console.log((0, console_log_colors_1.green)("No outstanding migrations, database is up to date"));
            return;
        }
        console.log((0, console_log_colors_1.green)(`Found ${outstandingMigrations.length} outstanding migrations, running...`));
        for (const migration of outstandingMigrations) {
            console.log((0, console_log_colors_1.green)(`- running migration ${migration.file}`));
            await Migration_js_1.default.create(client, {
                file: migration.file,
                rawSql: migration.sql,
            });
        }
    }
    catch (err) {
        new error_handler_js_1.RuntimeError(err.message);
        process.exit(1);
    }
};
exports.default = migrate;
//# sourceMappingURL=migration.js.map