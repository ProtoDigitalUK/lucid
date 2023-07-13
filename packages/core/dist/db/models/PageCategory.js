"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../db"));
class PageCategory {
}
_a = PageCategory;
PageCategory.createMultiple = async (data) => {
    const client = await db_1.default;
    const categories = await client.query({
        text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
        values: [data.page_id, data.category_ids],
    });
    return categories.rows;
};
PageCategory.getMultiple = async (category_ids, collection_key) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `SELECT id FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
        values: [category_ids, collection_key],
    });
    return res.rows;
};
PageCategory.getMultipleByPageId = async (page_id) => {
    const client = await db_1.default;
    const res = await client.query({
        text: `SELECT * FROM lucid_page_categories WHERE page_id = $1`,
        values: [page_id],
    });
    return res.rows;
};
PageCategory.deleteMultiple = async (data) => {
    const client = await db_1.default;
    const deleteCategories = await client.query({
        text: `DELETE FROM lucid_page_categories WHERE page_id = $1 AND category_id = ANY($2) RETURNING *`,
        values: [data.page_id, data.category_ids],
    });
    return deleteCategories.rows;
};
exports.default = PageCategory;
//# sourceMappingURL=PageCategory.js.map