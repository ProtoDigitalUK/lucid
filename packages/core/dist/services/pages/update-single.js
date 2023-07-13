"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const Page_1 = __importDefault(require("../../db/models/Page"));
const collections_1 = __importDefault(require("../collections"));
const environments_1 = __importDefault(require("../environments"));
const collection_bricks_1 = __importDefault(require("../collection-bricks"));
const page_categories_1 = __importDefault(require("../page-categories"));
const pages_1 = __importDefault(require("../pages"));
const format_page_1 = __importDefault(require("../../utils/format/format-page"));
const updateSingle = async (data) => {
    const currentPage = await pages_1.default.checkPageExists({
        id: data.id,
        environment_key: data.environment_key,
    });
    const [environment, collection] = await Promise.all([
        environments_1.default.getSingle({
            key: data.environment_key,
        }),
        collections_1.default.getSingle({
            collection_key: currentPage.collection_key,
            environment_key: data.environment_key,
            type: "pages",
        }),
    ]);
    const parentId = data.homepage ? undefined : data.parent_id;
    if (parentId) {
        await pages_1.default.parentChecks({
            parent_id: parentId,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
        });
    }
    await collection_bricks_1.default.validateBricks({
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    let newSlug = undefined;
    if (data.slug) {
        newSlug = await pages_1.default.buildUniqueSlug({
            slug: data.slug,
            homepage: data.homepage || false,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
            parent_id: parentId,
        });
    }
    const page = await Page_1.default.updateSingle({
        id: data.id,
        environment_key: data.environment_key,
        userId: data.userId,
        title: data.title,
        slug: newSlug,
        homepage: data.homepage,
        parent_id: parentId,
        category_ids: data.category_ids,
        published: data.published,
        excerpt: data.excerpt,
        builder_bricks: data.builder_bricks,
        fixed_bricks: data.fixed_bricks,
    });
    if (!page) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Updated",
            message: "There was an error updating the page",
            status: 500,
        });
    }
    await Promise.all([
        data.category_ids
            ? page_categories_1.default.updateMultiple({
                page_id: page.id,
                category_ids: data.category_ids,
                collection_key: currentPage.collection_key,
            })
            : Promise.resolve(),
        collection_bricks_1.default.updateMultiple({
            id: page.id,
            builder_bricks: data.builder_bricks || [],
            fixed_bricks: data.fixed_bricks || [],
            collection: collection,
            environment: environment,
        }),
    ]);
    return (0, format_page_1.default)(page);
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map