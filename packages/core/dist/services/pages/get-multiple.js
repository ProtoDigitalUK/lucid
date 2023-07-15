"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const query_helpers_1 = require("../../utils/app/query-helpers");
const Page_1 = __importDefault(require("../../db/models/Page"));
const format_page_1 = __importDefault(require("../../utils/format/format-page"));
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page } = data.query;
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
                ...filter,
                environment_key: data.environment_key,
            },
            meta: {
                collection_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
                title: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                slug: {
                    operator: "%",
                    type: "text",
                    columnType: "standard",
                },
                category_id: {
                    operator: "=",
                    type: "int",
                    columnType: "standard",
                    table: "lucid_page_categories",
                },
                environment_key: {
                    operator: "=",
                    type: "text",
                    columnType: "standard",
                },
            },
        },
        sort: sort,
        page: page,
        per_page: per_page,
    });
    const pages = await Page_1.default.getMultiple(client, SelectQuery);
    return {
        data: pages.data.map((page) => (0, format_page_1.default)(page)),
        count: pages.count,
    };
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map