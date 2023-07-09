"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const getSingle = async (data) => {
    const category = await Category_1.default.getSingle(data.environment_key, data.id);
    return category;
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map