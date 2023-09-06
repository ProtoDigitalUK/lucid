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
const createSingle = async (client, data) => {
    const parsePermissions = await (0, service_js_1.default)(index_js_1.default.validatePermissions, false, client)(data.permission_groups);
    await (0, service_js_1.default)(index_js_1.default.checkNameIsUnique, false, client)({
        name: data.name,
    });
    const role = await Role_js_1.default.createSingle(client, {
        name: data.name,
        permission_groups: data.permission_groups,
    });
    if (!role) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error creating the role.",
            status: 500,
        });
    }
    if (data.permission_groups.length > 0) {
        await (0, service_js_1.default)(index_js_2.default.createMultiple, false, client)({
            role_id: role.id,
            permissions: parsePermissions,
        });
    }
    return (0, format_roles_js_1.default)(role);
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map