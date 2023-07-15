"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../utils/app/error-handler");
const service_1 = __importDefault(require("../utils/app/service"));
const users_1 = __importDefault(require("../services/users"));
const throwPermissionError = () => {
    throw new error_handler_1.LucidError({
        type: "basic",
        name: "Permission Error",
        message: "You do not have permission to access this resource",
        status: 403,
    });
};
const permissions = (permissions) => async (req, res, next) => {
    try {
        const environment = req.headers["lucid-environment"];
        const user = await (0, service_1.default)(users_1.default.getSingle, false)({
            user_id: req.auth.id,
        });
        if (user.super_admin)
            return next();
        if (user.permissions === undefined)
            throwPermissionError();
        if (permissions.global) {
            permissions.global.forEach((permission) => {
                if (!user.permissions?.global.includes(permission))
                    throwPermissionError();
            });
        }
        if (permissions.environments) {
            if (!environment)
                throwPermissionError();
            const environmentPermissions = user.permissions?.environments?.find((env) => env.key === environment);
            if (!environmentPermissions)
                throwPermissionError();
            permissions.environments.forEach((permission) => {
                if (!environmentPermissions?.permissions.includes(permission))
                    throwPermissionError();
            });
        }
        return next();
    }
    catch (error) {
        return next(error);
    }
};
exports.default = permissions;
//# sourceMappingURL=permissions.js.map