"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
const query_helpers_1 = require("../../utils/query-helpers");
const RolePermission_1 = __importDefault(require("../models/RolePermission"));
const validate_permissions_1 = __importDefault(require("../../services/roles/validate-permissions"));
class Role {
}
_a = Role;
Role.createSingle = async (data) => {
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)(["name"], [data.name]);
    const parsePermissions = await (0, validate_permissions_1.default)(data.permission_groups);
    const roleCheck = await db_1.default.query({
        text: `SELECT * FROM lucid_roles WHERE name = $1`,
        values: [data.name],
    });
    if (roleCheck.rows.length > 0) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "The role name must be unique.",
            status: 500,
            errors: (0, error_handler_1.modelErrors)({
                name: {
                    code: "Not unique",
                    message: "The role name must be unique.",
                },
            }),
        });
    }
    const roleRes = await db_1.default.query({
        text: `INSERT INTO lucid_roles (${columns.formatted.insert}) VALUES (${aliases.formatted.insert}) RETURNING *`,
        values: values.value,
    });
    let role = roleRes.rows[0];
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error creating the role.",
            status: 500,
        });
    }
    try {
        if (data.permission_groups.length > 0) {
            await RolePermission_1.default.createMultiple(role.id, parsePermissions);
        }
    }
    catch (error) {
        await Role.deleteSingle(role.id);
        throw error;
    }
    return role;
};
Role.deleteSingle = async (id) => {
    const roleRes = await db_1.default.query({
        text: `DELETE FROM lucid_roles WHERE id = $1 RETURNING *`,
        values: [id],
    });
    let role = roleRes.rows[0];
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error deleting the role.",
            status: 500,
        });
    }
    return role;
};
Role.getMultiple = async (data) => {
    const rolesRes = await db_1.default.query({
        text: `SELECT * FROM lucid_roles WHERE id = ANY($1)`,
        values: [data],
    });
    let roles = rolesRes.rows;
    if (!roles) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error getting the roles.",
            status: 500,
        });
    }
    return roles;
};
exports.default = Role;
//# sourceMappingURL=Role.js.map