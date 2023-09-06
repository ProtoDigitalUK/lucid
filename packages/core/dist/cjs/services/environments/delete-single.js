"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_js_1 = __importDefault(require("../../db/models/Environment.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const index_js_1 = __importDefault(require("../environments/index.js"));
const format_environment_js_1 = __importDefault(require("../../utils/format/format-environment.js"));
const deleteSingle = async (client, data) => {
    await (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
        key: data.key,
    });
    const environment = await Environment_js_1.default.deleteSingle(client, {
        key: data.key,
    });
    if (!environment) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Environment not deleted",
            message: `Environment with key "${data.key}" could not be deleted`,
            status: 400,
        });
    }
    return (0, format_environment_js_1.default)(environment);
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map