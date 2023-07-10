"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Category_1 = __importDefault(require("../../db/models/Category"));
const query_helpers_1 = require("../../utils/app/query-helpers");
const getMultiple = async (data) => {
    const { filter, sort, page, per_page } = data.query;
    const selectQuery = new query_helpers_1.SelectQueryBuilder({
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
    return await Category_1.default.getMultiple(selectQuery);
};
exports.default = getMultiple;
//# sourceMappingURL=get-multiple.js.map