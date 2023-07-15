"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
class Environment {
}
_a = Environment;
Environment.getAll = async (client) => {
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
Environment.getSingle = async (client, data) => {
    const environment = await client.query({
        text: `SELECT * FROM lucid_environments WHERE key = $1`,
        values: [data.key],
    });
    return environment.rows[0];
};
Environment.upsertSingle = async (client, data) => {
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
Environment.deleteSingle = async (client, data) => {
    const environments = await client.query({
        text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
        values: [data.key],
    });
    return environments.rows[0];
};
exports.default = Environment;
//# sourceMappingURL=Environment.js.map