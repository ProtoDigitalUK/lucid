"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const checkKeyUnique = async (data) => {
    const menu = await Menu_1.default.checkKeyIsUnique(data.key, data.environment_key);
    if (menu) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Menu Key Already Exists",
            message: `Menu key "${data.key}" already exists in environment "${data.environment_key}"`,
            status: 400,
        });
    }
};
exports.default = checkKeyUnique;
//# sourceMappingURL=check-key-unique.js.map