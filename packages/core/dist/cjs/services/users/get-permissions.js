"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRole_js_1 = __importDefault(require("../../db/models/UserRole.js"));
const format_user_permissions_js_1 = __importDefault(require("../../utils/format/format-user-permissions.js"));
const getPermissions = async (client, data) => {
    const userPermissions = await UserRole_js_1.default.getPermissions(client, {
        user_id: data.user_id,
    });
    if (!userPermissions) {
        return {
            roles: [],
            permissions: {
                global: [],
                environments: [],
            },
        };
    }
    return (0, format_user_permissions_js_1.default)(userPermissions);
};
exports.default = getPermissions;
//# sourceMappingURL=get-permissions.js.map