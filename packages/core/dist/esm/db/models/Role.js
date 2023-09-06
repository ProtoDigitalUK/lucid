import { queryDataFormat, } from "../../utils/app/query-helpers.js";
export default class Role {
    static createSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
            columns: ["name"],
            values: [data.name],
        });
        const roleRes = await client.query({
            text: `INSERT INTO lucid_roles (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
        return roleRes.rows[0];
    };
    static deleteSingle = async (client, data) => {
        const roleRes = await client.query({
            text: `DELETE FROM lucid_roles WHERE id = $1 RETURNING *`,
            values: [data.id],
        });
        return roleRes.rows[0];
    };
    static getMultiple = async (client, query_instance) => {
        const roles = client.query({
            text: `SELECT ${query_instance.query.select} FROM lucid_roles as roles ${query_instance.query.where} ${query_instance.query.order} ${query_instance.query.pagination}`,
            values: query_instance.values,
        });
        const count = client.query({
            text: `SELECT COUNT(DISTINCT lucid_roles.id) FROM lucid_roles ${query_instance.query.where}`,
            values: query_instance.countValues,
        });
        const data = await Promise.all([roles, count]);
        return {
            data: data[0].rows,
            count: Number(data[1].rows[0].count),
        };
    };
    static updateSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
            columns: ["name", "updated_at"],
            values: [data.data.name, data.data.updated_at],
        });
        const roleRes = await client.query({
            text: `UPDATE lucid_roles SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
            values: [...values.value, data.id],
        });
        return roleRes.rows[0];
    };
    static getSingle = async (client, data) => {
        const roleRes = await client.query({
            text: `SELECT 
          roles.*,
          json_agg(json_build_object(
            'id', rp.id, 
            'permission', rp.permission,
            'environment_key', rp.environment_key
          )) AS permissions
        FROM
          lucid_roles as roles
        LEFT JOIN 
          lucid_role_permissions as rp ON roles.id = rp.role_id
        WHERE 
          roles.id = $1
        GROUP BY
          roles.id`,
            values: [data.id],
        });
        return roleRes.rows[0];
    };
    static getSingleByName = async (client, data) => {
        const roleRes = await client.query({
            text: `SELECT * FROM lucid_roles WHERE name = $1`,
            values: [data.name],
        });
        return roleRes.rows[0];
    };
}
//# sourceMappingURL=Role.js.map