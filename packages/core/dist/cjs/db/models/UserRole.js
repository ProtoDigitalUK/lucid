"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserRole {
    static getAll = async (client, data) => {
        const userRoles = await client.query({
            text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
            values: [data.user_id],
        });
        return userRoles.rows;
    };
    static updateRoles = async (client, data) => {
        const roles = await client.query({
            text: `
        INSERT INTO lucid_user_roles(user_id, role_id)
        SELECT $1, unnest($2::integer[]);`,
            values: [data.user_id, data.role_ids],
        });
        return roles.rows;
    };
    static deleteMultiple = async (client, data) => {
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
            values: [data.role_ids, data.user_id],
        });
        return roles.rows;
    };
    static getPermissions = async (client, data) => {
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
            values: [data.user_id],
        });
        return userPermissions.rows;
    };
}
exports.default = UserRole;
//# sourceMappingURL=UserRole.js.map