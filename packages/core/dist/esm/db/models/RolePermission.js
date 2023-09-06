import { queryDataFormat } from "../../utils/app/query-helpers.js";
export default class RolePermission {
    static createSingle = async (client, data) => {
        const { columns, aliases, values } = queryDataFormat({
            columns: ["role_id", "permission", "environment_key"],
            values: [data.role_id, data.permission, data.environment_key],
        });
        const permissionRes = await client.query({
            text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
        return permissionRes.rows[0];
    };
    static deleteSingle = async (client, data) => {
        const rolePermission = await client.query({
            text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
            values: [data.id],
        });
        return rolePermission.rows[0];
    };
    static deleteAll = async (client, data) => {
        const res = await client.query({
            text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
            values: [data.role_id],
        });
        return res.rows;
    };
    static getAll = async (client, data) => {
        const res = await client.query({
            text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
            values: [data.role_id],
        });
        return res.rows;
    };
}
//# sourceMappingURL=RolePermission.js.map