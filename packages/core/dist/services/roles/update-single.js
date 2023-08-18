"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const Role_1 = __importDefault(require("../../db/models/Role"));
const roles_1 = __importDefault(require("../roles"));
const role_permissions_1 = __importDefault(require("../role-permissions"));
const format_roles_1 = __importDefault(require("../../utils/format/format-roles"));
const updateSingle = async (client, data) => {
    const parsePermissions = await (0, service_1.default)(roles_1.default.validatePermissions, false, client)(data.permission_groups);
    if (data.name) {
        await (0, service_1.default)(roles_1.default.checkNameIsUnique, false, client)({
            name: data.name,
        });
    }
    const role = await Role_1.default.updateSingle(client, {
        id: data.id,
        data: {
            name: data.name,
            permission_groups: data.permission_groups,
        },
    });
    if (!role) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error updating the role.",
            status: 500,
        });
    }
    if (data.permission_groups.length > 0) {
        await (0, service_1.default)(role_permissions_1.default.deleteAll, false, client)({
            role_id: role.id,
        });
        await (0, service_1.default)(role_permissions_1.default.createMultiple, false, client)({
            role_id: role.id,
            permissions: parsePermissions,
        });
    }
    return (0, format_roles_1.default)(role);
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map