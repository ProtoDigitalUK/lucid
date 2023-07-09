"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const updateSingle = async (data) => {
    const category = await Category_1.default.updateSingle(data.environment_key, data.id, data.data);
    return category;
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map