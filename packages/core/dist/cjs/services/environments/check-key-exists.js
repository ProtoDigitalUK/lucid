"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_js_1 = __importDefault(require("../../db/models/Environment.js"));
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const checkKeyExists = async (client, data) => {
    const environment = await Environment_js_1.default.getSingle(client, {
        key: data.key,
    });
    if (environment) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Environment already exists",
            message: `Environment with key "${data.key}" already exists`,
            status: 400,
        });
    }
    return;
};
exports.default = checkKeyExists;
//# sourceMappingURL=check-key-exists.js.map