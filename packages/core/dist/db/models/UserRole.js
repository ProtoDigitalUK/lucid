"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const Role_1 = __importDefault(require("../models/Role"));
const format_permissions_1 = __importDefault(require("../../services/users/format-permissions"));
class UserRole {
}
_a = UserRole;
UserRole.update = async (id, data) => {
    const client = await db_1.default;
    const userRoles = await client.query({
        text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
        values: [id],
    });
    const newRoles = data.role_ids.filter((role) => {
        return !userRoles.rows.find((userRole) => userRole.role_id === role);
    });
    if (newRoles.length > 0) {
        const rolesRes = await Role_1.default.getMultiple({
            filter: {
                role_ids: newRoles.map((role) => role.toString()),
            },
        });
        if (rolesRes.count !== newRoles.length) {
            throw new error_handler_1.LucidError({
                type: "basic",
                name: "Role Error",
                message: "One or more of the roles do not exist.",
                status: 500,
            });
        }
        await client.query({
            text: `
          INSERT INTO lucid_user_roles(user_id, role_id)
          SELECT $1, unnest($2::integer[]);`,
            values: [id, newRoles],
        });
    }
    const rolesToRemove = userRoles.rows.filter((userRole) => {
        return !data.role_ids.find((role) => role === userRole.role_id);
    });
    if (rolesToRemove.length > 0) {
        const rolesToRemoveIds = rolesToRemove.map((role) => role.id);
        await client.query({
            text: `
          DELETE FROM lucid_user_roles
          WHERE id IN (${rolesToRemoveIds.join(",")})
        `,
        });
    }
    const updatedUserRoles = await client.query({
        text: `
        SELECT * FROM lucid_user_roles
        WHERE user_id = $1
      `,
        values: [id],
    });
    return updatedUserRoles.rows;
};
UserRole.getPermissions = async (id) => {
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
        values: [id],
    });
    if (!userPermissions.rows) {
        return {
            permissions: [],
            roles: [],
            environments: [],
        };
    }
    const formattedPermissions = (0, format_permissions_1.default)(userPermissions.rows);
    return formattedPermissions;
};
exports.default = UserRole;
//# sourceMappingURL=UserRole.js.map