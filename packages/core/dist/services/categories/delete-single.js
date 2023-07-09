"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const deleteSingle = async (data) => {
    const category = await Category_1.default.deleteSingle(data.environment_key, data.id);
    return category;
};
exports.default = deleteSingle;
//# sourceMappingURL=delete-single.js.map