"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
class PageCategory {
}
_a = PageCategory;
PageCategory.createMultiple = async (client, data) => {
    const categories = await client.query({
        text: `INSERT INTO lucid_page_categories (page_id, category_id) SELECT $1, id FROM lucid_categories WHERE id = ANY($2) RETURNING *`,
        values: [data.page_id, data.category_ids],
    });
    return categories.rows;
};
PageCategory.getMultiple = async (client, data) => {
    const res = await client.query({
        text: `SELECT * FROM lucid_categories WHERE id = ANY($1) AND collection_key = $2`,
        values: [data.category_ids, data.collection_key],
    });
    return res.rows;
};
PageCategory.getMultipleByPageId = async (client, data) => {
    const res = await client.query({
        text: `SELECT * FROM lucid_page_categories WHERE page_id = $1`,
        values: [data.page_id],
    });
    return res.rows;
};
PageCategory.deleteMultiple = async (client, data) => {
    const deleteCategories = await client.query({
        text: `DELETE FROM lucid_page_categories WHERE page_id = $1 AND category_id = ANY($2) RETURNING *`,
        values: [data.page_id, data.category_ids],
    });
    return deleteCategories.rows;
};
exports.default = PageCategory;
//# sourceMappingURL=PageCategory.js.map