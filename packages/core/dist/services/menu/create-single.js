"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Menu_1 = __importDefault(require("../../db/models/Menu"));
const createSingle = async (data) => {
    const menu = await Menu_1.default.createSingle({
        environment_key: data.environment_key,
        key: data.key,
        name: data.name,
        description: data.description,
        items: data.items,
    });
    return menu;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map