"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Environment_1 = __importDefault(require("../../db/models/Environment"));
const error_handler_1 = require("../../utils/app/error-handler");
const checkKeyExists = async (data) => {
    const environment = await Environment_1.default.checkKeyExists(data.key);
    if (environment.length > 0) {
        throw new error_handler_1.LucidError({
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