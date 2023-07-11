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
RolePermission.createSingle = async (role_id, permission, environment_key) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["role_id", "permission", "environment_key"],
        values: [role_id, permission, environment_key],
    });
    const permissionRes = await client.query({
        text: `INSERT INTO lucid_role_permissions (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return permissionRes.rows[0];
};
RolePermission.deleteSingle = async (id) => {
    const client = await db_1.default;
    const rolePermission = await client.query({
        text: `DELETE FROM lucid_role_permissions WHERE id = $1 RETURNING *`,
        values: [id],
    });
    return rolePermission.rows[0];
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