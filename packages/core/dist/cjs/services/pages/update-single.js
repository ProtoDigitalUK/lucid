"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_js_1 = require("../../utils/app/error-handler.js");
const service_js_1 = __importDefault(require("../../utils/app/service.js"));
const Page_js_1 = __importDefault(require("../../db/models/Page.js"));
const index_js_1 = __importDefault(require("../collections/index.js"));
const index_js_2 = __importDefault(require("../environments/index.js"));
const index_js_3 = __importDefault(require("../collection-bricks/index.js"));
const index_js_4 = __importDefault(require("../page-categories/index.js"));
const index_js_5 = __importDefault(require("../pages/index.js"));
const format_page_js_1 = __importDefault(require("../../utils/format/format-page.js"));
const updateSingle = async (client, data) => {
    const currentPage = await (0, service_js_1.default)(index_js_5.default.checkPageExists, false, client)({
        id: data.id,
        environment_key: data.environment_key,
    });
    const [environment, collection] = await Promise.all([
        (0, service_js_1.default)(index_js_2.default.getSingle, false, client)({
            key: data.environment_key,
        }),
        (0, service_js_1.default)(index_js_1.default.getSingle, false, client)({
            collection_key: currentPage.collection_key,
            environment_key: data.environment_key,
            type: "pages",
        }),
    ]);
    const parentId = data.homepage ? undefined : data.parent_id;
    if (parentId) {
        await (0, service_js_1.default)(index_js_5.default.parentChecks, false, client)({
            parent_id: parentId,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
        });
    }
    await (0, service_js_1.default)(index_js_3.default.validateBricks, false, client)({
        builder_bricks: data.builder_bricks || [],
        fixed_bricks: data.fixed_bricks || [],
        collection: collection,
        environment: environment,
    });
    let newSlug = undefined;
    if (data.slug) {
        newSlug = await (0, service_js_1.default)(index_js_5.default.buildUniqueSlug, false, client)({
            slug: data.slug,
            homepage: data.homepage || false,
            environment_key: data.environment_key,
            collection_key: currentPage.collection_key,
            parent_id: parentId,
        });
    }
    const page = await Page_js_1.default.updateSingle(client, {
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
        throw new error_handler_js_1.LucidError({
            type: "basic",
            name: "Page Not Updated",
            message: "There was an error updating the page",
            status: 500,
        });
    }
    await Promise.all([
        data.category_ids
            ? (0, service_js_1.default)(index_js_4.default.updateMultiple, false, client)({
                page_id: page.id,
                category_ids: data.category_ids,
                collection_key: currentPage.collection_key,
            })
            : Promise.resolve(),
        (0, service_js_1.default)(index_js_3.default.updateMultiple, false, client)({
            id: page.id,
            builder_bricks: data.builder_bricks || [],
            fixed_bricks: data.fixed_bricks || [],
            collection: collection,
            environment: environment,
        }),
    ]);
    return (0, format_page_js_1.default)(page);
};
exports.default = updateSingle;
//# sourceMappingURL=update-single.js.map