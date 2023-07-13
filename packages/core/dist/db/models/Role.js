"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const query_helpers_1 = require("../../utils/app/query-helpers");
class Role {
}
_a = Role;
Role.createSingle = async (data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["name"],
        values: [data.name],
    });
    const roleRes = await client.query({
        text: `INSERT INTO lucid_roles (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    return roleRes.rows[0];
};
Role.deleteSingle = async (id) => {
    const client = await db_1.default;
    const roleRes = await client.query({
        text: `DELETE FROM lucid_roles WHERE id = $1 RETURNING *`,
        values: [id],
    });
    return roleRes.rows[0];
};
Role.getMultiple = async (query_instance) => {
    const client = await db_1.default;
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
        count: parseInt(data[1].rows[0].count),
    };
};
Role.updateSingle = async (id, data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["name"],
        values: [data.name],
    });
    const roleRes = await client.query({
        text: `UPDATE lucid_roles SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
        values: [...values.value, id],
    });
    return roleRes.rows[0];
};
Role.getSingle = async (id) => {
    const client = await db_1.default;
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
        values: [id],
    });
    return roleRes.rows[0];
};
Role.getSingleByName = async (name) => {
    const client = await db_1.default;
    const roleRes = await client.query({
        text: `SELECT * FROM lucid_roles WHERE name = $1`,
        values: [name],
    });
    return roleRes.rows[0];
};
exports.default = Role;
//# sourceMappingURL=Role.js.map