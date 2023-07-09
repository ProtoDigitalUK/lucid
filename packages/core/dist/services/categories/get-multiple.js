"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const getMultiple = async (data) => {
    const categories = await Category_1.default.getMultiple(data.environment_key, data.query);
    return categories;
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map