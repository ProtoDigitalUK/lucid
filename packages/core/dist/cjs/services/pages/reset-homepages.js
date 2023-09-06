"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slug_1 = __importDefault(require("slug"));
const Page_js_1 = __importDefault(require("../../db/models/Page.js"));
const resetHomepages = async (client, data) => {
    const homepages = await Page_js_1.default.getNonCurrentHomepages(client, {
        current_id: data.current,
        environment_key: data.environment_key,
    });
    const updatePromises = homepages.map(async (homepage) => {
        let newSlug = (0, slug_1.default)(homepage.title, { lower: true });
        const slugExists = await Page_js_1.default.checkSlugExistence(client, {
            slug: newSlug,
            id: homepage.id,
            environment_key: data.environment_key,
        });
        if (slugExists) {
            newSlug += `-${homepage.id}`;
        }
        return Page_js_1.default.updatePageToNonHomepage(client, {
            id: homepage.id,
            slug: newSlug,
        });
    });
    await Promise.all(updatePromises);
};
exports.default = resetHomepages;
//# sourceMappingURL=reset-homepages.js.map