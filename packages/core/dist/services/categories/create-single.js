"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const createSingle = async (data) => {
    const category = await Category_1.default.createSingle({
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        title: data.title,
        slug: data.slug,
        description: data.description,
    });
    return category;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map