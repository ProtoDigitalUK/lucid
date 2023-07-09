"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const deleteSingle = async (data) => {
    const menu = await Menu_1.default.deleteSingle({
        environment_key: data.environment_key,
        id: data.id,
    });
    return menu;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map