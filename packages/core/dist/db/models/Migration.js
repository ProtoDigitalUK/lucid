"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("@db/db"));
class Migration {
}
_a = Migration;
Migration.all = async () => {
    try {
        const migrations = await (0, db_1.default) `SELECT * FROM lucid_migrations`;
        return migrations;
    }
    catch (err) {
        return [];
    }
};
Migration.create = async (data) => {
    const { file, rawSql } = data;
    await db_1.default.begin(async (sql) => {
        await sql.unsafe(rawSql);
        await sql `INSERT INTO lucid_migrations (file) VALUES (${file})`;
    });
};
exports.default = Migration;
//# sourceMappingURL=Migration.js.map