"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const collections_1 = __importDefault(require("../collections"));
const pages_1 = __importDefault(require("../pages"));
const page_categories_1 = __importDefault(require("../page-categories"));
const format_page_1 = __importDefault(require("../../utils/format/format-page"));
const createSingle = async (client, data) => {
    const parentId = data.homepage ? undefined : data.parent_id;
    const checks = Promise.all([
        (0, service_1.default)(collections_1.default.getSingle, false, client)({
            collection_key: data.collection_key,
            environment_key: data.environment_key,
            type: "pages",
        }),
        parentId === undefined
            ? Promise.resolve(undefined)
            : (0, service_1.default)(pages_1.default.parentChecks, false, client)({
                parent_id: parentId,
                environment_key: data.environment_key,
                collection_key: data.collection_key,
            }),
    ]);
    await checks;
    const slug = await (0, service_1.default)(pages_1.default.buildUniqueSlug, false, client)({
        slug: data.slug,
        homepage: data.homepage || false,
        environment_key: data.environment_key,
        collection_key: data.collection_key,
        parent_id: parentId,
    });
    const page = await Page_1.default.createSingle(client, {
        environment_key: data.environment_key,
        title: data.title,
        slug: slug,
        collection_key: data.collection_key,
        homepage: data.homepage,
        excerpt: data.excerpt,
        published: data.published,
        parent_id: parentId,
        category_ids: data.category_ids,
        userId: data.userId,
    });
    if (!page) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Not Created",
            message: "There was an error creating the page",
            status: 500,
        });
    }
    const operations = [
        data.category_ids
            ? (0, service_1.default)(page_categories_1.default.createMultiple, false, client)({
                page_id: page.id,
                category_ids: data.category_ids,
                collection_key: data.collection_key,
            })
            : Promise.resolve(),
        data.homepage
            ? (0, service_1.default)(pages_1.default.resetHomepages, false, client)({
                current: page.id,
                environment_key: data.environment_key,
            })
            : Promise.resolve(),
    ];
    await Promise.all(operations);
    return (0, format_page_1.default)(page);
};
exports.default = createSingle;
//# sourceMappingURL=create-single.js.map