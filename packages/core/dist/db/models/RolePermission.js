"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class RolePermission {
}
_a = RolePermission;
RolePermission.createMultiple = async (role_id, permissions) => {
    const client = await db_1.default;
    const permissionsPromise = permissions.map((permission) => {
        const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
            columns: ["role_id", "permission", "environment_key"],
            values: [role_id, permission.permission, permission.environment_key],
        });
        return client.query({
            text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
            values: values.value,
        });
    });
    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map((permission) => permission.rows[0]);
    return permissionsData;
};
RolePermission.deleteMultiple = async (ids) => {
    const client = await db_1.default;
    const permissionsPromise = ids.map((id) => {
        return client.query({
            text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
            values: [id],
        });
    });
    const permissionsRes = await Promise.all(permissionsPromise);
    const permissionsData = permissionsRes.map((permission) => permission.rows[0]);
    return permissionsData;
};
RolePermission.deleteAll = async (role_id) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `DELETE FROM lucid_role_permissions WHERE role_id = $1 RETURNING *`,
        values: [role_id],
    });
    return res.rows;
};
RolePermission.getAll = async (role_id) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `SELECT * FROM lucid_role_permissions WHERE role_id = $1`,
        values: [role_id],
    });
    return res.rows;
};
exports.default = RolePermission;
//# sourceMappingURL=RolePermission.js.map