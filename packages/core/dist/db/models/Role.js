"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Role_roleNameUnique;
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
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["name"],
        values: [data.name],
    });
    const parsePermissions = await (0, validate_permissions_1.default)(data.permission_groups);
    await __classPrivateFieldGet(Role, _a, "f", _Role_roleNameUnique).call(Role, data.name);
    const roleRes = await client.query({
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
    if (data.permission_groups.length > 0) {
        try {
            await RolePermission_1.default.createMultiple(role.id, parsePermissions);
        }
        catch (error) {
            await Role.deleteSingle(role.id);
            throw error;
        }
    }
    return role;
};
Role.deleteSingle = async (id) => {
    const client = await db_1.default;
    const roleRes = await client.query({
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
Role.getMultiple = async (query) => {
    const client = await db_1.default;
    const { filter, sort, page, per_page, include } = query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "roles.id",
            "roles.name",
            "roles.created_at",
            "roles.updated_at",
        ],
        exclude: undefined,
        filter: {
            data: filter,
            meta: {
                name: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                role_ids: {
                    key: "id",
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const roles = await client.query({
        text: `SELECT
          ${SelectQuery.query.select}
        FROM
          lucid_roles as roles
        ${SelectQuery.query.where}
        ${SelectQuery.query.order}
        ${SelectQuery.query.pagination}`,
        values: SelectQuery.values,
    });
    const count = await client.query({
        text: `SELECT 
          COUNT(DISTINCT lucid_roles.id)
        FROM
          lucid_roles
        ${SelectQuery.query.where}`,
        values: SelectQuery.countValues,
    });
    if (include && include.includes("permissions")) {
        const permissionsPromise = roles.rows.map((role) => RolePermission_1.default.getAll(role.id));
        const permissions = await Promise.all(permissionsPromise);
        roles.rows = roles.rows.map((role, index) => {
            return {
                ...role,
                permissions: permissions[index].map((permission) => {
                    return {
                        id: permission.id,
                        permission: permission.permission,
                        environment_key: permission.environment_key,
                    };
                }),
            };
        });
    }
    return {
        data: roles.rows,
        count: count.rows[0].count,
    };
};
Role.updateSingle = async (id, data) => {
    const client = await db_1.default;
    const { columns, aliases, values } = (0, query_helpers_1.queryDataFormat)({
        columns: ["name"],
        values: [data.name],
    });
    const parsePermissions = await (0, validate_permissions_1.default)(data.permission_groups);
    await __classPrivateFieldGet(Role, _a, "f", _Role_roleNameUnique).call(Role, data.name, id);
    const roleRes = await client.query({
        text: `UPDATE lucid_roles SET ${columns.formatted.update} WHERE id = $${aliases.value.length + 1} RETURNING *`,
        values: [...values.value, id],
    });
    let role = roleRes.rows[0];
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error updating the role.",
            status: 500,
        });
    }
    if (data.permission_groups.length > 0) {
        await RolePermission_1.default.deleteAll(id);
        await RolePermission_1.default.createMultiple(id, parsePermissions);
    }
    return role;
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
    let role = roleRes.rows[0];
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error getting the role.",
            status: 500,
        });
    }
    return role;
};
_Role_roleNameUnique = { value: async (name, id) => {
        const client = await db_1.default;
        const roleCheck = await client.query({
            text: `SELECT * FROM lucid_roles WHERE name = $1 AND id != $2`,
            values: [name, id],
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
    } };
exports.default = Role;
//# sourceMappingURL=Role.js.map