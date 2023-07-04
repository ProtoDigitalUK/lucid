"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class Migration {
}
_a = Migration;
Migration.all = async () => {
    try {
        const client = await db_1.default;
        const migrations = await client.query(`SELECT * FROM lucid_migrations`);
        return migrations.rows;
    }
    catch (err) {
        return [];
    }
};
Migration.create = async (data) => {
    const client = await db_1.default;
    const { file, rawSql } = data;
    await client.query({
        text: rawSql,
    });
    await client.query({
        text: `INSERT INTO lucid_migrations (file) VALUES ($1)`,
        values: [file],
    });
};
exports.default = Migration;
//# sourceMappingURL=Migration.js.map