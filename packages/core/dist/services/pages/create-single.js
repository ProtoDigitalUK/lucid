"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = __importDefault(require("../../db/models/Page"));
const createSingle = async (data) => {
    const page = await Page_1.default.createSingle({
        environment_key: data.environment_key,
        title: data.title,
        slug: data.slug,
        collection_key: data.collection_key,
        homepage: data.homepage,
        excerpt: data.excerpt,
        published: data.published,
        parent_id: data.parent_id,
        category_ids: data.category_ids,
        userId: data.userId,
    });
    return page;
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map