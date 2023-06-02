"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
const error_handler_1 = require("../../utils/error-handler");
class PageCategory {
}
_a = PageCategory;
PageCategory.create = async (data) => {
    const { page_id, category_ids, collection_key } = data;
    await PageCategory.checkCategoryPostType(category_ids, collection_key);
    const categories = await db_1.default.query({
        text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
        values: [page_id, category_ids],
    });
    if (categories.rowCount !== category_ids.length) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Page Category Not Created",
            message: "There was an error creating the page category.",
            status: 500,
        });
    }
    return categories.rows;
};
PageCategory.checkCategoryPostType = async (category_ids, collection_key) => {
    const res = await db_1.default.query({
        text: `SELECT id FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
        values: [category_ids, collection_key],
    });
    if (res.rows.length !== category_ids.length) {
        throw new error_handler_1.LucidError({
            type: "basic",
            name: "Category Not Found",
            message: "Category not found.",
            status: 404,
            errors: (0, error_handler_1.modelErrors)({
                id: {
                    code: "not_found",
                    message: "Category not found.",
                },
                collection_key: {
                    code: "not_found",
                    message: "Collection key not found.",
                },
            }),
        });
    }
};
exports.default = PageCategory;
//# sourceMappingURL=PageCategory.js.map