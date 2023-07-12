"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const error_handler_1 = require("../../utils/app/error-handler");
const format_environment_1 = __importDefault(require("../../utils/format/format-environment"));
const checkKeyExists = async (data) => {
    const environment = await Environment_1.default.checkKeyExists(data.key);
    if (environment) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Environment already exists",
            message: `Environment with key "${data.key}" already exists`,
            status: 400,
        });
    }
    return (0, format_environment_1.default)(environment);
};
exports.default = checkKeyExists;
//# sourceMappingURL=check-key-exists.js.map