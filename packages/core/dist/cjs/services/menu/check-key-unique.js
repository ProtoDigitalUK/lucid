"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const Menu_js_1 = __importDefault(require("../../db/models/Menu.js"));
const checkKeyUnique = async (client, data) => {
    const menu = await Menu_js_1.default.checkKeyIsUnique(client, {
        key: data.key,
        environment_key: data.environment_key,
    });
    if (menu) {
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Menu Key Already Exists",
            message: `Menu key "${data.key}" already exists in environment "${data.environment_key}"`,
            status: 400,
        });
    }
};
exports.default = checkKeyUnique;
//# sourceMappingURL=check-key-unique.js.map