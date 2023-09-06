"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../environments/index.js"));
const Permissions_js_1 = __importDefault(require("../Permissions.js"));
const validatePermissions = async (client, permGroup) => {
    if (permGroup.length === 0)
        return [];
    const permissionSet = Permissions_js_1.default.permissions;
    const environmentsRes = await (0, service_js_1.default)(index_js_1.default.getAll, false, client)();
    const validPermissions = [];
    const permissionErrors = {};
    const environmentErrors = {};
    permGroup.forEach((obj) => {
        const envKey = obj.environment_key;
        for (let i = 0; i < obj.permissions.length; i++) {
            const permission = obj.permissions[i];
            if (!envKey) {
                if (permissionSet.global.includes(permission)) {
                    validPermissions.push({
                        permission,
                    });
                    continue;
                }
                else {
                    if (!permissionErrors[permission]) {
                        permissionErrors[permission] = {
                            key: permission,
                            code: "Invalid Permission",
                            message: `The permission "${permission}" is invalid against global permissions.`,
                        };
                    }
                }
            }
            else {
                if (permissionSet.environment.includes(permission)) {
                    const env = environmentsRes.find((e) => e.key === envKey);
                    if (!env) {
                        if (!environmentErrors[envKey]) {
                            environmentErrors[envKey] = {
                                key: envKey,
                                code: "Invalid Environment",
                                message: `The environment key "${envKey}" is invalid.`,
                            };
                        }
                        continue;
                    }
                    validPermissions.push({
                        permission,
                        environment_key: envKey,
                    });
                    continue;
                }
                else {
                    if (!permissionErrors[permission]) {
                        permissionErrors[permission] = {
                            key: permission,
                            code: "Invalid Permission",
                            message: `The permission "${permission}" is invalid against environment permissions.`,
                        };
                    }
                }
            }
        }
    });
    if (Object.keys(permissionErrors).length > 0 ||
        Object.keys(environmentErrors).length > 0) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Role Error",
            message: "There was an error creating the role.",
            status: 500,
            errors: (0, error_handler_js_1.modelErrors)({
                permissions: permissionErrors,
                environments: environmentErrors,
            }),
        });
    }
    return validPermissions;
};
exports.default = validatePermissions;
//# sourceMappingURL=validate-permissions.js.map