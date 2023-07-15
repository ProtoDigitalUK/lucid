"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
class RolePermission {
}
_a = RolePermission;
RolePermission.createSingle = async (client, data) => {
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["role_id", "permission", "environment_key"],
        values: [data.role_id, data.permission, data.environment_key],
    });
    const permissionRes = await client.query({
        text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return permissionRes.rows[0];
};
RolePermission.deleteSingle = async (client, data) => {
    const rolePermission = await client.query({
        text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
        values: [data.id],
    });
    return rolePermission.rows[0];
};
RolePermission.deleteAll = async (client, data) => {
    const res = await client.query({
        text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
        values: [data.role_id],
    });
    return res.rows;
};
RolePermission.getAll = async (client, data) => {
    const res = await client.query({
        text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
        values: [data.role_id],
    });
    return res.rows;
};
exports.default = RolePermission;
//# sourceMappingURL=RolePermission.js.map