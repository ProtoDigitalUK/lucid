"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const deleteSingle = async (client, data) => {
    const menu = await Menu_1.default.deleteSingle(client, {
        environment_key: data.environment_key,
        id: data.id,
    });
    if (!menu) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Menu Delete Error",
            message: "Menu could not be deleted",
            status: 500,
        });
    }
    return menu;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map