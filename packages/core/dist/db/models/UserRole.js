"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class UserRole {
}
_a = UserRole;
UserRole.getAll = async (user_id) => {
    const client = await db_1.default;
    const userRoles = await client.query({
        text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
        values: [user_id],
    });
    return userRoles.rows;
};
UserRole.updateRoles = async (user_id, data) => {
    const client = await db_1.default;
    const roles = await client.query({
        text: `
        INSERT INTO lucid_user_roles(user_id, role_id)
        SELECT $1, unnest($2::integer[]);`,
        values: [user_id, data.role_ids],
    });
    return roles.rows;
};
UserRole.deleteMultiple = async (user_id, role_ids) => {
    const client = await db_1.default;
    const roles = await client.query({
        text: `
        DELETE FROM 
          lucid_user_roles
        WHERE 
          id = ANY($1::integer[])
        AND 
          user_id = $2
        RETURNING *;
      `,
        values: [role_ids, user_id],
    });
    return roles.rows;
};
UserRole.getPermissions = async (user_id) => {
    const client = await db_1.default;
    const userPermissions = await client.query({
        text: `SELECT 
          rp.permission,
          rp.environment_key,
          r.id AS role_id,
          r.name AS role_name
        FROM 
          lucid_role_permissions rp
        INNER JOIN 
          lucid_user_roles ur ON ur.role_id = rp.role_id
        INNER JOIN 
          lucid_roles r ON r.id = rp.role_id
        WHERE 
          ur.user_id = $1;`,
        values: [user_id],
    });
    return userPermissions.rows;
};
exports.default = UserRole;
//# sourceMappingURL=UserRole.js.map