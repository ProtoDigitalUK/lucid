"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Role_js_1 = __importDefault(require("../../db/models/Role.js"));
const index_js_1 = __importDefault(require("../roles/index.js"));
const index_js_2 = __importDefault(require("../role-permissions/index.js"));
const format_roles_js_1 = __importDefault(require("../../utils/format/format-roles.js"));
const updateSingle = async (client, data) => {
    if (data.name) {
        await (0, service_js_1.default)(index_js_1.default.checkNameIsUnique, false, client)({
            name: data.name,
        });
    }
    const role = await Role_js_1.default.updateSingle(client, {
        id: data.id,
        data: {
            name: data.name,
            updated_at: new Date().toISOString(),
        },
    });
    if (!role) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error updating the role.",
            status: 500,
        });
    }
    if (data.permission_groups !== undefined) {
        const parsePermissions = await (0, service_js_1.default)(index_js_1.default.validatePermissions, false, client)(data.permission_groups);
        await (0, service_js_1.default)(index_js_2.default.deleteAll, false, client)({
            role_id: data.id,
        });
        if (data.permission_groups.length > 0) {
            await (0, service_js_1.default)(index_js_2.default.createMultiple, false, client)({
                role_id: data.id,
                permissions: parsePermissions,
            });
        }
    }
    return (0, format_roles_js_1.default)(role);
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map