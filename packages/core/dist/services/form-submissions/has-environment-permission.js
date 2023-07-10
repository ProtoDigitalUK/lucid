"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const environments_1 = __importDefault(require("../environments"));
const hasEnvironmentPermission = async (data) => {
    const environment = await environments_1.default.getSingle({
        key: data.environment_key,
    });
    const hasPerm = environment.assigned_forms?.includes(data.form_key);
    if (!hasPerm) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Form Error",
            message: "This form is not assigned to this environment.",
            status: 403,
        });
    }
    return environment;
};
exports.default = hasEnvironmentPermission;
//# sourceMappingURL=has-environment-permission.js.map