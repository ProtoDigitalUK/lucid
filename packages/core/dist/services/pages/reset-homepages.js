"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const resetHomepages = async (data) => {
    const homepages = await Page_1.default.getNonCurrentHomepages(data.current, data.environment_key);
    const updatePromises = homepages.map(async (homepage) => {
        let newSlug = (0, slugify_1.default)(homepage.title, { lower: true, strict: true });
        const slugExists = await Page_1.default.checkSlugExistence(newSlug, homepage.id, data.environment_key);
        if (slugExists) {
            newSlug += `-${homepage.id}`;
        }
        return Page_1.default.updatePageToNonHomepage(homepage.id, newSlug);
    });
    await Promise.all(updatePromises);
};
exports.default = resetHomepages;
//# sourceMappingURL=reset-homepages.js.map