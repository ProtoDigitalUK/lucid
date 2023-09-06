"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_js_1 = require("../../utils/app/query-helpers.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Role_js_1 = __importDefault(require("../../db/models/Role.js"));
const index_js_1 = __importDefault(require("../role-permissions/index.js"));
const format_roles_js_1 = __importDefault(require("../../utils/format/format-roles.js"));
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page, include } = data.query;
    const SelectQuery = new query_helpers_js_1.SelectQueryBuilder({
        columns: ["roles.id", "roles.name", "roles.created_at", "roles.updated_at"],
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
    const roles = await Role_js_1.default.getMultiple(client, SelectQuery);
    if (include && include.includes("permissions")) {
        const permissionsPromise = roles.data.map((role) => (0, service_js_1.default)(index_js_1.default.getAll, false, client)({
            role_id: role.id,
        }));
        const permissions = await Promise.all(permissionsPromise);
        roles.data = roles.data.map((role, index) => {
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
        data: roles.data.map((role) => (0, format_roles_js_1.default)(role)),
        count: roles.count,
    };
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map