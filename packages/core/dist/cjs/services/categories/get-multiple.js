"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_js_1 = __importDefault(require("../../db/models/Category.js"));
const query_helpers_js_1 = require("../../utils/app/query-helpers.js");
const getMultiple = async (client, data) => {
    const { filter, sort, page, per_page } = data.query;
    const SelectQuery = new query_helpers_js_1.SelectQueryBuilder({
        columns: [
            "id",
            "environment_key",
            "collection_key",
            "title",
            "slug",
            "description",
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
    return await Category_js_1.default.getMultiple(client, SelectQuery);
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map