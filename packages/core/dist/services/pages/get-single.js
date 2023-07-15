"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
const error_handler_1 = require("../../utils/app/error-handler");
const service_1 = __importDefault(require("../../utils/app/service"));
const Page_1 = __importDefault(require("../../db/models/Page"));
const collections_1 = __importDefault(require("../collections"));
const collection_bricks_1 = __importDefault(require("../collection-bricks"));
const format_page_1 = __importDefault(require("../../utils/format/format-page"));
const getSingle = async (client, data) => {
    const { include } = data.query;
    const SelectQuery = new query_helpers_1.SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
            "collection_key",
            "parent_id",
            "title",
            "slug",
            "full_slug",
            "homepage",
            "excerpt",
            "published",
            "published_at",
            "published_by",
            "created_by",
            "created_at",
            "updated_at",
        ],
        exclude: undefined,
        filter: {
            data: {
                id: data.id.toString(),
                environment_key: data.environment_key,
            },
            meta: {
                id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: undefined,
        page: undefined,
        per_page: undefined,
    });
    const page = await Page_1.default.getSingle(client, SelectQuery);
    if (!page) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page not found",
            message: `Page with id "${data.id}" not found`,
            status: 404,
        });
    }
    if (include && include.includes("bricks")) {
        const collection = await (0, service_1.default)(collections_1.default.getSingle, false, client)({
            collection_key: page.collection_key,
            environment_key: page.environment_key,
            type: "pages",
        });
        const pageBricks = await (0, service_1.default)(collection_bricks_1.default.getAll, false, client)({
            reference_id: page.id,
            type: "pages",
            environment_key: data.environment_key,
            collection: collection,
        });
        page.builder_bricks = pageBricks.builder_bricks;
        page.fixed_bricks = pageBricks.fixed_bricks;
    }
    return (0, format_page_1.default)(page);
};
exports.default = getSingle;
//# sourceMappingURL=get-single.js.map