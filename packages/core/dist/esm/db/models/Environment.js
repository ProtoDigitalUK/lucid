import { queryDataFormat } from "../../utils/app/query-helpers.js";
export default class Environment {
    static getAll = async (client) => {
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
    static getSingle = async (client, data) => {
        const environment = await client.query({
            text: `SELECT * FROM lucid_environments WHERE key = $1`,
            values: [data.key],
        });
        return environment.rows[0];
    };
    static upsertSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
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
    static deleteSingle = async (client, data) => {
        const environments = await client.query({
            text: `DELETE FROM lucid_environments WHERE key = $1 RETURNING *`,
            values: [data.key],
        });
        return environments.rows[0];
    };
}
//# sourceMappingURL=Environment.js.map