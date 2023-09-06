"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../environments/index.js"));
const hasEnvironmentPermission = async (client, data) => {
    const environment = await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        key: data.environment_key,
    });
    const hasPerm = environment.assigned_forms?.includes(data.form_key);
    if (!hasPerm) {
        throw new error_handler_js_1.LucidError({
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