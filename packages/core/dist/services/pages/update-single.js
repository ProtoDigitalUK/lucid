"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Page_1 = __importDefault(require("../../db/models/Page"));
const updateSingle = async (data) => {
    const page = await Page_1.default.updateSingle({
        id: data.id,
        environment_key: data.environment_key,
        userId: data.userId,
        title: data.title,
        slug: data.slug,
        homepage: data.homepage,
        parent_id: data.parent_id,
        category_ids: data.category_ids,
        published: data.published,
        excerpt: data.excerpt,
        builder_bricks: data.builder_bricks,
        fixed_bricks: data.fixed_bricks,
    });
    return page;
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map