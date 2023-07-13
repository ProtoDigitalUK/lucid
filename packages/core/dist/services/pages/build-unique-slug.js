"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const buildUniqueSlug = async (data) => {
    if (data.homepage) {
        return "/";
    }
    data.slug = (0, slugify_1.default)(data.slug, { lower: true, strict: true });
    const slugCount = await Page_1.default.getSlugCount({
        slug: data.slug,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        parent_id: data.parent_id,
    });
    if (slugCount >= 1) {
        return `${data.slug}-${slugCount}`;
    }
    else {
        return data.slug;
    }
};
exports.default = buildUniqueSlug;
//# sourceMappingURL=build-unique-slug.js.map