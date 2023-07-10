"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class Environment {
}
_a = Environment;
Environment.getAll = async () => {
    const client = await db_1.default;
    const environments = await client.query({
        text: `SELECT *
        FROM 
          lucid_environments
        ORDER BY
          key ASC`,
        values: [],
    });
    return environments.rows;
};
Environment.getSingle = async (key) => {
    const client = await db_1.default;
    const environment = await client.query({
        text: `SELECT * FROM lucid_environments WHERE key = $1`,
        values: [key],
    });
    return environment.rows[0];
};
Environment.upsertSingle = async (data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: [
            "key",
            "title",
            "assigned_bricks",
            "assigned_collections",
            "assigned_forms",
        ],
        values: [
            data.key,
            data.title,
            data.assigned_bricks,
            data.assigned_collections,
            data.assigned_forms,
        ],
    });
    const environments = await client.query({
        text: `INSERT INTO lucid_environments (${columns.formatted.insert}) 
        VALUES (${aliases.formatted.insert}) 
        ON CONFLICT (key) 
        DO UPDATE SET ${columns.formatted.doUpdate}
        RETURNING *`,
        values: [...values.value],
    });
    return environments.rows[0];
};
Environment.deleteSingle = async (key) => {
    const client = await db_1.default;
    const environments = await client.query({
        text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
        values: [key],
    });
    return environments.rows[0];
};
Environment.checkKeyExists = async (key) => {
    const client = await db_1.default;
    const environments = await client.query({
        text: `SELECT * FROM lucid_environments WHERE key = $1`,
        values: [key],
    });
    return environments.rows;
};
exports.default = Environment;
//# sourceMappingURL=Environment.js.map